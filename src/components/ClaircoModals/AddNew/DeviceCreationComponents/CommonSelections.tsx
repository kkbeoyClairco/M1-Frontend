import React, { Fragment } from 'react';
import { Col, Form } from 'react-bootstrap';
import { Provider } from 'react-redux';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
interface CommonSelectionsInterface {
    deviceTypeList: selectTagType[];
    customerSelected: selectTagType;
    buldingSelected: selectTagType;
    selectedFloor: selectTagType;
    zonesList: selectTagType[];
    setDeviceType: React.Dispatch<React.SetStateAction<string | null>>;
    handleZoneSelection: (newValue: any, actionMeta: ActionMeta<any>) => void;
}
const CommonSelections: React.FC<CommonSelectionsInterface> = ({
    deviceTypeList,
    setDeviceType,
    customerSelected,
    buldingSelected,
    selectedFloor,
    zonesList,
    handleZoneSelection,
}) => {
    return (
        <Fragment>
            <Col style={{ marginTop: '15px' }}>
                <Form.Label>Select Device Type</Form.Label>
                <Select
                    name="deviceType"
                    placeholder="Select Device Type"
                    className="react-select mb-2"
                    classNamePrefix="react-select"
                    options={deviceTypeList}
                    onChange={(e: SingleValue<selectTagType>) => {
                        const label = e?.label?.toLowerCase().replace(/\s+/g, '');
                        setDeviceType(label ?? '');
                    }}
                    // styles={{
                    //     control: (provided: any) => ({
                    //         ...provided,
                    //         color: 'black',
                    //     }),
                    //     singleValue: (provided: any) => ({
                    //         ...provided,
                    //         color: 'black', // Selected value text color
                    //     }),
                    //     option: (provided: any, state: any) => ({
                    //         ...provided,
                    //         color: 'black', // Text color for dropdown options
                    //         backgroundColor: state.isFocused ? '#f0f0f0' : 'white', // Highlight focused option
                    //     }),
                    // }}
                />
            </Col>

            <Form.Label>Customer</Form.Label>
            <Select
                // defaultInputValue={}

                name="customerId"
                placeholder="Select customer"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={[]}
                // onChange={(e: any) => setCustomerSelected(e)}
                value={customerSelected?.value ? customerSelected : null}
                isDisabled={true}
                isClearable={false}
            />
            <Form.Label>Building</Form.Label>
            <Select
                name="buildingId"
                placeholder="Select building"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={[]}
                // onChange={(e: any) => setBuldingSelected(e.value)}
                value={buldingSelected?.value ? buldingSelected : null}
                isDisabled={true}
            />
            <Form.Label>Floor</Form.Label>
            <Select
                name="floorId"
                placeholder="Select floor"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={[]}
                // onChange={(e: any) => setSelectedFloor(e?.value)}
                value={selectedFloor?.value ? selectedFloor : null}
                isDisabled={true}
            />
            <Form.Label>Zone</Form.Label>
            <Select
                name="zoneId"
                placeholder="Select zone "
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={zonesList}
                onChange={handleZoneSelection}
                isClearable={false}
            />
        </Fragment>
    );
};

export default CommonSelections;
