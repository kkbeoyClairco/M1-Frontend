import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Statistics from './Statistics';
import CustomerTable from './CustomerTable';
import { DeviceTables } from 'pages/ClaircoAdminDashboard/DeviceListPage/DeviceTables';
const AdminDashboard = () => {
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <Link to="#" className="btn btn-primary ms-1">
                                    <i className="mdi mdi-filter-variant"></i>
                                </Link>
                            </form>
                        </div>
                        <h4 className="page-title"> Clairco Dashboard</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Statistics />
            </Row>
            <Row>
                <CustomerTable />
                {/* <DeviceTables /> */}
            </Row>
        </>
    );
};
export default AdminDashboard;
