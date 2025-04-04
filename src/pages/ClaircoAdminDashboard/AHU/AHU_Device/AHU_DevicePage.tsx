import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getUserInfoFromSession } from 'utils/storageFunctions';
import { DeviceSelectionComponent } from './DeviceSelectionComponent';
import AHUCards from './AHUCards';
import AHUTrendsChart from 'components/ClaircoTrends/AHU/TrendsChart';

const AHU_DevicePage = () => {
    const [locationData, setLocationData] = useState<any>();
    const [ahuData, setAhuData] = useState<any>();
    const [btuData, setBtuData] = useState<any>();

    //   Refs
    const trendsGraphRef = useRef<HTMLDivElement>(null);
    const occupancyRef = useRef<HTMLDivElement>(null);
    const iaqRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const { customerId } = getUserInfoFromSession();

    //Handlers
    // Device changing function
    const handleDeviceSelection = async (deviceData: any) => {
        try {
            const {
                location: locationName = '',
                buildingName = '',
                floorName = '',
                sensorName = '',
                btuName = '',
                name: ahuName = '',
                floorId,
            } = deviceData;
            // console.log('New Data from selection', deviceData);
            setLocationData({
                locationName,
                buildingName,
                floorName,
                floorId,
            });
            setAhuData({
                ahuId: deviceData?.value,
                ahuName: deviceData?.name,
                ahuSensor: deviceData?.sensorName,
            });
            setBtuData({
                btuSensor: deviceData?.btuName,
            });
            const path = location?.pathname;
            // console.log('Path Name', location);
            const paramsString = path.split('/').pop(); // Extracts the last part of the path
            const searchParam = new URLSearchParams(paramsString);
            // console.log('search params', Object.entries(searchParams));
            searchParam.set('location', locationName);
            searchParam.set('building', buildingName);
            searchParam.set('floorName', floorName);
            searchParam.set('ahuName', ahuName);
            searchParam.set('btuSensor', btuName);
            searchParam.set('ahuSensor', sensorName);
            searchParam.set('ahuId', deviceData?.value);
            searchParam.set('floorId', floorId);

            window.history.pushState({}, '', `/customer/vrv-vrf/0#/customer/ahu/${searchParam.toString()}`);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        //Scroll to top
        window.scrollTo(0, 0);
        const path = location?.pathname;
        const paramsString = path.split('/').pop(); // Extracts the last part of the path
        const searchParams = new URLSearchParams(paramsString);
        // const name = searchParams.get('name');
        const buildingName = searchParams.get('building');
        const locationName = searchParams?.get('location');
        const floorName = searchParams.get('floorName');
        const btuSensor = searchParams.get('btuSensor');
        const ahuName = searchParams.get('ahuName');
        const ahuSensor = searchParams.get('ahuSensor');
        const ahuId = searchParams.get('ahuId');
        const floorId = searchParams.get('floorId');
        setLocationData({
            locationName,
            buildingName,
            floorName,
            floorId,
        });
        setBtuData({
            btuSensor,
        });
        setAhuData({
            ahuId,
            ahuName,
            ahuSensor,
        });
    }, []);
    // useEffect(() => {
    //     // getRealTimeAHU(ahuData?.ahuSensor);
    //     // getOccupancyAndIaqDevicesList(ahuData?.ahuId);
    //     // getAverageValues(ahuData?.ahuId);
    //     // getDPTRealtime(ahuData?.ahuId);
    // }, [ahuData, getOccupancyAndIaqDevicesList]);

    return (
        <>
            <Row style={{ marginLeft: '10px' }}>
                {' '}
                <Col xs={12} md={6}>
                    <PageHeading title={'AHU'} />
                </Col>
                <Col xs={12} md={6}>
                    <DeviceSelectionComponent
                        customerId={customerId}
                        floorId={locationData?.floorId}
                        functionToExecute={handleDeviceSelection}
                        defaultSelection={ahuData?.ahuName ?? ''}
                    />
                </Col>
            </Row>

            <AHUCards ahuData={ahuData} btuData={btuData} locationData={locationData} />
            <Row ref={trendsGraphRef} style={{ marginLeft: '10px', padding: '10px', paddingLeft: '15px' }}>
                <AHUTrendsChart
                    sensorNameAHU={ahuData?.ahuSensor ?? ''}
                    sensorNameBTU={btuData?.btuSensor ?? ''}
                    deviceId={ahuData?.ahuId ?? ''}
                />
            </Row>
            <Row ref={iaqRef} style={{ marginLeft: '10px' }}>
                {/* <IAQDevicesTable tableData={IAQTableData} /> */}
            </Row>
            <Row ref={occupancyRef} style={{ marginLeft: '10px' }}>
                {/* <OccupancyDevicesTable tableData={occuTableData} /> */}
            </Row>
        </>
    );
};

export default AHU_DevicePage;
