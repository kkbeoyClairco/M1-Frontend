import React, { useCallback, useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap';
import Statistics from './Statistics';
// import AHUDevicesTable from '../AHU/AHU_Home/AHUDevicesTable';
import Layouts from 'pages/ClaircoCustomerDashboard/Layouts/Layouts';
// import OccupancyTrendsModal from './OccupancyTrendsModal';
import { useRedux } from 'hooks';
// import { fetchBuildingsRequest } from 'redux/homePage/actions';
// import { getUserDetailsFromSession, getUserIdFromSession } from 'utils/storageFunctions';
// import { MODIFY_ALERT, THIRTY_MINUTES_INTERVAL } from 'appConstants/claircoConstants';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getDataForSVGManipulation } from 'helpers/api/services/Clairco/customerSide/occupancy';
import { getCurrentEpochTime } from 'utils/timeFunctions';
import BuildingSelection from 'components/ClaircoCustomerDashboard/Widgets/LandingPageWidgets/BuildingSelection';
import { THIRTY_MINUTES_INTERVAL } from 'appConstants/claircoConstants';
import OccupantsLayout2 from 'pages/ClaircoCustomerDashboard/Layouts/Layouts2';

const CustomerLandingPage = () => {
    // States
    const [occupantsNumber, setOccupantsNumber] = useState<string | number>('-');
    const [isOccupancyTrendOpen, setIsOccupancyTrendOpen] = useState(false);
    const [customer, setCustomer] = useState<any>({});

    // Redux Hook
    const { dispatch, appSelector } = useRedux();
    const state = appSelector((state) => state.HomePageReducer);
    const { activeFloor } = state;

    //Select handlers
    //Occupancy Trends Modal
    const handleOccupancyTrendsModal = () => {
        try {
            setIsOccupancyTrendOpen(true);
        } catch (error) {
            console.log(error);
        }
    };

    //Sets the total Occupants count per floor - Uses the Layout API for occuancy to get the data
    const getTotalOccupantsCount = useCallback(async () => {
        try {
            const occupancyId = deviceTypeId['Occupancy'];
            if (!activeFloor?.floorId) return;
            const occupancyData = await getDataForSVGManipulation(activeFloor?.floorId, occupancyId);
            const occupancyCount = occupancyData?.data?.devices?.reduce((accu: number, curr: any) => {
                let value: number = 0;
                const currentTime = getCurrentEpochTime();
                if (
                    curr?.rawData?.occupancy?.epochTime &&
                    currentTime - curr?.rawData?.occupancy?.epochTime <= THIRTY_MINUTES_INTERVAL
                ) {
                    value = curr?.rawData?.occupancy?.metaData?.occupancy_number ?? 0;
                }
                return accu + value;
            }, 0);
            setOccupantsNumber(occupancyCount);
        } catch (error) {
            console.log(error);
            setOccupantsNumber('-');
        }
    }, [activeFloor]);
    useEffect(() => {
        // const { customerId } = getUserIdFromSession();
        // const data = getUserDetailsFromSession();
        // dispatch(fetchBuildingsRequest(customerId));
        // setCustomer({ customerId, customerName: data?.name });
    }, [dispatch]);

    useEffect(() => {
        // getTotalOccupantsCount();
    }, [activeFloor, getTotalOccupantsCount]);
    return (
        <div>
            {/* {isOccupancyTrendOpen && (
                <OccupancyTrendsModal modalState={isOccupancyTrendOpen} modalControlFn={setIsOccupancyTrendOpen} />
            )} */}
            {/* <Row>
                <Col xs={12}></Col>
            </Row> */}
            {/* Title Cards */}
            <Row style={{ paddingTop: '20px', paddingLeft: '5px' }}>
                <Col md={3}>
                    <Statistics
                        occupantsNumber={occupantsNumber}
                        functionToExecute={handleOccupancyTrendsModal}
                        customerName={customer?.customerName}
                        customerId={customer?.customerId}
                    />
                    {/* <BuildingSelection /> */}
                </Col>
                {/* Floor Plan or Layout */}
                <Col md={9} style={{ paddingTop: '0px', paddingLeft: '5px' }}>
                    <OccupantsLayout2
                        floorId={activeFloor?.floorId}
                        devices={
                            //     [
                            //     '66d015995b0bbb913bf9936d', //AHU
                            //     '6690f12ed90262f91784da83', //Occupancy
                            //     '6690f11bd90262f91784da81', //VRV
                            // ]
                            activeFloor?.activeDevices ?? []
                        }
                        floorPlanUrl={
                            'https://res.cloudinary.com/dlulq6hny/image/upload/v1751458697/drawing_mrywpv.svg'
                            // 'https://res.cloudinary.com/dlulq6hny/image/upload/v1751366964/drawing_rrtnnd.svg'
                            // 'https://res.cloudinary.com/dlulq6hny/image/upload/v1745837864/HCLlayout_4_k7jefr.svg'
                            // activeFloor?.layout
                        }
                        // floorId={'66aca7ceb180b45b2dfe62a9'} //iic
                        // floorId={'66f69ef10b7e6d271d9949f4'} //voic
                        // floorId={"66aca7ceb180b45b2dfe62a9"} //Brigade
                    />
                </Col>
            </Row>
            {/* <Row style={{ paddingLeft: '20px', paddingRight: '15px' }}>
                <DeviseTable customerId={customerId} />
            </Row>
            <Row style={{ paddingLeft: '20px', paddingRight: '0' }}>
                <EnergyMeterTable customerId={customerId} />
            </Row>
            <Row style={{ paddingLeft: '20px', paddingRight: '10px' }}>
                <OccupancyTable setOccupantsNumber={setOccupantsNumber} customerId={customerId} />
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                <IAQDeviceTables customerId={customerId} />
            </Row>
            <Row style={{ paddingLeft: '20px', paddingRight: '10px' }}>
                <AHUDeviseTable customerId={customerId} />
            </Row> */}
        </div>
    );
};

export default CustomerLandingPage;
