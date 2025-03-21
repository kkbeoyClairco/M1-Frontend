import React from 'react';
// import ReactEcharts from 'echarts-for-react';
import { Card, Row } from 'react-bootstrap';
// import axios from 'axios';
// import { conforms } from 'lodash';
import ThermalImageLoader from 'components/ClaircoSkeltonLoaders/ThermalImageLoader';

// inter
const Heatmap = ({
    lastUpdated,
    thermalImage,
    thermalImageDate,
    thermalImageLoading,
}: {
    lastUpdated?: string;
    thermalImage?: any;
    thermalImageDate?: any;
    thermalImageLoading?: boolean;
}) => {
    return (
        <Card className="shadow rounded-lg w-100">
            <Card.Body>
                <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <h4 className="header-title">Thermal Image </h4>
                    {/* <div style={{ width: '19em' }}>{}</div> */}
                    <div className="w-100 text-wrap">
                        <p className="mx-auto text-end">Image generated based on data from {lastUpdated}</p>
                    </div>
                </Row>
                <Row
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '3em',
                        width: '95%',
                        marginInline: 'auto',
                    }}>
                    {' '}
                    {!thermalImageLoading ? (
                        thermalImage ? (
                            <img src={thermalImage ?? ''} alt="Thermal" height={'216px'} width="100px" />
                        ) : (
                            <Row
                                className=" justify-content-center align-items-center text-truncate text-wrap"
                                style={{ height: '15em', width: '100%' }}>
                                <h4 className="text-wrap text-center "> Thermal imaging is currently unavailable</h4>
                            </Row>
                        )
                    ) : (
                        <ThermalImageLoader />
                    )}
                </Row>
            </Card.Body>{' '}
        </Card>
    );
};

export default Heatmap;
