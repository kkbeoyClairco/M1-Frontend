import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
// import StatisticsChartWidget from '../OccupancyDevice/StatisticsChartWidget';
import { Link, useLocation } from 'react-router-dom';
import {
    fetchThermalmage,
    getOccupancyFromAllDevice,
    getOccupancywithDates,
    getRawOccupancyData,
    getThemopileData,
} from 'helpers/api/services/Clairco/customerSide/occupancy';
import Heatmap from '../../HeatMap/Heatmap';
import { HyperDatepicker } from 'components';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { conforms } from 'lodash';
import { oneHourInMilliseconds } from 'appConstants/propertyTable';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import OccupancyWidget from './OccupancyWidget';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import TrendsSkelton from 'components/ClaircoSkeltonLoaders/TrendsSkelton';
import { toast } from 'sonner';

interface GraphOptions {
    [key: string]: number;
}
interface LocationState {
    name?: string;
}
const ThermopileDevicePage = () => {
    const [timePeriod, setTimePeriod] = useState(1);
    const [graphXAxis, setGraphXAxis] = useState([]);
    const [occupancyData, setOccupancyData] = useState([]);
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [idArray, setIdArray] = useState([]);
    const [isLoading, setIsLoading] = useState<{ trends: boolean; image: boolean }>({ trends: false, image: false });
    // const [deviceName, setdeviceName] = useState('');
    const [isHistoricData, setIsHistoricData] = useState(false);
    const [lastUpdated, setLastUpdated] = useState('');
    const [thermalImage, setThermalImage] = useState('');
    const [thermalImageLoading, setThermalImageLoading] = useState(false);
    const [imageDate, setImageDate] = useState<any>();
    // const [name, setname] = useState('');
    const [locationDetails, setLocationDetails] = useState<{
        deviceName: string;
        zone: string;
        location: string;
        building: string;
    }>({
        deviceName: '',
        zone: '',
        location: '',
        building: '',
    });
    const location = useLocation();
    // const state = location.state as LocationState;
    // const deviceId = location.pathname.split('/').reverse()[0] || '';
    // const zoneName = useRef<any>(null);
    // const zoneName = state?.name ?? '';

    // console.log('Location:', zoneName);
    const [occupantsCount, setOccupantsCount] = useState<any>();

    //Graph Option
    const option = {
        grid: {
            left: '10%', // Adjust the left margin
            right: '10%', // Adjust the right margin
            bottom: '30%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: graphXAxis,

            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'right',
                },
                margin: 30,
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        yAxis: [
            {
                type: 'value',
                name: 'Occupants',
                position: 'left',
                nameLocation: 'middle',
                minInterval: 1,
                nameTextStyle: {
                    padding: [0, 40, 40, 0],
                },

                axisLabel: {
                    formatter: function (values: number) {
                        return Math.floor(values);
                    },
                },
            },
        ],
        series: [
            {
                name: 'Occupants',
                data: occupancyData,
                connectNulls: true,
                type: 'line',
                symbol: 'diamond',
                symbolSize: 8,
                yAxisIndex: 0,
            },
        ],
    };
    const graphOptions: GraphOptions = {
        '1': 1,
        '6': 6,
        '12': 12,
        '24': 24,
    };
    const changeTimePeriod = async (key: number) => {
        try {
            if (isLoading.trends) {
                toast.warning('We’re handling your request. The button will be available soon.');
                return;
            }
            setStartDate(new Date(new Date().setDate(new Date().getDate() - key)));
            setTimePeriod(key);
        } catch (error) {
            console.log(error);
        }
    };
    const getOccupantsData = useCallback(
        async (deviceId, timePeriod) => {
            try {
                if (!Object.values(graphOptions).includes(timePeriod) || !deviceId) return;
                setIsLoading((prev) => ({ ...prev, trends: true }));
                // const currentEpoch = convertDateToEpoch(new Date());
                // const startEpoch = currentEpoch - oneHourInMilliseconds * timePeriod;
                // const endEpochTime = convertDateToEpoch(endDate);
                // const data: any = await getRawOccupancyData(
                //     Math.floor(startEpoch / 1000),
                //     Math.floor(currentEpoch / 1000),
                //     deviceId
                // );

                const data = await getThemopileData(deviceId, timePeriod);
                const extracted = data?.data?.data ?? [];

                const occupancyNumberArray = extracted?.map((data: any) => data?.COUNT);
                const extractTime = extracted?.map((data: any) => {
                    const extractedTime = data?.['TIME'];
                    const time = convertUnixToIST(extractedTime);
                    return time;
                });

                const thermopileId = extracted?.map((doc: any) => {
                    return doc?._id;
                });

                getThermalImage(thermopileId[thermopileId.length - 1]);
                // console.log('Data for occupa:', data, thermopileId);
                setGraphXAxis(extractTime);
                setOccupancyData(occupancyNumberArray);
                setLastUpdated(extractTime[extractTime.length - 1]);
                setImageDate(extractTime[extractTime.length - 1]);
                setStartDate(new Date(new Date().setDate(new Date().getDate() - 1)));
                setEndDate(new Date());
                setIdArray(thermopileId);
                setOccupantsCount(occupancyNumberArray[occupancyNumberArray.length - 1]);
            } catch (error) {
                setOccupancyData([]);
                setGraphXAxis([]);
                console.log(error);
            } finally {
                setIsLoading((prev) => ({ ...prev, trends: false }));
            }
        },
        [timePeriod]
    );

    // const fetchOccupancyData = async () => {
    //     try {
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
    const handleDatePick = async () => {
        try {
            if (!locationDetails.deviceName) return;
            // 5 is an invalid input it will unselect the time selection buttons
            setTimePeriod(5);
            // console.log(startDate, new Date(new Date().setDate(new Date().getDate() - 1)));
            const startEpochTime = convertDateToEpoch(startDate);
            const endEpochTime = convertDateToEpoch(endDate);
            const res = await getOccupancywithDates(
                Math.floor(startEpochTime / 1000),
                Math.floor(endEpochTime / 1000),
                locationDetails?.deviceName
            );
            const occupancyNumberArray = res?.data?.reverse()?.map((doc: any) => {
                return doc?.metaData?.['occupancy_number'];
            });
            const extractTime = res?.data?.map((data: any) => {
                const extractedTime = data?.['epochTime'];
                const time = convertUnixToIST(extractedTime);
                return time;
            });
            const thermopileId = res?.data.map((doc: any) => {
                return doc?.rawDataId;
            });
            getThermalImage(thermopileId[thermopileId.length - 1]);
            if (!extractTime) return;
            setGraphXAxis(extractTime);
            setImageDate(extractTime[extractTime.length - 1]);
            setLastUpdated(extractTime[extractTime.length - 1]);

            setOccupancyData(occupancyNumberArray);
            setIdArray(thermopileId);
            setOccupantsCount(occupancyNumberArray[occupancyNumberArray.length - 1]);
        } catch (error) {
            setOccupancyData([]);
            setGraphXAxis([]);
            console.log(error);
        }
    };
    const getThermalImage = async (id: any) => {
        try {
            // console.log('Themaml image id', id);
            if (!id) return;
            setThermalImageLoading(true);
            const res = await fetchThermalmage(id);
            let imageBlob = res?.data;
            const imageUrl = URL.createObjectURL(imageBlob);
            setThermalImage(imageUrl);
            setThermalImageLoading(false);
        } catch (error) {
            setThermalImageLoading(false);
        }
    };
    const handleChartClick = async (params: any) => {
        try {
            // console.log('Params', params.dataIndex);
            // setThermalImageLoading(true);
            const id = idArray[params.dataIndex];
            setImageDate(graphXAxis[params.dataIndex]);
            getThermalImage(id);
            setOccupantsCount(occupancyData[params.dataIndex]);
        } catch {
            // setThermalImageLoading(false);
        }
    };
    useEffect(() => {
        if (locationDetails?.deviceName) getOccupantsData(locationDetails.deviceName, timePeriod);
    }, [getOccupantsData, locationDetails.deviceName, timePeriod]);
    useEffect(() => {
        handleChartClick('');
        const path = location?.pathname;
        const paramsString = path?.split('/')?.pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        const building = searchParams.get('building') ?? '';
        const locationName = searchParams?.get('location') ?? '';
        const zoneName = searchParams?.get('zone') ?? '';
        const deviceName = searchParams?.get('deviceName') ?? '';
        setLocationDetails({ zone: zoneName, building: building, location: locationName, deviceName: deviceName });
    }, []);
    return (
        <>
            <PageHeading title={`Occupancy Details `} />
            <p className="mb-0 mx-3 fst-italic text-wrap">
                {locationDetails?.location +
                    ' ' +
                    '/' +
                    ' ' +
                    locationDetails?.building +
                    ' ' +
                    '/' +
                    ' ' +
                    locationDetails?.zone +
                    ' ' +
                    '/' +
                    ' ' +
                    locationDetails?.deviceName}
            </p>
            <Row
                className="mx-4"
                style={
                    {
                        // paddingLeft: '20px'
                    }
                }>
                <Col xs={12} lg={3} style={{}}>
                    <OccupancyWidget
                        icon={faUser}
                        occupantsCount={occupantsCount ?? 'Na'}
                        title="Total Occupants"
                        lastUpdated={imageDate ?? ''}
                    />
                </Col>
                <Col xs={12} lg={9}>
                    <Heatmap
                        lastUpdated={imageDate}
                        thermalImage={thermalImage}
                        thermalImageLoading={thermalImageLoading}
                    />
                </Col>
            </Row>
            {/* Trends */}
            <Card className="shadow-lg rounded-lg p-2 mx-3">
                <Card.Body>
                    <Tab.Container defaultActiveKey="1hr">
                        <div className="align-items-center d-sm-flex justify-content-sm-between mb-3">
                            <div className="ChartHeading">
                                <h4 className="header-title">Occupancy Trends</h4>
                            </div>

                            <Nav as="ul" variant="pills" className=" p-1 rounded  ">
                                {Object.keys(graphOptions).map((key: any) => {
                                    return (
                                        <Nav.Item as="li" key={key} className="flex-fill text-center">
                                            <Nav.Link
                                                as={Link}
                                                className="py-1"
                                                to="#"
                                                eventKey={graphOptions[key]}
                                                style={{
                                                    background: timePeriod == graphOptions[key] ? '#00695C' : '#008675',

                                                    borderRadius: '0px',
                                                    color: timePeriod == graphOptions[key] ? '#FFFFFF' : '#000000',
                                                }}
                                                onClick={() => changeTimePeriod(graphOptions[key])}>
                                                {key}hr
                                            </Nav.Link>
                                        </Nav.Item>
                                    );
                                })}
                            </Nav>
                        </div>
                        {/* Graph*/}
                        <Row style={{ height: '600px' }}>
                            <Col md={12}>
                                {!isLoading.trends ? (
                                    <ReactEcharts
                                        option={option}
                                        style={{ height: '500px', width: '100%' }}
                                        onEvents={{ click: handleChartClick }}
                                    />
                                ) : (
                                    <>
                                        <TrendsSkelton />
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Tab.Container>
                </Card.Body>
            </Card>
            {/* </Row> */}
        </>
    );
};

export default ThermopileDevicePage;
