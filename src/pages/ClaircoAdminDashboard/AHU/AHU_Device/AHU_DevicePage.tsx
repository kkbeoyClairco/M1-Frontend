import LastUpdated from 'components/ClaircoCustomerDashboard/General/LastUpdated/LastUpdated';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import HeadbandWidget from 'components/ClaircoCustomerDashboard/Widgets/HeadbandWidget';
import PlainWidget from 'components/ClaircoCustomerDashboard/Widgets/PlainWidget';
import PlainWidgetWithTwoParameters from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithTwoParameters';
import UnitSelectedWidget from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidget';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import IAQDevicesTable from './IAQDevicesTable';
import OccupancyDevicesTable from './OccupancyDeviceTable';
import TrendsChart from 'pages/ClaircoCustomerDashboard/AHU/AHU_Device/TrendsChart';
import TimerIcon from 'components/ClaircoCustomerDashboard/Icons/TimerIcon';
import Navigator from 'components/ClaircoCustomerDashboard/NavigatorComponent/Navigator';
import PlainWidgetWithUnitsIcon from 'components/ClaircoCustomerDashboard/Widgets/PlainWidgetWithUnitsIcon';
import {
    fetchAHURealTime,
    fetchAverageValuesForAHU,
    fetchBTURealTime,
    fetchOccuAndIaqList,
    fetchRealtimeDPT,
} from 'helpers/api/services/Clairco/customerSide/ahu';
import { convertDateToEpoch, convertUnixToIST } from 'utils/timeFunctions';
import { roundToOneDecimal } from 'utils/maths';
import { AHUModeReverseMapping } from 'appConstants/DeviceMappingConstants';
import UnitSelectedWidgetWithControls from 'components/ClaircoCustomerDashboard/Widgets/UnitSelectedWidgetWithControls';
import ControlsModal from './ControlsModal';
import { useLocation } from 'react-router-dom';
import { getDataFromSession, getUserDetailsFromSession, getUserInfoFromSession, isAdmin } from 'utils/storageFunctions';
import { convertToBTU } from 'utils/unitConversion';
import { DeviceSelectionComponent } from './DeviceSelectionComponent';
import classNames from 'classnames';
import { TwoParameterWidget } from './TwoParameterWidget';
import { conforms, forEach } from 'lodash';
import AHUCards from './AHUCards';

// interface LocationState {
//     sensorName?: string;
//     deviceName?: string;
//     btuName?: string;
//     id?: string;
//     floorId?: string;
// }
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

    // Click Handlers

    // Occupancy and IAQ Tables
    // const getOccupancyAndIaqDevicesList = useCallback(async (ahuId: any) => {
    //     if (!ahuId) return;
    //     // console.log('Occupancy List:');

    //     // const data = await fetchOccuAndIaqList(ahuId);
    //     // const iaq = data?.data?.iaqDevices;
    //     // const occupancy = data?.data?.occupancyDevices;
    //     // // console.log('Data for table', data, occupancy);
    //     // setIAQTableData(iaq);
    //     // setOccuTableData(occupancy);
    // }, []);

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
            // console.log(searchParam.toString());

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
                <TrendsChart
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
