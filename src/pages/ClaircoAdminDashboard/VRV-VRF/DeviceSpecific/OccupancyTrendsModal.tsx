import React, { useEffect, useState } from 'react';
import { Button, Modal, Row } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import { useDatePicker } from 'hooks';
import { createPortal } from 'react-dom';

import { HyperDatepicker } from 'components';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { fetchZoneWiseOccupancyData } from 'helpers/api/services/Clairco/customerSide/occupancy';
type OccupancyModalProps = {
    modalState?: boolean;
    modalControlFn?: any;
    name?: string;
    zoneId?: any;
};
const OccupancyTrendsModal: React.FC<OccupancyModalProps> = ({ modalState, modalControlFn, name, zoneId }) => {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [xAxis, setXAxis] = useState([]);
    const [occupantsArray, setOccupantsArray] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleDateSubmission = async () => {
        try {
            setIsLoading(true);
            const epochStart = convertDateToEpoch(startDate);
            const endEpoch = convertDateToEpoch(endDate);
            const res = await fetchZoneWiseOccupancyData(
                Math.floor(epochStart / 1000),
                Math.floor(endEpoch / 1000),
                zoneId
            );
            const occupantsCount = res?.data.map((doc: any) => doc.totalOccupancy);
            const timeArray = res?.data.map((doc: any) => convertUnixToIST(doc.latestEpochTime));
            setXAxis(timeArray);
            setOccupantsArray(occupantsCount);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };
    //Echarts Graph Option
    const option = {
        grid: {
            left: '10%', // Adjust the left margin
            right: '10%', // Adjust the right margin
            bottom: '20%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: xAxis,
            axisLabel: {
                rotate: 60, // Rotate the labels 90 degrees to make them vertical
                textStyle: {
                    align: 'center',
                },
                // interval: 1,
                margin: 60,
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        // visualMap: {
        //     show: false,
        //     dimension: 0,
        // },
        yAxis: [
            {
                type: 'value',
                name: ' Occupants',
                position: 'left',
                nameLocation: 'middle',
                minInterval: 1,
                nameTextStyle: {
                    padding: [0, 40, 50, 0], // Adjust padding to move the label away from the axis
                },
                // axisLine: {
                //     lineStyle: {
                //         color: [graphLineColour],
                //     },
                // },
                axisLabel: {
                    // formatter: function (value: any) {
                    //     if (graphPara !== parameters.b) {
                    //         return `${value} ${unitTables[graphPara]}`;
                    //     } else {
                    //         const fanSpeedLabels = ['Auto', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
                    //         return fanSpeedLabels[value] || value;
                    //     }
                    // },
                },
            },
        ],
        series: [
            {
                // name: graphPara,
                data: occupantsArray,
                type: 'line',
                connectNulls: true,
                // yAxisIndex: 0,
                symbol: 'circle', // stack: 'Total',
                symbolSize: 5,
                lineStyle: {
                    // color: graphLineColour,
                },
            },
        ],
    };
    useEffect(() => {
        handleDateSubmission();
    }, []);
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="lg">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Occupancy Trends Of {name} </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <form style={{ display: 'flex', justifyContent: 'start', padding: '10px' }}>
                        <label style={{ padding: '10px' }} htmlFor="">
                            From
                        </label>
                        <HyperDatepicker
                            value={startDate}
                            inputClass="form-control-light"
                            onChange={(date) => {
                                setStartDate(date);
                            }}
                        />
                        <label htmlFor="" style={{ padding: '10px', marginLeft: '50px' }}>
                            To
                        </label>
                        <HyperDatepicker
                            value={endDate}
                            inputClass="form-control-light"
                            onChange={(date) => {
                                setEndDate(date);
                            }}
                        />{' '}
                        <Button
                            onClick={handleDateSubmission}
                            style={{ margin: '20px', marginTop: '0px', background: '#008675', borderWidth: '0px' }}>
                            Submit
                        </Button>
                    </form>
                </Row>{' '}
                <Row style={{ display: 'flex' }}>
                    {/* <p>The graph currently displays data from {startDate.toString()} to {endDate.toString()}</p> */}
                    <p style={{ padding: '20px', height: '10px', width: '100%' }}>
                        {isLoading ? 'Fetching data, please wait…' : ''}
                    </p>{' '}
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <ReactEcharts option={option} style={{ height: '500px', width: '850px' }} />
                </Row>{' '}
            </Modal.Body>
        </Modal>
    );
};

export default OccupancyTrendsModal;
