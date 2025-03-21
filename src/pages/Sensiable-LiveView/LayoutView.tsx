import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import NavigateModal from './NavigateModal';
import Building from 'assets/images/sensiable/Building.svg';
import React from 'react';

const LayoutView = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSubmit = () => {
   
  };

  return (
    <>
      <Card>
        <Row >
        <Col xs={12} sm={12} md={12} >
            <div className="page-title-box">
              <div className="page-title-right">
                <div className="input-group"></div>
                <div className="pagination justify-content-end">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <div style={{ fontWeight: 'normal', marginBottom: '15px',paddingRight:'20px' }}>
    <i className="mdi mdi-square text-success"></i> Available
  </div>
  <div style={{ fontWeight: 'normal', marginBottom: '15px',paddingRight:'20px'  }}>
    <i className="mdi mdi-square text-danger"></i> Occupied
  </div>
  <div style={{ fontWeight: 'normal', marginBottom: '15px',paddingRight:'20px'  }}>
    <i className="mdi mdi-square text-"></i> Offline
  </div>
</div>

                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowAddModal(true);
                    }}
                  >
                    Navigate
                  </Button>
                </div>
              </div>
              <h4 className="page-title">Layout View</h4>
            </div>
          </Col>
        </Row>
      </Card>
      <NavigateModal show={showAddModal} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <div className="px-8">
        <img src={Building} alt="" />
      </div>
    </>
  );
};

export default LayoutView;
