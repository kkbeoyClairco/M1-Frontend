import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import React, { useEffect, useState } from 'react';
import { CellFormatter, Table } from 'components';

import { Card, OverlayTrigger, Popover, Row } from 'react-bootstrap';
import { convertUnixToIST } from 'utils/timeFunctions';
// import { fetchMaintenanceLogs } from 'helpers/api/services/Clairco/maintenanceSide/maintenance';
import { ref } from 'yup';
import ImageModal from './ImageModal';
import { getUserDetailsFromSession } from 'utils/storageFunctions';
import TableSkelton2 from 'components/ClaircoSkeltonLoaders/TableSkelton2';
// import { fetchMaintenanceLogs } from 'helpers/api/services/Clairco/maintenanceLogs';
// import TableSkelton2 from 'components/ClaircoCustomer/Skeltons/TableSkelton2';
import { fetchMaintenanceLogs } from 'helpers/api/services/Clairco/customerSide/maintenance';
const MaintenanceTable = ({ refresh }: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [imageModalState, setImageModalState] = useState(false);

    // const internetStatus = navigator.onLine;
    // console.log('Internet Status', internetStatus);
    const fetchLogsList = async () => {
        try {
            setIsLoading(true);
            const customerId =
                getUserDetailsFromSession().type === 'Admin' ? '' : getUserDetailsFromSession()?.customerId;
            // console.log('Custoemr details', customerId);
            const res = await fetchMaintenanceLogs(customerId);
            setTableData(res?.data?.reverse() ?? []);
            // console.log(res);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setTableData([]);
        }
    };

    const handleImageClick = (imageURL: string) => {
        try {
            setImageModalState(true);
            setSelectedImage(imageURL);
        } catch (error) {
            console.log(error);
        }
    };
    const handleImageModalState = () => {
        try {
            setImageModalState((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        {
            Header: 'Technician Name',
            accessor: 'technicianId.name',
            defaultCanSort: true,
        },

        {
            Header: 'Customer',
            accessor: 'customerId.name',
            defaultCanSort: true,
        },

        {
            Header: 'Building',
            accessor: 'buildingId.name',
            defaultCanSort: true,
        },
        {
            Header: 'Floor',
            accessor: 'floorId.name',
            defaultCanSort: true,
        },

        {
            Header: 'Device',
            accessor: 'deviceType.name',
            defaultCanSort: false,
        },
        {
            Header: 'Work Details',
            accessor: 'workDescription',
            defaultCanSort: false,
            Cell: ({ value }: { value: any }) => {
                const popover = (
                    <Popover id="popover-basic">
                        {/* <Popover.Header as="h3">Popover Title</Popover.Header> */}
                        <Popover.Body> {value}</Popover.Body>
                    </Popover>
                );
                return (
                    <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover}>
                        <p
                            style={{
                                overflowWrap: 'break-word',
                                display: '-webkit-box',
                                wordWrap: 'break-word',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 10,
                                overflow: 'hidden',
                                maxWidth: '60px',
                                whiteSpace: 'normal',
                            }}>
                            {value}
                        </p>
                    </OverlayTrigger>
                );
            },
        },

        {
            Header: 'Image',
            accessor: 'workDoneImg',
            defaultCanSort: true,
            Cell: ({ value }: { value: any }) => {
                return value ? (
                    <img
                        onClick={() => handleImageClick(value)}
                        src={value}
                        alt="Maintenance"
                        width={'50px'}
                        height={'50px'}
                        style={{ cursor: 'pointer' }}
                    />
                ) : (
                    'Na'
                );
            },
        },
        {
            Header: 'Date done',
            accessor: 'maintainedAt',
            defaultCanSort: true,

            // defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time === 'Invalid Date' ? 'Na' : time;
            },
        },
        {
            Header: 'Date updated',
            accessor: 'updatedAt',
            defaultCanSort: false,
            Cell: ({ value }: any) => {
                const time = convertUnixToIST(value);
                return time;
            },
        },
        // {
        //     Header: 'View',
        //     accessor: 'action',
        //     defaultCanSort: false,
        //     Cell: ActionColumn,
        // },
    ];
    useEffect(() => {
        fetchLogsList();
    }, [refresh]);
    return (
        <>
            <ImageModal imageURL={selectedImage} modalState={imageModalState} modalControlFn={handleImageModalState} />
            <Row style={{ paddingRight: '0px', paddingTop: '1em' }}>
                {/* <Col xs={12}> */}

                <Card>
                    <Card.Body>
                        {!isLoading ? (
                            <Table
                                columns={columns}
                                data={tableData ?? []}
                                pageSize={0}
                                // sizePerPageList={sizePerPageList}
                                isSortable={true}
                                pagination={true}
                                isSearchable={true}
                                tableClass=" mt-3 "
                                searchBoxClass="mb-2"
                            />
                        ) : (
                            <TableSkelton2 />
                        )}
                    </Card.Body>
                </Card>
                {/* </Col> */}
            </Row>
        </>
    );
};

export default MaintenanceTable;
