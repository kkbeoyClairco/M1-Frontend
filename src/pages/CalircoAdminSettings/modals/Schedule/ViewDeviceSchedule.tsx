import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import { schedule } from 'helpers/api/services/Clairco/schedule';
import { Card, Col, Row } from 'react-bootstrap';
import { ToastContext } from 'context/ToastContext';
import { days } from 'pages/CalircoAdminSettings/utils/columns';
import TemperatureChart from 'pages/CalircoAdminSettings/utils/TemperatureChart';

const ViewDeviceSchedule = (props: any) => {

    const toast = useContext(ToastContext);
    const schedules: any = props.selecteddevice?.schedules;
    const activeDaybg = '#f3944a';
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<any>(null);
    const [morningData, setMorningData] = useState<any>(null);
    const [afternoonData, setAfternoonData] = useState<any>(null);
    const deleteScheduleByDay = async (deviceId: string, day: string,scheduleId:any) => {
        try {
         if(!scheduleId){
            toast?.showToast('No schedule found for the selected day', 'error');
            return;
         }
            setIsLoading(true);
            const response = await schedule.deleteByDay({ deviceId, day });
            if (response.data) {
                toast?.showToast('Schedule deleted successfully', 'success');
            }
        } catch (error) {
            toast?.showToast('some error occure while deleting schedule', 'error');
        }
    };
    const fetchScheduleData = async (day: any) => {
        try {
            setIsLoading(true);
            setSelectedDay(day);
            const scheduleId = schedules.find((schedule: any) => schedule.day === day)?.scheduleId;
            if (!scheduleId) {
                setMorningData(null);
                setAfternoonData(null);
                toast?.showToast('No schedule found for the selected day', 'error');
                return;
            }
            const response = await schedule.byId({ scheduleId });
            if (response.data) {
                toast?.showToast('Schedule Data fetched successfully', 'success');
                setMorningData(response.data.body.filter((item: any) => item.time >= '00:00' && item.time < '12:00'));
                setAfternoonData(
                    response.data.body.filter((item: any) => item.time >= '12:00' && item.time <= '23:45')
                );
            }
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        }
    };

    const DayCards = () => {
        return (
            <Row>
                {days.map((day, index) => (
                    <Col key={index}>
                        <Card aria-disabled={isLoading}>
                            <Card.Body
                                style={{
                                    width: 'auto',
                                    backgroundColor: selectedDay === day ? activeDaybg : 'cornsilk',
                                    cursor: 'pointer',
                                    fontWeight: selectedDay === day ? 'bold' : 'normal',
                                    color: selectedDay === day ? 'white' : 'black',
                                }}
                                onClick={() => fetchScheduleData(day)}>
                                {day}
                            </Card.Body>
                            <Card.Footer>
                                <i
                                    className="mdi mdi-trash-can-outline me-1"
                                    style={{ cursor: 'pointer', fontSize: '20px' }} 
                                    onClick={() => {
                                        const scheduleId = schedules.find((schedule: any) => schedule.day === day)?.scheduleId;
                                        deleteScheduleByDay(props.selecteddevice._id, day,scheduleId);
                                    }}></i>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };
    return (
        <Modal
            size={'xl'}
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            onHide={props.onClose}>
            <Modal.Header
                className="text-white"
                style={{ backgroundColor: '#008675', borderColor: '#008675' }}
                closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.selecteddevice.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DayCards />
                {morningData && afternoonData && (
                    <div style={{ overflow: 'auto', height: '500px' }}>
                        {morningData && <TemperatureChart dataPoints={morningData} title="Morning Schedule from 00:00 AM to 12:00 PM" />}
                        <hr />
                        {afternoonData && <TemperatureChart dataPoints={afternoonData} title="Afternoon Schewdule from 12:00 PM to 11:45 PM" />}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default ViewDeviceSchedule;
