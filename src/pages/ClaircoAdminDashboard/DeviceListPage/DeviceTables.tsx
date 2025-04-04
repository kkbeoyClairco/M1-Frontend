import { Row, Col, Card } from 'react-bootstrap';
import { CellFormatter, Table } from 'components'; // Assuming 'Table' is a valid component
import { DeviseTables } from '../BuildingsPage/types';
import { Column } from 'react-table';
import { formatDateToLocalTime } from '../../../helpers/utils';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useRedux } from 'hooks';
import { getAllBuildings, getDeviceTypes } from 'redux/actions';
import { useSSR } from 'react-i18next';
import { getDevices, getDeviceTypeList } from 'helpers/api/services/Clairco/adminSide/devices';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
import { selectTagType } from 'types/selectTagType';
import { setLabels } from 'react-chartjs-2/dist/utils';
import TableSkelton from 'components/ClaircoCustomer/Skeltons/TableSkelton';
import { columnConfig } from './columnConfig';
import { deviceTypesConstant } from 'appConstants/DeviceMappingConstants';
type NewType = CellFormatter<DeviseTables>;

type DeviceTablesProps = {
    // deviceList: any;
    customerId?: string;
    deviceTypeId?: string;
    floorId?: string;
};

export const DeviceTables: React.FC<DeviceTablesProps> = ({ deviceTypeId, floorId }) => {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [deviceTypeList, setDeviceTypeList] = useState<{ label: string; value: string }[]>([]);
    const [selectedDeviceType, setSelectedDeviceType] = useState<selectTagType>({ label: '', value: '' });
    const navigate = useNavigate();
    const { dispatch, appSelector } = useRedux();

    const handleNavigation = (data: any) => {
        console.log(data);
        const { name = '', deviceType = '' } = data;
        console.log('deviceType', deviceType);

        switch (deviceType) {
            case 'IAQ':
                // navigate(`/admin/pages/iaq/device?name=${name}&deviceType=6690ef7fdeb2b486e92011aa`);
                break;
            case 'AHU':
                break;
            case 'VRV':
                break;
            case '66d015995b0bbb913bf9936d':
        }
    };

    // const columns: ReadonlyArray<Column> = [
    //     { Header: 'Device', accessor: 'name', defaultCanSort: false },
    //     // { Header: 'Type', accessor: 'type', defaultCanSort: false },
    //     { Header: 'Location', accessor: 'buildingId.location', defaultCanSort: false },
    //     { Header: 'Building', accessor: 'buildingId.name', defaultCanSort: false },
    //     { Header: 'Floor', accessor: 'floorId.name', defaultCanSort: false },

    //     {
    //         Header: 'Last Updated',
    //         accessor: 'updatedAt',
    //         defaultCanSort: false,
    //         Cell: ({ value }) => formatDateToLocalTime(value),
    //     },
    //     { Header: 'Status', accessor: 'status', defaultCanSort: false },
    //     {
    //         Header: 'Action',
    //         accessor: 'action',
    //         defaultCanSort: false,
    //         Cell: ActionColumn,
    //     },
    // ];
    const sizePerPageList = [
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: '50',
            value: 50,
        },
    ];
    const fetchDeviceTypes = useCallback(async () => {
        try {
            // const res = await getDeviceTypeList();
            const deviceTypes = deviceTypesConstant;
            const deviceTypesToSelect = Object.values(deviceTypes)?.map((value: string) => ({
                label: value,
                value: value,
            }));
            console.log('Device Tpes', deviceTypesToSelect);
            setDeviceTypeList(deviceTypesToSelect);
            const defaultSelection = { label: deviceTypesToSelect?.[0].label, value: deviceTypesToSelect?.[0].value };
            //  deviceTypesToSelect;
            if (!floorId) return;

            fetchDeviceList(defaultSelection?.label, floorId);

            setSelectedDeviceType(defaultSelection);
            // console.log('Device type lists', deviceTypesToSelect);
        } catch (error) {
            setDeviceTypeList([]);
            console.log(error);
        }
    }, [floorId]);

    const handleDeviceTypeSelection = (newValue: SingleValue<selectTagType>, actionMeta: ActionMeta<selectTagType>) => {
        try {
            setIsLoading(true);
            const { label = '', value = '' } = newValue || {};

            setSelectedDeviceType({ label, value });
            if (value && floorId) fetchDeviceList(label, floorId);

            return;
        } catch (error) {
            console.log(error);
        }
    };
    const fetchDeviceList = async (deviceType: string, floorId: string) => {
        try {
            setIsEmpty(false);
            setIsLoading(true);
            // const deviceTypeString = deviceTypesConstant[deviceType];
            const res = await getDevices(deviceType, floorId);
            const response = res?.data?.map((data: object) => ({ ...data, deviceType }));
            setTableData(response ? response : []);
            if (res?.data && res?.data?.length < 1) setIsEmpty(true);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setTableData([]);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (floorId) fetchDeviceTypes();
    }, [fetchDeviceTypes, floorId]);

    return (
        // <Row style={{ marginLeft: '0px' }}>
        <Card className="shadow-lg mt-2 rounded-lg p-2 mx-2">
            <Card.Body>
                <Row>
                    {deviceTypeList.length > 1 && (
                        <>
                            {' '}
                            <Col xs={8}>
                                <h4 className="header-title mb-3">{selectedDeviceType?.label + ' '} Device List</h4>
                            </Col>
                            <Col xs={4}>
                                <Select
                                    options={deviceTypeList ?? []}
                                    onChange={handleDeviceTypeSelection}
                                    placeholder={'Please select type of the Device'}
                                    value={Object.keys(selectedDeviceType)?.length > 1 ? selectedDeviceType : null}
                                />

                                {/* <h4 className="header-title mb-3">Device List</h4> */}
                            </Col>
                        </>
                    )}
                </Row>
                {deviceTypeList.length > 1 && !isLoading ? (
                    isEmpty ? (
                        <h4>No {selectedDeviceType?.label ?? ''} Device installed here</h4>
                    ) : (
                        <Table
                            columns={columnConfig(selectedDeviceType?.label ?? '') ?? []}
                            data={tableData ?? []}
                            pageSize={10}
                            sizePerPageList={sizePerPageList}
                            isSortable={true}
                            pagination={true}
                            isSearchable={true}
                            tableClass=" mt-3 "
                            searchBoxClass="mb-2"
                        />
                    )
                ) : (
                    <TableSkelton />
                )}
            </Card.Body>
        </Card>
        // </Row>
    );
};
