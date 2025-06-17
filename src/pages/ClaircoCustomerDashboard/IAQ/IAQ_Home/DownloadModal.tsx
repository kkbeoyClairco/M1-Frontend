import { HyperDatepicker } from 'components';
import { downloadExcel, getCsvdownload, getCsvdownload1 } from 'helpers/api/services/Clairco/customerSide/iaq';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { getDateOnly } from 'utils/timeFunctions';
import Select from 'react-select';
import { use } from 'i18next';
import { da } from 'date-fns/locale';
import { setBuildings } from 'redux/actions';
import { conforms, set, split } from 'lodash';
import { getUserDetailsFromSession, getUserIdFromSession, getUserInfoFromSession } from 'utils/storageFunctions';
import { customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
// import ExcelJS from 'exceljs';
// import XLSX from 'xlsx';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { getIAQColorARGB, getPM10ColorARGB, getPM25Color, getPM25ColorARGB } from 'utils/AQI/colorUtils';
type DownloadModalProps = {
    modalState?: boolean;
    modalControlFn?: any;
    name?: string;
    zoneId?: any;
    dataArray?: [];
    floorsData?: [];
};
const DownloadModal: React.FC<DownloadModalProps> = ({ modalState, modalControlFn, dataArray, floorsData }) => {
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 1)));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [interval, setInterval] = useState('hourly');
    //Arrays for Select tag
    const [customersList, setCustomersList] = useState<any>([]);
    const [buildingList, setBuildingList] = useState<any>([]);
    const [floorList, setFloorsList] = useState<any>([]);
    //Selected
    const [customerSelected, setCustomerSelected] = useState<any>([]);
    const [floorSelected, setFloorSelected] = useState<any>([]);
    const [buildingSelected, setBuildingSelected] = useState<any>([]);

    const { isAdmin } = getUserIdFromSession();
    const isAdminOrNot = isAdmin === 'Admin';

    const handleInterval = async (e: any) => {
        try {
            setInterval(e.value);
        } catch (error) {
            console.log(error);
        }
    };

    const getCustomersListForSelect = (data: any) => {
        try {
            const customerMap = new Map();
            customerMap.set('Others', {
                value: '',
                label: 'None',
            });

            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.customerId?._id)
                    customerMap.set(data?.[i]?.customerId._id, {
                        label: data?.[i]?.customerId?.name ?? '',
                        value: data?.[i]?.customerId._id ?? '',
                    });
            }
            const customerList = Array.from(customerMap.values());
            return customerList;
        } catch (error) {
            console.log(error);
        }
    };

    const getBuidinglListForSelect = (data: any) => {
        try {
            const buildingMap = new Map();
            buildingMap.set('Others', {
                value: '',
                label: 'None',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.buildingId?._id)
                    buildingMap.set(data?.[i]?.buildingId._id, {
                        label: data?.[i]?.buildingId?.name ?? '',
                        value: data?.[i]?.buildingId._id ?? '',
                    });
            }
            const buildingList = Array.from(buildingMap.values());
            return buildingList;
        } catch (error) {
            console.log(error);
        }
    };

    const getFloorsListForSelect = (data: any) => {
        try {
            const floorMap = new Map();
            floorMap.set('Others', {
                value: '',
                label: 'None',
            });
            for (let i = 0; i < data.length; i++) {
                if (data?.[i]?.floorId?._id)
                    floorMap.set(data?.[i]?.floorId?._id, {
                        value: data?.[i]?.floorId?._id,
                        label: data?.[i]?.floorId?.name,
                    });
            }
            const floorList = Array.from(floorMap.values());
            return floorList;
        } catch (error) {
            console.log(error);
        }
    };

    const filterFloorsBasedOnBuilding = (buildingId: string, data: any) => {
        try {
            let filterdFloors = data;
            if (buildingId) filterdFloors = data.filter((item: any) => item?.buildingId?._id === buildingId);
            const floorList = getFloorsListForSelect(filterdFloors);
            // setFloorList(floorList ?? []);
            return floorList;
        } catch (error) {
            console.log(error);
        }
    };
    const timeInterval = useMemo(
        () => [
            { value: 'hourly', label: 'Hourly' },
            { value: 'daily', label: 'Daily' },
        ],
        []
    );

    const handleFilterSelection = (e: any, state: string) => {
        try {
            // console.log('Selected', e);
            switch (state) {
                case 'customer':
                    // setBuildings(e)
                    setCustomerSelected(e);
                    // setBuildingSelected({});
                    filterBuildingsBasedOnCustomer(e.value ?? '', dataArray);
                    setBuildingSelected({});
                    setFloorSelected({});
                    break;
                case 'building':
                    setBuildingSelected(e);
                    // setCustomerSelected({});
                    setFloorSelected({});
                    break;
                case 'floor':
                    setFloorSelected(e);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    };
    //Fetch Data from Backend
    const handleSubmit = async () => {
        try {
            if (isLoading) {
                toast.warning('Loading... Please wait while we fetch the necessary data for you.');
                return;
            }
            setIsLoading(true);
            const userInfo = getUserDetailsFromSession();
            // console.log('User from session', userInfo);
            if (userInfo?.type !== 'Admin') customerSelected.value = userInfo?.customerId;
            const start_time = getDateOnly(startDate);
            const end_time = getDateOnly(endDate);
            let csvData: any = [];

            if (!customerSelected?.value && !buildingSelected?.value && !floorSelected?.value) {
                toast.warning('Please choose a customer to continue with the process.');
                // throw new Error('No selection');
                return;
            } else if (floorSelected?.value) {
                const floor_id = `${floorSelected?.value}`;
                csvData = await getCsvdownload1({ floor_id, start_time, end_time, interval });
            } else if (buildingSelected?.value) {
                const building_id = `${buildingSelected?.value}`;
                csvData = await getCsvdownload1({
                    building_id,
                    start_time,
                    end_time,
                    interval,
                });
            } else if (customerSelected?.value) {
                const customer_id = `${customerSelected?.value}`;
                csvData = await getCsvdownload1({
                    customer_id,
                    start_time,
                    end_time,
                    interval,
                });
            }
            const blob = new Blob([csvData?.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            const disposition = csvData?.headers?.['content-disposition'];
            let filename = '';
            // `${customerSelected?.label ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.xlsx`;
            if (disposition && disposition.includes('filename=')) {
                filename = disposition.split('filename=')[1].replace(/['"]/g, '').trim();
            }
            a.href = url;
            a.download = filename;
            //  `${customerSelected?.label ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            // document.body.removeChild(a);
            modalControlFn(false);
        } catch (error) {
            setIsLoading(false);

            console.log(error);
            setIsLoading(false);

            toast.error('Oops! Something went wrong. Please try again later. We appreciate your understanding!');
        }
        //  finally {
        //     setIsLoading(false);
        // }
    };

    const filterBuildingsBasedOnCustomer = (customerId: string, data: any) => {
        try {
            // console.log('customerId', customerId);
            let filterdBuildings = data.filter((item: any) => item?.customerId?._id === customerId);
            if (customerId) {
                const buildingList = getBuidinglListForSelect(filterdBuildings);
                setBuildingList(buildingList ?? []);
            } else setBuildingList(getBuidinglListForSelect(data));
            // console.log('Filtered Building List', Object.keys(buildingList ?? []).length);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (dataArray) {
            const customersArray = getCustomersListForSelect(dataArray);
            const buildingArray = getBuidinglListForSelect(dataArray);
            const floorArray = getFloorsListForSelect(dataArray);
            setCustomersList(customersArray);
            setBuildingList(buildingArray);
            setFloorsList(floorArray);
        }
    }, [dataArray]);

    useEffect(() => {
        if (buildingSelected) {
            const filteredFloors = filterFloorsBasedOnBuilding(buildingSelected.value, dataArray);
            // console.log('Filtered Floors', filteredFloors);
            setFloorsList(filteredFloors);
            setFloorSelected({});
        }
    }, [buildingSelected]);

    useEffect(() => {
        // console.log('Floor Selected', floorSelected);
    }, [floorSelected]);
    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="lg">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Download Data</h5>
                </Modal.Title>{' '}
            </Modal.Header>
            <Modal.Body>
                {isAdminOrNot ? (
                    <Row>
                        <Col xxl={3}>
                            {' '}
                            <label htmlFor="" style={{ padding: '1em' }}>
                                Customer
                            </label>
                        </Col>
                        <Col xxl={9}>
                            <Select
                                options={customersList}
                                onChange={(e) => handleFilterSelection(e, 'customer')}
                                placeholder={'Select Customer'}
                                value={customerSelected ? customerSelected : null}
                            />
                        </Col>
                    </Row>
                ) : null}
                <Row>
                    {/* <Col xxl={3}></Col> */}
                    <Col xxl={3} style={{ display: '', justifyContent: 'center', textAlign: 'start' }}>
                        <label htmlFor="" style={{ padding: '1em' }}>
                            Building
                        </label>
                    </Col>
                    <Col xxl={9}>
                        <Select
                            options={buildingList}
                            onChange={(e) => handleFilterSelection(e, 'building')}
                            placeholder={'Select Building'}
                            // defaultValue={buildingList?.[0]}
                            value={buildingSelected?.label ? buildingSelected : null}
                        />
                    </Col>
                </Row>
                <Row>
                    {/* <Col xxl={3}></Col> */}

                    <Col xxl={3} style={{ display: '', justifyContent: 'center', textAlign: 'start' }}>
                        <label htmlFor="" style={{ padding: '1em' }}>
                            Floor
                        </label>
                    </Col>
                    <Col xxl={9}>
                        <Select
                            options={floorList}
                            onChange={(e) => handleFilterSelection(e, 'floor')}
                            placeholder={'Select Floor'}
                            value={floorSelected?.label ? floorSelected : null}
                        />
                    </Col>
                </Row>
                <Row>
                    {' '}
                    {/* <Col xxl={3}></Col> */}
                    <Col xxl={3} style={{ display: '', justifyContent: 'center', textAlign: 'start' }}>
                        <label style={{ padding: '1em' }} htmlFor="">
                            From
                        </label>{' '}
                    </Col>
                    <Col xxl={9}>
                        <HyperDatepicker
                            value={startDate}
                            inputClass="form-control-light"
                            onChange={(date) => {
                                setStartDate(date);
                            }}
                        />
                    </Col>
                </Row>{' '}
                <Row>
                    {' '}
                    {/* <Col xxl={3}></Col> */}
                    <Col xxl={3} style={{ display: '', justifyContent: 'center', textAlign: 'start' }}>
                        <label htmlFor="" style={{ padding: '1em' }}>
                            To
                        </label>
                    </Col>{' '}
                    <Col xxl={9}>
                        <HyperDatepicker
                            value={endDate}
                            inputClass="form-control-light"
                            onChange={(date) => {
                                setEndDate(date);
                            }}
                        />{' '}
                    </Col>
                </Row>
                <Row>
                    {' '}
                    {/* <Col xxl={3}></Col> */}
                    <Col xxl={3} style={{ display: '', justifyContent: 'center', textAlign: 'start' }}>
                        {' '}
                        <label htmlFor="" style={{ padding: '1em' }}>
                            Time Interval
                        </label>
                    </Col>
                    <Col xxl={9}>
                        {' '}
                        <Select
                            options={timeInterval}
                            onChange={handleInterval}
                            placeholder={'Time Interval'}
                            defaultValue={timeInterval[0]}
                        />
                    </Col>{' '}
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Col xs={12} md={3} className="d-flex justify-content-end">
                    <Button
                        className="w-100"
                        onClick={handleSubmit}
                        style={{
                            marginRight: '0em',
                            margin: '0em',
                            marginLeft: '1em',
                            marginTop: '0em',
                            background: '#008675',
                            borderWidth: '0.1em',
                        }}>
                        {' '}
                        {isLoading && (
                            <span className="spinner-grow spinner-grow-sm mx-1" role="status" aria-hidden="true"></span>
                        )}
                        {isLoading ? 'Fetching...' : ' Download'}
                    </Button>
                </Col>

                <Col xs={12} md={3} className="d-flex justify-content-start">
                    <Button
                        className="btn btn-outline-dark w-100"
                        onClick={modalControlFn}
                        style={{
                            margin: '0em',
                            marginLeft: '1em',
                            marginTop: '0em',
                            background: 'grey',
                            borderWidth: '0.1em',
                        }}>
                        Close
                    </Button>
                </Col>
            </Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;
