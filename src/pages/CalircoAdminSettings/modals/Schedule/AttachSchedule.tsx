import React, { useState,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { schedule } from 'helpers/api/services/Clairco/schedule';
import Select from 'react-select';
import { ToastContext } from 'context/ToastContext';
import { days } from 'pages/CalircoAdminSettings/utils/columns';

const AttachSchedule = (props: any) => {
    const toast = useContext(ToastContext);

    const scheduleList = props?.schedules?.map((schedule:any)=>{
        return {value:schedule?.id ,label:schedule?.name}
    });
    
    const {_id,name,schedules,GatewayId,switchDeviceId,...rest} = props.selecteddevice;
    const defaultSchedules = schedules?.map((schedule:any)=>{
        return {value:schedule?.scheduleId ,day:schedule?.day , label:scheduleList.find((item:any) => item.value === schedule.scheduleId)?.label}
    })|| [];
    
    const handleSubmit = async(event: any) => {
        event.preventDefault();
        const formData = Object.fromEntries(new FormData(event.target).entries());
        const schedules = [];
        for (const day in formData) {
            if(formData[day] === "") continue;
            schedules.push({ day, scheduleId: formData[day] });
        }
        if(schedules.length === 0){
            toast?.showToast('Please select at least one schedule', 'error');
            return;
        }else{
            try{
                const res = await schedule.attach({deviceId:_id},{schedules});
                toast?.showToast('Schedule attached successfully, if you want to verify please Fetch deviceData', 'success');
                props.onClose();
            }catch(error:any){
               toast?.showToast(error, 'error');
            }
        }

    };
    
    const DayCards = () => {
        return (
          <div style={{ maxHeight: '300px',overflow: 'auto'}}>
            {days.map((day, index) => (
              <Col key={index}>
                <Card style={{ width: 'auto' ,backgroundColor: 'cornsilk' }}>
                  <Card.Body>
                    {day}
                    <hr />
                    <Select 
                            name={day}
                            placeholder="Select schedule"
                            className="react-select"
                            classNamePrefix="react-select"
                            options={scheduleList}
                            defaultValue={defaultSchedules.find((schedule:any) =>{
                                return schedule?.day === day ? schedule?.label : null 
                            } )}
                        />
              
              </Card.Body>
                </Card>
              </Col>
            ))}
          </div>
        );
      };
    
    return (
        <Modal
            size={"xl"}
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            centered
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Attach Schedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <form  onSubmit={handleSubmit}>
                   <Form.Label>Device Name : {name}</Form.Label>
                   
                       <DayCards/>
                   <Modal.Footer>
                   <Row className="float-end">
                        <Col>
                            <Button
                                type="submit"
                                className="ms-2"
                                style={{ backgroundColor: '#008675', borderColor: '#008675' }}>
                                SUBMIT
                            </Button>
                        </Col>
                    </Row>
                    </Modal.Footer>
               </form>
            </Modal.Body>

        </Modal>
    );
};

export default AttachSchedule;
