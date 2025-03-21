import { Col, Row } from 'react-bootstrap';

export const AQIToolTip = () => {
    const aqiVlauesMap = {
        Good: ' 0 to 50 ',
        Moderate: '51 to 100',
        'Unhealthy for Sensitive Groups': '101 to 150',
        Unhealthy: '151 to 200',
        'Very Unhealthy': '201 to 300',
        Hazardous: '301 and higher',
    };
    return (
        <>
            {Object.entries(aqiVlauesMap).map(([key, value]) => {
                return (
                    <Row style={{ paddingInline: '10px', width: '100%', color: '#3E2723' }}>
                        <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> • {key} </h6>
                        </Col>
                        <Col xs={6}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> {value}</h6>{' '}
                        </Col>{' '}
                    </Row>
                );
            })}{' '}
        </>
    );
};

export const VoCToolTip = () => {
    const vocValueMapper = {
        Good: ' 0 to 40',
        Moderate: '41 to 100',
        Poor: '101 to 300',
        Unhealthy: '301 or higher',
    };
    return (
        <>
            {Object.entries(vocValueMapper).map(([key, value]) => {
                return (
                    <Row style={{ paddingInline: '10px', width: '100%', color: '#3E2723' }}>
                        <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> • {key} </h6>
                        </Col>
                        <Col xs={6}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> {value}</h6>{' '}
                        </Col>{' '}
                    </Row>
                );
            })}{' '}
        </>
    );
};

export const Co2ToolTip = () => {
    const co2Mapper = {
        Good: '750 or less ',
        Moderate: '751 to 841',
        Poor: ' 842 to 900',
        Unhealthy: '901 to 1500',
        Severe: '1501 to 2500',
        Hazardous: '2500 or greater',
    };
    return (
        <>
            {' '}
            {Object.entries(co2Mapper).map(([key, value]) => {
                return (
                    <Row style={{ paddingInline: '10px', width: '100%', color: '#3E2723' }}>
                        <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px', minWidth: '11em' }}>
                                {' '}
                                • {key}{' '}
                            </h6>
                        </Col>
                        <Col xs={6}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> {value}</h6>{' '}
                        </Col>{' '}
                    </Row>
                );
            })}{' '}
            {/* <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Good{' '}
                </Col>
                <Col xs={6}> 750 or less </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Moderate{' '}
                </Col>
                <Col xs={6}>751 to 841 </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Poor
                </Col>
                <Col xs={6}> 842 to 900</Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Unhealthy
                </Col>
                <Col xs={6}>901 to 1500 </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Severe
                </Col>
                <Col xs={6}>1501 to 2500 </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={6} style={{ padding: '0px', textAlign: 'start' }}>
                    • Hazardous
                </Col>
                <Col xs={6}>2500 or greater </Col>{' '}
            </Row> */}
        </>
    );
};

export const PMToolTip = () => {
    const pmValuesMap = {
        Good: ['12 or less', ' 54 or less'],
        Moderate: ['13 to 35', '55 to 154 '],
        Poor: ['36 to 55', '155 to 254'],
        Unhealthy: ['56 to 150', '255 to 354'],
        Severe: ['151 or 250', '355 to 424'],
        Hazardous: ['250 or more', '425 or more '],
    };
    return (
        <>
            {' '}
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    {' '}
                </Col>
                <Col xs={4}>
                    {' '}
                    <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px', minWidth: '17em' }}>
                        PM 2.5
                    </h6>{' '}
                </Col>{' '}
                <Col xs={4}>
                    {' '}
                    <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}>PM 10 </h6>
                </Col>{' '}
            </Row>
            {Object.entries(pmValuesMap).map(([key, value]) => {
                return (
                    <Row style={{ paddingInline: '10px', width: '100%', color: '#3E2723' }}>
                        <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> • {key} </h6>
                        </Col>
                        <Col xs={4}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> {value[0]}</h6>{' '}
                        </Col>{' '}
                        <Col xs={4}>
                            <h6 style={{ fontWeight: '600', fontSize: '1em', marginBottom: '1px' }}> {value[1]}</h6>{' '}
                        </Col>{' '}
                    </Row>
                );
            })}{' '}
            {/* <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Good{' '}
                </Col>
                <Col xs={4}> 12 or less </Col> <Col xs={4}> 54 or less</Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Moderate{' '}
                </Col>
                <Col xs={4}>13 to 35 </Col> <Col xs={4}>55 to 154 </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Poor
                </Col>
                <Col xs={4}> 36 to 55</Col> <Col xs={4}> 155 to 254</Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Unhealthy
                </Col>
                <Col xs={4}>56 to 150</Col> <Col xs={4}>255 to 354</Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Severe
                </Col>
                <Col xs={4}>151 or 250 </Col> <Col xs={4}>355 to 424 </Col>{' '}
            </Row>
            <Row style={{ paddingInline: '10px', width: '100%' }}>
                <Col xs={4} style={{ padding: '0px', textAlign: 'start' }}>
                    • Hazardous
                </Col>
                <Col xs={4}>250 or more </Col> <Col xs={4}>425 or more </Col>{' '}
            </Row> */}
        </>
    );
};
