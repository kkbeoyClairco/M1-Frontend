import { useState, useContext, useCallback, useEffect, Fragment } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
import { useRedux } from 'hooks';
import { ToastContext } from 'context/ToastContext';
import { FormInput } from 'components/form';
import { device } from 'helpers/api/services/Clairco/device';
import { useNavigate } from 'react-router-dom';
import { setSelectedFloor } from 'redux/homePage/actions';
import { conforms, floor } from 'lodash';
import { getDeviceTypes } from 'redux/actions';
import { getZonesListAttachedToFloor } from 'helpers/api/services/Clairco/adminSide/zones';
import { BTUModule } from './BTUModule';
import { OccupancyModule } from './OccupancyModule';
import { AHUModule } from './AHUModule';
import { OutdoorModule } from './OutdoorModule';
import { IndoorModule } from './IndoorModule';
import { IAQModule } from './IAQModule';
import { SwitchesModule } from './SwitchesModule';
import { DptModule } from './DptModule';
import { EnergymeterModule } from './EnergymeterModule';
import BuildingSelection from 'components/ClaircoCustomerDashboard/Widgets/LandingPageWidgets/BuildingSelection';
import { customer } from 'helpers/api/services/Clairco/customer';
import CommonSelections from './CommonSelections';

const transformArray = (array: any) => {
    const transformedArray = array?.map((item: any) => {
        return { value: item?.id, label: item?.name };
    });
    return transformedArray;
};
const tarnsformTojsonObject = (object: any) => {
    if (!object) {
        return object;
    }

    let res = object.replace(/\n/g, '');
    res = JSON.parse(res);
    return res;
};
const transformToArray = (item: any) => {
    if (!item) return item;
    return item.replace(/\s+/g, '').split(',').filter(Boolean);
};

