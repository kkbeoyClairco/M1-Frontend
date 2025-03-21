import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import StatisticsWidget from './StatisticsWidget';
import IAQ from 'assets/images/sensiable/IAQ.svg';
import Home from 'assets/images/sensiable/Home.svg';
import ppm from 'assets/images/sensiable/ppm.svg';
import VOC from 'assets/images/sensiable/VOC.svg';
import Humidity from 'assets/images/sensiable/Humidity.svg';
import Parameter from './EnvironmentModals/Parameters';

const EnvironmentStatistics = () => {
  // Define a state variable for statistics data
  const [statisticsData, setStatisticsData] = useState({
    iaq: { value: '333', trend: '4.87%' },
    temperature: { value: '21°C', trend: '4.87%' },
    humidity: { value: '30%', trend: '4.87%' },
    co2: { value: '0.003ppm', trend: '4.87%' },
    voc: { value: '0.02ppm', trend: '4.87%' },
  });

  const [showIAQModal, setShowIAQModal] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);
  const [showHumidityModal, setShowHumidityModal] = useState(false);
  const [showCo2Modal, setShowCo2Modal] = useState(false);
  const [showVocModal, setShowVocModal] = useState(false);

  const handleIAQSubmit = () => {
    // Implement the logic for IAQ submission if needed
  };

  const handleAddModal = () => {
    // Implement the logic for temperature modal if needed
  };

  const handleHumidityModal = () => {
    // Implement the logic for humidity modal if needed
  };

  const handleCo2Modal = () => {
    // Implement the logic for CO2 modal if needed
  };

  const handleVocModal = () => {
    // Implement the logic for VOC modal if needed
  };

  return (
    <>
      <Row>
        <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => setShowIAQModal(true)}>
          <StatisticsWidget
            iconPath={IAQ}
            description="Number of Orders"
            title="IAQ"
            stats={statisticsData.iaq.value}
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: statisticsData.iaq.trend,
              time: 'Since last month',
            }}
          />
        </Col>

        <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => setShowTempModal(true)}>
          <StatisticsWidget
            iconPath={Home}
            description="Number of Orders"
            title="TEMPERATURE"
            stats={statisticsData.temperature.value}
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: statisticsData.temperature.trend,
              time: 'Since last month',
            }}
          />
        </Col>

        <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => setShowHumidityModal(true)}>
          <StatisticsWidget
            iconPath={Humidity}
            description="Number of Orders"
            title="HUMIDITY LEVEL"
            stats={statisticsData.humidity.value}
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: statisticsData.humidity.trend,
              time: 'Since last month',
            }}
          />
        </Col>

        <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => setShowCo2Modal(true)}>
          <StatisticsWidget
            iconPath={ppm}
            description="Number of Orders"
            title="CO2 LEVEL"
            stats={statisticsData.co2.value}
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: statisticsData.co2.trend,
              time: 'Since last month',
            }}
          />
        </Col>

        <Col sm={12} xs={12} style={{ cursor: 'pointer' }} onClick={() => setShowVocModal(true)}>
          <StatisticsWidget
            iconPath={VOC}
            description="Number of Orders"
            title="VOC LEVEL"
            stats={statisticsData.voc.value}
            trend={{
              textClass: 'text-success',
              icon: 'mdi mdi-arrow-up-bold',
              value: statisticsData.voc.trend,
              time: 'Since last month',
            }}
          />
        </Col>
      </Row>

      <Parameter
        show={showIAQModal}
        onClose={() => setShowIAQModal(false)}
        onSubmit={handleIAQSubmit}
        modalTitle="IAQ"
        cardTitle="LOCATION WISE IAQ"
        temperatureHeader='IAQ'
      />
      <Parameter
        show={showTempModal}
        onClose={() => setShowTempModal(false)}
        onSubmit={handleAddModal}
        modalTitle="TEMPERATURE"
        cardTitle="LOCATION WISE TEMPERATURE"
        temperatureHeader='TEMPERATURE'
      />
      <Parameter
        show={showHumidityModal}
        onClose={() => setShowHumidityModal(false)}
        onSubmit={handleHumidityModal}
        modalTitle="HUMIDITY"
        cardTitle="LOCATION WISE HUMIDITY"
        temperatureHeader='HUMIDITY'
      />
      <Parameter
        show={showCo2Modal}
        onClose={() => setShowCo2Modal(false)}
        onSubmit={handleCo2Modal}
        modalTitle="CO2"
        cardTitle="LOCATION WISE CO2"
        temperatureHeader='CO2'
      />
      <Parameter
        show={showVocModal}
        onClose={() => setShowVocModal(false)}
        onSubmit={handleVocModal}
        modalTitle="VOC"
        cardTitle="LOCATION WISE VOC"
        temperatureHeader='VOC'
      />
    </>
  );
};

export default EnvironmentStatistics;
