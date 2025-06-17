import React, { useState, useEffect } from 'react';
import { useUser } from 'hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFloorList } from 'helpers/api/services/Clairco/uv';
import { Row, Col, Card } from 'react-bootstrap';
import { Table } from 'components';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';

const ActionColumn = ({ row }: any) => {
    const navigate = useNavigate();

    const handleTableItemClick = (item: any) => {
        navigate('/customer/uv/Lamps', { state: item });
    };
    return (
        <div className="action-icon">
            <div style={{}}>
                <i className="mdi mdi-eye me-3" onClick={() => handleTableItemClick(row?.original)}></i>
            </div>
        </div>
    );
};

const Uvfloor = () => {
    const [isLoading, setIsLoading] = useState(false);

    const location: any = useLocation();
    const buildingId = location?.state?.id;
    const customerId = location?.state?.customerId;

    const [floor, setfloor] = useState([]);
    const getFloor = async () => {
        setIsLoading(true);
        try {
            const response = await getFloorList(customerId, buildingId);
            setfloor(response?.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    useEffect(() => {
        getFloor();
    }, []);

    const columns = [
        {
            Header: 'Floor',
            accessor: 'name',
            defaultCanSort: true,
        },
        {
            Header: 'Action',
            accessor: 'action',
            defaultCanSort: false,
            Cell: ActionColumn,
        },
    ];

    const sizePerPageList = [
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: '50',
            value: 50,
        },
    ];

    return (
        <>
            <PageHeading title={'UV Home'} />{' '}
            <Row style={{ marginLeft: '1em', paddingRight: '0px' }}>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">Floors</h4>
                            </Col>
                        </Row>
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={floor}
                                pageSize={10}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass=" mt-3 "
                                searchBoxClass="mb-2"
                            />
                        ) : (
                            <TableSkelton />
                        )}
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
};

export default Uvfloor;
