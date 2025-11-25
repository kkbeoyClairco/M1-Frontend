import { HyperDatepicker } from 'components';
import { getCsvdownload, getCsvdownload1 } from 'helpers/api/services/Clairco/customerSide/iaq';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { getDateOnly } from 'utils/timeFunctions';
import Select from 'react-select';
// import { use } from 'i18next';
// import { da } from 'date-fns/locale';
// import { setBuildings } from 'redux/actions';
// import { set, split } from 'lodash';
import { getUserIdFromSession } from 'utils/storageFunctions';
// import { customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';

// import XLSX from 'xlsx';
import * as XLSX from 'xlsx';
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
            const start_time = getDateOnly(startDate);
            const end_time = getDateOnly(endDate);
            let csvData: any = [];
            if (floorSelected?.value) {
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

            if (typeof csvData?.data !== 'string' || csvData?.data?.trim() === '') {
                window.alert('No data found for the selected date range.');
                return;
            }

            const workbook = XLSX.utils.book_new();
            // const sheetsMap: any = {};
            const buildingName = csvData?.data?.split('\n')?.[1] ?? '';

            const csvToArray = (strData: any) => {
                const rows = strData.split('\n');
                return rows.map((row: any) => row.split(','));
            };
            const sections = csvData?.data?.split(/(?=Customer: )/);
            sections.forEach((section: any, index: number) => {
                const sheetData = csvToArray(section);

                const sheet = XLSX.utils.aoa_to_sheet(sheetData);
                XLSX.utils.book_append_sheet(workbook, sheet, `Sheet${index + 1}`);
            });

            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            // Create Blob and download
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${buildingName ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            modalControlFn(false);
            // const splitData = csvData?.data?.split('Customer');
            // for (let i = 0; i < splitData.length; i++) {
            //     if (splitData[i]) sheetsMap[i] = splitData[i];
            // }
            // for (let i = 0; i < Object.keys(sheetsMap).length; i++) {
            //     XLSX.utils.book_append_sheet(workbook, sheetsMap[i], `Sheet${i}`);
            // }
            // console.log('Split data', workbook);
            // for()
            // const blob = new Blob([csvData.data], { type: 'text/csv' });
            // const url = window.URL.createObjectURL(blob);
            // console.log('Blob', url);

            // const a = document.createElement('a');
            // a.style.display = 'none';
            // a.href = url;
            // a.download = `${buildingName ?? 'IAQ_Data'}_${start_time}-${end_time}_${interval}.csv`;

            // document.body.appendChild(a);
            // a.click();
            // window.URL.revokeObjectURL(url);
            // document.body.removeChild(a);
        } catch (error) {
            console.log(error);
        }
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
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {' '}
                {/* <Row style={{ padding: '2em' }}> */}
                <form style={{ padding: '1em' }}>
                    {isAdminOrNot ? (
                        <Row>
                            {/* <Col xxl={3}></Col> */}

                            <Col xxl={3}>
                                {' '}
                                <label htmlFor="" style={{ padding: '1em' }}>
                                    Customer{' '}
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
                            {/* <select
                                    style={{ marginLeft: '1em', borderRadius: '0.5em', height: '2em' }}
                                    name="interval"
                                    id="interval"
                                    onChange={handleInterval}>
                                    <option value="hourly">hourly</option>
                                    <option value="daily">daily</option>
                                </select> */}
                        </Col>{' '}
                    </Row>
                    <Row style={{ marginTop: '1em' }}>
                        <Col sm={8}></Col>
                        <Col sm={4} style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            {' '}
                            <Button
                                onClick={handleSubmit}
                                style={{
                                    marginRight: '0em',
                                    margin: '0em',
                                    marginLeft: '1em',
                                    marginTop: '0em',
                                    background: '#008675',
                                    borderWidth: '0.1em',
                                }}>
                                Download
                            </Button>
                            <Button
                                className="btn btn-outline-dark"
                                onClick={modalControlFn}
                                // style={{
                                //     margin: '20px',
                                //     marginTop: '0px',
                                //     borderWidth: '0px',
                                //     background: 'grey',
                                //     // color: 'black',
                                // }}
                                style={{
                                    margin: '0em',
                                    marginLeft: '1em',
                                    marginTop: '0em',
                                    background: 'grey',
                                    borderWidth: '0.1em',
                                }}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </form>
                {/* </Row>{' '} */}
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
        </Modal>
    );
};

export default DownloadModal;
