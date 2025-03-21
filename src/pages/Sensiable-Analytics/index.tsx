import { Col, Row } from 'react-bootstrap';
import { HyperDatepicker } from 'components';
import { useDatePicker } from 'hooks';
import Statistics from './Statistics'
import UtilizationPattern from './UtilizationPattern';
import Utilization from './Utilization';
import { useState } from 'react';
import SettingModal from './SettingsModal/Index';
import HeatMap from './Heatmap';
import { Link } from 'react-router-dom';

const OccupancyAnalytics = () => {
    const { selectedDate, onDateChange } = useDatePicker();
      
  const [showAddModal, setShowAddModal] = useState(false);

  const handleModalOpen = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSubmit = () => {
   
  };


    return (
<>
           <Row>
                <Col>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <div className="input-group">
                                    <HyperDatepicker
                                        value={selectedDate}
                                        inputClass="form-control-light"
                                        onChange={(date) => {
                                            onDateChange(date);
                                        }}
                                    />
                                </div>
                             <Link to="#" className="btn btn-primary ms-2" onClick={handleModalOpen}>
                    <i className="mdi mdi-filter-variant"></i>
                    
                                </Link>
                            </form>
                        </div>
                        <h4 className="page-title">Occupancy Analytics</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Statistics/>
            </Row>
            <Row>
    <Col md={4}>
    <UtilizationPattern />   
      </Col>
    <Col md={8}>
          <Utilization />

    </Col>

</Row>
<Row>
    <Col sm={12}>
      <HeatMap/>  
    </Col>
</Row>
<SettingModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />

            </>
);
}; export default OccupancyAnalytics;