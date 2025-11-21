import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind, faSmog, faCloud } from '@fortawesome/free-solid-svg-icons';

interface AirQualityCardProps {
    pm10: number;
    voc: number;
    aqi: number;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ pm10, voc, aqi }) => (
    <Card className="bento-card air-quality-card shadow-sm rounded-4 p-4 text-center">
        <Card.Body>
            <h5 className="mb-3 d-flex align-items-center justify-content-center gap-2">
                <FontAwesomeIcon icon={faWind} style={{ color: '#00b894' }} /> Air Quality
            </h5>
            <div className="d-flex flex-column gap-2">
                <div className="d-flex align-items-center gap-2 justify-content-center">
                    <FontAwesomeIcon icon={faSmog} style={{ color: '#636e72' }} /> <span>PM10:</span>{' '}
                    <b>{pm10} µg/m³</b>
                </div>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                    <FontAwesomeIcon icon={faCloud} style={{ color: '#fdcb6e' }} /> <span>VOC:</span> <b>{voc} ppm</b>
                </div>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                    <span style={{ color: '#0984e3', fontWeight: 600 }}>AQI:</span> <b>{aqi}</b>
                </div>
            </div>
        </Card.Body>
    </Card>
);

export default AirQualityCard;
