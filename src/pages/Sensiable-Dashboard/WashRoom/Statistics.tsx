import { Card, Col, Row } from 'react-bootstrap';
import Desk from 'assets/images/sensiable/Desk.svg';
import Groups from 'assets/images/sensiable/Groups.svg';
import { useEffect, useState } from 'react';
import StatisticsWidget from '../OccupancyTrends/StatisticsWidget';
import Dustbin from 'assets/images/sensiable/Dustbin.svg';
import Cleanup from 'assets/images/sensiable/Cleanup.svg';
import Tissue22 from 'assets/images/sensiable/Tissue22.svg';
import SoapDispenser from 'assets/images/sensiable/SoapDispenser.svg';
import WashroomParameterModal from './WashroomModal';

const WashroomStatistics = () => {
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
  const [showDustbinModal, setShowDustbinModal] = useState(false);
  const [showWashroomModal, setShowWashroomModal] = useState(false);
  const [showTissueModal, setShowTissueModal] = useState(false);
  const [showSoapModal, setShowSoapModal] = useState(false);

  const handleDustbinCleanupsSubmit = () => {
  };

  const handleWashroomCleanupsModal = () => {
  };

  const handleTissueModal = () => {
  };

  const handleSoapModal = () => {
  };


  return (
    <>

<Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowDustbinModal(true);
}}>
 
        <div style={{  padding: '0px',height:'px' }}>

  <StatisticsWidget
    iconpath={Dustbin}
    description="Number of Customers"
    title="DUSTBIN CLEANUPS"
    stats={`${dashboardStats.stats}  `}
    total={1445}
    trend={{
      textClass: 'text-success',
      icon: 'mdi mdi-arrow-up-bold',
      value: dashboardStats.value,
      time: 'From the previous week',
    }}
    cardHeight="170px" // Change the height value as needed

  />
</div>
</Col>

<Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowWashroomModal(true);
}}>
      <StatisticsWidget
       iconpath={Cleanup}
        description=""
        title="WASHROOM CLEANUPS"
        stats={`${dashboardStats.stats1}  `}
        total={20} 
        trend={{
          textClass: 'text-danger',
          icon: 'mdi mdi-arrow-down-bold',
          value: dashboardStats.value,
          time: 'From previous week',
        }}
        cardHeight="170px" // Change the height value as needed

      />

    </Col>
    <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowTissueModal(true);
}}> 
      <StatisticsWidget   
       iconpath={Tissue22}
        description=""
        title="TISSUE PAPER REFILL"
        stats={`${dashboardStats.stats1}  `}
        total={20} 
        trend={{
          textClass: 'text-danger',
          icon: 'mdi mdi-arrow-down-bold',
          value: dashboardStats.value,
          time: 'From previous week',
        }}
        cardHeight="170px" // Change the height value as needed

      />

    </Col>
    <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => {
  setShowSoapModal(true);
}}>
      <StatisticsWidget
       iconpath={SoapDispenser}
        description=""
        title="SOAP DISPENSER REFILL"
        stats={`${dashboardStats.stats1}  `}
        total={20} 
        trend={{
          textClass: 'text-danger',
          icon: 'mdi mdi-arrow-down-bold',
          value: dashboardStats.value,
          time: 'From previous week',
        }}
        cardHeight="170px" // Change the height value as needed

      />

    </Col>

    <WashroomParameterModal
          show={showDustbinModal}
          onClose={() => setShowDustbinModal(false)}
          onSubmit={handleDustbinCleanupsSubmit}
          modalTitle="DUSTBIN CLEANUPS"
          cardTitle="LOCATION WISE DUSTBIN CLEANUPS"
        />

<WashroomParameterModal
  show={showWashroomModal}
  onClose={() => setShowWashroomModal(false)}
  onSubmit={handleWashroomCleanupsModal}
  modalTitle="WASHROOM CLEANUPS"
  cardTitle="LOCATION WISE WASHROOM CLEANUPS"
/>

<WashroomParameterModal
  show={showTissueModal}
  onClose={() => setShowTissueModal(false)}
  onSubmit={handleTissueModal}
  modalTitle="TISSUE PAPER REFILL"
  cardTitle="LOCATION WISE TISSUE PAPER REFILL"
/>

<WashroomParameterModal
  show={showSoapModal}
  onClose={() => setShowSoapModal(false)}
  onSubmit={handleSoapModal}
  modalTitle="SOAP DISPENSER REFILL"
  cardTitle="LOCATION WISE SOAP DISPENSER REFILL"
/>


         


    </>
  );
};

export default WashroomStatistics;
