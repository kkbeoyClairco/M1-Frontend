import { floor } from 'helpers/api/services/Clairco/customer';
// import {
//     getBuildingListWithCustomerId,
//     getFloorListWithBuildingId,
// } from 'helpers/api/services/Clairco/maintenanceLogs';
import {
    getFloorListWithBuildingId,
    getBuildingListWithCustomerId,
} from 'helpers/api/services/Clairco/customerSide/maintenance';
import React, { Fragment, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
// import { Prev } from 'react-bootstrap/esm/PageItem';
// import { act } from 'react-dom/test-utils';
// import { Provider } from 'react-redux';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { selectTagType } from 'types/selectTagType';
import { boolean } from 'yup';
type PreSelectedType = Partial<{
    customer: selectTagType;
    building: selectTagType;
    floor: selectTagType;
}>;
interface CommonSelectionsInterface {
    customersList: any;
    data?: any;
    handlerFn: any;
    error?: any;
    preSelected?: PreSelectedType;
    customerDisabled?: boolean;
    buildingDisabled?: boolean;
    floorDisabled?: boolean;
    // handleZoneSelection: (newValue: any, actionMeta: ActionMeta<any>) => void;
}
const CommonSelections: React.FC<CommonSelectionsInterface> = ({
    customersList,
    data,
    handlerFn,
    error,
    customerDisabled = false,
    buildingDisabled = false,
    floorDisabled = false,
}) => {
    const [buildingsList, setBuildingsList] = useState([]);
    const [floorsList, setFloorsList] = useState([]);
    const [selected, setSelected] = useState<{
        customer?: selectTagType;
        building?: selectTagType;
        floor?: selectTagType;
    }>({});

    const fetchBuildingsList = async (customerSelected: SingleValue<selectTagType>) => {
        try {
            if (!customerSelected?.value) return;
            // setSelected({ customer: customerSelected });
            const res = await getBuildingListWithCustomerId(customerSelected?.value); // Function Imported from Maintenance logs
            const list = res?.data?.map((item: any) => ({ label: item?.name, value: item?.id }));
            setBuildingsList(list ?? []);
            handlerFn('building', null);
            handlerFn('floor', null);
        } catch (error) {
            setBuildingsList([]);
        }
    };

    const fetchFloorsList = async (buildingSelected: SingleValue<selectTagType>, customer: string | null) => {
        try {
            if (!buildingSelected?.value || !customer) return;
            // setSelected((prev) => ({ ...prev, building: buildingSelected }));
            handlerFn('floor', null);

            const res = await getFloorListWithBuildingId(customer, buildingSelected.value);
            const list = res?.data?.map((item: any) => ({ label: item.name, value: item.id }));
            setFloorsList(list ?? []);
        } catch (error) {
            console.log(error);
            setFloorsList([]);
        }
    };

    const handleSelection = async (valueSelected: SingleValue<selectTagType>, actionMeta: ActionMeta<any>) => {
        try {
            if (!valueSelected) return;
            // setSelected((prev) => ({ ...prev, floor: floorSelected }));
            handlerFn(actionMeta?.name, valueSelected);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Fragment>
            <Form.Label>Customer *</Form.Label>
            <Select
                // defaultInputValue={}

                name="customer"
                placeholder="Select Customer"
                className="react-select mb-2"
                classNamePrefix="react-select"
                isDisabled={customerDisabled}
                options={customersList}
                onChange={(value, actionMeta) => {
                    fetchBuildingsList(value);
                    handleSelection(value, actionMeta);
                }}
                value={data?.customer ? data?.customer : null}
                // isDisabled={true}
                isClearable={false}
            />
            {error?.customerId && <div className="text-danger">{error?.customerId ?? ''}</div>}
            <Form.Label>Building *</Form.Label>
            <Select
                name="building"
                placeholder="Select Building"
                className="react-select mb-2"
                classNamePrefix="react-select"
                isDisabled={buildingDisabled}
                options={buildingsList}
                onChange={(selectedBuilding) => {
                    fetchFloorsList(selectedBuilding, data?.customer?.value ? data?.customer?.value : null);
                    handleSelection(selectedBuilding, {
                        name: 'building',
                        action: 'select-option',
                        option: selectedBuilding,
                    });
                }}
                value={data?.building ? data?.building : null}
                // isDisabled={true}
            />
            {error?.buildingId && <div className="text-danger">{error?.buildingId ?? ''}</div>}
            <Form.Label>Floor *</Form.Label>
            <Select
                name="floor"
                placeholder="Select floor"
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={floorsList}
                onChange={handleSelection}
                value={data?.floor ? data?.floor : null}
                isDisabled={floorDisabled}
            />{' '}
            {error?.floorId && <div className="text-danger">{error?.floorId ?? ''}</div>}
            {/* <Form.Label>Zone</Form.Label>
            <Select
                name="zoneId"
                placeholder="Select zone "
                className="react-select mb-2"
                classNamePrefix="react-select"
                options={zonesList}
                onChange={handleZoneSelection}
                isClearable={false}
            /> */}
        </Fragment>
    );
};

export default CommonSelections;
