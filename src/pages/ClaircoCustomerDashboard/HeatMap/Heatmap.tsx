import React, { useEffect, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Card, Row } from 'react-bootstrap';
import axios from 'axios';
import { conforms } from 'lodash';

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
    const [imageSrc, setImageSrc] = useState('');
    const [loading, isLoading] = useState(false);
    // const []
    useEffect(() => {
        // setImageSrc(sampleRes);
        // const fetchData = async () => {
        //     try {
        //         isLoading(true);
        //         const url1 = 'http://3.7.82.174:2001/occupancy/image';
        //         const res = await axios.post(url1, { rawDataId: '66e803a2d30baa0ab8d4306a' }, { responseType: 'blob' });
        //         let imageBlob = res.data;
        //         const imageUrl = URL.createObjectURL(imageBlob);
        //         // imageBlob = imageBlob.blob();
        //         // const imageObjectURL = URL.createObjectURL(imageBlob);
        //         // console.log('Image resp from flask', res);
        //         setImageSrc(imageUrl);
        //         isLoading(false);
        //     } catch (error) {
        //         console.log(error);
        //         isLoading(false);
        //     }
        // };
        // fetchData();
    }, []);

    return (
        <div>
            <Card>
                <Card.Body>
                    {' '}
                    <Row style={{ display: 'flex', justifyContent: 'space-between', width: 'full' }}>
                        <h4 className="header-title">Thermal Image </h4>
                        <div style={{ width: '100px' }}>{}</div>
                        <div style={{ width: '400px' }}>Image generated based on data from {lastUpdated}</div>
                    </Row>
                    <Row
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '40px',
                            width: '400px',
                            marginInline: 'auto',
                        }}>
                        {' '}
                        {!thermalImageLoading ? (
                            <img src={thermalImage} alt="Thermal" height={'216px'} width="100px" />
                        ) : (
                            <div
                                style={{
                                    height: '216px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                {' '}
                                <div style={{ width: '100%' }}>
                                    <h5 className="card-title placeholder-glow">
                                        <span className="placeholder col-6"></span>
                                    </h5>{' '}
                                    <p className="card-text placeholder-glow">
                                        <span className="placeholder col-7"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-4"></span>
                                        <span className="placeholder col-6"></span>
                                        <span className="placeholder col-8"></span>
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* <ReactEcharts
                            option={option}
                            style={{
                                height: '300px',
                                width: '500px',
                                marginInline: '60px',
                                padding: '0px',
                                // display: 'flex',
                                // justifyContent: 'center',
                            }}
                        />{' '} */}
                    </Row>
                </Card.Body>{' '}
            </Card>
        </div>
    );
};

export default Heatmap;
