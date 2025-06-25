import React, { useState, useContext, useCallback, useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { ActionMeta } from 'react-select';
import { useRedux } from 'hooks';
import { ToastContext } from 'context/ToastContext';
import { getDeviceTypes } from 'redux/actions';
import { getZonesListAttachedToFloor } from 'helpers/api/services/Clairco/adminSide/zones';
// import { BTUModule } from './BTUModule';
// import { OccupancyModule } from './OccupancyModule';
// import { AHUModule } from './AHUModule';
// import { OutdoorModule } from './OutdoorModule';
// import { IndoorModule } from './IndoorModule';
import { IAQModule } from './IAQModule';
// import { SwitchesModule } from './SwitchesModule';
// import { DptModule } from './DptModule';
// import { EnergymeterModule } from './EnergymeterModule';
import { customer } from 'helpers/api/services/Clairco/customer';
import CommonSelections from './CommonSelections';
import { btuFormValidator, occupancyFormValidator } from 'validators/btuFormValidator';
import { toast } from 'sonner';
import { selectTagType } from 'types/selectTagType';
import { param } from './deviceCreationConstants';
import { iaqFormValidator } from 'validators/iaqDeviceCreationValidator';
// import { userValidationSchema } from 'pages/CalircoAdminSettings/utils/validations';
// const transformArray = (array: any) => {
//     const transformedArray = array?.map((item: any) => {
//         return { value: item?.id, label: item?.name };
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
interface dataInterface {
    customer?: selectTagType;
    building?: selectTagType;
    floor?: selectTagType;
    name?: string;
    outdoorDeviceType?: selectTagType;
    outdoorDevice?: selectTagType;
    stationId?: string;
    subscriptionEndsOn?: Date;
    parameters?: {
        parameter?: selectTagType;
        lowerLimit?: number | string;
        upperLimit?: string | number;
        calibrationValue?: string | number;
    }[];
}
const IAQDeviceCreation = (props: any) => {
    const [isApiLoading, setIsApiLoading] = useState(false);
    const [newData, setNewData] = useState<dataInterface>({ parameters: [param] });
    const [error, setError] = useState({
        name: null,
        customer: null,
        floor: null,
        building: null,
        outdoorDevice: null,
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
                    validationErrors[validationError.path] = validationError.message;
                    console.log(validationError.message);
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
            // console.log('INput change', value, key);
            // Object.entries(value).forEach(([key, value]) => {});

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
                customer: newData?.customer?.value,
                building: newData?.building?.value,
                floor: newData?.floor?.value,
                outdoorDeviceType: newData?.outdoorDeviceType?.value,
            };
            validateSubmitData(data, iaqFormValidator, setError);
        } catch (error: any) {
            toast.error('Oops! Something went wrong. Please try again in a moment.');
        } finally {
            setIsApiLoading(false);
        }
    };

    useEffect(() => {
        console.log('Error', error);
    }, [error]);

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
                        customersList={props?.data?.customerList}
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
