import React, { useEffect, useState, useMemo, useContext } from 'react';
import CustomerModal from '../modals/CustomerModal/CustomerModal';
import BuildingModal from '../modals/BuildingModal/BuildingModal';
import FloorModal from '../modals/FloorModal/FloorModal';
import ZoneModal from '../modals/ZoneModal/ZoneModal';
import useRedux from 'hooks/useRedux';
import { formatDateToLocalTime } from 'helpers/utils';
import { customer, building, floor, zone } from 'helpers/api/services/Clairco/customer';
import { Section } from '../utils/Section';
import { columnConfig } from '../utils/columns';
import { getAllBuildings, getDeviceTypes, getCustomers, setCustomers } from 'redux/actions';

import {
    updateCustomer,
    updateBuildings,
    updateFloors,
    updateZones,
    setFloors as setFloorInStore,
    setZones as setZoneInStore,
} from 'redux/actions';
import { ToastContext } from 'context/ToastContext';
import { convertUnixToIST } from 'utils/timeFunctions';
type ModalState = {
    customer: boolean;
    building: boolean;
    floor: boolean;
    zone: boolean;
};

type Customer = {
    customerId: string;
    name: string;
    createdAt: string;
    action: any;
};

type Building = {
    customerName: string;
    [key: string]: any;
};

type Floor = {
    name: string;
    createdAt: string;
    customer: string;
    building: string;
};

type Zone = {
    createdAt: string;
    customer: string;
    building: string;
    floor: any;
};

