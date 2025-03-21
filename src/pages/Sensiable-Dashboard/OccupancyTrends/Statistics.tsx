import { Card, Col, Row } from 'react-bootstrap';
import StatisticsWidget from './StatisticsWidget';
import MeetingOccupancy from 'assets/images/sensiable/MeetingOccupancy.svg';
import SeatOccupancy1 from 'assets/images/sensiable/SeatOccupancy1.svg';
import Groups from 'assets/images/sensiable/Groups.svg';
import { useEffect, useState } from 'react';
// import CostAnalysis from '../CostAnalysisModal';
import MeetingRoom from './MeetingRoommoadl';
import SeatOccupancy from './SeatOccupancyModal';
import CostAnalysis from './CostAnalysisModal';

// import MeetingRoom from './MeetingRoomModal';
// import CostAnalysis from './CostAnalysisModal';

const Statistics = () => {
  let CharWidgetObject = {
    stats: '',
    value: '',
  };
  const [dashboardStats, setDashboardStats] = useState<any>(CharWidgetObject);
  const [showText, setShowText] = useState<boolean>(false);

  const getDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      const data = response;
      setDashboardStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  useEffect(() => {
    setDashboardStats({
      stats: '1440',
      value: '4.27%',
      stats1: '10',

    });
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const[showModal,setShowModal]=useState(false);
  const[showSeatModal,setShowSeatModal]=useState(false);
  

  const handleCloseModal = () => {
    setShowAddModal(false);
  };
const handleSeatModal=()=>{
  setShowModal(false)
}

    const handleSubmit=()=>{

    }
    const handleSeatSubmit=()=>{

    }

    const handleMeetingSubmit=()=>{

    }


  return (
    <>
 
<Col sm={12} xs={12} style={{ cursor: 'pointer' }}onClick={() => {
  setShowModal(true);
}}>
  <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowSeatModal(true);
}}></Col>
  <StatisticsWidget
    iconpath={SeatOccupancy1}
    description="Number of Customers"
    title="SEAT OCCUPANCY"
    stats={`${dashboardStats.stats}  `}
    total={1445}
    trend={{
      textClass: 'text-success',
      icon: 'mdi mdi-arrow-up-bold',
      value: dashboardStats.value,
      time: 'From the previous week',
    }}
  />

</Col>

<Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowSeatModal(true);
}}>
      <StatisticsWidget
       iconpath={MeetingOccupancy}
        description="Number of Orders"
        title="MEETING ROOM OCCUPANCY"
        stats={`${dashboardStats.stats1}  `}
        total={20} 
        trend={{
          textClass: 'text-danger',
          icon: 'mdi mdi-arrow-down-bold',
          value: dashboardStats.value,
          time: 'From previous week',
        }}
      />

    </Col>

      <Row>
      <Col sm={12} xs={12}>
    <Card style={{ height: 'auto' }}>
  <button
    className="cta-box bg-primary text-white"
    onClick={() => {
      setShowAddModal(true);
    }}
  >
  <Card.Body style={{ padding: '16px' }}>
  <Row>
    <Col xs={12} md={7} className="mb-3 mb-md-0">
      <div className="d-flex align-items-start align-items-center">
        <div className="w-100 overflow-hidden">
          <h3 className="m-1 fw-normal cta-box-title">
            Cost Impact of vacant seats for the day
          </h3>
        </div>
      </div>
    </Col>
    <Col xs={12} md={5}>
      <div className="text-center">
        <span className="chart">
          <i className="mdi mdi-currency-usd dollar-icon" style={{ fontSize: '30px' }}></i>
          <span className="m-0" style={{ fontSize: '35px' }}>
            {100}
          </span>
          {/* <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {'99+'}
            <span className="visually-hidden">unread messages</span>
          </span> */}
        </span>
      </div>
    </Col>
  </Row>
</Card.Body>

  </button>
  <CostAnalysis show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

</Card>
</Col>
</Row>

<SeatOccupancy show={ showSeatModal} onClose={()=>{setShowSeatModal(false)}} onSubmit={handleSeatSubmit} />
<MeetingRoom show={showModal} onClose={()=>{ setShowModal(false)}} onSubmit={ handleMeetingSubmit} />

    </>
  );
};

export default Statistics;
