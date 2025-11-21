import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind } from '@fortawesome/free-solid-svg-icons';

interface AQICardProps {
    value: number;
    compact?: boolean;
}

const AQICard: React.FC<AQICardProps> = ({ value, compact }) => (
    <Card
        className={`bento-card aqi-card shadow-sm rounded-4 text-center${compact ? ' compact-card p-2' : ' p-4'}`}
        style={
            compact
                ? {
                      background: '#fff',
                      borderRadius: 24,
                      minWidth: 0,
                      minHeight: 0,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                  }
                : { borderRadius: 24 }
        }>
        <Card.Body
            className={compact ? 'py-2 px-2' : ''}
            style={
                compact
                    ? {
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          padding: 0,
                      }
                    : {}
            }>
            <div className={compact ? '' : 'mb-2'} style={compact ? { marginBottom: 2 } : {}}>
                <FontAwesomeIcon icon={faWind} size={compact ? 'lg' : '2x'} style={{ color: 'black' }} />
            </div>
            <h6
                className={compact ? 'mb-1' : 'mb-2 text-muted'}
                style={compact ? { fontSize: '0.85rem', color: 'black' } : {}}>
                Air Quality Index
            </h6>
            <h4
                className={compact ? 'mb-0' : 'mb-1'}
                style={{ color: 'black', fontWeight: 'bold', fontSize: compact ? '1.2rem' : undefined }}>
                {value}{' '}
                <small className="" style={compact ? { fontSize: '0.8rem', color: 'black' } : {}}>
                    AQI
                </small>{' '}
            </h4>

            <div className={compact ? 'mt-1' : 'mt-2'}>
                <span
                    className=""
                    style={{
                        // backgroundColor: value > 100 ? '#ff6b6b' : value > 50 ? '#feca57' : '#48ca9b',
                        color: 'white',
                        fontSize: compact ? '0.7rem' : undefined,
                        padding: compact ? '0.2em 0.6em' : undefined,
                    }}>
                    {value > 100 ? 'Unhealthy' : value > 50 ? 'Moderate' : 'Good'}
                </span>
            </div>
        </Card.Body>
    </Card>
);

export default AQICard;
