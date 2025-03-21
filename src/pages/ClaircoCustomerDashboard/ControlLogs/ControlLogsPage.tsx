import React, { useState } from 'react';
import { CellFormatter, HyperDatepicker, Table } from 'components';
import { Button, Card, Col, Row } from 'react-bootstrap';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { getVrfControlLogs } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
const ControlLogsPage = () => {
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [tableData, setTableData] = useState<any>([]);
    const columns = [
        {
            Header: 'Time',
            accessor: 'epochTime',
            defaultCanSort: true,
            Cell: ({ row }: any) => {
                return convertUnixToIST(row.values.epochTime);
            },
        },
        {
            Header: 'Type',
            accessor: 'type',
            defaultCanSort: true,
        },
        {
            Header: 'Raw Input',
            accessor: (row: any) => row.data,
            defaultCanSort: true,
            Cell: (row: any) => {
                return Object.entries(row.value).map((values: any) => {
                    const [key, value] = values;
                    return (
                        <p key={key}>
                            {key}: {value}
                        </p>
                    );
                });
            },
        },
    ];
    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
    ];
    const handleDatePick = async () => {
        try {
            // console.log('dates:', startDate, endDate);
            const startEpochTime = convertDateToEpoch(startDate);
            const endEpochTime = convertDateToEpoch(endDate);
            const res = await getVrfControlLogs(startEpochTime, endEpochTime);
            console.log('Res', res);
            setTableData(res || []);
        } catch (error) {
            console.log(error);
        }
    };
    useState(() => {
        handleDatePick();
    });
    return (
        <div>
            <PageHeading title={'Control Logs'} />
            <Row style={{ marginLeft: '10px' }}>
                {' '}
                <form style={{ display: 'flex', justifyContent: 'start', padding: '10px' }}>
                    <label style={{ padding: '10px' }} htmlFor="">
                        From
                    </label>{' '}
                    <HyperDatepicker
                        value={startDate}
                        inputClass="form-control-light"
                        onChange={(date: any) => {
                            setStartDate(date);
                        }}
                    />{' '}
                    <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
                        To
                    </label>
                    <HyperDatepicker
                        value={endDate}
                        inputClass="form-control-light"
                        onChange={(date: any) => {
                            setEndDate(date);
                        }}
                    />{' '}
                    <Button
                        style={{
                            margin: '20px',
                            marginTop: '0px',
                            background: '#008675',
                            borderWidth: '0px',
                        }}
                        onClick={handleDatePick}>
                        Submit
                    </Button>{' '}
                </form>
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            {' '}
                            <Table
                                columns={columns}
                                data={tableData}
                                pageSize={5}
                                sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass=" mt-3 "
                                searchBoxClass="mb-2"
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ControlLogsPage;
