import React, { useEffect, useState } from 'react';
import ModalBodyWrapper from './ModalComponents/ModalBodyWrapper';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import { Col, Row } from 'react-bootstrap';
// import { EditableTitleWidget } from 'components/ClaircoAdminDashboard/DrawingTest/Widgets/EditableTitleWidget';
import CameraFeeds from './Widgets/CameraFeeds';
import ThermalImage from './Widgets/ThermalImage';
import QuadrantsTable from './QuadrantsTable';
import ReadingsHistoryTable from './ReadingsHistoryTable';
import ThermalImageWithQuadrants from './ThermalWithQuadrant/ThermalImageWithQuadrants';
import OfflineWidget from './Widgets/OfflineWidget';
import SelectedUnitWidget from './Widgets/SelectedUnitWidget';
import { useLocation, useNavigate } from 'react-router-dom';
import ImageWrapper from './Widgets/ImageWrapper';
import InfoWidget from './Widgets/InfoWidget';
import useWebSocket from 'hooks/useWebsocket';
import { image_base64, raw_data } from './constant';
// import TestModal from '../TestModal';

const ThermopilePage = () => {
    const [modalState, setModalState] = useState(false);
    const [isStreaming, setIstreaming] = useState(false);
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [images, setImages] = useState({ thermal: '', raw: '' });
    // const { messages } = useWebSocket('ws://13.200.208.90:8081');
    const navigate = useNavigate();
    const handleNavigationToQuadSelector = async () => {
        try {
            navigate('zones');
        } catch (error) {
            console.log(error);
        }
    };
    const handleStreaming = async () => {
        setIstreaming((prev) => !prev);
    };
    const location = useLocation();

    useEffect(() => {
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        // console.log('URL:', searchParams.toString(), path);
        const name = searchParams.get('name');
        const building = searchParams.get('building');
        const locationName = searchParams?.get('location');
        const floor = searchParams.get('floor');
        // console.log('sensor name', name, 'building', building, 'location', locationName, 'floor', floor);
        setLocationInfo({ floor, location: locationName, sensorName: name, building });
    }, []);
    useEffect(() => {
        const sampleimage = image_base64;
        setImages(() => ({ raw: sampleimage, thermal: sampleimage }));
        // }
    }, []);
    return (
        <>
            {/* {modalState && <ModalBodyWrapper modalControlFn={handleModalSwitch} modalState={modalState} />} */}
            {/* <TestModal /> */}
            <PageHeading title={`Thermopile Device`} />

            <Row className="mx-3 my-2">
                <Col xs={12} lg={4} className="my-auto align-items-center">
                    <SelectedUnitWidget
                        unitName={locationInfo?.sensorName ?? 'Sensor'}
                        location={locationInfo?.location ?? 'Location'}
                        floor={locationInfo?.floor ?? 'Floor'}
                        building={locationInfo?.building ?? 'Building'}
                        deviceState={isStreaming}
                        swithDisabled={false}
                        deviceControlFunction={handleStreaming}
                    />
                </Col>

                <Col xs={12} lg={4} className="my-auto align-items-center">
                    {/* <EditableTitleWidget title="PIR Timeout" value={26} inputType={'number'} /> */}
                </Col>
                <Col xs={12} lg={4} className="my-auto align-items-center">
                    {' '}
                    {/* <EditableTitleWidget title="Noise Threshold" value={5} /> */}
                </Col>
            </Row>
            <Row className="mx-3">
                <Col xs={12} xl={4}>
                    <InfoWidget count={0} maxTemp={0} ambTemp={0} status={isStreaming} />

                    <ImageWrapper images={images} isStreaming={isStreaming} />
                </Col>
                <Col xs={12} md={8}>
                    <QuadrantsTable navControlFn={handleNavigationToQuadSelector} />
                </Col>
            </Row>

            <Row className="mx-3 mt-3 mb-2">
                <Col xs={12} md={8}>
                    <ReadingsHistoryTable />
                </Col>
                <Col xs={12} md={4}>
                    <ThermalImageWithQuadrants />
                </Col>
            </Row>
        </>
    );
};

export default ThermopilePage;
