import { useState, useContext, useCallback, useEffect, Fragment } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
import { useRedux } from 'hooks';
import { ToastContext } from 'context/ToastContext';
import { deviceCreationformConfig } from './deviceCreationformConfig';
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
const alterForm = (item: any) => {
    return (
        <Fragment key={item.label}>
            <Col style={{ marginTop: '20px' }}>
                <Form.Label>{item.label}</Form.Label>
                {item.type === 'select' && (
                    <Select
                        name={item.value}
                        placeholder={'Select ' + item.label}
                        className="react-select mb-2"
                        classNamePrefix="react-select"
                        options={[]}
                    />
                )}
                {item.type === 'input' && (
                    <FormInput
                        placeholder={'Enter ' + item.label}
                        type="text"
                        name={item.value}
                        containerClass={'mb-1'}
                        key="text"
                    />
                )}

                {(item.type === 'object' || item.type === 'list') && (
                    <Form.Control
                        as="textarea"
                        placeholder={'Enter ' + item.label + ' in this proper format'}
                        name={item.value}
                        style={{ width: '100%', height: '8em' }}
                    />
                )}
            </Col>
        </Fragment>
    );
};

const DeviceCreation2 = (props: any) => {
    const [customerIdSelected, setCustomerIdSelected] = useState<any>();
    const [buldingSelected, setBuldingSelected] = useState<any>();
    const [selectedFloor, setSelectedFloor] = useState<any>();
    const [zoneSelected, setZoneSelected] = useState<any>();
    const [buildingsList, setBuildingsList] = useState<any>();
    const [floorsList, setFloorsList] = useState<any>();
    const [zonesList, setZonesList] = useState<any>();
    const { appSelector, dispatch } = useRedux();
    const { customers, buildings, floors, zones, deviceNameToId } = appSelector((state) => ({
        customers: state.Customer?.customers ?? [],
        buildings: state.Building.buildings ?? [],
        floors: state.Floor.floors ?? [],
        zones: state.Zone.zones ?? [],
        deviceNameToId: state.Device.deviceNameToId ?? [],
    }));
    const navigate = useNavigate();

    const [deviceType, setDeviceType] = useState<string | null>(null);

    const toast = useContext(ToastContext);
    const deviceTypeList = Array.from(deviceNameToId, ([key, value]) => ({ label: key, value: value }));
    const customersList = customers.map((customer: any) => ({ label: customer?.name, value: customer?.customerId }));

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
            // console.log('Device Data', deviceData);
            props.onSubmit('Device', deviceData);
            // const res = await device.createInBulk(deviceData);
            // toast?.showToast('device created successfully', 'success');
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
            console.log(newValue);
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
    useEffect(() => {
        dispatch(getDeviceTypes());
    }, [dispatch]);
    useEffect(() => {
        const floorId = props?.data?.floorId ?? '';
        if (floorId) getZones(floorId);
    }, [getZones, props]);
    useEffect(() => {
        console.log(deviceType);
    }, [deviceType]);
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
                    <Form onSubmit={handleSubmit}>
                        <Col style={{ marginTop: '15px' }}>
                            <Form.Label>Select Device Type</Form.Label>
                            <Select
                                name="deviceType"
                                placeholder="Select Device Type"
                                className="react-select mb-2"
                                classNamePrefix="react-select"
                                options={deviceTypeList}
                                onChange={(e: any) => {
                                    const label = e.label?.toLowerCase().replace(/\s+/g, '');
                                    setDeviceType(label);
                                }}
                            />
                        </Col>
                        {/* {deviceType &&
                            (Object.keys(deviceCreationformConfig).includes(deviceType) ? (
                                <> */}
                        <Form.Label>Customer</Form.Label>
                        <Select
                            name="customerId"
                            placeholder="Select customer"
                            className="react-select mb-2"
                            classNamePrefix="react-select"
                            options={customersList}
                            onChange={(e: any) => setCustomerIdSelected(e.value)}
                            value={props.data.customerId ? { label: 'Selected', value: props.data.customerId } : null}
                            isDisabled={props.data.customerId ? true : false}
                        />
                        <Form.Label>Building</Form.Label>
                        <Select
                            name="buildingId"
                            placeholder="Select building"
                            className="react-select mb-2"
                            classNamePrefix="react-select"
                            options={buildingsList}
                            onChange={(e: any) => setBuldingSelected(e.value)}
                            value={props.data.buildingId ? { label: 'Selected', value: props.data.buildingId } : null}
                            isDisabled={props.data.buildingId ? true : false}
                        />
                        <Form.Label>Floor</Form.Label>
                        <Select
                            name="floorId"
                            placeholder="Select floor"
                            className="react-select mb-2"
                            classNamePrefix="react-select"
                            options={floorsList}
                            onChange={(e: any) => setSelectedFloor(e?.value)}
                            value={props.data.floorId ? { label: 'Selected', value: props.data.floorId } : null}
                            isDisabled={props.data.floorId ? true : false}
                        />
                        <Form.Label>Zone</Form.Label>
                        <Select
                            name="zoneId"
                            placeholder="Select zone "
                            className="react-select mb-2"
                            classNamePrefix="react-select"
                            options={zonesList}
                            onChange={handleZoneSelection}
                        />
                        {/* {deviceCreationformConfig[deviceType as keyof typeof deviceCreationformConfig].map(
                                        (item: any) => alterForm(item)
                                    )} */}
                        {deviceType === 'btu' ? <BTUModule /> : null}
                        {deviceType === 'occupancy' ? <OccupancyModule /> : null}
                        {deviceType === 'ahu' ? <AHUModule /> : null}
                        {deviceType === 'vrv/vrfoutdoor' ? <OutdoorModule /> : null}
                        {deviceType === 'energymeter' ? <EnergymeterModule /> : null}
                        {deviceType === 'dpt' ? <DptModule /> : null}
                        {deviceType === 'switches' ? <SwitchesModule /> : null}
                        {deviceType === 'iaq' ? <IAQModule /> : null}
                        {deviceType === 'vrv/vrf' ? <IndoorModule /> : null}
                        {/* {deviceType === 'gateway' ? <BTUModule /> : null}
                        {deviceType === 'pir' ? <BTUModule /> : null} */}

                        <Col className="d-flex justify-content-end mt-3">
                            {deviceType && (
                                <Button
                                    type="submit"
                                    className="ms-2"
                                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                    SUBMIT
                                </Button>
                            )}{' '}
                        </Col>
                        {/* </> */}
                        {/* ) : (
                                <>Form is not created for this device type. </>
                            ))} */}
                    </Form>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default DeviceCreation2;
