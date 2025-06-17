import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Popover, OverlayTrigger } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUvdevices, getUvData } from 'helpers/api/services/Clairco/uv';
import ultraviolet from 'assets/images/clairco/ultraviolet.png';

const Lamps = () => {
    const navigate = useNavigate();
    const location: any = useLocation();

    const customerId = location?.state?.customerId;
    const buildingId = location?.state?.buildingId;
    const floorId = location?.state?.id;
    const [panelBoxData, setPanelBoxData] = useState([]);
    const [uv_lights, setUv_lights] = useState([]);
    const [connected, setConnected] = useState(0);
    const [dataLoading, setDataLoading] = useState(false);
    const [runnningHours, setRunnningHours] = useState(0);
    const [totalRunningHours, setTotalRunningHours] = useState(0);
    const [runningHoursForAllUVLights, setRunnningHoursForAllUVLights] = useState([]);

    const fetchData = async () => {
        try {
            const deviceInfo = await fetchUvdevices(customerId, buildingId, floorId);
            const circuitId = deviceInfo?.data[0]?.circuitId.toString();
            if (circuitId) {
                const { data } = await getUvData(circuitId);
                setPanelBoxData(data);

                data.map((info: any) => {
                    const arr = [
                        info[1]
                            .replace(/["]+/g, '')
                            .replace(/[\[\]']+/g, '')
                            .replace(/["']/g, ''),
                    ];
                    const arr1 = arr[0].replace(/,/g, '').split(' ');
                    let count = 0;
                    arr1.map((item: any) => {
                        if (
                            item === '1' &&
                            Math.round(Date.now() / 1000) -
                                Math.round(new Date(`${info[6]} ${info[5]}`).getTime() / 1000) <=
                                900
                        ) {
                            ++count;
                        }
                    });

                    setUv_lights(arr1);
                    setConnected(count);
                    setDataLoading(false);
                });
                data.map((info: any) => {
                    if (info[2]) {
                        const arr = [
                            info[2]
                                .replace(/["]+/g, '')
                                .replace(/[\[\]']+/g, '')
                                .replace(/["']/g, ''),
                        ];
                        const arr1 = arr[0].replace(/,/g, '').split(' ');
                        // console.log(arr1);
                        setRunnningHoursForAllUVLights(arr1);
                        setTotalRunningHours(info[3]);
                    } else {
                        setRunnningHoursForAllUVLights([]);
                        setTotalRunningHours(0);
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const content = (
        <Popover style={{ padding: '1em' }}>
            <Row>
                {' '}
                <p>
                    Running hours :{' '}
                    {runnningHours == undefined || runnningHours == null ? 'NA' : runnningHours + ' hrs'}
                </p>
            </Row>
            <Row>
                <p>
                    Remaining running hours :{' '}
                    {runnningHours !== undefined ? totalRunningHours - runnningHours + ' hrs' : 'NA'}
                </p>
            </Row>
        </Popover>
    );

    return (
        <>
            {panelBoxData.length > 0 && (
                <div style={{ marginLeft: '1em', padding: '1em', marginTop: '1em' }}>
                    <Row gutter={16}>
                        {panelBoxData.map((info) => (
                            <Col span={24}>
                                <Card style={{ alignItems: 'center', width: '100%' }}>
                                    <Card.Header>
                                        {Math.round(Date.now() / 1000) -
                                            Math.round(new Date(`${info[6]} ${info[5]}`).getTime() / 1000) >
                                        900
                                            ? 'System Status : OFF'
                                            : 'System Status : ON'}
                                    </Card.Header>
                                    <Card.Body>
                                        <h1 style={{ display: 'flex', justifyContent: 'center' }}>
                                            {info[4] !== null ? info[4] : 'NA'}
                                        </h1>
                                        <h1
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                color: 'gray',
                                                fontWeight: '400',
                                                fontSize: '16px',
                                                marginBottom: '15px',
                                            }}>
                                            <span
                                                style={{
                                                    margin: '0 10px',
                                                    paddingRight: '10px',
                                                }}>
                                                <b> UV Lamp Status : </b>
                                            </span>
                                            TOTAL :{' '}
                                            <span
                                                style={{
                                                    borderRight: '2px solid gray',
                                                    margin: '0 10px',
                                                    paddingRight: '10px',
                                                }}>
                                                <b> {uv_lights.length} </b>
                                            </span>
                                            ON :
                                            <span
                                                style={{
                                                    borderRight: '2px solid gray',
                                                    margin: '0 10px',
                                                    paddingRight: '10px',
                                                }}>
                                                <b>{connected}</b>
                                            </span>
                                            OFF :{' '}
                                            <span style={{ paddingLeft: '10px' }}>
                                                {' '}
                                                <b>{uv_lights.length - connected} </b>{' '}
                                            </span>
                                        </h1>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                marginBottom: '30px',
                                            }}>
                                            {uv_lights.map((light, i) => (
                                                <OverlayTrigger key={i} placement="top" overlay={content}>
                                                    <div
                                                        key={i + 1}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            backgroundColor:
                                                                Math.round(Date.now() / 1000) -
                                                                    Math.round(
                                                                        new Date(`${info[6]} ${info[5]}`).getTime() /
                                                                            1000
                                                                    ) <=
                                                                    900 && light === '1'
                                                                    ? 'green'
                                                                    : 'red',
                                                            display: 'flex',
                                                            color: 'white',
                                                            margin: '15px 15px  15px 15px ',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            fontSize: '16px',
                                                        }}
                                                        onMouseEnter={(e) =>
                                                            setRunnningHours(runningHoursForAllUVLights[i])
                                                        }>
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'column',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                padding: '15px',
                                                                border: '3px solid black',
                                                                height: '100%',
                                                            }}>
                                                            <div>
                                                                <img
                                                                    src={ultraviolet}
                                                                    width="90%"
                                                                    style={{
                                                                        display: 'block',
                                                                        margin: '0 auto',
                                                                    }}
                                                                />
                                                            </div>
                                                            <div> {i + 1}</div>
                                                        </div>
                                                    </div>
                                                </OverlayTrigger>
                                            ))}
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '20px',
                                                }}>
                                                <div
                                                    style={{
                                                        width: '100px',
                                                        height: '30px',
                                                        backgroundColor: 'green',
                                                        margin: '5px 5px  0 0 ',
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'white',
                                                        borderRadius: '25px',
                                                    }}>
                                                    UVC LAMP
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: '5px',
                                                        fontWeight: '500',
                                                        fontSize: '14px',
                                                        color: 'gray',
                                                        //   fontSize: "18px",
                                                    }}>
                                                    <b> ON </b>
                                                </div>
                                            </div>
                                            <span style={{ borderRight: '2px solid gray' }}></span>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginLeft: '20px',
                                                }}>
                                                <div
                                                    style={{
                                                        width: '100px',
                                                        height: '30px',
                                                        backgroundColor: 'red',
                                                        margin: '5px 5px  0 0 ',
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        color: 'white',
                                                        borderRadius: '25px',
                                                    }}>
                                                    UVC LAMP{' '}
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: '5px',
                                                        fontWeight: '500',
                                                        fontSize: '14px',
                                                        color: 'gray',
                                                        //   fontSize: "18px",
                                                    }}>
                                                    <b> OFF</b>
                                                </div>
                                            </div>
                                        </div>
                                    </Card.Body>
                                    <Card.Footer>Updated 15 minutes ago</Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </>
    );
};

export default Lamps;