const CustomerSettings1 = () => {
    const { dispatch, appSelector } = useRedux();
    const { customers, buildings, customerMap, buildingMap } = appSelector((state) => ({
        customers: state?.Customer?.customers || [],
        buildings: state?.Building?.buildings || [],
        customerMap: state?.Customer?.customerMap,
        buildingMap: state?.Building?.buildingMap,
    }));
    const [customerList, setCustomers1] = useState<Customer[]>([]);
    const [buildingList, setBuildings] = useState<Building[]>([]);
    const [floorList, setFloors] = useState<Floor[]>([]);
    const [zoneList, setZones] = useState<Zone[]>([]);
    const [showAddModal, setShowAddModal] = useState<ModalState>({
        customer: false,
        building: false,
        floor: false,
        zone: false,
    });
    const toast = useContext(ToastContext);

    const getFloorAndZone = async () => {
        try {
            const floorRes = await floor.all();
            const floors =
                floorRes?.data?.map((floor: any) => ({
                    ...floor,
                    createdAt: formatDateToLocalTime(floor?.createdAt),
                    customer: customerMap.get(floor?.customerId),
                    building: buildingMap.get(floor?.buildingId),
                })) || [];
            setFloors(floors);

            const zoneRes = await zone?.all();
            const zones =
                zoneRes?.data?.zones.map((zone: any) => ({
                    ...zone,
                    createdAt: formatDateToLocalTime(zone?.createdAt),
                    customer: customerMap.get(zone?.customerId),
                    building: buildingMap.get(zone?.buildingId),
                    floor: floors.find((floor: any) => floor?.id === zone?.floorId)?.name ?? '',
                })) || [];
            setZones(zones);
            dispatch(setFloorInStore(floorRes?.data));
            dispatch(setZoneInStore(zoneRes?.data?.zones));
        } catch (error: any) {
            // toast?.showToast('Error occurred while fetching Floors and Zones', error);
            // toast?.showToast(error,'error');
            console.log(error);
        }
    };

    const toggleModal = (type: keyof ModalState) => {
        setShowAddModal((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleSubmit = async (event: any, type: string) => {
        event.preventDefault();
        event.stopPropagation();
        const formData = new FormData(event.target);
        const payload: any = {};
        formData.forEach((value, key) => {
            payload[key] = value;
        });
        // console.log('Forms', payload);

        let newData: any;
        switch (type) {
            case 'customer':
                try {
                    newData = await customer.create(payload);
                    if (newData) {
                        dispatch(updateCustomer({ ...newData.data }));
                        const newCustomer = {
                            ...newData.data,
                            customerId: newData.data.id,
                            createdAt: formatDateToLocalTime(newData.data.createdAt),
                        };
                        setCustomers1((prev) => [...prev, newCustomer]);
                        toast?.showToast('Customer created successfully', 'success');
                    }
                } catch (error) {
                    toast?.showToast('some error occure while creating customer', 'error');
                }
                break;
            case 'building':
                try {
                    newData = await building.create(payload);
                    if (newData) {
                        dispatch(updateBuildings({ ...newData.data }));
                        const newBuilding = {
                            ...newData.data,
                            buildingId: newData.data.id,
                            customerName: customerMap.get(newData.data.customerId),
                            // createdAt: convertUnixToIST(newData.data.createdAt),
                        };
                        setBuildings((prev) => [...prev, newBuilding]);
                        toast?.showToast('Building created successfully', 'success');
                    }
                } catch (error) {
                    toast?.showToast('some error occure while creating building', 'error');
                }
                break;
            case 'floor':
                try {
                    newData = await floor.create(payload);
                    if (newData) {
                        dispatch(updateFloors({ ...newData.data }));
                        const newFloor = {
                            ...newData.data,
                            createdAt: formatDateToLocalTime(newData.data.createdAt),
                            customer: customerMap.get(newData.data.customerId),
                            building: buildingMap.get(newData.data.buildingId),
                        };
                        setFloors((prev) => [...prev, newFloor]);
                        toast?.showToast('Floor created successfully', 'success');
                    }
                } catch (error) {
                    toast?.showToast('some error occure while creating floor', 'error');
                }

                break;
            case 'zone':
                try {
                    newData = await zone.create(payload);
                    if (newData) {
                        dispatch(updateZones({ ...newData.data }));
                        const newZone = {
                            ...newData.data.createdZone,
                            createdAt: formatDateToLocalTime(newData.data.createdZone.createdAt),
                            customer: customerMap.get(newData.data.createdZone.customerId),
                            building: buildingMap.get(newData.data.createdZone.buildingId),
                            floor: floorList.find((floor: any) => floor.Id === newData.data.createdZone.floorId)?.name,
                        };
                        setZones((prev) => [...prev, newZone]);
                        toast?.showToast('Zone created successfully', 'success');
                    }
                } catch (error) {
                    toast?.showToast('some error occure while creating zone', 'error');
                }
                break;
        }
    };
    const renderSectionComponents = useMemo(() => {
        return [
            {
                title: 'Customers',
                onAddClick: () => toggleModal('customer'),
                data: customerList,
                columns: columnConfig.customer,
                modal: { Component: CustomerModal },
                modalProps: {
                    show: showAddModal.customer,
                    onClose: () => toggleModal('customer'),
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event, 'customer'),
                },
            },
            {
                title: 'Buildings',
                onAddClick: () => toggleModal('building'),
                data: buildingList,
                columns: columnConfig.building,
                modal: { Component: BuildingModal },
                modalProps: {
                    show: showAddModal.building,
                    onClose: () => toggleModal('building'),
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event, 'building'),
                    customerlist: customerList,
                },
            },
            {
                title: 'Floors',
                onAddClick: () => toggleModal('floor'),
                data: floorList,
                columns: columnConfig.floor,
                modal: { Component: FloorModal },
                modalProps: {
                    show: showAddModal.floor,
                    onClose: () => toggleModal('floor'),
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event, 'floor'),
                    customerlist: customerList,
                    buildinglist: buildingList,
                },
            },
            {
                title: 'Zones',
                onAddClick: () => toggleModal('zone'),
                data: zoneList,
                columns: columnConfig.zone,
                modal: { Component: ZoneModal },
                modalProps: {
                    show: showAddModal.zone,
                    onClose: () => toggleModal('zone'),
                    onSubmit: (event: React.FormEvent<HTMLFormElement>) => handleSubmit(event, 'zone'),
                    floorlist: floorList,
                    customerlist: customerList,
                    buildinglist: buildingList,
                },
            },
        ];
    }, [customerList, buildingList, floorList, toggleModal]);
    const formatCustomers = (customers: any) =>
        customers?.map((customer: any) => ({
            customerId: customer?.id,
            name: customer?.name,
            createdAt: formatDateToLocalTime(customer?.createdAt),
            action: customer?.action,
        }));

    const formatBuildings = (buildings: any) =>
        buildings?.map((building: any) => ({
            ...building,
            buildingId: building.id,
            customerName: customerMap.get(building?.customerId),
            createdAt: convertUnixToIST(building?.createdAt),
        }));
    useEffect(() => {
        customer.all().then((cus: any) => {
            if (cus?.data) {
                const customers = formatCustomers(cus?.data);
                setCustomers1(customers);
                dispatch(setCustomers(customers));
            }
        });
    }, []);
    useEffect(() => {
        building.all().then((buildings: any) => {
            // console.log('Buildings', buildings);
            setBuildings(formatBuildings(buildings?.data));
        });
        getFloorAndZone();
        dispatch(getAllBuildings());

        dispatch(getDeviceTypes());
    }, []);

    return (
        <>
            {renderSectionComponents.map((section, index) => (
                <Section key={index} {...section} />
            ))}
        </>
    );
};

export default CustomerSettings1;
