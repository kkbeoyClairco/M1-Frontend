import React, { useEffect, useState } from 'react';
import './BentoGrid2.scss';
import GaugeChartVOC2 from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartVOC2';
import TrendsChart from 'components/BentoGrid2/Trends/TrendsChart';
import { roundToOneDecimal } from 'utils/maths';
import { convertUnixToIST } from 'utils/timeFunctions';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import GaugeChartNH3 from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartNH3';
const sensorName = 'IAQ24002';
const BentoGrid2 = () => {
    const [cardData, setCardData] = useState<any>({
        voc: 0,
        nh3: 0,
    });
    const [lastUpdated, setLastUpdated] = useState('');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAQICardData = async (sensorName: string) => {
        try {
            if (!sensorName) return;
            setIsLoading(true);
            const Id = deviceTypeId['IAQ'];
            const response = await getIaqData({
                sensorName,
                deviceTypeId: Id,
            });
            console.log('Response', response);

            const data: any = response?.data?.[0] ?? {};
            // const data = sampleTableTestData[0] as any;
            const { VOC = 0, NH3 = 0, timestamp = 0 } = data;

            setCardData({
                // aqi: roundToOneDecimal(Number(AQI)),
                voc: roundToOneDecimal(Number(VOC)),
                nh3: roundToOneDecimal(Number(NH3)),
            });
            setLastUpdated(convertUnixToIST(timestamp));
        } catch (error) {
            console.log(error);
            setCardData({
                voc: 0,
                nh3: 0,
                timestamp: 0,
            });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getAQICardData(sensorName);
    }, []);
    return (
        <div className="bento-grid2-container">
            <div className="bento-grid2">
                <div className="bento-grid2-item top-left-box">
                    <GaugeChartVOC2 deviceName="" property="" value={cardData.voc} lastUpdated={lastUpdated} />
                </div>
                <div className="bento-grid2-item top-right-box">
                    <GaugeChartNH3 deviceName="" property="" value={cardData.nh3} lastUpdated={lastUpdated} />
                </div>
                <div className=" bottom-trends-box">
                    <TrendsChart sensorName={sensorName} deviceId="" buildingId="" />
                </div>
            </div>
        </div>
    );
};

export default BentoGrid2;
