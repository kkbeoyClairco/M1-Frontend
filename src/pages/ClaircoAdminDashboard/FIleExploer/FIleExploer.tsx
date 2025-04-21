import React, { Fragment, useEffect, useState } from 'react';
import { default as FIleExploer1 } from 'components/ClaircoFIleExploer/FIleExploer';
import { building, customer, floor } from 'helpers/api/services/Clairco/customer';
import { device } from 'helpers/api/services/Clairco/device';

import BuildingModal from 'components/ClaircoModals/AddNew/BuildingModal';
import FloorModal from 'components/ClaircoModals/AddNew/FloorModal';
import DeviceCreation from 'components/ClaircoModals/AddNew/DeviceCreation';
import { controlVrfVrcStateAPI } from 'helpers/api/services/Clairco/customerSide/vrf-vrf';
import CustomerModal from 'components/ClaircoModals/AddNew/CustomerModal';
import { Col, Row } from 'react-bootstrap';
import Button from 'components/ClaircoButtons/Button1';
import { ModalButton } from 'components/ClaircoButtons/ModalButton';
import { toast } from 'sonner';
import FIleExploerVirtualized from 'components/ClaircoFIleExploer/FIleExploerVirtualized';
import { sample } from './text';
import { getDevices } from 'helpers/api/services/Clairco/adminSide/devices';
import { deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
import DeviceCreation2 from 'components/ClaircoModals/AddNew/DeviceCreationComponents/DeviceCreation2';
interface Customer {
    id: string;
    name: string;
    isFolder: boolean;
    type: string;
    isExpanded: boolean;
    children: Customer[]; // Assuming children follow the same structure
}

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
    const [modalState, setModalState] = useState<{
        building: boolean;
        floor: boolean;
        device: boolean;
        customer: boolean;
    }>({
        building: false,
        floor: false,
        device: false,
        customer: false,
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

    // const updateDevicesData = (node: any, id: string, inputData: any[]) => {
    //     return node.map((node: any) => {
    //         if (node.id === id) {
    //             const childrens = node.children?.filter((child: any) =>
    //                 inputData?.every((input: any) => input.id !== child.id)
    //             );
    //             return { ...node, children: [...(childrens ?? []), ...(inputData ?? {})] };
    //         } else if (node.children) {
    //             return { ...node, children: updateData(node.children, id, inputData) };
    //         }
    //         return node;
    //     });
    // };

    // // API Call Functions
    // Fetch Building Data For a Customer Id
    const fetchBuildingData = async (customerId: string) => {
        try {
            const res = await building.byCustomerId({ customerId });
            // const res=await
            // console.log('Data', res);
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

    //Add DeviceType as CHILDRENS
    const fetchFloorsData = async (customerId: string, buildingId: string) => {
        try {
            const res = await floor.byCustomerId(customerId, buildingId);

            const extractedData = res.data.map((data: any) => {
                // Define the children dynamically based on the array in res.data
                const children = [];
                //DUMMY data
                children.push({
                    name: 'AHU',
                    id: 17447108687003,
                    type: 'DeviceType',
                    isFolder: true,
                    floorId: data.id,
                    customerId: data.customerId ?? '',
                    buildingId: data.buildingId ?? '',
                });
                if (data.deviceTypes?.includes('AHU')) {
                    children.push({
                        name: 'AHU',
                        id: 17447108687003,
                        type: 'DeviceType',
                        isFolder: true,
                        floorId: data.id,
                        customerId: data.customerId ?? '',
                        buildingId: data.buildingId ?? '',
                    });
                }

                if (data.deviceTypes?.includes('IAQ')) {
                    children.push({
                        name: 'IAQ',
                        id: 17447108687002,
                        type: 'DeviceType',
                        isFolder: true,
                        floorId: data.id,
                        customerId: data.customerId ?? '',
                        buildingId: data.buildingId ?? '',
                    });
                }

                if (data.deviceTypes?.includes('OCCUPANCY')) {
                    children.push({
                        name: 'OCCUPANCY',
                        id: 17447108687001,
                        type: 'DeviceType',
                        isFolder: true,
                        floorId: data.id,
                        customerId: data.customerId ?? '',
                        buildingId: data.buildingId ?? '',
                    });
                }

                return {
                    name: data.name,
                    isFolder: true,
                    type: 'Floor',
                    id: data.id,
                    customerId: data.customerId ?? '',
                    buildingId: data.buildingId ?? '',
                    isExpanded: false,
                    children,
                };
            });

            setData((prev) => updateData(prev, buildingId, extractedData));

            // console.log('Floor res', res);
        } catch (error) {
            console.log(error);
        }
    };

    const getIAQDevices = async (floorId: string) => {
        try {
            const deviceType = deviceTypesConstant.IAQ;
            const res = await getDevices(deviceType, floorId);
            const extractedData = res?.data?.map((data: any) => {
                return {
                    name: data?.name ?? '',
                    isFolder: false,
                    type: 'Device',
                    id: data.id,
                    customerId: data?.customerId?.id ?? '',
                    buildingId: data?.buildingId?.id ?? '',
                    isExpanded: true,
                };
            });
            return extractedData;
        } catch (error) {
            return [];
        }
    };
    const getAHUDevices = async (floorId: string) => {
        try {
            const deviceType = deviceTypesConstant.AHU;
            const res = await getDevices(deviceType, floorId);
            const extractedData = res?.data?.map((data: any) => {
                return {
                    name: data?.name ?? '',
                    isFolder: false,
                    type: 'Device',
                    id: data.id,
                    customerId: data?.customerId?.id ?? '',
                    buildingId: data?.buildingId?.id ?? '',
                    isExpanded: true,
                };
            });
            return extractedData;
        } catch (error) {
            return [];
        }
    };
    const getOccupancyDevices = async (floorId: string) => {
        try {
            const deviceType = deviceTypesConstant.OCCUPANCY;
            const res = await getDevices(deviceType, floorId);
            const extractedData = res?.data?.map((data: any) => {
                return {
                    name: data?.name ?? '',
                    isFolder: false,
                    type: 'Device',
                    id: data.id,
                    customerId: data?.customerId?.id ?? '',
                    buildingId: data?.buildingId?.id ?? '',
                    isExpanded: true,
                };
            });
            return extractedData;
        } catch (error) {
            return [];
        }
    };
    // Fetch Building Data For a Floor Id
    const fetchDevicesWithFloorId = async (floorId: string, id: string, type: string) => {
        try {
            let data: any = [];
            // console.log('Type', type);
            if (type === 'IAQ') {
                data = await getIAQDevices(floorId);
            }
            if (type === 'AHU') {
                data = await getAHUDevices(floorId);
                console.log('AHU API CALL', data);
            }
            if (type === 'OCCUPANCY') {
                data = await getOccupancyDevices(floorId);
                console.log('OCCUPANY API Call', data);
            }
            // if(type==="IAQ") console.log("IAQ API Call")

            setData((prev) => updateData(prev, id, data));
        } catch (error) {
            console.log(error);
        }
    };
    // const fetchDeviceTypesWithFloorIdAndDeviceType = async () => {
    //     try {
    //         const extractedData = sample.map((data: any) => {
    //             return {
    //                 name: data.name,
    //                 isFolder: false,
    //                 type: 'Device',
    //                 id: data.id,
    //                 customerId: data.customerId?._id ?? '',
    //                 buildingId: data.buildingId?._id ?? '',
    //                 isExpanded: false,
    //             };
    //         });
    //         setData((prev) => updateData(prev, floorId, extractedData));
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };
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
        // console.log('Device TYpe:', type, data);
        try {
            switch (type) {
                case 'Customer': // Fetchs building data for a Customer
                    fetchBuildingData(data?.id);
                    break;
                case 'Building': //Fetch Floor Data for a Building
                    fetchFloorsData(data?.customerId, data?.id);
                    break;
                case 'Floor': ///Fetch Device Data for a Floor
                    // fetchDevicesWithFloorId(data?.id);
                    break;
                case 'DeviceType': ///Fetch Device Data for a Floor
                    fetchDevicesWithFloorId(data?.floorId, data?.id, data.name ?? '');
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

            //API ERROR ALERT
            const res = await building.createNew(customerId, data);

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
            // console.log('Device Addition', type, payload);
            // payload.customerId = infoToModal.customerId;
            // payload.buildingId = infoToModal.buildingId;
            const res = await device.create(payload, 'Occupancy');
            console.log('DEvice creation api res:', res);
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
                case 'Cus': // Customer Addtion
                    setModalState({ building: false, floor: false, device: false, customer: true });
                    break;
                case 'Customer': // Building Addtion
                    setModalState({ building: true, floor: false, device: false, customer: false });
                    break;
                case 'Building': // Floor Addtion
                    setModalState({ building: false, floor: true, device: false, customer: false });
                    setInfotoModal((prev) => ({ ...prev, customerId: data.customerId }));
                    break;
                case 'Floor': // Device Addtion
                    console.log('Device data', data);
                    setModalState({ building: false, floor: false, device: true, customer: false });
                    setInfotoModal((prev) => ({
                        ...prev,
                        customerId: data.customerId,

                        buildingId: data.buildingId,
                        floorId: data?.id ?? '',
                    }));
                    break;
                case 'DeviceType':
                    toast.warning(
                        'This functionality has not been implemented yet. Please proceed with device addition and select the device type from there.'
                    );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddNewCustomer = async (formData: any) => {
        try {
            const res = await customer.create(formData);
            if (res.status === 201) {
                toast.success('Customer has been created');
                const newCustomer: Customer = {
                    id: res?.data?.id ?? '',
                    name: res?.data?.name ?? '',
                    isFolder: true,
                    type: 'Customer',
                    isExpanded: false,
                    children: [],
                };
                // setData((prev:) => [...prev, newCustomer]);
            } else throw new Error('Customer Creation Failed');
        } catch (error) {
            toast.error('Customer has not been created');
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
                    // console.log('Customer ', formData);
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
            {modalState.customer && (
                <CustomerModal
                    show={modalState.customer}
                    onClose={() => setModalState((prev: any) => ({ ...prev, customer: !prev.customer }))}
                    handleAddition={handleAddNewCustomer}
                />
            )}
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
                <DeviceCreation2
                    show={modalState.device}
                    data={infoToModal}
                    onSubmit={handleDeviceCreation}
                    onClose={() => setModalState((prev: any) => ({ ...prev, device: !prev.device }))}
                />
            )}
            <Row className="d-flex justify-content-end">
                <Col xs={12} lg={4} className="d-flex justify-content-end mt-2">
                    <ModalButton onClick={async () => handleAddition({}, 'Cus')} text="Add new Customer" />
                </Col>
            </Row>
            <div style={{ paddingLeft: '30px', padding: '20px', marginTop: '0px' }}>
                <FIleExploer1 dataInput={data} handleAPICalls={handleAPICalls} handleAddition={handleAddition} />
                {/* Virtualized WIP Component */}
                {/* <FIleExploerVirtualized
                    dataInput={data}
                    handleAPICalls={handleAPICalls}
                    handleAddition={handleAddition}
                /> */}
            </div>
        </Fragment>
    );
};

export default FIleExploer;
