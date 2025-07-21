import { HyperDatepicker } from 'components';
import { getCsvdownload, getCsvdownload1 } from 'helpers/api/services/Clairco/customerSide/iaq';
import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { toast } from 'sonner';
import { getDateOnly } from 'utils/timeFunctions';
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
    const [interval, setInterval] = useState('hourly');

    const handleDateSubmission = async () => {
        try {
            setIsLoading(true);
            const startDateFormatted = getDateOnly(startDate);
            const endDateFormatted = getDateOnly(endDate);
            // const csvData = await getCsvdownload(deviceId, startDateFormatted, endDateFormatted, interval);
            // if (typeof csvData !== 'string' || csvData.trim() === '') {
            //     toast.error('No data found for the selected date range.');
            //     return;
            // }

            const csvData = await getCsvdownload1({
                deviceId,
                start_time: startDateFormatted,
                end_time: endDateFormatted,
                interval,
            });

            const blob = new Blob([csvData?.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const disposition = csvData?.headers?.['content-disposition'];
            let filename = '';
            // `${customerSelected?.label ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.xlsx`;
            if (disposition && disposition.includes('filename=')) {
                filename = disposition.split('filename=')[1].replace(/['"]/g, '').trim();
            }
            a.href = url;
            a.download = filename;
            //  `${customerSelected?.label ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            modalControlFn();
        } catch (error) {
            console.log(error);
            toast.error('Oops! Something went wrong. Please try again later. We appreciate your understanding!');
        } finally {
            setIsLoading(false);
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
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                            </select>
                        </Col>
                    </Row>
                    {/* </Row>{' '} */}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Col xs={12} md={3} className="d-flex justify-content-end">
                    {' '}
                    <Button
                        className="w-100"
                        onClick={handleDateSubmission}
                        style={{ margin: '1em', marginTop: '0px', background: '#008675', borderWidth: '0px' }}>
                        {isLoading && (
                            <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"></span>
                        )}
                        {isLoading ? 'Fetching...' : ' Download'}
                    </Button>
                </Col>{' '}
                <Col xs={12} md={3} className="d-flex justify-content-end">
                    {' '}
                    <Button
                        className="btn btn-outline-dark w-100"
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
            </Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;
