import React, { useState,useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { schedule } from 'helpers/api/services/Clairco/schedule';
import { ToastContext } from 'context/ToastContext';
import { timeSlots } from 'pages/CalircoAdminSettings/utils/columns';
import { days } from 'pages/CalircoAdminSettings/utils/columns';
import Select from 'react-select';
import { redo } from 'easymde';

const OverrideSchedule = (props: any) => {
    const day = new Date().getDay();
    const currentday = days[day];
    const toast = useContext(ToastContext);
    const [scheduleId, setScheduleId] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [formData, setFormData] = useState(
        timeSlots.map((time) => ({
            time,
            status: '-1',
            setTemp: '',
        }))
    );

    useEffect(()=>{
        
        setFormData(
                timeSlots.map((time) => ({
                    time,
                    status: '-1',
                    setTemp: '',
                }))
            );
        const {_id,schedules} = props?.selecteddevice;
        setDeviceId(_id);
        schedules?.forEach((schedule: any) => {
            if (schedule.day === currentday) {
                setScheduleId(schedule.scheduleId);
            }
        })
         
    },[]);
    
    const handleChange = (index: number, field: string, value: string) => {
        const updatedFormData: any = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);
    };

   
    const onSubmit = async(event: any) => {
        event.preventDefault();

        // Validate schedule name and device type
        if (!scheduleId || !deviceId) {
            alert('Please provide a valid scheduleId and deviceId or refresh the page.');
            return;
        }
        if(!props.selecteddevice.switchDeviceId || !props.selecteddevice.GatewayID){
            alert('Plesase attach Switch or Gateway to this Device or Attach Both first.');
            return;
        }

        // Convert time slot data into the desired format
        const timeSlotData = formData.filter(( item) => {
            const { time, status, setTemp } = item;
            let slotData: any = {
                 status ,
                ...(setTemp !== '' && { setTemp }),
            };
            
            if (slotData.status ==='-1' ) {
                delete slotData.status;
                delete slotData.setTemp;
            } else if (slotData.status === '0') {
                delete slotData.setTemp;
            }
            // Remove the time key if it has no valid fields
            if (Object.keys(slotData).length > 0) {
                slotData.time = time;
                return slotData;
            }
            return null;
        }, {});

        if(timeSlotData.length === 0){
            toast?.showToast('Please select at least one time slot ,if you want empty schedule please delete this schedule', 'error');
            return;
        }
        // Combine all data into a single object
        const submissionData = {
            switchId: props?.selecteddevice?.switchDeviceId,
            gatewayId:props?.selecteddevice?.GatewayID,
            scheduleData: timeSlotData,
        };

        try {
            const response = await schedule.override({deviceId,scheduleId},submissionData);
            if(response.data){
                toast?.showToast('schedule override successfully', 'success');
                props.onClose();
            }
            
        } catch (error:any) {
            toast?.showToast(error, 'error');
        }
    };
    return (
        <Modal
            size="xl"
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Override Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {scheduleId ?(<form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{color:'red'}}>you are updating the Current day Schedule please be care full </Form.Label>
                    </Form.Group>
                    {/* Device Type ID Field */}
                    
                    <Form.Label>Time Slots</Form.Label>
                    <hr></hr>
                    <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                        {timeSlots.map((time, index) => (
                            <Row key={index} className="mb-3 align-items-center">
                                {/* Time Label */}
                                <Col md={2}>
                                    <Form.Label>{time}</Form.Label>
                                </Col>

                                {/* Status Dropdown */}
                                <Col md={4}>
                                    <Form.Select
                                        value={formData[index].status}
                                        onChange={(e) => handleChange(index, 'status', e.target.value)}>
                                        <option value="-1">Power On/Off</option>
                                        <option value="1">ON</option>
                                        <option value="0">OFF</option>
                                    </Form.Select>
                                </Col>

                                {/* Set Temperature Input */}
                                <Col md={4}>
                                    <Form.Control
                                        type="number"
                                        placeholder="Set Temperature"
                                        value={formData[index].setTemp}
                                        onChange={(e) => handleChange(index, 'setTemp', e.target.value)}
                                    />
                                </Col>
                            </Row>
                        ))}
                    </div>
                    <Modal.Footer>
                   <Row className="float-end">
                       <Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                Override Schedule
                            </Button>
                        </Col>
                    </Row>
                    </Modal.Footer>
                </form>):(<>
                <h1>No schedule Exist On {currentday} please Attach schedule first</h1>
                </>)}
            </Modal.Body>
        </Modal>
    );
};

export default OverrideSchedule;