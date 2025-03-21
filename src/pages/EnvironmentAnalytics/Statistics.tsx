import { StatisticsChartWidget3 } from 'components';
import { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const Statistics = () => {
    let CharWidgetObject = {
        stats: '' ,
        lastMonthData: '',
        currentMonthData: '',
        data : [0],
    } 

    const [temperature, setTemperature] = useState(CharWidgetObject);
    const [humidity, setHumidity] = useState(CharWidgetObject);
    const [co2, setCo2] = useState(CharWidgetObject);
    const [voc, setVoc] = useState(CharWidgetObject);

    useEffect(() => {
        setTemperature({
            stats: '24.5°C',
            lastMonthData: '23.5°C',
            currentMonthData: '23.5°C',
            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        });
        setHumidity({
            stats: '74.5%',
            lastMonthData: '78.1%',
            currentMonthData: '82.8%',
            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        });
        setCo2({
            stats: '0.22 ppm',
            lastMonthData: '0.33 PPM',
            currentMonthData: '0.33 PPM',
            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        });
        setVoc({
            stats: '0.22 ppm',
            lastMonthData: '0.33 PPM',
            currentMonthData: '0.33 PPM',
            data: [12, 14, 2, 47, 32, 44, 14, 55, 41, 69],
        });
    }, []);

    return (
        <Row>
            <Col xs={12}>
                <Row className="g-3">
                    <Col sm={6} lg={3}>
                        <StatisticsChartWidget3
                            title="Temperature Pattern"
                            stats= {temperature.stats}
                            lastMonthData={temperature.lastMonthData}
                            currentMonthData={temperature.currentMonthData}
                            name="series-1"
                            colors={['#EE6666','#FF9D9D']}
                            strokeWidth={2}
                            borderRadius={1}
                            data={temperature.data}
                        />
                    </Col>

                    <Col sm={6} lg={3}>
                        <StatisticsChartWidget3
                            title="Humidity Pattern"
                            stats={humidity.stats}
                            lastMonthData={humidity.lastMonthData}
                            currentMonthData={humidity.currentMonthData}
                            name="series-1"
                            colors={['#FED580','#FFBC00']}
                            strokeWidth={2}
                            borderRadius={1}
                            data={humidity.data}
                        />
                    </Col>

                    <Col sm={6} lg={3}>
                        <StatisticsChartWidget3
                            title="CO2 Pattern"
                            stats={co2.stats}
                            lastMonthData= {co2.lastMonthData}
                            currentMonthData= {co2.currentMonthData}
                            name="series-1"
                            colors={['#34BFA3','#A1D689']}
                            strokeWidth={2}
                            borderRadius={1}
                            data={co2.data}
                        />
                    </Col>

                    <Col sm={6} lg={3}>
                        <StatisticsChartWidget3
                            title="VOC Pattern"
                            stats= {voc.stats}
                            lastMonthData= {voc.lastMonthData}
                            currentMonthData= {voc.currentMonthData}
                            name="series-1"
                            colors={['#5571C7','#ADB3FF']}
                            strokeWidth={2}
                            borderRadius={1}
                            data={voc.data}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default Statistics;
