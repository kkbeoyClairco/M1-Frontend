import React, { Fragment, useEffect, useState } from 'react';
import { default as FIleExploer1 } from 'components/ClaircoFIleExploer/FIleExploer';
import { building, customer, floor } from 'helpers/api/services/Clairco/customer';
import { device } from 'helpers/api/services/Clairco/device';

import BuildingModal from 'components/ClaircoModals/AddNew/BuildingModal';
import FloorModal from 'components/ClaircoModals/AddNew/FloorModal';
import DeviceCreation from 'components/ClaircoModals/AddNew/DeviceCreation';
import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';

const FIleExploer = () => {
    const [customers, setCustomers] = useState([]);
    // const [demoTest, setDemoTest] = useState('');
    const [infoToModal, setInfotoModal] = useState<{
        name: string;
        id: string;
        customerId?: string;
        buildingId?: string;
        zoneId?: string;
    }>({
        name: '',
        id: '',
    });
    const [modalState, setModalState] = useState<{ building: boolean; floor: boolean; device: boolean }>({
        building: false,
        floor: false,
        device: false,
    });
    const [data, setData] = useState([]);

    // Function that updates the Node. This works irrespective of the Level of the Node. ID is the unique identifier of the Node.
    const updateData = (node: any, id: string, inputData: any[]) => {
        return node.map((node: any) => {
            if (node.id === id) {
                const childrens = node.children?.filter((child: any) =>
                    inputData?.every((input: any) => input.id !== child.id)
                );
                return { ...node, children: [...(childrens ?? []), ...(inputData ?? {})] };
            } else if (node.children) {
                return { ...node, children: updateData(node.children, id, inputData) };
            }
            return node;
        });
    };

    // // API Call Functions
    // Fetch Building Data For a Customer Id
    const fetchBuildingData = async (customerId: string) => {
        try {
            const res = await building.byCustomerId({ customerId });
            // const res=await
            console.log('Data', res);
            const extractedData = res.data.map((data: any) => {
                return {
                    name: data.name,
                    isFolder: true,
                    type: 'Building',
                    id: data.id,
                    customerId: data.customerId ?? '',
                    isExpanded: false,
                };
            });
            setData((prev) => updateData(prev, customerId, extractedData));
            return;
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Building Data with buildingId and Customer Id
    const fetchFloorsData = async (customerId: string, buildingId: string) => {
        try {
            const res = await floor.byCustomerId(customerId, buildingId);
            const extractedData = res.data.map((data: any) => {
                return {
                    name: data.name,
                    isFolder: true,
                    type: 'Floor',
                    id: data.id,
                    customerId: data.customerId ?? '',
                    buildingId: data.buildingId ?? '',
                    isExpanded: false,
                };
            });
            setData((prev) => updateData(prev, buildingId, extractedData));

            // console.log('Floor res', res);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch Building Data For a Floor Id
    const fetchDevicesWithFloorId = async (floorId: string) => {
        try {
            // console.log('Floorid', floorId);
            // const res = await device.floorDevices(floorId);
            //  Sample dummy data. API is absent
            const sample = [
                {
                    _id: '66a0d87915f3cb65438d5636',
                    name: 'IAQ24007',
                    customerId: {
                        _id: '6698e2d415023def020a7c45',
                        name: 'Capitaland',
                        createdAt: '2024-07-18T09:39:32.229Z',
                        updatedAt: '2024-07-18T09:39:32.229Z',
                    },
                    buildingId: '66a08b435f335657c02ea9c3',
                    floorId: {
                        _id: '66a092c9fb72eeb7c358f408',
                        name: 'Reception North ',
                        customerId: '6698e2d415023def020a7c45',
                        buildingId: '66a08b435f335657c02ea9c3',
                        layout: null,
                        createdAt: '2024-07-24T05:36:09.105Z',
                        updatedAt: '2024-07-24T05:36:09.105Z',
                    },
                    createdAt: '2024-07-24T10:33:29.205Z',
                    updatedAt: '2024-07-24T10:33:29.205Z',
                    deviceType: '6690ef7fdeb2b486e92011aa',
                    data: {
                        id: '66a0d87915f3cb65438d5636',
                        name: 'IAQ24007',
                        indoor: null,
                        iaq: null,
                        occupancy_number: null,
                        epochTime: null,
                    },
                },
            ];

            const extractedData = sample.map((data: any) => {
                return {
                    name: data.name,
                    isFolder: false,
                    type: 'Device',
                    id: data.id,
                    customerId: data.customerId?._id ?? '',
                    buildingId: data.buildingId?._id ?? '',
                    isExpanded: false,
                };
            });
            setData((prev) => updateData(prev, floorId, extractedData));
            // console.log('Res', sample);
        } catch (error) {
            console.log(error);
        }
    };
    // API fetching Customers list- CALLED ON INIAL PAGE LOAD
    const fetchCustomers = async () => {
        const customers = await customer.all();
        const customersList = customers.data.map((data: any) => {
            return {
                name: data.name,
                isFolder: true,
                type: 'Customer',

                id: data.id,
                isExpanded: false,
                children: [],
            };
        });
        setCustomers(customersList);
        setData(customersList);
    };

    // API Router Function
    const handleAPICalls = (type: string, data: any) => {
        try {
            switch (type) {
                case 'Customer': // Fetchs building data for a Customer
                    fetchBuildingData(data?.id);
                    break;
                case 'Building': //Fetch Floor Data for a Building
                    fetchFloorsData(data?.customerId, data?.id);
                    break;
                case 'Floor': ///Fetch Device Data for a Floor
                    fetchDevicesWithFloorId(data?.id);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    // // Handler Functions - Addition to Backend and Node
    //  Function handling Bulding addition
    const handleBuildingAddition = async (customerId: string, data: any) => {
        try {
            data.customerId = data.id;
            delete data.id;
            const res = await building.create(data);

            const extractedData = {
                name: res?.data?.name ?? '',
                isFolder: true,
                type: 'Building',
                id: res.data.id ?? '',
                customerId: customerId,
                buildingId: res.data.id ?? '',
                isExpanded: false,
            };
            setData((prev) => updateData(prev, customerId, [extractedData]));
        } catch (error) {
            console.log(error);
        }
    };

    //  Function handling Floor addition
    const handleFloorAddition = async (buildingId: string, data: any) => {
        try {
            data.buildingId = buildingId;
            data.customerId = infoToModal.customerId ?? '';
            const res = await floor.create(data);
            if (res.status !== 201) return alert('Error creating floor');
            const extractedData = {
                name: res?.data?.name ?? '',
                isFolder: true,
                type: 'Floor',
                id: res.data.id ?? '',
                customerId: data?.customerId ?? '',
                buildingId: buildingId ?? '',
                floorId: res.data?.id,
                isExpanded: false,
            };
            setData((prev) => updateData(prev, buildingId, [extractedData]));
        } catch (error) {
            console.log(error);
        }
    };

    //  Function handling Device addition
    const handleDeviceCreation = async (type: string, payload: any) => {
        try {
            payload.customerId = infoToModal.customerId;
            payload.buildingId = infoToModal.buildingId;
            const res = await device.create(payload);
            //NEEDS TO BE UPDATED WITH NODE ADDITION TO THE TREE
        } catch (error) {
            console.log(error);
        }
    };

    // Handlers Router -State Changes and Routes to appropriate Function based on the type of Addition
    const handleAddition = (data: any, type: string) => {
        try {
            setInfotoModal({ name: data.name ?? '', id: data?.id ?? '' });
            switch (type) {
                case 'Customer': // Building Addtion
                    setModalState({ building: true, floor: false, device: false });
                    break;
                case 'Building': // Floor Addtion
                    setModalState({ building: false, floor: true, device: false });
                    setInfotoModal((prev) => ({ ...prev, customerId: data.customerId }));
                    break;
                case 'Floor': // Device Addtion
                    setModalState({ building: false, floor: false, device: true });
                    setInfotoModal((prev) => ({
                        ...prev,
                        customerId: data.customerId,
                        buildingId: data.buildingId,
                        floorId: data?.id ?? '',
                    }));
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Function that Orchastrates the Building/Floor/Device Addition
    const handleSubimit = (e: any, type: string) => {
        e.preventDefault();
        e.stopPropagation();
        const formData = new FormData(e.target);
        const payload: any = {};
        payload.id = infoToModal.id;
        formData.forEach((value, key) => {
            payload[key] = value;
        });

        try {
            switch (type) {
                case 'Customer':
                    // handleBuildingAddition(payload.id, payload);
                    break;
                case 'Building':
                    handleBuildingAddition(payload.id, payload);
                    break;
                case 'Floor':
                    handleFloorAddition(payload.id, payload);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <Fragment>
            {modalState.building && (
                <BuildingModal
                    show={modalState.building}
                    data={infoToModal}
                    onClose={() => setModalState((prev: any) => ({ ...prev, building: !prev.building }))}
                    onSubmit={handleSubimit}
                />
            )}
            {modalState.floor && (
                <FloorModal
                    show={modalState.floor}
                    data={infoToModal}
                    onClose={() => setModalState((prev: any) => ({ ...prev, floor: !prev.floor }))}
                    onSubmit={handleSubimit}
                    buildinglist={undefined}
                />
            )}
            {modalState.device && (
                <DeviceCreation
                    show={modalState.device}
                    data={infoToModal}
                    onSubmit={handleDeviceCreation}
                    onClose={() => setModalState((prev: any) => ({ ...prev, device: !prev.device }))}
                />
            )}
            <div style={{ paddingLeft: '30px', padding: '20px', marginTop: '10px' }}>
                <FIleExploer1 dataInput={data} handleAPICalls={handleAPICalls} handleAddition={handleAddition} />
            </div>{' '}
        </Fragment>
    );
};

export default FIleExploer;
