import { deviceTypeId } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import { data } from 'pages/Sensiable-AdminDashboard/data';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';

export const DeviceSelectionComponent = ({ defaultSelection, customerId, floorId, functionToExecute }: any) => {
    const [tableData, setTableData] = useState([
        { label: 'Clairco AHU 1', value: 'Clairco AHU 1' },
        { label: 'Clairco AHU 2', value: 'Clairco AHU 2' },

        { label: 'Clairco AHU 3', value: 'Clairco AHU 3' },

        { label: 'Clairco AHU 4', value: 'Clairco AHU 4' },
    ]);

    const handleDeviceSelection = async (e: any) => {
        try {
            // console.log('device selection:', e);
            functionToExecute(e);
        } catch (error) {
            console.log(error);
        }
    };

    // const getAHUData = async () => {
    //     try {
    //         const deviceId = deviceTypeId['AHU'];
    //         if (!customerId || !floorId) return;
    //         const response = await fetchDevicesList(deviceId, customerId, floorId);
    //         // console.log('Select', response);
    //         const dataToPass = response?.data?.map((doc: any) => {
    //             return {
    //                 label: doc?.name,
    //                 value: doc?._id,
    //                 sensorName: doc?.switchDeviceId?.name,
    //                 name: doc?.name,
    //                 btuName: doc?.btuDeviceId?.name,
    //                 customerId,
    //                 floorId,
    //                 buildingName: doc?.buildingId?.name,
    //                 floorName: doc?.floorId?.name,
    //                 location: doc?.locationId?.name,
    //             };
    //         });
    //         setTableData(dataToPass || []);
    //     } catch (error) {
    //         console.log(error);
    //         setTableData([]);
    //     }
    // };
    // useEffect(() => {
    //     getAHUData();
    // }, [customerId, floorId]);
    return (
        <>
            <div style={{ marginTop: '20px' }}>
                {' '}
                <Select
                    name="ahuList"
                    placeholder={defaultSelection}
                    // defaultInputValue={tableData?.[0]}
                    value={tableData[0]}
                    onChange={(e) => handleDeviceSelection(e)}
                    className="react-select"
                    classNamePrefix="react-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            width: '550px', // Adjust the width as needed
                            marginLeft: '25px',
                        }),
                        menu: (provided) => ({
                            ...provided,
                            width: '550px', // Adjust the width of the dropdown menu as needed marginLeft: '135px',
                        }),
                    }}
                    options={tableData}></Select>
            </div>
        </>
    );
};
