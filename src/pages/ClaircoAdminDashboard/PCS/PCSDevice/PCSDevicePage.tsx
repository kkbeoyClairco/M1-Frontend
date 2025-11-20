import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useCallback, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import TrendsChart from './TrendsChart2';
import { useLocation } from 'react-router-dom';

import { convertUnixToIST } from 'utils/timeFunctions';
import { getPcsData, getPCSMonthlyTraffic, getPCSTraffic } from 'helpers/api/services/Clairco/customerSide/pcs';
import HeadbandWidget2 from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget2';
import useInterval from 'use-interval';
interface LocationState {
    name?: string;
}
const PCSDevicePage = () => {
    const location = useLocation();
    const [sensorName, setSensorName] = React.useState('');
    const [realTimeData, setRealTimeData] = React.useState<any>({});
    const [lastUpdated, setLastUpdated] = React.useState('');
    const [locationData, setLocationData] = React.useState<any>({});
    const [cardData, setCardData] = React.useState<any>();

    // const state = location.state as LocationState;
    const getLiveData = useCallback(async (sensorName) => {
        if (!sensorName) return;

        const res = await getPcsData(sensorName);
        let latestData = res?.data?.data;
        const latestTime = convertUnixToIST(latestData?.['timestamp']);

        setRealTimeData({
            inCount: latestData?.inCount ?? '-',
            outCount: latestData?.outCount ?? '-',
            occupants: latestData?.no_of_Occupants ?? '-',
        });
        setLastUpdated(latestTime);
    }, []);

    const getPCSTrafficDataDaily = useCallback(async (sensorName: string) => {
        try {
            const today = new Date();
            const formattedDate = today.toISOString().slice(0, 10);
            // console.log(formattedDate); // Output: 2025-06-24
            const res = await getPCSTraffic(sensorName, 'day', formattedDate);
            const { busiestHour = {}, leastBusiestHour = {} } = res?.data ?? {};
            setCardData((prev: any) => ({ ...prev, busiestHour, leastBusiestHour }));
            // console.log('Res', res);
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getPCSTrafficDataMonthly = useCallback(async (sensorName: string) => {
        try {
            const res = await getPCSTraffic(sensorName, 'month');
            const { busiestDay = {}, leastBusiestDay = {} } = res?.data ?? {};
            // setCardData((prev: any) => ({ ...prev, busiestDay, leastBusiestDay }));
            // console.log('Res', res);
        } catch (error) {
            console.log(error);
        }
    }, []);

    const getMontlyData = async (sensorName: string) => {
        try {
            const res = await getPCSMonthlyTraffic(sensorName);
            const { busiestDay = {}, leastBusiestDay = {} } = res?.data ?? {};
            setCardData((prev: any) => ({
                ...prev,
                busiestDay: {
                    inCount: busiestDay?.footfall ?? 0,
                    time: busiestDay?.date ?? '',
                },
                leastBusiestDay: {
                    inCount: leastBusiestDay?.footfall ?? 0,
                    time: leastBusiestDay?.date ?? '',
                },
            }));
            // console.log('Res', res);
        } catch (error) {
            console.log(error);
        }
    };

    useInterval(() => getLiveData(sensorName), 60000);

    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        const building = searchParams.get('building') ?? '';
        const floor = searchParams.get('floor') ?? '';
        const zoneName = searchParams.get('zone') ?? '';
        setSensorName(name ?? '');
        setLocationData({ building: building ?? '', floor: floor ?? '', zoneName: zoneName ?? '' });
        getLiveData(name);
        getPCSTrafficDataDaily(name);
        getMontlyData(name);
        getPCSTrafficDataMonthly(name);
    }, [location]);

    return (
        <>
            <PageHeading title={'People Counting Sensor'} />
            <Row
                className="g-3"
                style={{
                    marginLeft: '10px',
                    marginBottom: '2em',
                    flexGrow: '1',
                    flexWrap: 'wrap',
                    alignItems: 'stretch',
                    // color: 'black',
                }}>
                {' '}
                <Col lg={3}>
                    <UnitSelectedWidget
                        unitName={sensorName ? sensorName : 'Sensor'}
                        location={locationData?.building ? locationData?.building : ''}
                        floor={locationData?.zoneName ? locationData?.zoneName : '	'}
                        building={locationData?.floor ? locationData?.floor : ''}
                        deviceState={true}
                        swithDisabled={true}
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget
                        title="Today's Total Incount"
                        value={realTimeData?.inCount ?? '-'}
                        lastUpdated={lastUpdated}
                        description="The cumulative number of people who entered this room today."
                    />
                </Col>
                <Col lg={3}>
                    <HeadbandWidget2
                        title="Today's Peak Incount Hour"
                        value={cardData?.busiestHour?.inCount ?? '-'}
                        time={cardData?.busiestHour?.time ?? '-'}
                        description="
                        
                        Shows the hour with the most entries today and the number of people during that hour"
                    />
                    {/* kj */}
                </Col>
                <Col lg={3}>
                    <HeadbandWidget2
                        title="Today's Lowest Incount Hour"
                        value={cardData?.leastBusiestHour?.inCount ?? '-'}
                        time={cardData?.leastBusiestHour?.time ?? '-'}
                        description="
                        
                        Shows the hour today with the fewest entries and the number of people during that hour."
                    />
                    {/* kj */}
                </Col>
                {/* <Col lg={3}></Col> */}
                <Col lg={3}>
                    <HeadbandWidget2
                        title="Busiest Day of the Month"
                        value={cardData?.busiestDay?.inCount ?? '-'}
                        time={cardData?.busiestDay?.time ?? '-'}
                        description="                        
Shows the day of the current month with the highest foot traffic (most people entering), displaying the date and the total inCount difference for that day                        "
                    />
                    {/* kj */}
                </Col>
                <Col lg={3}>
                    <HeadbandWidget2
                        title="Quietest Day of the Month"
                        value={cardData?.leastBusiestDay?.inCount ?? '-'}
                        time={cardData?.leastBusiestDay?.time ?? '-'}
                        description="                        
Shows the day of the current month with the lowest foot traffic (fewest people entering), displaying the date and the total inCount difference for that day.                        
                        "
                    />
                    {/* <WidgetNew1 /> */}
                </Col>
                {/* <Col lg={3}>
                 
                </Col>{' '} */}
                <Col lg={3}>
                    <HeadbandWidget
                        title="Current Occupants"
                        value={realTimeData?.occupants ?? '-'}
                        lastUpdated={lastUpdated ?? '-'}
                        description="Displays the current number of people in the room in real time."
                    />
                    {/* kj */}
                </Col>{' '}
                <Col lg={3}>
                    <HeadbandWidget
                        title="Today's Total Outcount"
                        value={realTimeData?.outCount ?? '-'}
                        lastUpdated={lastUpdated}
                        description="Displays, in real time, how many people have left the room."
                    />
                    {/* kj */}
                </Col>{' '}
            </Row>

            <Row style={{ marginLeft: '10px', padding: '10px', marginTop: '20px' }}>
                <TrendsChart sensorName={sensorName} />
            </Row>
        </>
    );
};
export default PCSDevicePage;
