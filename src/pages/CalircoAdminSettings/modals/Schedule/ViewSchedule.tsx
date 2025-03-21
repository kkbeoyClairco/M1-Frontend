import Modal from 'react-bootstrap/Modal';
import TemperatureChart from 'pages/CalircoAdminSettings/utils/TemperatureChart';
const ViewSchedule = (props:any)=>{
    
      const scheduleData:any = props.selectedschedule.body;
      const morningData = scheduleData.filter((item:any) => item.time >= "00:00" && item.time < "12:00")
      const afternoonData =scheduleData.filter((item:any) => item.time >= "12:00" && item.time <= "23:45")
      
    return  (
        <Modal
            size={"xl"}
            {...props}
            aria-labelledby="contained-modal-title-vcenter"
            className="modal-center"
            onHide={props.onClose}>
            <Modal.Header className="text-white" style={{ backgroundColor: '#008675', borderColor: '#008675' }} closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{props.selectedschedule?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{overflow:"auto" , height:"500px"}}>
                <TemperatureChart dataPoints={morningData} title="Morning Schedule from 00:00 AM to 12:00 PM" />
                <hr />
                <TemperatureChart dataPoints={afternoonData} title="Afternoon Schdeule from 12:00 PM to 11:45 PM" />
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ViewSchedule;