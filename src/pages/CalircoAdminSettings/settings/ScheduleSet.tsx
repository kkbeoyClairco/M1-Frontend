import react, { useState, useEffect, useContext } from 'react';
import { useRedux } from 'hooks';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { ToastContext } from 'context/ToastContext';
import { Table } from 'components';
import { schedule } from 'helpers/api/services/Clairco/schedule';
import CreateAndUpdateSchedule from '../modals/Schedule/CreateAndUpdateSchedule';
import { device } from 'helpers/api/services/Clairco/device';
import Select from 'react-select';
import { sizePerPageList } from '../utils/columns';
import AttachSchedule from '../modals/Schedule/AttachSchedule';
import ViewSchedule from '../modals/Schedule/ViewSchedule';
import ViewDeviceSchedule from '../modals/Schedule/ViewDeviceSchedule';
import OverrideSchedule from '../modals/Schedule/OverrideSchedule';
import { set } from 'lodash';
import DeleteConfirmation from '../modals/Schedule/DeleteConfirmation';

const ScheduleSet = () => {
    const toast = useContext(ToastContext);
    const [showModal, setShowAddModal] = useState(false);
    const [showAttachScheduleModal, setAttachScheduleModal] = useState(false);
    const [showViewDeviceScheduleModal, setViewDeviceScheduleModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [shecduleData, setScheduleData] = useState<any>([]);
    const [showOverrideScheduleModal, setShowOverrideScheduleModal] = useState(false);
    const [deviceType, setDeviceType] = useState<any>({ lable: '', value: '' });
    const [deviceData, setDeviceData] = useState<any>(null);
    const [selectedDevice, setSelectedDevice] = useState<any>(null);
    const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [idAndNameToDelete, setIdAndNameToDelete] = useState({});
    const { appSelector } = useRedux();
    const { deviceNameToId } = appSelector((state) => ({
        deviceNameToId: state.Device.deviceNameToId,
    }));
    const deviceTypeList = Array.from(deviceNameToId, ([key, value]) => ({ label: key, value: key }));

    const fetchDeviceData = async (e: any) => {
        try {
            const label = e.label?.replace(/\s+/g, '');
            const value = e.value;
            console.log('Value', value);
            setDeviceType({ label, value });
            // if (value === '' || label === '') {
            //     toast?.showToast('Please select device type', 'error');
            //     return;
            // } else if (label != 'AHU') {
            //     toast?.showToast('only AHU device type is available', 'error');
            //     return;
            // }

            const response = await device.byDeviceTypeId({ deviceType: value });
            if (response.data) {
                setDeviceData(response.data);
                toast?.showToast('Device Data fetched successfully', 'success');
            }
        } catch (error: any) {
            toast?.showToast('some error occure while fetching Device Data', 'error');
        }
    };

    const deleteSchedule = async (scheduleId: string) => {
        try {
            // const response = await schedule.delete({ scheduleId });
            // if (response.data) {
            //     setScheduleData((prevSchedules: any) =>
            //         prevSchedules.filter((schedule: any) => schedule.id !== scheduleId)
            //     );
            //     toast?.showToast('Schedule deleted successfully', 'success');
            // }
        } catch (error) {
            toast?.showToast('some error occure while deleting schedule', 'error');
        }
    };

    const fetchSchedules = async () => {
        try {
            const schedules = await schedule.all();
            if (schedules.data) {
                setScheduleData(schedules.data);
            }
        } catch (error: any) {
            toast?.showToast('some error occure while fetching schedule', 'error');
        }
    };

    const updateExistingSchedule = async (schedule: any) => {
        try {
            // console.log('update schedule', schedule);
            const data = shecduleData;
            const index = data.findIndex((item: any) => item.id === schedule.id);
            if (index !== -1) {
                data[index] = schedule;
                setScheduleData(data);
            } else {
                data.push(schedule);
                setScheduleData(data);
            }
        } catch (error: any) {
            console.log(error);
        }
    };
    const handleModalState = (data?: any) => {
        try {
            console.log('Data', data);
            setDeleteModal((prev) => !prev);
            if (!deleteModal) {
                return;
            }
            const { id = '', name = '' } = data;
            setIdAndNameToDelete({ id, name });
            // deleteModal()
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = (scheduleId: string) => {
        try {
            handleModalState();
            // deleteSchedule(scheduleId);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchSchedules();
    }, []);

    const AttachScheduleInfo = ({ row }: any) => {
        return (
            <Row style={{ justifyContent: 'center' }}>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-eye"
                        style={{ cursor: 'pointer', fontSize: '20px' }} // Larger icon size and reduced margin
                        onClick={() => {
                            setSelectedDevice(row.original);
                            setViewDeviceScheduleModal(true);
                        }}></i>
                </Col>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-pencil-box-multiple"
                        style={{ cursor: 'pointer', fontSize: '20px' }} // Larger icon size
                        onClick={() => {
                            setSelectedDevice(row.original);
                            setAttachScheduleModal(true);
                        }}></i>
                </Col>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-cached"
                        style={{ cursor: 'pointer', fontSize: '20px' }} // Larger icon size
                        onClick={() => {
                            setSelectedDevice(row.original);
                            setShowOverrideScheduleModal(true);
                        }}></i>
                </Col>
            </Row>
        );
    };
    const Scheduleinfo = ({ row }: any) => {
        return (
            <Row style={{ justifyContent: 'center' }}>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-eye me-1"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => {
                            setSelectedSchedule(row.original);
                            setShowScheduleModal(true);
                        }}></i>
                </Col>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-trash-can-outline me-1"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => {
                            handleModalState(row?.original ?? {});
                        }}></i>
                </Col>
                <Col xs={1} className="text-center">
                    <i
                        className="mdi mdi-pencil-box-multiple"
                        style={{ cursor: 'pointer', fontSize: '20px' }}
                        onClick={() => {
                            setSelectedSchedule(row.original);
                            setShowAddModal(true);
                        }}></i>
                </Col>
            </Row>
        );
    };

    const deviceColumns = [
        { Header: 'Device Name', accessor: 'name', defaultCanSort: false },
        { Header: 'View / Attach Schedule /Override Schedule', accessor: 'action', Cell: AttachScheduleInfo },
    ];
    const scheduleColumns = [
        { Header: 'Schedule Name', accessor: 'name', defaultCanSort: false },
        { Header: 'View/Delete/Edit', accessor: 'action', Cell: Scheduleinfo },
    ];

    return (
        <>
            <DeleteConfirmation handleModalState={handleModalState} state={deleteModal} deleteFn={handleDeleteClick} />
            {showAttachScheduleModal && (
                <AttachSchedule
                    onClose={() => setAttachScheduleModal(false)}
                    show={showAttachScheduleModal}
                    selecteddevice={selectedDevice}
                    deviceTypeId={deviceType?.value}
                    schedules={shecduleData ?? []}
                />
            )}
            {showViewDeviceScheduleModal && (
                <ViewDeviceSchedule
                    onClose={() => setViewDeviceScheduleModal(false)}
                    show={showViewDeviceScheduleModal}
                    selecteddevice={selectedDevice}
                />
            )}
            {showOverrideScheduleModal && (
                <OverrideSchedule
                    onClose={() => setShowOverrideScheduleModal(false)}
                    show={showOverrideScheduleModal}
                    selecteddevice={selectedDevice}
                />
            )}
            <Row className="mt-4">
                {/* <Row></Row> */}

                <Card>
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <h4 className="header-title mb-3">Schedule Templets</h4>
                            </Col>
                            <Col xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                                    variant="primary"
                                    onClick={() => setShowAddModal(true)}
                                    className="mb-3">
                                    Create New Templet
                                </Button>
                            </Col>
                        </Row>
                        <Table
                            columns={scheduleColumns}
                            data={shecduleData ?? []}
                            pageSize={10}
                            sizePerPageList={sizePerPageList}
                            isSortable
                            pagination
                            isSearchable
                            tableClass="table-striped text-center"
                            searchBoxClass="mb-2"
                        />
                    </Card.Body>
                    {showModal && (
                        <CreateAndUpdateSchedule
                            onClose={() => {
                                setShowAddModal(false);
                                setSelectedSchedule(null);
                            }}
                            show={showModal}
                            updateScheduleData={updateExistingSchedule}
                            selectedschedule={selectedSchedule}
                        />
                    )}
                    {showScheduleModal && (
                        <ViewSchedule
                            onClose={() => {
                                setShowScheduleModal(false);
                                setSelectedSchedule(null);
                            }}
                            show={showScheduleModal}
                            selectedschedule={selectedSchedule}
                        />
                    )}
                </Card>

                <Card className="p-2">
                    <Card.Body>
                        <Row>
                            <Col xs={6}>
                                <h4 className="header-title mb-3">Devices List</h4>
                            </Col>

                            <Col sm={6}>
                                <Select
                                    name="deviceTypeId"
                                    placeholder="Select Device Type to Fetch Data"
                                    className="react-select"
                                    classNamePrefix="react-select"
                                    options={deviceTypeList}
                                    onChange={fetchDeviceData}
                                />
                            </Col>
                            {/* <Col xs={6}>
                        <Button
                            style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                            variant="primary"
                            onClick={() => fetchDeviceData()}
                            className="mb-3">
                            Fetch Device Data
                        </Button>
                    </Col> */}
                        </Row>
                        <Table
                            columns={deviceColumns}
                            data={deviceData ?? []}
                            pageSize={10}
                            sizePerPageList={sizePerPageList}
                            isSortable
                            pagination
                            isSearchable
                            tableClass="table-striped text-center"
                            searchBoxClass="mb-2"
                        />
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
};

export default ScheduleSet;
