import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Statistics from './Statistics';
import LayoutView from './LayoutView';

const LiveView = () => {
    const navigate = useNavigate();
    const handleTableItemClick = (item: any) => {
        navigate({ pathname: '/pages/analyticsoccupancy' });
    };
    return (
<>
           <Row>
                <Col>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <div className="input-group">
                                <button className="btn btn-primary ms-2" onClick={handleTableItemClick}>
                                View Analytics
                            </button>
                                </div>
                                <button className="btn btn-primary ms-2">
                    <i className="mdi mdi-filter-variant"></i>
                                </button>
                            </form>
                        </div>
                        <h4 className="page-title">Live View</h4>
                    </div>
                </Col>
            </Row>
            <Row>
               <Statistics/>
                
                </Row>
                <Row>
               <LayoutView/>
                
                </Row>
            </>
);
}; export default LiveView;