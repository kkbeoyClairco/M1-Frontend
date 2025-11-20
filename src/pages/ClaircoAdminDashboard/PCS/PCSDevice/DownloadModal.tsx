import { HyperDatepicker } from 'components';
import { getCsvdownload } from 'helpers/api/services/Clairco/customerSide/iaq';
import React, { useState } from 'react';
import { Button, Col, Modal, Row, Toast } from 'react-bootstrap';
import { getDateOnly } from 'utils/timeFunctions';
// import DownloadModalComponent from './DownloadModal';

type DownloadModalProps = {
    modalState?: boolean;
    modalControlFn?: any;
    name?: string;
    zoneId?: any;
    deviceId?: string;
};
const DownloadModal: React.FC<DownloadModalProps> = ({ modalState, modalControlFn, name, zoneId, deviceId }) => {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [interval, setInterval] = useState('daily');

    const handleDateSubmission = async () => {
        try {
            const startDateFormatted = getDateOnly(startDate);
            const endDateFormatted = getDateOnly(endDate);
            const response: any = await getCsvdownload(deviceId, startDateFormatted, endDateFormatted, interval);
            const disposition = response?.headers?.get('Content-Disposition');
            let filename = `PCS_Report-${startDateFormatted}-${endDateFormatted}.xlsx`;
            if (disposition && disposition.indexOf('filename=') !== -1) {
                filename = disposition.split('filename=')[1].replace(/"/g, '');
            }
            const downloadUrl = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
            modalControlFn && modalControlFn();
            // setIsLoading(true);
            // const epochStart = convertDateToEpoch(startDate);
            // const endEpoch = convertDateToEpoch(endDate);
            // const res = await fetchZoneWiseOccupancyData(
            //     Math.floor(epochStart / 1000),
            //     Math.floor(endEpoch / 1000),
            //     zoneId
            // );
            // const occupantsCount = res?.data.map((doc: any) => doc.totalOccupancy);
            // const timeArray = res?.data.map((doc: any) => convertUnixToIST(doc.latestEpochTime));
            // setXAxis(timeArray);
            // setOccupantsArray(occupantsCount);
            // setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    };

    const handleInterval = async (e: any) => {
        try {
            setInterval(e.target.value);
            // console.log(e.target.value);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="lg">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Download Data</h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {' '}
                <form style={{ justifyContent: 'start', padding: '10px' }}>
                    {/* <Row> */}
                    <Row>
                        {' '}
                        <Col xs={3}>
                            {' '}
                            <label style={{ padding: '1em', marginLeft: '2em' }} htmlFor="">
                                From
                            </label>{' '}
                        </Col>{' '}
                        <Col xs={9}>
                            <HyperDatepicker
                                value={startDate}
                                inputClass="form-control-light"
                                onChange={(date) => {
                                    setStartDate(date);
                                }}
                            />
                        </Col>{' '}
                    </Row>
                    <Row>
                        {' '}
                        <Col xs={3}>
                            <label htmlFor="" style={{ padding: '1em', marginLeft: '2em' }}>
                                To
                            </label>
                        </Col>
                        <Col xs={9}>
                            {' '}
                            <HyperDatepicker
                                value={endDate}
                                inputClass="form-control-light"
                                onChange={(date) => {
                                    setEndDate(date);
                                }}
                            />{' '}
                        </Col>
                    </Row>{' '}
                    <Row>
                        {' '}
                        <Col xs={3}>
                            <label htmlFor="" style={{ padding: '1em', marginLeft: '2em' }}>
                                Time Interval
                            </label>
                        </Col>
                        <Col xs={9}>
                            {' '}
                            <select
                                style={{ borderRadius: '5px', height: '35px', width: '100%' }}
                                name="interval"
                                id="interval"
                                onChange={handleInterval}>
                                <option value="daily">Daily</option>
                                <option value="hourly">Hourly</option>
                            </select>
                        </Col>
                    </Row>
                    {/* </Row>{' '} */}
                </form>
                <Row>
                    <Col sm={6}></Col>
                    <Col sm={6} style={{ display: 'flex', justifyContent: 'end' }}>
                        {' '}
                        <Button
                            onClick={handleDateSubmission}
                            style={{ margin: '1em', marginTop: '0px', background: '#008675', borderWidth: '0px' }}>
                            Submit
                        </Button>
                        <Button
                            className="btn btn-outline-dark"
                            onClick={modalControlFn}
                            style={{
                                margin: '1em',
                                marginTop: '0px',
                                borderWidth: '0px',
                                background: 'grey',
                                // color: 'black',
                            }}>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;
