import { useState, useContext, useCallback, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useRedux } from 'hooks';
import { ToastContext } from 'context/ToastContext';
import { formConfig } from './formConfig';
import { FormInput } from 'components/form';
import { device } from 'helpers/api/services/Clairco/device';
import { useNavigate } from 'react-router-dom';
import { setSelectedFloor } from 'redux/homePage/actions';
import { conforms } from 'lodash';

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
const DeviceCreation = () => {
    const [customerIdSelected, setCustomerIdSelected] = useState<any>();
    const [buldingSelected, setBuldingSelected] = useState<any>();
    const [selectedFloor, setSelectedFloor] = useState<any>();
    const [zoneSelected, setZoneSelected] = useState<any>();
    const [buildingsList, setBuildingsList] = useState<any>();
    const [floorsList, setFloorsList] = useState<any>();
    const [zonesList, setZonesList] = useState<any>();
    const { appSelector } = useRedux();
    const { customers, buildings, floors, zones, deviceNameToId } = appSelector((state) => ({
        customers: state.Customer?.customers,
        buildings: state.Building.buildings,
        floors: state.Floor.floors,
        zones: state.Zone.zones,
        deviceNameToId: state.Device.deviceNameToId,
    }));
    const navigate = useNavigate();
    const [deviceType, setDeviceType] = useState(null);

    const toast = useContext(ToastContext);
    const deviceTypeList = Array.from(deviceNameToId, ([key, value]) => ({ label: key, value: value }));
    const customersList = customers.map((customer: any) => ({ label: customer?.name, value: customer?.customerId }));

    const handleSubmit = async (event: any) => {
        event.preventDefault();
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
            console.log(deviceData);
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
    const alterForm = (item: any) => {
        return (
            <>
                <Col style={{ marginTop: '20px' }}>
                    <Form.Label>{item.label}</Form.Label>
                    {item.type === 'select' && (
                        <Select
                            name={item.value}
                            placeholder={'Select ' + item.label}
                            className="react-select"
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
                            style={{ width: '100%', height: '20rem' }}
                        />
                    )}
                </Col>
            </>
        );
    };

    useEffect(() => {
        setBuildingsList(() => []);
        setFloorsList(() => []);
        setZonesList(() => []);
        setBuldingSelected('');
        setSelectedFloor([]);
        setZoneSelected([]);
        if (buildings.length > 1) {
            const filteredBuildings = buildings.filter((building: any) => building?.customerId === customerIdSelected);
            setBuildingsList(transformArray(filteredBuildings));
        }
    }, [buildings, customerIdSelected]);

    useEffect(() => {
        setFloorsList([]);
        setZonesList([]);
        setSelectedFloor([]);
        setZoneSelected([]);
        if (floors.length > 1) {
            const filteredFloors = floors.filter((floor: any) => floor?.buildingId === buldingSelected);
            setFloorsList(transformArray(filteredFloors));
        }
    }, [floors, buldingSelected]);
    useEffect(() => {
        setZonesList([]);
        setZoneSelected([]);
        if (zones.length > 1) {
            const filteredZones = zones.filter((zone: any) => zone?.floorId === selectedFloor);
            // console.log('zones selected', transformArray(filteredZones));
            setZonesList(transformArray(filteredZones));
        }
    }, [selectedFloor]);
    return (
        <Row style={{ marginLeft: '2rem', marginTop: '2rem', marginRight: '10rem' }}>
            <Row className="d-flex justify-content-end">
                <Button
                    onClick={() => navigate('/admin/pages/claircosettings')}
                    className="ms-2"
                    style={{ backgroundColor: '#008675', borderColor: '#008675', maxWidth: '10em' }}>
                    Back to settings
                </Button>
            </Row>
            <Form onSubmit={handleSubmit}>
                <Col style={{ marginTop: '20px' }}>
                    <Form.Label>Select Device Type</Form.Label>
                    <Select
                        name="deviceTypeId"
                        placeholder="Select Device Type"
                        className="react-select"
                        classNamePrefix="react-select"
                        options={deviceTypeList}
                        onChange={(e: any) => {
                            const label = e.label?.toLowerCase().replace(/\s+/g, '');
                            setDeviceType(label);
                        }}
                    />
                </Col>
                {deviceType &&
                    (Object.keys(formConfig).includes(deviceType) ? (
                        <>
                            <Form.Label>Customer</Form.Label>
                            <Select
                                name="customerId"
                                placeholder="Select customer"
                                className="react-select"
                                classNamePrefix="react-select"
                                options={customersList}
                                onChange={(e: any) => setCustomerIdSelected(e.value)}
                            />
                            <Form.Label>Building</Form.Label>
                            <Select
                                name="buildingId"
                                placeholder="Select building"
                                className="react-select"
                                classNamePrefix="react-select"
                                options={buildingsList}
                                onChange={(e: any) => setBuldingSelected(e.value)}
                            />
                            <Form.Label>Floor</Form.Label>
                            <Select
                                name="floorId"
                                placeholder="Select floor"
                                className="react-select"
                                classNamePrefix="react-select"
                                options={floorsList}
                                onChange={(e: any) => setSelectedFloor(e?.value)}
                            />
                            <Form.Label>Zone</Form.Label>
                            <Select
                                name="zoneId"
                                placeholder="Select zone "
                                className="react-select"
                                classNamePrefix="react-select"
                                options={zonesList}
                            />
                            {formConfig[deviceType as keyof typeof formConfig].map((item) => alterForm(item))}
                            <Col className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    className="ms-2"
                                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                    SUBMIT
                                </Button>
                            </Col>
                        </>
                    ) : (
                        <>Form is not created for this device type. </>
                    ))}
            </Form>
        </Row>
    );
};

export default DeviceCreation;
