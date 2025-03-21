import { Button, Card, Col, Row } from 'react-bootstrap';
import downloadIcon from './images/download.svg';
import QrImage from './images/QR-Img.svg';
import FilterIcon from './images/fluent_next-28-filled.svg';

const CommissionSequence = () => {
    return (
        <div className="CommissionSequence">
            <h4 className="header-title">Commisioning</h4>
            <div className="page-SubHeading p-2 pt-0">
                <Row>
                    <Col lg={10}>
                        <p className="text-muted">Commissioning Individual Sensors</p>
                    </Col>
                    <Col lg={2}>
                        <Button type="button" variant="primary" className="float-end">
                            <img src={FilterIcon} alt="Filter Icon" />
                        </Button>
                    </Col>
                </Row>
                <div className="page-content p-2 py-0">
                    <h4 className="header-title">Site Commissioning Steps</h4>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={9}>
                                    <h4>Step 1:</h4>
                                    <p>Download commissioning sequence file.</p>
                                </Col>
                                <Col lg={3}>
                                    <div className="DownloadSeqence float-end">
                                        <Button type="button" variant="primary">
                                            <img src={downloadIcon} alt="download icon" />{' '}
                                            <span>Download Sequence File</span>
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={9}>
                                    <h4>Step 2:</h4>
                                    <p>Download sensor commissioning mobile app scanning or clicking on the QR code.</p>
                                </Col>
                                <Col lg={3}>
                                    <div className="QrCode float-end">
                                        <a  href="https://play.google.com/store/apps/details?id=com.vel.barcodetosheet" target="_blank" rel="noopener noreferrer">
                                        <img src={QrImage} alt="QR Code" />
                                        </a>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h4>Step 3:</h4>
                            <p>
                                Scan QR code of all installed sensors in the same sequence as mentioned in the
                                commissioning sequence file.
                            </p>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <h4>Step 4:</h4>
                            <p>Sync scanned data from mobile app or upload .csv file to finish</p>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export { CommissionSequence };
