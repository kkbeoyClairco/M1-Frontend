import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Table } from 'components';
import { useUser } from 'hooks';
import { useNavigate } from 'react-router-dom';
import { getBuildingList } from 'helpers/api/services/Clairco/uv';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';

const ActionColumn = ({ row }: any) => {
    const navigate = useNavigate();
    // console.log('row', row);
    const handleTableItemClick = (item: any) => {
        navigate('floors', { state: item });
    };
    return (
        <div className="action-icon">
            <div style={{}}>
                <i className="mdi mdi-eye me-3" onClick={() => handleTableItemClick(row?.original)}></i>
            </div>
        </div>
    );
};

const Uvbuilding = () => {
    const [loggedInUser] = useUser();
    const [isLoading, setIsLoading] = useState(false);

    // console.log('Logged in user', loggedInUser);
    const customerId = loggedInUser?.user?.customerId;
    const [building, setbuilding] = useState([]);
    // console.log('Buildings Customer iD', loggedInUser);
    const getBuildings = async () => {
        setIsLoading(true);
        try {
            const response = await getBuildingList(customerId);
            setbuilding(response?.data);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        getBuildings();
    }, []);

    const columns = [
        {
            Header: 'Building',
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
            {' '}
            <PageHeading title={'UV Home'} />{' '}
            <Row className="mx-3">
                <Card style={{ height: '100%' }}>
                    <Card.Body>
                        <Row>
                            <Col>
                                <h4 className="header-title mb-3">Building List</h4>
                            </Col>
                        </Row>
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={building ?? []}
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

export default Uvbuilding;
