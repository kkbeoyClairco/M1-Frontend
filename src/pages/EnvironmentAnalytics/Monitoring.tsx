import { Breadcrumb, Card } from 'react-bootstrap';
import heatmap from 'assets/images/sensiable/heatmap.svg';

const Monitoring = ({Building='',Floor=''}) => {
    return (
        <Card>
            <Card.Body>
                <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                <h4 className="header-title"> Environment Monitoring</h4>
                <Breadcrumb listProps={{ className: 'mb-0 p-0' }}>
                    <Breadcrumb.Item href="#">Bosch</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">Hong Kong</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">{Building || 'Building'}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{Floor || 'Floor'}</Breadcrumb.Item>
                </Breadcrumb>
                </div>
                <img src={heatmap} alt="map" className="img-fluid" />
            </Card.Body>
        </Card>
    );
};

export default Monitoring;
