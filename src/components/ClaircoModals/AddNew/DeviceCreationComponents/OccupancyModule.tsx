import { FormInput } from 'components/form';
import { getDevices } from 'helpers/api/services/Clairco/adminSide/devices';
import React, { Fragment, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';

interface OccupancyModuleInterface {
    data?: {
        name?: string;
        parentDeviceType?: string;
    };
    customerInfo: selectTagType;
    // gateWayList: selectTagType[];
    onChange?: (value: any) => void;
    error?: {
        name?: number;
        parentDeviceType?: string;
        parentDeviceId?: string;
    };
}
const parentDeviceTypes = [
    { label: 'AHU', value: 'AHU' },
    { label: 'VRF', value: 'VRV/VRF Outdoor' },
];
export const OccupancyModule: React.FC<OccupancyModuleInterface> = ({ data, customerInfo, onChange, error }) => {
    const [parentDevices, setParentDevices] = useState<selectTagType[]>([]);
    const [isApiLoading, setIsApiLoading] = useState(false);
    const getDeviceData = async (deviceType: string) => {
        try {
            // let devices = [];
            setIsApiLoading(true);
            const res = await getDevices(deviceType, '', customerInfo.value);
            const devices = res?.data.map((device: any) => ({
                label: device.name + '/ ' + (device?.floorId?.name ?? '') + '/ ' + (device?.buildingId?.name ?? ''),
                value: device.id,
            }));
            setParentDevices(devices);
        } catch (error) {
            console.log(error);
        } finally {
            setIsApiLoading(false);
        }
    };

    const handleSelectChange = (
        e: SingleValue<{ label: string; value: string }>,
        actionMeta: ActionMeta<{ label: string; value: string }>
    ) => {
        const name = actionMeta?.name ?? '';

        const value = e?.value;
        if (name === 'parentDeviceType' && value) {
            setParentDevices([]);
            if (onChange) onChange({ ...data, [name]: value, parentDeviceId: '' });
            getDeviceData(value);
            return;
        }
        if (onChange) onChange({ ...data, [name]: value });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // const newValue = e.target.value;
        const { name, value } = e.target;
        if (onChange) onChange({ ...data, [name]: value });
    };
    return (
        <Fragment>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'Name'}</Form.Label>
                <FormInput
                    placeholder={'Enter Name '}
                    type="text"
                    name={'name'}
                    containerClass={'mb-1'}
                    key="text"
                    onChange={handleInputChange}
                    value={data?.name}
                />
                {error?.name && <p className="text-danger">{error.name}</p>}
            </Col>
            {/* <Col style={{ marginTop: '20px' }}>
                <Form.Label>{'DeviceModal ID'}</Form.Label>
                <FormInput
                    placeholder={'Enter DeviceModal ID '}
                    type="text"
                    name={'modelId'}
                    containerClass={'mb-1'}
                    key="text"
                />
            </Col> */}
            <Form.Label>Parent Device Type</Form.Label>
            <Select
                name="parentDeviceType"
                placeholder="Select Parent Device Type"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={parentDeviceTypes}
                onChange={handleSelectChange}
                isClearable
                value={
                    data?.parentDeviceType
                        ? parentDeviceTypes.find((option) => option.value === data.parentDeviceType)
                        : null
                }
            />{' '}
            {error?.parentDeviceType && <p className="text-danger">{error.parentDeviceType}</p>}
            <Form.Label>Parent Device </Form.Label>
            <Select
                name="parentDeviceId"
                placeholder="Select Parent Device"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={parentDevices ?? []}
                onChange={handleSelectChange}
                isLoading={isApiLoading}
                loadingMessage={() => 'Fetching devices...'}
                noOptionsMessage={() => 'No devices found'}
                isClearable
                // value={selectedFloor?.value ? selectedFloor : null}
            />
            {error?.parentDeviceId && <p className="text-danger">{error?.parentDeviceId}</p>}
        </Fragment>
    );
};
