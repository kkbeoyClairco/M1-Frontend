import React, { useState,useContext, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Col, Form, Row } from 'react-bootstrap';
import { schedule } from 'helpers/api/services/Clairco/schedule';
import { ToastContext } from 'context/ToastContext';
import { timeSlots } from 'pages/CalircoAdminSettings/utils/columns';
import { useRedux } from 'hooks';
import Select from 'react-select';

const CreateAndUpdateSchedule = (props: any) => {
    const {appSelector} = useRedux();
    const { deviceNameToId } = appSelector((state) => ({
        deviceNameToId: state.Device.deviceNameToId,
    }));
    const deviceTypeList = Array.from(deviceNameToId, ([key, value]) => ({ label: key, value: value }));

    const toast = useContext(ToastContext);
    const [scheduleName, setScheduleName] = useState('');
    const [deviceTypeId, setDeviceTypeId] = useState('');
    const [formData, setFormData] = useState(
        timeSlots.map((time) => ({
            time,
            status: '-1',
            setTemp: '',
        }))
    );

    useEffect(()=>{
        if(props?.selectedschedule){
            setScheduleName(props?.selectedschedule?.name);

            let data = props?.selectedschedule?.body;
            
            setFormData(
                timeSlots.map((time) => {
                    const slotData = data.find((item: any) => {
                        return item.time === time ? { time:item.time , status:item.status , setTemp:item.setTemp || '' } : null;
                    });
                    return slotData || {
                        time,
                        status: '-1',
                        setTemp: '',
                    };
                })
            );
            
        }
        else{
            setFormData(
                timeSlots.map((time) => ({
                    time,
                    status: '-1',
                    setTemp: '',
                }))
            );
        }
         
    },[]);
    
    const handleChange = (index: number, field: string, value: string) => {
        const updatedFormData: any = [...formData];
        updatedFormData[index][field] = value;
        setFormData(updatedFormData);
    };

    const updateSchedule = async ()=>{
        try {
            
            let submissionData = {
                name: props?.selectedschedule?.name,
                body: props?.selectedschedule?.body
            };
            const timeSlotData = formData.filter(( item) => {
                const { time, status, setTemp } = item;
                let slotData: any = {
                     status ,
                    ...((setTemp !== '' || setTemp !== undefined) && { setTemp }),
                };
                if (slotData.status ==='-1' ) {
                    delete slotData.status;
                    delete slotData.setTemp;
                } else if (slotData.status === '0' ) {
                    delete slotData['setTemp'];
                }
                else if(slotData.status === '1' && slotData.setTemp ===''){
                   delete slotData.setTemp; 
                }
                // Remove the time key if it has no valid fields
                if (Object.keys(slotData).length > 0) {
                    slotData.time = time;
                    return slotData;
                }
                return null;
            }, {});
             
            submissionData.body = timeSlotData;
            const response = await schedule.update(
            { scheduleId:props.selectedschedule.id}, submissionData);
            if(response.data){
                toast?.showToast('Schedule updated successfully','success');
                props.updateScheduleData(response.data);
            }
            props.onClose();
        } catch (error:any) {
            
             toast?.showToast('some error occure while updating schedule','error');
        }
    }
    const onSubmit = async(event: any) => {
        event.preventDefault();

        // Validate schedule name and device type
        if (!scheduleName.trim() || !deviceTypeId.trim()) {
            alert('Please provide a valid schedule name and device type ID.');
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
            name: scheduleName,
            deviceType: deviceTypeId,
            body: timeSlotData,
        };

        try {
            const response = await schedule.create(submissionData);
            if(response.data){
                toast?.showToast('schedule created successfully', 'success');
                const schedule = response.data;
                props.updateScheduleData(schedule);
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
                <Modal.Title id="contained-modal-title-vcenter">Schedule Templet</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Schedule Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter schedule name"
                            value={scheduleName}
                            onChange={(e) => setScheduleName(e.target.value)}
                        />
                    </Form.Group>
                    {/* Device Type ID Field */}
                    {!props?.selectedschedule && (<Form.Group className="mb-3">
                        <Form.Label>Device Type ID</Form.Label>
                        <Select
                                        name="deviceTypeId"
                                        placeholder="Select Device Type"
                                        className="react-select"
                                        classNamePrefix="react-select"
                                        options={deviceTypeList}
                                        onChange={(e: any) => {
                                            const label = e.label?.replace(/\s+/g, '');
                                            const value = e.value;
                                            setDeviceTypeId(value);
                                        }}
                                    />
                    </Form.Group>)}
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
                        { !props?.selectedschedule && (<Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                SUBMIT
                            </Button>
                        </Col>)}
                    </Row>
                    </Modal.Footer>
                </form>
                { props?.selectedschedule && (<Col>
                            <Button onClick={()=> updateSchedule()}>
                                 Update
                            </Button>
                        </Col>)}
            </Modal.Body>
        </Modal>
    );
};

export default CreateAndUpdateSchedule;
