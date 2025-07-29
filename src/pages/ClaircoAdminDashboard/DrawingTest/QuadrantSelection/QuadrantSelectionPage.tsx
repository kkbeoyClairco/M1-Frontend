// import QuadrantPlotting from 'components/ClaircoThermopile/QuadrantPlotting';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
// import { image_base64 } from '../DevicePage/constant';
// import { scalingFactorVGAdot3Camera } from 'appConstants/DeviceConstants';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import QuadrantDetails from 'components/ClaircoThermopile/QuadrantDetails';
// import QuadrantRectanglePlotting from 'components/ClaircoThermopile/QuadrantRectanglePlotting';
import QuadrantRectanglePlotting2 from 'components/ClaircoThermopile/QuadrantRectanglePlotting2';
// import SelectedUnitWidget from '../DevicePage/Widgets/SelectedUnitWidget';
import { useLocation, useNavigate } from 'react-router-dom';
// import { EditableTitleWidget } from 'components/ClaircoCustomerDashboard/Widgets/EditableTitleWidget';
// import InfoWidget from '../DevicePage/Widgets/InfoWidget';
import useWebSocket from 'hooks/useWebsocket';
import { getNormalizedRectangles } from 'utils/quadrantSelector';
import config from 'config';
import { roundToOneDecimal } from 'utils/maths';
interface PointInterface {
    x: number;
    y: number;
}

interface zoneInterface {
    name: string;
    points: PointInterface[];
    tTemp?: number | null;
    count?: number | null;
}
const QuadrantSelectionPage = () => {
    const [zones, setZones] = useState<zoneInterface[]>([]);
    const [selectedQuadrant, setSelectedQuadrants] = useState<number | null>(null);
    const [locationInfo, setLocationInfo] = useState<any>({ floor: '', location: '', sensorName: '', building: '' });
    const [isCommissioning, setIsCommissioning] = useState(false);
    const [temperatureArray, setTemperatureArray] = useState([]);
    const [data, setData] = useState<{ count?: number; minTemp?: number; maxTemp?: number; ambTemp?: number } | null>(
        {}
    );
    const location = useLocation();
    const socketMethods = useWebSocket('');
    const handleCommissioning = async () => {
        try {
            setIsCommissioning((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        console.log('Zones', zones);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' && selectedQuadrant !== null) {
                const newZones = zones.filter((_, idx) => idx !== selectedQuadrant);
                setZones(newZones);
                const normalized = getNormalizedRectangles(newZones, 1);
                socketMethods.sendMessage({ type: 'quadrants', quadrants: normalized });
                const thresholds = newZones.map((data: any, i: number) => data?.tTemp);
                socketMethods.sendMessage({
                    type: 'thresholds',
                    thresholds: thresholds,
                });
                setSelectedQuadrants(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedQuadrant, zones]);
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
    }, [location?.pathname]);
    useEffect(() => {
        if (isCommissioning) {
            socketMethods.connectWebSocket();
            socketMethods.sendMessage({ client_type: 'frontend' });
        } else socketMethods.closeWebSocket();
    }, [isCommissioning]);
    useEffect(() => {
        let message: any = socketMethods.messages;
        if (!message) return;
        message = JSON.parse(message);
        if (message?.type === 'thermal_data') {
            const tempArray = message?.['thermal_image'];
            const minTemp = roundToOneDecimal(message?.min_temp);
            const maxTemp = roundToOneDecimal(message?.max_temp);
            const ambTemp = roundToOneDecimal(message?.ambient_temperature);
            const count = (Object.values(message?.people_count ?? {}) as number[]).reduce(
                (acc: number, curr: number) => (curr ? acc + curr : 0),
                0
            );

            setTemperatureArray(tempArray);
            setData({ minTemp, maxTemp, count, ambTemp });
            // console.log('Socket Messages', tempArray);
        }
    }, [socketMethods.messages]);
    return (
        <div>
            <>
                <PageHeading title="Zone Selector" />
                <Row className="mx-3 my-2">
                    <Col xs={12} xl={4} className="my-auto align-items-center"></Col>
                    <Col xs={12} xl={4} className="my-auto align-items-center"></Col>
                    <Col xs={12} xl={4} className="my-auto align-items-center"></Col>
                </Row>
                <Row className="mx-3 my-2">
                    <Col xs={12} xl={8} className="d-flex justify-content-start align-items-center">
                        {isCommissioning ? (
                            <QuadrantRectanglePlotting2
                                selectedQuadrant={selectedQuadrant}
                                setSelectedQuadrants={setSelectedQuadrants}
                                scalingFactor={1}
                                changeZonetFn={setZones}
                                sendDataFn={socketMethods?.sendMessage}
                                temperatureInput={temperatureArray}
                                // imageURL={image_base64}
                                zonesList={zones}
                            />
                        ) : (
                            <div className="d-flex justify-content-center align-items-center">
                                <p className="  text-center m-0">Start Commissioning to view the live values</p>
                            </div>
                        )}
                    </Col>
                    <Col xs={12} xl={4} className="d-flex align-items-center h-100 ">
                        {isCommissioning ? (
                            <QuadrantDetails
                                selectedQuadInput={selectedQuadrant}
                                zones={zones}
                                setSelectedQuadrants={setSelectedQuadrants}
                                setZones={setZones}
                                sendDataFn={socketMethods.sendMessage}
                            />
                        ) : (
                            <div className="d-flex justify-content-center align-items-center">
                                <p className="  text-center m-0">Start Commissioning to view the live values</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </>
        </div>
    );
};

export default QuadrantSelectionPage;
