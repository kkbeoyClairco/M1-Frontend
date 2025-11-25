import React, { useEffect, useState } from 'react';
import PM10Card from './PM10Card';
import VOCCard from './VOCCard';
import AQICard from './AQICard';
import EnergySavedCard from './EnergySavedCard';
import MoneySavedCard from './MoneySavedCard';
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
const hvac = { energySaved: 41574.8, moneySaved: 199155.8 };
const washroom = { odourLevel: 2, isOccupied: false, totalEntries: 34 };

const BentoGrid: React.FC = () => {
    // Demo data, replace with real data as needed
    const [airQuality, setAirQuality] = useState({ pm10: 0, pm25: 0, opm10: 0, opm25: 0, voc: 120, aqi: 85 });
    const [space, setSpace] = useState({ incount: 60, outcount: 50 });
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
            const latestTime = convertUnixToIST(latestData?.['timestamp']);

            setSpace({
                incount: latestData?.inCount ?? '-',
                outcount: latestData?.outCount ?? '-',
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
            const { AQI = 0, PM10 = 0, PM25 = 0, VOC = 0, OPM10 = 0, OPM25 = 0 } = iaqData?.data?.[0] ?? {};
            // console.log('IAQ data', iaqData, AQI, PM10, PM25);
            setAirQuality((prev) => ({
                ...prev,
                pm10: PM10,
                pm25: PM25,
                aqi: AQI,
                voc: VOC,
            }));
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
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            letterSpacing: 0.2,
                        }}>
                        Air Quality
                    </div>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <PM10Card2
                            pm10={airQuality.pm10}
                            pm25={airQuality.pm25}
                            oPm10={airQuality.opm10}
                            oPm25={airQuality.opm25}
                            aqi={airQuality.aqi}
                            voc={airQuality.voc}
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
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            letterSpacing: 0.2,
                        }}>
                        Energy Savings
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <EnergySavedCard
                            energySaved={hvac.energySaved}
                            moneySaved={hvac.moneySaved}
                            percentChange={24}
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
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            letterSpacing: 0.2,
                        }}>
                        Washroom Solutions
                    </div>
                    <div style={{ flex: 1, display: 'flex' }}>
                        <WashroomSolutionsCard {...washroom} />
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
                    <div
                        style={{
                            fontWeight: 700,
                            fontSize: '1.2rem',
                            color: '#222',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                            letterSpacing: 0.2,
                        }}>
                        Space Management
                    </div>
                    <div style={{ display: 'flex', flex: 1, gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <InCountCard count={space.incount} />
                        </div>
                        <div style={{ flex: 1, display: 'flex' }}>
                            <OutCountCard count={space.outcount} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BentoGrid;
