import React, { useEffect, useState } from 'react';
import StatisticsWidget from './StatisticsWidget';
import { Col, Row } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Charts from './Charts';
import {
    getEnergyMeterLiveReading,
    getEnergyMeterHistoricReadings,
    getPowerHistoricData,
} from 'helpers/api/services/Clairco/customerSide/energyMeter';
import { useSSR } from 'react-i18next';
import { convertUnixToISTForTable, formatUnixTimestamp } from 'utils/claircoFunctions';
import PowerChart from './PowerChart';
import PfAndFrequencyChart from './PfAndFrequencyChart';
import CurrentChart from './CurrentChart';
import VoltageChart from './VoltageChart';
import { convertUnixToIST, getCurrentEpochTime } from 'utils/timeFunctions';
import { getOverallOccupancyData } from 'helpers/api/services/Clairco/customerSide/occupancy';
import axios from 'axios';
import { historicReadings, realtimeDataDummy, totalConsumption } from 'appConstants/energymeterData';

interface HourlyDataValue {
    totalOccupancy: number;
    count: number;
}
const EnergyMeterPage = () => {
    const [liveData, setLiveData] = useState({
        Ab: 0,
        Ar: 0,
        Ay: 0,
        F: 0,
        PFAvg: 0,
        Vb: 0,
        Vr: 0,
        Vy: 0,
        WhB: 0,
        WhR: 0,
        WhY: 0,
        whAvg: 0,
    });
    const [powerR, setPowerR] = useState();
    const [powerY, setPowerY] = useState();
    const [powerB, setPowerB] = useState();
    const [powerAverage, setPowerAverage] = useState();
    const [pfData, setPfData] = useState();
    const [frequencyData, setFrequencyData] = useState();
    const [voltageR, setVoltageR] = useState();
    const [voltageY, setVoltageY] = useState();
    const [voltageB, setVoltageB] = useState();
    const [currentR, setCurrentR] = useState();
    const [currentY, setCurrentY] = useState();
    const [currentB, setCurrentB] = useState();
    const [powerTimeValues, setPowerTimeValues] = useState();
    const [pfTimeValues, setPfTimeValue] = useState();
    const [voltageTimeValues, setVoltageTimeValues] = useState();
    const [currentTimeValues, setCurrentTimeValues] = useState();
    const [powerTimeState, setPowerState] = useState('day');
    const [pfTimeState, setPfTimeState] = useState(1);
    const [voltageTimeState, setVoltageTimeState] = useState(1);
    const [currentTimeState, setCurrentTimeState] = useState(1);
    const [timeframe2, setTimeFrame2] = useState('hourly');
    const [lastUpdated, setLastUpdated] = useState('');
    const [sensorName, setSensorName] = useState('');
    const [occupantsCountArray, setOccupantsCountArray] = useState([]);
    const [temperatureValues, setTemperatureValues] = useState([]);
    const location = useLocation();
    // const epochStartTime = (timeFrame: any) => {
    //     if (timeFrame === 'day') return 60 * 60 * 24;
    //     else if (timeFrame === 'week') return 60 * 60 * 24 * 7;
    //     else return 0;
    //     // else if (timeFrame === 'month')  return 60 * 60 * 24 * 30
    // };
    // // Calculates the average Occupancy
    // function calculateAverageOccupancy(epochTimes: any, occupantsData: any) {
    //     const THIRTY_MINUTES = 30 * 60;
    //     let averageOccupancies: any = [];

    //     epochTimes.forEach((epochTime: any) => {
    //         let totalOccupants = 0;
    //         let count = 0;

    //         occupantsData.forEach((occupant: any) => {
    //             if (Math.abs(occupant.latestEpochTime - epochTime) <= THIRTY_MINUTES) {
    //                 totalOccupants += occupant.totalOccupancy;
    //                 count++;
    //             }
    //         });

    //         const average = count > 0 ? Math.round(totalOccupants / count) : 0;
    //         averageOccupancies.push(average);

    //         // averageOccupancies.push({ epochTime, averageOccupancy: average });
    //     });

    //     return averageOccupancies;
    // }

    // Gets Power Historic Data
    const fetchPowerHistoricData = async () => {
        try {
            // if (!sensorName) return;
            const result: any = { data: totalConsumption };

            //Data to Energy Trends
            const rValues = result.data.reverse().map((doc: any) => {
                const value = Math.round((doc.consumption.WhR * 100) / 1000) / 100;
                return value < 0 ? 0 : value;
            });
            const yValues = result.data.map((doc: any) => {
                const value = Math.round((doc.consumption.WhY * 100) / 1000) / 100;
                return value < 0 ? 0 : value;
            });
            const bValues = result.data.map((doc: any) => {
                const value = Math.round((doc.consumption.WhB * 100) / 1000) / 100;
                return value < 0 ? 0 : value;
            });
            const averageValues = result.data.map((doc: any) => {
                const value = Math.round((doc.consumption.WhAvg * 100) / 1000) / 100;
                return value < 0 ? 0 : value;
            });

            const timeValues = result.data.map((doc: any) => convertUnixToIST(doc.epochTime));

            // const energyTimeValues = result.data.map((doc: any) => doc.epochTime);
            //Occupancy
            // if (powerTimeState === 'day' || (powerTimeState === 'week' && timeframe2 === 'hourly')) {
            //     const endEpochTime = getCurrentEpochTime();
            //     const startEpochTime = endEpochTime - epochStartTime(powerTimeState);
            // console.log('Start epoch:', timeValues);
            //     let occupancyData: any = await getOverallOccupancyData(startEpochTime, endEpochTime);
            //     const processedOccupancyData = calculateAverageOccupancy(energyTimeValues, occupancyData.data);
            //     setOccupantsCountArray(processedOccupancyData);
            // } else setOccupantsCountArray([]);
            //convertEpochToDate1(doc['Epoch time']));

            // console.log('Processed values:', timeValues);
            setPowerR(rValues);
            setPowerY(yValues);
            setPowerB(bValues);
            setPowerAverage(averageValues);

            setPowerTimeValues(timeValues);
            // console.log('Energy Meter Live', rValues, yValues, bValues, averageValues);
        } catch (error) {
            console.log(error);
        }
    };
    // Gets PF & Frequency Historic Data
    const fetchPfHistoricData = async () => {
        try {
            // if (!sensorName) return;
            const result: any = { data: historicReadings };
            // await getEnergyMeterHistoricReadings(sensorName, pfTimeState);
            // console.log('Data:', result);
            // Data to Pf and Frequncy Trends
            const pfValues = result.data.reverse().map((doc: any) => Math.round(doc.data.PFAvg * 100) / 100);
            const frequncyValues = result.data.map((doc: any) => Math.round(doc.data.F * 100) / 100);

            const timeValues = result.data.map((doc: any) => convertUnixToIST(doc['Epoch time']));

            setPfData(pfValues);
            setFrequencyData(frequncyValues);
            setPfTimeValue(timeValues);
        } catch (error) {
            console.log(error);
        }
    };
    // Gets Voltage Historic Data
    const fetchVoltageHistoricData = async () => {
        try {
            // if (!sensorName) return;
            const result: any = { data: historicReadings };
            // await getEnergyMeterHistoricReadings(sensorName, voltageTimeState);

            // Data to Voltage Trends
            const rVoltageValues = result.data.reverse().map((doc: any) => Math.round(doc.data.Vr * 100) / 100);
            const yVoltageValues = result.data.map((doc: any) => Math.round(doc.data.Vy * 100) / 100);
            const bVoltageValues = result.data.map((doc: any) => Math.round(doc.data.Vb * 100) / 100);

            const timeValues = result.data.map((doc: any) => convertUnixToIST(doc['Epoch time']));

            setVoltageR(rVoltageValues);
            setVoltageY(yVoltageValues);
            setVoltageB(bVoltageValues);
            setVoltageTimeValues(timeValues);
        } catch (error) {
            console.log(error);
        }
    };
    // Gets Current Historic Data
    const fetchCurrentHistoricData = async () => {
        try {
            if (!sensorName) return;

            const result: any = { data: historicReadings };
            // await getEnergyMeterHistoricReadings(sensorName, currentTimeState);

            // Data to current Trends
            const rCurrentValues = result.data.reverse().map((doc: any) => Math.round(doc.data.Ar * 100) / 100);
            const yCurrentValues = result.data.map((doc: any) => Math.round(doc.data.Ay * 100) / 100);
            const bCurrentValues = result.data.map((doc: any) => Math.round(doc.data.Ab * 100) / 100);

            const timeValues = result.data.map((doc: any) => convertUnixToIST(doc['Epoch time']));
            setCurrentR(rCurrentValues);
            setCurrentY(yCurrentValues);
            setCurrentB(bCurrentValues);
            setCurrentTimeValues(timeValues);
        } catch (error) {
            console.log(error);
        }
    };
    // Gets Live Data
    const fetchLiveData = async (sensorName: any) => {
        try {
            if (!sensorName) return;

            const response: any = { data: realtimeDataDummy };
            // await getEnergyMeterLiveReading(sensorName);
            if (response.data[0]) {
                setLiveData(response.data[0].data);
            }
            const time = convertUnixToIST(
                new Date()
                // response.data[0]['Epoch time']
            );
            // console.log('time:', time, response);
            setLastUpdated(time);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const name = searchParams.get('name') ?? '';
        setSensorName(name);
        fetchLiveData(name);
    }, []);
    useEffect(() => {
        fetchPowerHistoricData();
        fetchPfHistoricData();
        fetchVoltageHistoricData();
        fetchCurrentHistoricData();
    }, [powerTimeState, pfTimeState, voltageTimeState, currentTimeState, timeframe2, sensorName]);

    return (
        <>
            {' '}
            <Row>
                <Col xs={12} style={{ paddingLeft: '40px' }}>
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <form className="d-flex">
                                <Link to="#" className="btn btn-primary ms-1">
                                    <i className="mdi mdi-filter-variant"></i>
                                </Link>
                            </form>
                        </div>
                        <h4 className="page-title"> Energy Dashboard </h4>
                    </div>
                </Col>
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Total <br />
                                Energy Consumption
                                <br />
                                {/* Required */}
                            </span>
                        }
                        value={[liveData.whAvg / 1000]}
                        lastUpdated={lastUpdated}
                        unit="kWh"
                        // stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>{' '}
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Power Factor
                                <br />
                                {/* Required */}
                            </span>
                        }
                        value={[liveData?.PFAvg ? Math.round(liveData?.PFAvg * 100) / 100 : 0]}
                        lastUpdated={lastUpdated}
                        unit="PF"
                        stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Frequency <br />
                                {/* Required */}
                            </span>
                        }
                        value={[liveData.F || 0]} //change the Frequency  to correct one
                        lastUpdated={lastUpdated}
                        unit="kWh"
                        stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                {' '}
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Phase Wise
                                <br /> Energy Consumption
                                {/* Required */}
                            </span>
                        }
                        value={[liveData.WhR / 1000, liveData.WhY / 1000, liveData.WhB / 1000]}
                        lastUpdated={lastUpdated}
                        unit="kWh"
                        stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>{' '}
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Phase Wise Current <br />
                                {/* Required */}
                            </span>
                        }
                        value={[liveData.Ar, liveData.Ay, liveData.Ab]}
                        lastUpdated={lastUpdated}
                        unit="A"
                        stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>{' '}
                <Col md={4}>
                    <StatisticsWidget
                        description=""
                        title={
                            <span>
                                Phase wise Voltage <br />
                                {/* Required */}
                            </span>
                        }
                        value={[liveData.Vr, liveData.Vy, liveData.Vb]}
                        lastUpdated={lastUpdated}
                        unit="V"
                        stats={'1'}
                        trend={{
                            textClass: 'text-success',
                            icon: 'mdi mdi-arrow-up-bold',
                            value: '4.87%',
                        }}
                    />
                </Col>
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                {' '}
                <PowerChart
                    title="Energy"
                    powerR={powerR}
                    powerY={powerY}
                    powerB={powerB}
                    powerAverage={powerAverage}
                    yAxisUnit={'kWh'}
                    xAxisInput={powerTimeValues}
                    timeStateFn={setPowerState}
                    timeStateFn2={setTimeFrame2}
                    occupancyData={occupantsCountArray}
                    temperatureData={temperatureValues}
                />
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                {' '}
                <PfAndFrequencyChart
                    title="PF & Frequency"
                    powerFactor={pfData}
                    frequency={frequencyData}
                    yAxisUnit={'Hz'}
                    xAxisInput={pfTimeValues}
                    timeStateFn={setPfTimeState}
                />
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                <VoltageChart
                    title="Voltage"
                    voltageR={voltageR}
                    voltageY={voltageY}
                    voltageB={voltageB}
                    yAxisUnit={'V'}
                    xAxisInput={voltageTimeValues}
                    timeStateFn={setVoltageTimeState}
                />
            </Row>
            <Row style={{ paddingLeft: '20px' }}>
                <CurrentChart
                    title="Current"
                    currentR={currentR}
                    currentY={currentY}
                    currentB={currentB}
                    yAxisUnit={'A'}
                    xAxisInput={currentTimeValues}
                    timeStateFn={setCurrentTimeState}
                />
            </Row>
        </>
    );
};

export default EnergyMeterPage;
