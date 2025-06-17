import { FormInput, HyperDatepicker } from 'components';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Select, { ActionMeta } from 'react-select';
import { validationSchema } from './formValidation';
// import { error } from 'console';
// import { get } from 'lodash';
import {
    createNewMaintenanceLog,
    getBuildingListWithCustomerId,
    getCustomersList,
    getDeviceTypeList,
    getFloorListWithBuildingId,
    getTechnicianList,
} from 'helpers/api/services/Clairco/customerSide/maintenance';
import { AxiosResponse } from 'axios';
import { convertDateToEpoch } from 'utils/timeFunctions';

interface LogInputModalPropTYpes {
    modalState: boolean;
    modalControlFn: () => void;
    refreshFn: (uniqueValue: number) => void;
}
const eventConstants = {
    technican: 'technican',
    device: 'device',
    customer: 'customer',
    building: 'building',
    floor: 'floor',
};
interface selectTagType {
    label: string;
    value: string;
}
interface ValidationErrors {
    [key: string]: string;
}
const LogInputModal: React.FC<LogInputModalPropTYpes> = ({ modalState, modalControlFn, refreshFn }) => {
    const [workImage, setWorkImage] = useState<File | null>(null);
    const [techniciansList, setTechniciansList] = useState<any[]>([]);
    const [customersList, setCustomersList] = useState<any>([]);

    const [buildingsList, setBuildingsList] = useState<any>([]);
    const [floorsList, setFloorsList] = useState<any[]>([]);
    const [devicesList, setDevicesList] = useState<any[]>([]);
    // const [date, setDate] = useState<Date>(new Date(Date.now()));
    const [description, setDescription] = useState<string | null>(null);
    const [customerSelected, setCustomerSelected] = useState<selectTagType | null>(null);
    const [technicianSelected, setTechnicianSelected] = useState<selectTagType | undefined>(undefined);
    const [deviceSelected, setDeviceSelected] = useState<selectTagType>();
    const [buildingSelected, setBuildingSelected] = useState<selectTagType>();
    const [floorSelected, setFloorsSelected] = useState<selectTagType>();
    const [dateDone, setDateDone] = useState(new Date());
    const [error, setError] = useState<ValidationErrors>({});
    const [supervisor, setSupervisor] = useState<string>('');
    interface ResponseState {
        status: boolean;
        message?: string;
        error?: boolean;
    }

    const [response, setResponse] = useState<ResponseState>({ status: false });
    // const dummy = [{ label: 'Technican Name', value: 'sdsadsdsdsds' }];
    let timer: ReturnType<typeof setTimeout>;
    const createDataForSelectTag = (data: any) => {
        try {
            const list = data?.map((item: any) => ({ label: item.name ?? '', value: item._id ?? '' }));
            return list;
        } catch (error) {
            console.log(error);
            return [];
        }
    };
    // Handler Functions
    // File Upload Function
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        try {
            // console.log('Image', e.target.files?.[0]);
            setWorkImage(e.target?.files?.[0] ?? null);
        } catch (error) {
            console.log(error);
        }
    };
    // API Calls For Select Tag
    const fetchTechnicanList = async () => {
        try {
            const res = await getTechnicianList();
            const list = createDataForSelectTag(res?.data);
            // ?.map((item: any) => ({ label: item.name, value: item._id }));
            setTechniciansList(list ?? []);
        } catch (error) {
            console.log(error);
            setTechniciansList([]);
        }
    };

    const fetchCustomersList = async () => {
        try {
            const res = await getCustomersList();
            // console.log('Custoemrs List', res);
            const list = res?.data?.map((item: any) => ({ label: item.name, value: item.id }));

            setCustomersList(list ?? []);
        } catch (error) {
            console.log(error);
            setCustomersList([]);
        }
    };

    const fetchBuildingsList = async (customerSelected: string) => {
        try {
            // console.log('Customer', customerSelected);
            const res = await getBuildingListWithCustomerId(customerSelected);
            const list = res?.data?.map((item: any) => ({ label: item.name, value: item.id }));
            setBuildingsList(list ?? []);
        } catch (error) {
            setBuildingsList([]);
        }
    };

    const fetchFloorsLis = async (customer: string, buildingSelected: string) => {
        try {
            const res = await getFloorListWithBuildingId(customer, buildingSelected);
            const list = res?.data?.map((item: any) => ({ label: item.name, value: item.id }));
            setFloorsList(list ?? []);
        } catch (error) {
            console.log(error);
            setFloorsList([]);
        }
    };

    const fetchDeviceList = async () => {
        try {
            const res = await getDeviceTypeList();
            const list = res?.data?.map((item: any) => ({ label: item.deviceTypeName, value: item.id }));
            setDevicesList(list ?? []);
        } catch (error) {
            console.log(error);
            setDevicesList([]);
        }
    };
    // Select Option Handler
    const handleSelectionChanges = (e: selectTagType | null, actionMeta: ActionMeta<selectTagType>) => {
        try {
            // console.log('E', e, actionMeta);
            switch (actionMeta?.name) {
                case eventConstants.technican:
                    if (e) setTechnicianSelected(e);
                    break;
                case eventConstants.customer:
                    if (e) {
                        setCustomerSelected(e);
                        // console.log('Customer', e);
                        fetchBuildingsList(e?.value ?? '');
                        setBuildingSelected({ label: '', value: '' });
                        setFloorsSelected({ label: '', value: '' });
                    }
                    break;

                case eventConstants.building:
                    if (e) {
                        setBuildingSelected(e);
                        setFloorsSelected({ label: '', value: '' });
                        fetchFloorsLis(customerSelected?.value ?? '', e?.value ?? '');
                    }
                    break;
                case eventConstants.floor:
                    if (e) {
                        setFloorsSelected(e);
                    }
                    break;
                case eventConstants.device:
                    if (e) setDeviceSelected(e);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // Text Input handler
    const handleTextInput = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        try {
            switch (field) {
                case 'clientSupervisor':
                    setSupervisor(e.target?.value ?? '');
                    break;
                case 'description':
                    setDescription(e.target?.value ?? '');
                    break;
            }

            // setError;
        } catch (error) {
            console.log(error);
        }
    };

    const handleAPISuccess = () => {
        try {
            setResponse({ status: true, message: 'Log have been created', error: false });
            timer = setTimeout(() => {
                modalControlFn();
                refreshFn(Date.now());
            }, 3000);
        } catch (error) {
            console.log(error);
        }
    };
    // Submit Handler
    const handleSUbmit = async (e: FormEvent<HTMLButtonElement>) => {
        try {
            e.preventDefault();
            const formData = {
                technicianId: technicianSelected?.value ?? '',
                clientSupervisorName: supervisor,
                customerId: customerSelected?.value ?? '',
                buildingId: buildingSelected?.value ?? '',
                floorId: floorSelected?.value ?? '',
                deviceType: deviceSelected?.value ?? '',
                workDescription: description ?? '',
                maintainedAt: convertDateToEpoch(dateDone),
                workDoneImg: workImage,
            };

            // Validation
            validationSchema
                .validate(formData, { abortEarly: false })
                .then(async (data) => {
                    const formData = new FormData();
                    (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
                        formData.append(key, data[key] as string | Blob);
                    });
                    const res1 = await createNewMaintenanceLog(formData);
                    if (res1?.status === 201) {
                        handleAPISuccess();
                        return;
                    } else setResponse({ status: true, message: 'Something went wrong,please try again', error: true });
                })
                .catch((error) => {
                    console.log(error);
                    const validationErrors: ValidationErrors = {};
                    error.inner.forEach((error: any) => {
                        console.log(error);

                        validationErrors[error?.path ?? ''] = error.message;
                    });
                    setError(validationErrors);
                });
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleDateSelection = (e: Date) => {
        try {
            // console.log('Date', e);
            setDateDone(e);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchTechnicanList();
        fetchCustomersList();
        fetchDeviceList();
        return () => {
            clearTimeout(timer);
        };
    }, []);
    return (
        <Modal
            show={modalState}
            onHide={modalControlFn}
            animation={true}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center "
            size="lg"
            centered>
            <Modal.Header style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                <Modal.Title className="text-white " style={{ paddingLeft: '1em' }}>
                    Add Maintenance History
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: '2em' }}>
                <form onSubmit={() => {}}>
                    <Form.Group className="mb-2">
                        <Form.Label>Technician Name *</Form.Label>
                        <Select
                            name={eventConstants.technican}
                            placeholder="Select Technician"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={techniciansList}
                            onChange={handleSelectionChanges}
                        />
                        {error.technicianId && <div className="text-danger">{error.technicianId}</div>}
                    </Form.Group>{' '}
                    <Form.Group className="mb-2">
                        <Form.Label>Client Supervisor Name *</Form.Label>
                        <FormInput
                            placeholder="Client Supervisor Name"
                            type="text"
                            name="clientSupervisor"
                            containerClass={'mb-1'}
                            key="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextInput(e, 'clientSupervisor')}
                        />

                        {error.clientSupervisorName && <div className="text-danger">{error.clientSupervisorName}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Customer *</Form.Label>
                        <Select
                            name={eventConstants.customer}
                            placeholder="Select Customer"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={customersList}
                            onChange={handleSelectionChanges}
                        />
                        {error.customerId && <div className="text-danger">{error.customerId}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Building *</Form.Label>
                        <Select
                            name={eventConstants.building}
                            placeholder="Select Building"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={buildingsList}
                            onChange={handleSelectionChanges}
                            value={Object.keys(buildingSelected ?? {}).length < 1 ? null : buildingSelected}
                        />
                        {error.buildingId && <div className="text-danger">{error.buildingId}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Floor *</Form.Label>
                        <Select
                            name={eventConstants.floor}
                            placeholder="Select Floor"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={floorsList}
                            onChange={handleSelectionChanges}
                            value={Object.keys(floorSelected ?? {}).length < 1 ? null : floorSelected}
                        />
                        {error.floorId && <div className="text-danger">{error.floorId}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Device *</Form.Label>
                        <Select
                            name={eventConstants.device}
                            placeholder="Select Device"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={devicesList}
                            onChange={handleSelectionChanges}
                        />
                        {error.deviceType && <div className="text-danger">{error.deviceType}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Date *</Form.Label>
                        <HyperDatepicker
                            showTimeSelect={true}
                            value={dateDone}
                            dateFormat={'MM/dd/yyyy h:mm aa'}
                            onChange={handleDateSelection}
                        />
                        {error.date && <div className="text-danger">{error.date}</div>}
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Work Description *</Form.Label>
                        <FormInput
                            placeholder="Description about the nature of work done"
                            type="textarea"
                            name="description"
                            containerClass={'mb-1'}
                            key="text"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => handleTextInput(e, 'description')}
                        />
                        {error.workDescription && <div className="text-danger">{error.workDescription}</div>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Image of the Work done *</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileUpload} />{' '}
                        {error.workDoneImg && <div className="text-danger">{error.workDoneImg}</div>}
                    </Form.Group>
                    <Row className="float-end">
                        <Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                                onClick={handleSUbmit}>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                </form>
                {response.status ? (
                    <h5 style={{ color: response.error ? 'red' : 'green' }}>
                        {response.error ? '' : ':✔'} {response.message}
                    </h5>
                ) : null}
            </Modal.Body>
        </Modal>
    );
};

export default LogInputModal;
