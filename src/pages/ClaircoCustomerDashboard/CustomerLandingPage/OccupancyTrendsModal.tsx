import React, { useEffect, useState } from 'react';
import { Button, Modal, Row } from 'react-bootstrap';
import ReactEcharts from 'echarts-for-react';
import { useDatePicker } from 'hooks';
import { createPortal } from 'react-dom';

import { HyperDatepicker } from 'components';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { getOverallOccupancyData } from 'helpers/api/services/Clairco/customerSide/occupancy';
type OccupancyModalProps = {
    modalState?: boolean;
    modalControlFn: any;
};
const OccupancyTrendsModal: React.FC<OccupancyModalProps> = ({ modalState, modalControlFn }) => {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 10)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [xAxis, setXAxis] = useState<any[]>([]);
    const [occupancyData, setOccupancyData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async () => {
        try {
            // console.log('Occupancy overall modal', startDate, endDate)
            setIsLoading(true);
            const startEpochTime = convertDateToEpoch(startDate);
            const endEpochTime = convertDateToEpoch(endDate);
            const res = await getOverallOccupancyData(
                Math.floor(startEpochTime / 1000),
                Math.floor(endEpochTime / 1000)
            );
            const occupancyArray = res?.data?.map((doc: any) => doc.totalOccupancy) || [];
            const extractedTime = res?.data?.map((doc: any) => convertUnixToIST(doc.latestEpochTime)) || [];
            // console.log('Occupancy array:', occupancyArray, extractedTime);
            setOccupancyData(occupancyArray);
            setXAxis(extractedTime);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    //Echarts Graph Option
    const option = {
        grid: {
            left: '10%', // Adjust the left margin
            right: '10%', // Adjust the right margin
            bottom: '30%', // Increase the bottom margin to make space for the labels
        },
        xAxis: {
            type: 'category',
            data: xAxis,
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

        yAxis: [
            {
                type: 'value',
                name: 'Overall Occupants',
                position: 'left',
                nameLocation: 'middle',
                minInterval: 1,
                nameTextStyle: {
                    padding: [0, 40, 50, 0], // Adjust padding to move the label away from the axis
                },
            },
        ],
        series: [
            {
                name: 'Occupants',
                data: occupancyData,
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
        handleSubmit();
    }, []);
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Occupancy Trends</h5>
                </Modal.Title>
                <button
                    onClick={() => modalControlFn(false)}
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ background: '#008675', borderWidth: '0px' }}>
                    <span aria-hidden="true">&times;</span>
                </button>
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
                            style={{ margin: '20px', marginTop: '0px', background: '#008675', borderWidth: '0px' }}
                            onClick={handleSubmit}>
                            Submit
                        </Button>
                    </form>
                </Row>
                <Row style={{ display: 'flex' }}>
                    {/* <p>The graph currently displays data from {startDate.toString()} to {endDate.toString()}</p> */}
                    <p style={{ padding: '20px', height: '10px', width: '25%' }}>
                        {isLoading ? 'Fetching data, please wait…' : ''}
                    </p>{' '}
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'center' }}>
                    <ReactEcharts option={option} style={{ height: '450px', width: '850px' }} />
                </Row>{' '}
            </Modal.Body>
        </Modal>
    );
};

export default OccupancyTrendsModal;
