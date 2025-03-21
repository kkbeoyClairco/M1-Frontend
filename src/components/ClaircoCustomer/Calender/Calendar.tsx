import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Calendar from '../apps/Calendar/FullCalendarWidget';
// import Calendar from 'pages/apps/Calendar';
// import Statistics from './Statistics';
// import './index.scss';
import { useEffect, useState } from 'react';
// import { ScheduleTableData } from './types';
// import { getAllSchedules } from 'helpers/services/schedule';
// import Table from './table';
// import { APPROVAL_STATUS_CLASS } from './data';
// import { useUser } from 'hooks';
// import Filter from 'pages/aams-filter/Filter';

const ScheduleDashboard = () => {
    const [scheduleData, setScheduleData] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState<any>([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const handleOpenFilter = () => {
        setShowFilterModal(true);
    };

    const handleFilterClose = () => {
        setShowFilterModal(false);
    };

    const [filteredBreadcrumb, setFilteredBreadcrumb] = useState([
        { label: 'Customer Name', value: '' },
        { label: 'Area Name', value: '' },
        { label: 'Sub Area Name', value: '' },
        { label: 'Technology Name', value: '' },
        { label: 'Severity', value: '' },
        { label: 'Machine Name', value: '' },
    ]);

    const handleFilterSubmit = (filterData: any) => {
        const filtered = [
            { label: filterData.customerId_name || filteredBreadcrumb[0].label, value: filterData.customer },
            { label: filterData.areaId_name || filteredBreadcrumb[1].label, value: filterData.area },
            { label: filterData.subAreaId_name || filteredBreadcrumb[2].label, value: filterData.subArea },
            { label: filterData.technologyId_name || filteredBreadcrumb[3].label, value: filterData.technology },
            { label: filterData.severityId_name || filteredBreadcrumb[4].label, value: filterData.severity },
            { label: filterData.machineId_name || filteredBreadcrumb[5].label, value: filterData.machine },
        ];
        setFilteredBreadcrumb(filtered);
        // getMachineData(filterData);
        handleFilterClose();
    };

    const getScheduleData = async () => {
        try {
            // const response = await getAllSchedules();
            // const data = response.data;
            // setScheduleData(data);
            // const calendarData = data.map((item: any) => ({
            //     id: item.id,
            //     title: item.machineName,
            //     start: new Date(item.date),
            //     className: APPROVAL_STATUS_CLASS[item.approvalStatus].bgClass,
            // }));
            // setCalendarEvents(calendarData);
        } catch (e: any) {
            console.log(e.message);
        }
    };
    useEffect(() => {
        // getScheduleData();
    }, []);
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <Link to="#" className="btn btn-primary ms-2" onClick={() => window.location.reload()}>
                                    <i className="mdi mdi-autorenew"></i>
                                </Link>
                            </form>
                        </div>
                        <h4 className="page-title">Schedule</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>{/* <Statistics /> */}</Col>

                <Col md={12}>
                    <Col lg={12}>
                        <Card>
                            <Card.Body>
                                {/* <Calendar
                                    onDateClick={() => {}}
                                    onDrop={() => {}}
                                    onEventClick={() => {}}
                                    onEventDrop={() => {}}
                                    events={calendarEvents}
                                /> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Col>
            </Row>
            <Row>{/* <Table data={scheduleData} getScheduleData={getScheduleData} /> */}</Row>
            {/* <Filter openModal={showFilterModal} onClose={handleFilterClose} onSubmit={handleFilterSubmit} /> */}
        </>
    );
};

export default ScheduleDashboard;
