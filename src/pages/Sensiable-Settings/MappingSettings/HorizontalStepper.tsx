import React from 'react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const horizontalLineStyles = {
  blueLine: {
    backgroundColor: 'blue',
  },
  blueDot: {
    backgroundColor: 'blue',
  },
};

const HorizontalStepper = () => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    navigate('/pages/commissionsequence');
  };

  return (
    <div className='mb-5 '>
      <h3 className="page-title">Commisioning</h3>
      <h5 style={{ fontWeight: 'normal' }}> Mapping Sensors</h5>
      <Row>
        <Col>
          <Row className="justify-content-center">
            <Col lg={7} md={10} sm={11}>
              <div className="horizontal-steps mt-4 mb-4 px-10">
                <div className="horizontal-steps-content">
                  <div className="step-item" style={horizontalLineStyles.blueDot}>
                    <span >Customer</span>
                  </div>
                  <div className="step-item" style={horizontalLineStyles.blueDot}>
                    <span >Create Building <br></br> Seat Type and BU</span>
                  </div>
                  <div className="step-item me-5" style={horizontalLineStyles.blueDot}>
                    <span>Upload layout &<br></br>Configure Floor</span>
                  </div>
                  <div className="step-item current" style={horizontalLineStyles.blueDot}>
                    <span >Seat Mapping &<br></br>Meeting Room Mapping</span>
                  </div>

                  <div className="step-item" style={horizontalLineStyles.blueDot}>
                    <span onClick={handleItemClick}>Download Site<br></br> commissioning sequence file</span>
                  </div>

                  <div className="step-item "  style={horizontalLineStyles.blueDot}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip></Tooltip>}
                    >
                      <span >Verify & Configure <br></br>sensors</span>
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="process-line" style={{ ...horizontalLineStyles.blueLine, width: '62%' }}></div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HorizontalStepper;
