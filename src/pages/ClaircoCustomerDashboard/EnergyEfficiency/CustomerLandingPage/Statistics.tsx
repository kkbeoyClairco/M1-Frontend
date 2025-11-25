import { Row, Col, Card } from 'react-bootstrap';
import Select from 'react-select';

import { useEffect, useState } from 'react';
import StatisticsChartWidget from './StatisticsChartWidget';
// import dummyImage from '../../../assets/images/2023-04-02 (1).jpg';
// C:\Bejoy K K\Work\M1 IAQ\src\assets\images\2023-04-02 (1).jpg
import { useRedux } from 'hooks';
import {
    fetchBuildingsSuccess,
    fetchFloorsRequest,
    fetchFloorsSuccess,
    setBuildingSelected,
    // setSelectedFloor,
} from 'redux/homePage/actions';

import { MODIFY_ALERT } from 'appConstants/claircoConstants';
import { convertUnixToIST } from 'utils/timeFunctions';
import { floor } from 'helpers/api/services/Clairco/customer';
const floors = [
    { label: 'Ground Floor ', value: 'F1' },
    { label: '1st Floor ', value: 'F2' },
];
const Statistics = ({ occupantsNumber, functionToExecute, customerId, handleFloorSelection1 }: any) => {
    const [totalEnergy, setTotalEnergy] = useState<any>(0);
    const [updatedTime, setUpdatedTime] = useState(convertUnixToIST(new Date()));
    const [totalPerSavings, setTotalPerSavings] = useState<any>();
    const [daySavings, setDaySavings] = useState<any>();
    const [weekSavings, setWeekSavings] = useState<any>();
    const [cumSavings, setCumSavings] = useState<any>();
    const { dispatch, appSelector } = useRedux();
    const state = appSelector((state) => state.HomePageReducer);
    const [floorSelected, setSelectedFloor] = useState(floors[0]);
    // const { id, customerId } = getUserIdFromSession();

    // console.log('State', state);
    const { activeBuilding, activeFloor, buildingData, floorData } = state;

    //Total Energy Consumption API
    const getLiveEnergy = async () => {
        try {
            // MODIFY_ALERT Change the hardcoded value
            // const response: any = await getEnergyMeterLiveReading('CEM24001');
            // const totalEnergy = Math.round((response?.data[0].data.whAvg * 100) / 1000) / 100;
            // // Math.round(liveData?.PFAvg * 100) / 100
            // const updatedAt = response?.data[0]['Epoch time'];
            // const formattedTime = convertUnixToIST(updatedAt);
            // setTotalEnergy(totalEnergy || '-');
            // setUpdatedTime(formattedTime);
        } catch (error) {
            console.log(error);
        }
    };

    //Cost Savings  API
    const getCostData = async () => {
        try {
            // const res = await fetchCostSavingsDetails();
            // const daySaved = roundToOneDecimal(res?.data?.day.costSaving);
            // const weekSaved = roundToOneDecimal(res?.data?.week.costSaving);
            // const tillDateSaved = roundToOneDecimal(res?.data?.tillDate.costSaving);
            // const perSavings = roundToOneDecimal(
            //     (100 * (res?.data?.tillDate?.totalWhAvg - res?.data?.tillDate?.totalConserve)) /
            //         res?.data?.tillDate?.totalWhAvg
            // );
            // setDaySavings(daySaved);
            // setWeekSavings(weekSaved);
            // setCumSavings(tillDateSaved);
            // setTotalPerSavings(perSavings);
        } catch (error) {}
    };

    // SELECT Handlers
    // Floor selection
    const handleFloorSelection = async (e: any) => {
        try {
            const floorDetails = floorData.filter((doc: any) => doc.id === e.value)?.[0];
            const value = e?.value ?? 'F1';
            if (value === 'F1') setSelectedFloor(floors?.[0]);
            else setSelectedFloor(floors?.[1]);
            // console.log('fLOOR SELECTED', value);
            // const
            handleFloorSelection1(value);
            // dispatch(
            //     setSelectedFloor(
            //         floorDetails?.id ?? '',
            //         floorDetails?.name ?? '',
            //         floorDetails?.deviceTypeId ?? [],
            //         floorDetails?.layout
            //     )
            // );
        } catch (error) {
            console.log(error);
        }
    };
    //Building selection
    const handleBuildingSelection = async (e: any) => {
        try {
            const id = e.value;
            const building = buildingData.filter((building: any) => building.id === id)?.[0];
            // const buildingId = buildingData[index]?.id;
            const buildingName = building.name ?? '';
            const buildingId = building.id ?? '';
            // console.log('Building selected', e, buildingName, buildingId);
            dispatch(setBuildingSelected(buildingId, buildingName));
            dispatch(fetchFloorsRequest(buildingId, customerId));

            // console.log('Customer ID:', customerId);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        // getLiveEnergy();
        // getCostData();
        return () => {
            // dispatch(fetchBuildingsSuccess([]));
            // dispatch(fetchFloorsSuccess([]));
            // dispatch(setBuildingSelected('', ''));
            // dispatch(setSelectedFloor('', '', [], ''));
        };
    }, []);
    return (
        <>
            {/* <Col md={12}> */}
            {/* <Row style={{ paddingRight: '0' }}> */}
            {/* Building Selection Card */}
            <Col lg={12} style={{ minWidth: '200px', margin: '10px', zIndex: 1 }}>
                {/* <Card style={{ minWidth: '200px' }}>
                    <Card.Body> */}
                <div
                    //  className="widget-flat-dummy"
                    style={{ height: '125px', background: 'white', color: 'black' }}>
                    <Row style={{ height: '10%' }}></Row>
                    <h5 style={{ marginTop: '10px', textAlign: 'center', paddingLeft: '10px', color: '#98a6ad' }}>
                        Select Building
                    </h5>
                    {/* Building Selection */}
                    <Select
                        styles={{
                            // control: (styles) => ({ ...styles, backgroundColor: 'white' }),
                            control: (provided) => ({
                                ...provided,
                                // backgroundColor: '#007BFF',
                                width: '95%', // Adjust the width as needed
                                // height: '50%', // Adjust the height as needed
                                minHeight: '0px',
                                margin: 'auto',
                                borderRadius: '0.5em',
                                marginBottom: '0.5em',
                            }),
                            indicatorsContainer: (provided, state) => ({
                                ...provided,
                                height: '1.5em',
                            }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                height: '2em',
                                padding: '0 1em',
                                marginTop: '-0.1em',

                                // color: '#007BFF', // Adjust the text color
                                // fontSize: '1.1em',
                            }),
                            input: (provided, state) => ({
                                ...provided,
                                margin: '0em', // Override margin to prevent padding issues
                                padding: '0px', // Ensure no extra padding is added
                            }),
                            singleValue: (provided, state) => ({
                                ...provided,
                                margin: '0px', // Override margin to prevent padding issues
                                // color: '#007BFF',
                                padding: '0px', // Ensure no extra padding is added
                                fontSize: '1.1em',
                                // background: '#F4E0AF',
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isSelected ? '#007BFF' : '#fff', // Background color when option is selected
                                color: state.isSelected ? '#fff' : '#000', // Text color based on selection
                                '&:hover': {
                                    backgroundColor: '#007BFF', // Background color on hover
                                    color: '#fff', // Text color on hover
                                },
                                // height: '70px', // Control height of the options
                                // minHeight: '0.5em', // Ensure minimum height
                                // width: '16em', // Control width of the options
                            }),
                        }}
                        name="buildingSelect"
                        placeholder={activeBuilding?.buildingName ? activeBuilding?.buildingName : ''}
                        // defaultInputValue={buildingData?.[0]?.id}
                        onChange={handleBuildingSelection}
                        className="react-select"
                        classNamePrefix="react-select"
                        options={[
                            { label: 'Clairco Building 1', value: 'building1' },
                            { label: 'Clairco Building 2', value: 'building2' },
                        ]}
                        value={{ label: 'Clairco Building 1', value: 'building1' }}
                    />

                    {/* Floor Selection */}

                    <Select
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                backgroundColor: 'transparent',
                                width: '95%', // Adjust the width as needed
                                height: '20%',
                                // height: '1.5em', // Adjust the height as needed minHeight: '50px',
                                minHeight: '0px',
                                // marginLeft: '135px',
                                margin: 'auto',
                                borderRadius: '0.5em',
                            }),
                            indicatorsContainer: (provided, state) => ({ ...provided, height: '1.5em' }),
                            valueContainer: (provided, state) => ({
                                ...provided,
                                height: '2em',
                                padding: '0 1em',
                                marginTop: '-0.1em',
                            }),
                            input: (provided, state) => ({
                                ...provided,
                                margin: '0em', // Override margin to prevent padding issues
                                padding: '0px', // Ensure no extra padding is added
                            }),
                            singleValue: (provided, state) => ({
                                ...provided,
                                margin: '0px', // Override margin to prevent padding issues
                                color: '#007BFF',
                                padding: '0px', // Ensure no extra padding is added
                                fontSize: '1.1em',
                            }),
                        }}
                        name="floorSelection"
                        placeholder={activeFloor?.floorName ? `${activeFloor?.floorName}` : ''}
                        // defaultInputValue={floorData?.[0]?.id ? `${floorData?.[0]?.id}` : ''}
                        onChange={handleFloorSelection}
                        className="react-select"
                        classNamePrefix="react-select"
                        options={floors}
                        value={floorSelected}
                    />
                </div>
                {/* </Card.Body>
                </Card> */}
            </Col>
            {/* Building Image Card */}
            <Col md={12} style={{ margin: '10px', height: '125px', borderRadius: '5px' }}>
                <div
                    className="widget-flat-dummy"
                    style={{ background: '#fafbfe', borderRadius: '5px', height: '125px', paddingLeft: '0' }}>
                    <img
                        loading="lazy"
                        src={
                            'https://res.cloudinary.com/dlulq6hny/image/upload/v1764058715/2023-04-02_1.2c0d43ccdee443b903ab_xlzmue.jpg'
                        }
                        style={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            textAlign: 'start', // objectPosition: ' 80% 100%',
                            // padding: '10px',
                            borderRadius: '5px',
                        }}
                        alt=""
                    />
                </div>
            </Col>
            {/* Energy Savings Card */}
            <Col md={12} style={{ margin: '10px', height: '125px' }}>
                <div
                    className="widget-flat-dummy"
                    style={{
                        height: '125px',
                        // backgroundImage: url(dummyImage),
                        // background: 'white',
                        // // borderBlockColor: 'green',
                        // // borderBlockWidth: '2px',
                        // borderColor: 'green',
                        // borderWidth: '10px',
                    }}>
                    <h5
                        style={{
                            marginTop: '30px',
                            textAlign: 'start',
                            paddingLeft: '10px',
                            // color: '#FAF9F6'
                        }}>
                        Total Cost Savings{' '}
                    </h5>

                    <div style={{ display: 'flex', justifyContent: 'start', paddingInline: '15px' }}>
                        <h4
                            style={{
                                display: 'flex',
                                // background: , // Gold gradient
                                WebkitBackgroundClip: 'text',
                                // WebkitTextFillColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'black',
                                margin: '0px',
                                marginRight: '10px',
                                fontWeight: '400',
                                fontSize: '15px',
                            }}>
                            {/* र &nbsp; */}
                            Today: &nbsp;
                        </h4>{' '}
                        <h2
                            style={{
                                // color: 'white'
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'linear-gradient(90deg, #FFFBDA, #FFB14E)', // Gold gradient
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '15px',
                                margin: '0px',
                            }}>
                            {' '}
                            र &nbsp; {398.6}{' '}
                        </h2>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'start',
                            paddingInline: '15px',
                            width: '100%',
                        }}>
                        <h4
                            style={{
                                display: 'flex',
                                // background: , // Gold gradient
                                WebkitBackgroundClip: 'text',
                                // WebkitTextFillColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'black',
                                margin: '0px',
                                marginRight: '10px',

                                fontWeight: '400',
                                fontSize: '15px',
                            }}>
                            {/* र &nbsp; */}
                            Week: &nbsp;
                        </h4>{' '}
                        <h2
                            style={{
                                // color: 'white'
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center',
                                background: 'linear-gradient(90deg, #FFFBDA, #FFB14E)', // Gold gradient
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '15px',
                                margin: '0px',
                            }}>
                            {' '}
                            र &nbsp; {1509.7}{' '}
                        </h2>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'start', paddingInline: '15px' }}>
                        <h4
                            style={{
                                display: 'flex',
                                // background: , // Gold gradient
                                WebkitBackgroundClip: 'text',
                                // WebkitTextFillColor: 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'black',
                                margin: '0px',
                                fontWeight: '400',
                                fontSize: '15px',
                                marginRight: '1px',
                            }}>
                            {/* र &nbsp; */}
                            To date: &nbsp;
                        </h4>{' '}
                        <h2
                            style={{
                                // color: 'white'
                                display: 'flex',
                                justifyContent: 'end',
                                alignItems: 'center',
                                background: 'linear-gradient(90deg, #FFFBDA, #FFB14E)', // Gold gradient
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '15px',
                                margin: '0px',
                                // textAlign: 'end',
                                // textAlign: 'right',
                            }}>
                            {' '}
                            र &nbsp; {30265.1}
                        </h2>
                    </div>
                </div>
            </Col>
            {/* Total Energy Card*/}
            <Col md={12} style={{ margin: '10px', height: '125px' }}>
                <StatisticsChartWidget
                    description="Battery Change Required"
                    title={<span>Total energy (kWh)</span>}
                    lastUpdated={updatedTime}
                    stats={`${29347.2} `}
                    trend={'chartData.batteryChangeRequired.trend'}
                    colors={['#008675']}
                    stats2={String(29)}
                    data={'chartData.batteryChangeRequired.data'}
                />
            </Col>
            {/* Total Occupancts Card */}
            <Col md={12} style={{ margin: '10px', height: '125px' }}>
                <StatisticsChartWidget
                    description="Battery Change Required"
                    title={
                        <span>
                            Total Occupants <br />
                        </span>
                    }
                    lastUpdated={updatedTime}
                    functionToExecute={functionToExecute}
                    stats={floorSelected?.value === 'F1' ? String(19) : String(17)}
                    trend={'chartData.batteryChangeRequired.trend'}
                    colors={['#008675']}
                    data={'chartData.batteryChangeRequired.data'}
                />
            </Col>
        </>
    );
};

export default Statistics;