const DeviceCreation2 = (props: any) => {
    const [customerSelected, setCustomerSelected] = useState<any>();
    const [buldingSelected, setBuldingSelected] = useState<any>();
    const [selectedFloor, setSelectedFloor] = useState<any>();
    const [zoneSelected, setZoneSelected] = useState<any>();

    const [zonesList, setZonesList] = useState<any>();
    const [newData, setNewData] = useState({
        btu: {},
        occupancy: {},
        ahu: {},
        vrfOutdoor: {},
        vrfIndoor: {},
        energyMeter: {},
        dpt: {},
        switch: {},
        iaq: {},
    });

    const { appSelector, dispatch } = useRedux();
    const { deviceNameToId } = appSelector((state) => ({
        deviceNameToId: state.Device.deviceNameToId ?? [],
    }));
    // const navigate = useNavigate();

    const [deviceType, setDeviceType] = useState<string | null>(null);

    const toast = useContext(ToastContext);
    const deviceTypeList = Array.from(deviceNameToId, ([key, value]) => ({ label: key, value: value }));
    // const customersList = customers.map((customer: any) => ({ label: customer?.name, value: customer?.customerId }));

    const handleChildInputChanges = (key: string, value: any) => {
        try {
            // console.log('New value', key, value);
            setNewData((prev) => ({ ...prev, [key]: value }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            const formData = new FormData(event.target);
            let deviceData: any = {};
            formData.forEach((value, key) => {
                switch (key) {
                    case 'parameters':
                        deviceData[key] = transformToArray(value);
                        break;
                    case 'calibrationValues':
                        deviceData[key] = tarnsformTojsonObject(value);
                        break;
                    case 'limits':
                        deviceData[key] = tarnsformTojsonObject(value);
                        break;
                    case 'dataIntervalTime':
                        deviceData[key] = Number(value);
                        break;
                    default:
                        deviceData[key] = value;
                        break;
                }
            });
            deviceData['floorId'] = selectedFloor?.value ?? '';
            deviceData['customerId'] = customerSelected?.value ?? '';
            deviceData['buildingId'] = buldingSelected.value ?? '';
            if (zoneSelected?.value) deviceData['zoneId'] = zoneSelected.value ?? '';

            // props.onSubmit('Device', deviceData);
        } catch (error: any) {
            if (error instanceof SyntaxError) {
                toast?.showToast('invalid json syntax in calibration values or limits or parameters', 'error');
            } else {
                toast?.showToast(error, 'error');
            }
        }
    };
    // console.log('Modal Info', props.data);

    // Selection Handlers
    const handleZoneSelection = async (newValue: any, actionMeta: ActionMeta<any>) => {
        try {
            setZoneSelected(newValue);
        } catch (error) {
            console.log(error);
        }
    };
    // const;

    const getZones = useCallback(async (floorId: string) => {
        try {
            if (!floorId) return;
            const response = await getZonesListAttachedToFloor(floorId);
            const zones = response?.data?.zones.map((zone: any) => ({ label: zone.name, value: zone.id }));
            setZonesList(zones ?? []);
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getCustomerDetails = useCallback(async (customerId: string) => {
        try {
            const res = await customer.byId(customerId);
            const customerDetails = { label: res.data?.name, value: res.data.id };
            setCustomerSelected(customerDetails);
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getBuildingDetails = useCallback(async (customerId: string, buildingId: string) => {
        try {
            const res = await customer.getBuildingDetailsWithId(customerId, buildingId);
            const building = { label: res?.data?.name, value: res?.data?.id };
            setBuldingSelected(building);
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getFloorDetails = useCallback(async (customerId: string, buildingId: string, floorId: string) => {
        try {
            const res = await customer.getFloorDetailsWithId(customerId, buildingId, floorId);
            const floor = { label: res?.data?.name, value: res?.data?.id };
            setSelectedFloor(floor);
        } catch (error) {
            console.log(error);
        }
    }, []);
    useEffect(() => {
        dispatch(getDeviceTypes());
    }, [dispatch]);
    useEffect(() => {
        const floorId = props?.data?.floorId ?? '';
        const customerId = props?.data?.customerId ?? '';
        const buildingId = props?.data?.buildingId ?? '';

        if (floorId) getZones(floorId);
        if (customerId) getCustomerDetails(customerId);
        if (customerId && buildingId) getBuildingDetails(customerId, buildingId);
        if (customerId && buildingId && floorId) getFloorDetails(customerId, buildingId, floorId);
        // setCustomerSelected({customerId});
        setBuldingSelected(buildingId);
    }, [getBuildingDetails, getCustomerDetails, getFloorDetails, getZones, props?.data]);

    // console.log(props?.data);

    // useEffect(() => {
    //     // console.log('BTU', newData);
    // }, [newData]);
    return (
        <Modal
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center text-dark"
            centered
            onHide={props.onClose}>
            <Modal.Header
                className="text-white d-flex justify-content-center"
                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="d-flex justify-content-center" id="contained-modal-title-vcenter">
                    <h4>Add {deviceType ? deviceType.toUpperCase() : ''} Device</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ marginLeft: '1em', marginTop: '0em', marginRight: '1em' }}>
                    <Row className="d-flex justify-content-end"></Row>
                    <CommonSelections
                        buldingSelected={buldingSelected}
                        customerSelected={customerSelected}
                        deviceTypeList={deviceTypeList}
                        handleZoneSelection={handleZoneSelection}
                        selectedFloor={selectedFloor}
                        setDeviceType={setDeviceType}
                        zonesList={zonesList}
                    />
                    <Form>
                        {deviceType === 'btu' ? (
                            <BTUModule data={newData.btu} onChange={(value) => handleChildInputChanges('btu', value)} />
                        ) : null}
                        {deviceType === 'occupancy' ? <OccupancyModule /> : null}
                        {deviceType === 'ahu' ? <AHUModule /> : null}
                        {deviceType === 'vrv/vrfoutdoor' ? <OutdoorModule /> : null}
                        {deviceType === 'energymeter' ? <EnergymeterModule /> : null}
                        {deviceType === 'dpt' ? <DptModule /> : null}
                        {deviceType === 'switches' ? <SwitchesModule /> : null}
                        {deviceType === 'iaq' ? <IAQModule /> : null}
                        {deviceType === 'vrv/vrfindoor' ? <IndoorModule /> : null}
                        {/* {deviceType === 'gateway' ? <BTUModule /> : null}
                        {deviceType === 'pir' ? <BTUModule /> : null} */}
                    </Form>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                {' '}
                <Col className="d-flex justify-content-end mt-3">
                    <Button
                        onClick={props.onClose}
                        type="button"
                        className="ms-2 btn-secondary"
                        // style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                    >
                        Close
                    </Button>{' '}
                    {deviceType && (
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            className="ms-2"
                            style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                            Submit
                        </Button>
                    )}{' '}
                </Col>
            </Modal.Footer>
        </Modal>
    );
};

export default DeviceCreation2;
