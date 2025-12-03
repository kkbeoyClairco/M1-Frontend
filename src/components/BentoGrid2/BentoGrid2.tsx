import React, { useEffect, useState } from 'react';
import './BentoGrid2.scss';
import GaugeChartVOC2 from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartVOC2';
import TrendsChart from 'components/BentoGrid2/Trends/TrendsChart';
import { roundToOneDecimal } from 'utils/maths';
import { convertUnixToIST } from 'utils/timeFunctions';
import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { getIaqData } from 'helpers/api/services/Clairco/customerSide/iaq';
import GaugeChartNH3 from 'components/ClaircoGauges/AQI/NewGauges/GaugeChartNH3';
const sensorNameVOC = 'ODS25050';
const sensorNameNH3 = 'ODS25048';
const BentoGrid2 = () => {
    const [cardData, setCardData] = useState<any>({
        voc: 0,
        nh3: 0,
    });
    const [lastUpdated, setLastUpdated] = useState({
        VOC: '',
        NH3: '',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getAQICardData = async () => {
        try {
            setIsLoading(true);
            const Id = deviceTypeId['IAQ'];
            const vocResponse = await getIaqData({
                sensorName: sensorNameVOC,
                deviceTypeId: Id,
            });
            const nh3Response = await getIaqData({
                sensorName: sensorNameNH3,
                deviceTypeId: Id,
            });
            const VOC = vocResponse?.data?.[0]?.VOC_index ?? 0;
            const NH3 = nh3Response?.data?.[0]?.NH3 ?? 0;
            const timestampVOC = convertUnixToIST(vocResponse?.data?.[0]?.timestamp ?? 0);
            const timestampNH3 = convertUnixToIST(nh3Response?.data?.[0]?.timestamp ?? 0);

            setCardData({
                voc: roundToOneDecimal(Number(VOC)),
                nh3: roundToOneDecimal(Number(NH3)),
            });
            setLastUpdated({ NH3: timestampNH3, VOC: timestampVOC });
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
        getAQICardData();
    }, []);
    return (
        <div className="bento-grid2-container">
            <div className="bento-grid2">
                <div className="bento-grid2-item top-left-box">
                    <GaugeChartVOC2 deviceName="" property="" value={cardData.voc} lastUpdated={lastUpdated.VOC} />
                </div>
                <div className="bento-grid2-item top-right-box">
                    <GaugeChartNH3 deviceName="" property="" value={cardData.nh3} lastUpdated={lastUpdated.NH3} />
                </div>
                <div className=" bottom-trends-box">
                    <TrendsChart
                        sensorNameVOC={sensorNameVOC}
                        sensorNameNH3={sensorNameNH3}
                        deviceId=""
                        buildingId=""
                    />
                </div>
            </div>
        </div>
    );
};

export default BentoGrid2;
