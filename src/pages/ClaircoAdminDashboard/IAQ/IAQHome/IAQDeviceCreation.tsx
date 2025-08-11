import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
// import { IndoorModule } from './IndoorModule';
import { IAQModule } from './IAQModule';
import CommonSelections from './CommonSelections';
import { toast } from 'sonner';
import { selectTagType } from 'types/selectTagType';
import { iaqFormValidator } from 'validators/iaqDeviceCreationValidator';
import { createIAQDevice } from 'helpers/api/services/Clairco/customerSide/iaq';
import { getCustomersList } from 'helpers/api/services/Clairco/customerSide/maintenance';
// import { userValidationSchema } from 'pages/CalircoAdminSettings/utils/validations';
// const transformArray = (array: any) => {
//     const transformedArray = array?.map((item: any) => {
//         return { value: item?._id, label: item?.name };
//     });
//     return transformedArray;
// };
// const tarnsformTojsonObject = (object: any) => {
//     if (!object) {
//         return object;
//     }

//     let res = object.replace(/\n/g, '');
//     res = JSON.parse(res);
//     return res;
// };
// const transformToArray = (item: any) => {
//     if (!item) return item;
//     return item.replace(/\s+/g, '').split(',').filter(Boolean);
// };
const activeParameters = ['PM1', 'PM25', 'PM4', 'PM10', 'CO2', 'HUM', 'TEMP'];
type IAQParameterKey = 'PM1' | 'PM25' | 'PM4' | 'PM10' | 'CO2' | 'HUM' | 'TEMP';
interface parameterType {
    name: IAQParameterKey;
    low: string | number;
    high: number;
    calib: string | number;
    isActive: boolean;
}
// type IAQParameters = {
//     [key in IAQParameterKey]?: parameterType;
// };
type IAQParameters = parameterType[];
interface dataInterface {
    customer?: selectTagType;
    building?: selectTagType;
    floor?: selectTagType;
    name?: string;
    outdoorDeviceType?: selectTagType;
    outdoorDevice?: selectTagType;
    stationId?: string;
    subscriptionEndsOn?: Date;
    parameters?: IAQParameters;
}
const IAQDeviceCreation = (props: any) => {
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [newData, setNewData] = useState<dataInterface>();
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState({
        name: null,
        customer: null,
        floor: null,
        building: null,
        // outdoorDevice: null,
    });

    const validateSubmitData = async (
        data: Record<string, any>,
        validationSchema: any,
        setError: React.Dispatch<React.SetStateAction<any>>
    ) => {
        try {
            await validationSchema.validate(data, { abortEarly: false });
            setError(null);
        } catch (error: any) {
            if (error.inner) {
                const validationErrors: Record<string, string> = {};
                error.inner.forEach((validationError: any) => {
                    if (validationError.path.includes('parameters')) {
                        const parameterName = validationError.path?.split('.')?.[1] ?? '';

                        validationErrors[parameterName] = validationError.message;
                        return;
                    } else validationErrors[validationError.path] = validationError.message;
                    // console.log(validationError.path);
                    toast.error(`Please recheck the form inputs`);
                });
                setError((prev: any) => ({
                    ...prev,
                    ...validationErrors,
                }));
            } else {
                console.error(error);
            }
            throw new Error('Validation Failed', error);
        }
    };

    const validateInputs = async (
        deviceType: string,
        data: Record<string, any>,
        validationSchema: any,
        setError: React.Dispatch<React.SetStateAction<any>>
    ) => {
        try {
            for (const [key, value] of Object.entries(data)) {
                await validationSchema.validateAt(key, { [key]: value });
                setError((prev: any) => ({
                    ...prev,
                    [deviceType]: {
                        ...prev[deviceType],
                        [key]: null,
                    },
                }));
            }
        } catch (error: any) {
            if (error.path) {
                setError((prev: any) => ({
                    ...prev,
                    [deviceType]: {
                        ...prev[deviceType],
                        [error.path]: error.message,
                    },
                }));
            } else {
                console.error(error);
            }
        }
    };
    const handleChildInputChanges = async (key: string, value: any) => {
        try {
            setNewData((prev) => ({ ...prev, [key]: value }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsApiLoading(true);
            const data = {
                ...newData,
                customerId: newData?.customer?.value,
                buildingId: newData?.building?.value,
                floorId: newData?.floor?.value,
                outdoorDeviceType: newData?.outdoorDeviceType?.value,
            };
            const parametersFromUI = newData?.parameters;
            const newParameter = parametersFromUI?.reduce((accu: any, parameter: any) => {
                if (!activeParameters.includes(parameter.name ?? '')) return accu;
                accu[parameter?.name] = {
                    ...parameter,
                };
                delete accu[parameter?.name]['name'];
                return accu;
            }, {});
            data.parameters = newParameter;
            await validateSubmitData(data, iaqFormValidator, setError);
            const res = await createIAQDevice(data);
            if (res?.status === 201) {
                toast.success(`Successfully added the IAQ ${res?.data?.device?.name ?? ''} device.`);
                props?.onClose();
            } else {
                console.error(res);
                toast.warning('Something went wrong, Please check console');
            }
            // console.log('Device Creation Res', res);
            //API Call
        } catch (error: any) {
            toast.error('Oops! Something went wrong. Please try again in a moment.');
        } finally {
            setIsApiLoading(false);
        }
    };
    const fetchCustomersList = async () => {
        try {
            const res = await getCustomersList();
            // console.log('Custoemrs List', res);
            const list = res?.data?.records?.map((item: any) => ({ label: item.name, value: item._id }));

            setCustomers(list ?? []);
        } catch (error) {
            console.log(error);
            setCustomers([]);
        }
    };
    useEffect(function initialApiCall() {
        fetchCustomersList();
    }, []);
    return (
        <Modal
            size="xl"
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center text-dark "
            centered
            onHide={props.onClose}>
            <Modal.Header
                closeButton
                className="text-white d-flex justify-content-center"
                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="d-flex justify-content-center" id="contained-modal-title-vcenter">
                    <h4>Add IAQ Device</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="text-dark" style={{ marginLeft: '1em', marginTop: '0em', marginRight: '1em' }}>
                    <Row className="d-flex justify-content-end "></Row>
                    <CommonSelections
                        customersList={customers ?? []}
                        handlerFn={handleChildInputChanges}
                        data={newData}
                        error={error}
                    />
                    <Form>
                        <IAQModule data={newData} handlerFn={handleChildInputChanges} error={error} />
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
                    <Button
                        // disabled={!deviceType}
                        type="button"
                        onClick={handleSubmit}
                        className="ms-2"
                        style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                        {isApiLoading ? 'Loading...' : '  Submit'}
                    </Button>
                </Col>
            </Modal.Footer>
        </Modal>
    );
};

export default IAQDeviceCreation;
