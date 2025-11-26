import React, { useEffect, useState } from 'react';
import PM10Card from './PM10Card';
import VOCCard from './VOCCard';
import AQICard from './AQICard';
import EnergySavedCard from './EnergySavedCard';
// import MoneySavedCard from './MoneySavedCard';
import WashroomSolutionsCard from './WashroomSolutionsCard';
import InCountCard from './InCountCard';
import OutCountCard from './OutCountCard';
import './BentoGrid.scss';
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import useInterval from 'use-interval';
import PM10Card2 from './PM10Card2';
import { useNavigate } from 'react-router-dom';
import { getPcsData } from 'helpers/api/services/Clairco/customerSide/pcs';
import { convertUnixToIST } from 'utils/timeFunctions';
import LastUpdated from 'components/ClaircoCustomerDashboard/General/LastUpdated/LastUpdated';
import SpaceManagementCard from './SpaceManagementCard';
const hvac = { energySaved: 41574.8, moneySaved: 199155.8 };
const washroom = { odourLevel: 2, isOccupied: false, totalEntries: 34 };
const headingStyle = {
    fontWeight: 700,
    fontSize: '1.18rem',
    color: '#1a237e',
    marginBottom: '0.5rem',
    textAlign: 'center' as const,
    letterSpacing: 0.2,
    fontFamily: 'inherit',
};
const BentoGrid: React.FC = () => {
    // Demo data, replace with real data as needed
    const [airQuality, setAirQuality] = useState({
        pm10: 50,
        pm25: 12,
        opm10: 152,
        opm25: 150,
        voc: 39,
        aqi: 50,
        lastUpdated: convertUnixToIST(new Date()),
    });
    const [space, setSpace] = useState({
        incount: 650,
        outcount: 400,
        occupancy: 250,
        lastUpdated: convertUnixToIST(new Date()),
    });
    const navigate = useNavigate();
    // const airQuality = { pm10: 0, pm25: 0, voc: 120, aqi: 85 };
    // const space = { incount: 70, outcount: 50 };
    const handleClick = (index: string) => {
        try {
            // const index
            let url = '';
            switch (index) {
                case 'a':
                    url =
                        '/air-quality/iaq-home/name=IAQ24058&building=Nalanda+Shelter&location=&floor=Location+1&deviceId=66a37f11b21720ad8091a215&customerId=6698e2d415023def020a7c45&building=Nalanda+Shelter&buildingId=66a08b435f335657c02ea9c3';
                    break;
                case 'e':
                    url = '/energy-efficiency';

                    break;
                case 'w':
                    url = '/wsr';

                    break;
                case 's':
                    url =
                        '/space/pcs-home/name=PCS_IGBC&building=Panasonic+Blr&location=Mumbai&floor=1st&zone=Meeting+Room+1';
                    break;
                default:
                // fallback code
            }
            navigate(url);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchPCS = async () => {
        try {
            const pcsData = await getPcsData('PCS_IGBC');
            let latestData = pcsData?.data?.data;
            const latestTime = convertUnixToIST(latestData?.['timestamp'] ?? new Date());

            setSpace({
                incount: latestData?.inCount ?? 650,
                outcount: latestData?.outCount ?? 400,
                occupancy: latestData?.inCount - latestData?.outcount,
                lastUpdated: latestTime,
            });
            console.log('PCS Data', pcsData);
        } catch (error) {
            console.log(error);
        }
    };
    const fetchIaqData = async () => {
        try {
            const iaqSensorName = 'IAQ24058';
            const Id = deviceTypeId['IAQ'];
            const iaqData = await getIaqData({ sensorName: iaqSensorName, deviceTypeId: Id });
            //  pm10: 50,
            // pm25: 12,
            // opm10: 152,
            // opm25: 356,
            // voc: 39,
            // aqi: 50,
            // lastUpdated: convertUnixToIST(new Date()),

            const {
                AQI = 50,
                PM10 = 50,
                PM25 = 12,
                VOC = 38,
                OPM10 = 152,
                OPM25 = 150,
                timestamp = new Date(),
            } = iaqData?.data?.[0] ?? {};
            // console.log('IAQ data', iaqData, AQI, PM10, PM25);
            // setAirQuality((prev) => ({
            //     ...prev,
            //     pm10: PM10,
            //     pm25: PM25,
            //     aqi: AQI,
            //     opm10: OPM10,
            //     opm25: OPM25,
            //     voc: VOC,
            //     lastUpdated: convertUnixToIST(timestamp),
            // }));
        } catch (error) {
            console.log(error);
        }
    };
    useInterval(fetchIaqData, 180000);
    useInterval(fetchPCS, 180000);

    useEffect(function fetchData() {
        fetchIaqData();
        fetchPCS();
    }, []);
    return (
        <div className="bento-grid-container" style={{ position: 'relative' }}>
            <div className="bento-grid">
                {/* Top row: Air Quality and Energy Savings */}
                <div
                    onClick={() => handleClick('a')}
                    className="bento-grid-item"
                    style={{
                        gridColumn: '1 / 2',
                        gridRow: '1 / 2',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}>
                    <div style={headingStyle}>Air Quality</div>

                    <div style={{ flex: 1, minHeight: 0 }}>
                        <PM10Card2
                            pm10={airQuality.pm10}
                            pm25={airQuality.pm25}
                            oPm10={airQuality.opm10}
                            oPm25={airQuality.opm25}
                            aqi={airQuality.aqi}
                            voc={airQuality.voc}
                            lastUpdated={airQuality?.lastUpdated}
                        />
                    </div>
                </div>
                <div
                    onClick={() => handleClick('e')}
                    className="bento-grid-item bento-energy-saved"
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '1 / 2',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                    <div style={headingStyle}>HVAC Energy Efficiency</div>

                    <div style={{ flex: 1, display: 'flex' }}>
                        <EnergySavedCard
                            energySaved={hvac.energySaved}
                            moneySaved={hvac.moneySaved}
                            percentChange={24}
                            lastUpdated={airQuality.lastUpdated}
                        />
                    </div>
                </div>

                {/* Middle row: Washroom Solutions */}
                <div
                    onClick={() => handleClick('w')}
                    className="bento-grid-item bento-washroom-solutions"
                    style={{
                        gridColumn: '1 / 2',
                        gridRow: '2 / 3',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}>
                    <div style={headingStyle}>Washroom Solutions</div>

                    <div style={{ flex: 1, display: 'flex' }}>
                        <WashroomSolutionsCard {...washroom} lastUpdated={airQuality.lastUpdated} />
                    </div>
                </div>

                {/* Middle row: Space Management */}
                <div
                    className="bento-grid-item bento-space-management"
                    onClick={() => handleClick('s')}
                    style={{
                        gridColumn: '2 / 3',
                        gridRow: '2 / 3',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        height: '100%',
                    }}>
                    <div style={headingStyle}>Space Management</div>
                    <SpaceManagementCard
                        inCount={space.incount ?? 650}
                        occupantCount={space.incount - space.outcount ?? 250}
                        outCount={space.outcount ?? 400}
                        lastUpdated={airQuality.lastUpdated}
                    />
                </div>
            </div>
        </div>
    );
};

export default BentoGrid;
