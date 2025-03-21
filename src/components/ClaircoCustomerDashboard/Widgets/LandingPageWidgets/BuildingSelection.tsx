import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Select from 'react-select';
import backgroundCircularImage from 'assets/images/Bg-circular.png';
type BuildingSelectionType = {
    buildingData?: any;
    floorData?: any;
    handleBuildingSelection?: () => void;
    handleFloorSelection?: () => void;
};
const BuildingSelection = ({
    buildingData,
    floorData,
    handleBuildingSelection,
    handleFloorSelection,
}: BuildingSelectionType) => {
    return (
        <Card
            style={{
                marginTop: '0.5em',
                background: '#008675',
                // backgroundImage: `url(${backgroundCircularImage})`,
                // backgroundSize: '130%',
                // backgroundPosition: 'center',
                // backgroundRepeat: 'repeat',

                height: '10em',
            }}>
            <Card.Body style={{ padding: '0px' }}>
                {/* <div className="widget-flat-dummy" style={{ height: '125px', background: '#008675', color: '#FFFEFE' }}> */}
                {/* <Row style={{ height: '20px' }}></Row> */}
                <h4 style={{ marginTop: '1em', textAlign: 'start', paddingLeft: '10px', color: 'black' }}>
                    Select Building
                </h4>
                {/* Building Selection */}
                <Select
                    styles={{
                        // control: (styles) => ({ ...styles, backgroundColor: 'white' }),
                        control: (provided) => ({
                            ...provided,
                            // backgroundColor: '#007BFF',
                            width: '90%', // Adjust the width as needed
                            height: '10%', // Adjust the height as needed minHeight: '50px',
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
                            marginTop: '-0.6em',

                            // color: '#007BFF', // Adjust the text color
                            // fontSize: '1.1em',
                        }),
                        input: (provided, state) => ({
                            ...provided,
                            height: '2em',
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
                    placeholder={buildingData?.[0]?.name ? buildingData?.[0]?.name : ''}
                    defaultInputValue={buildingData?.[0]?.id}
                    onChange={handleBuildingSelection}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={buildingData?.map((data: any) => ({
                        value: data.id,
                        label: data.name,
                        name: data.name,
                        // zoneId: data.zoneId,
                    }))}
                />

                {/* Floor Selection */}

                <Select
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            // backgroundColor: '#181818',
                            width: '90%', // Adjust the width as needed
                            // height: '10px',
                            height: '10%', // Adjust the height as needed minHeight: '50px',
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
                            marginTop: '-0.6em',
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
                    placeholder={floorData?.[0]?.name ? `Floor ${floorData?.[0]?.name}` : ''}
                    defaultInputValue={floorData?.[0]?.id ? `Floor ${floorData?.[0]?.id}` : ''}
                    onChange={handleFloorSelection}
                    className="react-select"
                    classNamePrefix="react-select"
                    options={floorData?.map((data: any) => ({
                        value: data.id,
                        label: data.name,
                        name: data.name,
                        // zoneId: data.zoneId,
                    }))}
                />
            </Card.Body>
        </Card>
    );
};

export default BuildingSelection;
