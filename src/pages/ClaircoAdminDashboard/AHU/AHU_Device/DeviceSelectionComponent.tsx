import { deviceTypeId, deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import { fetchDevicesList } from 'helpers/api/services/Clairco/customerSide/LandingPage';
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';

export const DeviceSelectionComponent = ({ defaultSelection, customerId, floorId, functionToExecute }: any) => {
    const [tableData, setTableData] = useState([]);

    const handleDeviceSelection = async (e: any) => {
        try {
            functionToExecute(e);
        } catch (error) {
            console.log(error);
        }
    };

    const getAHUData = useCallback(async () => {
        try {
            const deviceId = deviceTypesConstant['AHU'];
            const response = await fetchDevicesList(deviceId);
            const dataToPass = response?.data?.map((doc: any) => {
                return {
                    label: doc?.name,
                    value: doc?.id,
                    sensorName: doc?.switchDeviceId?.name,
                    name: doc?.name,
                    btuName: doc?.btuDeviceId?.name,
                    customerId: customerId?.id,
                    floorId: floorId?.id,
                    buildingName: doc?.buildingId?.name,
                    floorName: doc?.floorId?.name,
                    location: doc?.buildingId?.location,
                };
            });
            setTableData(dataToPass || []);
        } catch (error) {
            console.log(error);
            setTableData([]);
        }
    }, []);
    useEffect(() => {
        getAHUData();
    }, []);
    return (
        <>
            <div style={{ marginTop: '20px' }}>
                {' '}
                <Select
                    name="ahuList"
                    placeholder={defaultSelection}
                    defaultInputValue={tableData?.[0]}
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
