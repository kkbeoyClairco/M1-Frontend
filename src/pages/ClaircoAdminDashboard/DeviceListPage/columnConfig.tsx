import { convertEpochToIST } from 'utils/claircoFunctions';
import { Column } from 'react-table';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import {
    getIaqURL,
    getAHUUrl,
    getThermopileUrl,
    getVRFIndoorUrl,
    getVRFOutdoorUrl,
    getEneryMeterUrl,
    getPIRUrl,
} from 'utils/navigationHelpers';
// Navigation Function
const handleNavigation = (data: any, navigate: NavigateFunction) => {
    const { deviceType = '' } = data || {};
    switch (deviceType) {
        case 'IAQ':
            const url = getIaqURL(data);
            navigate(`/admin/pages/iaq/${url}`);
            break;
        case 'AHU':
            const url1 = getAHUUrl(data);
            navigate(`/admin/pages/ahu/${url1}`);
            break;
        case 'Occupancy':
            const url2 = getThermopileUrl(data);
            navigate(`/admin/pages/occupancy/${url2}`);
            break;
        case 'VRV/VRF Indoor':
            const url3 = getVRFIndoorUrl(data);
            navigate(`/admin/pages/indoor-devices/${url3}`);
            break;
        case 'VRV/VRF Outdoor':
            const url4 = getVRFOutdoorUrl(data);
            navigate(`/admin/pages/outdoor-devices/${url4}`);
            break;
        case 'Energy Meter':
            const url5 = getEneryMeterUrl(data);
            navigate(`/admin/pages/energymeter/${url5}`);
            break;
        case 'PIR':
            const url6 = getPIRUrl(data);
            navigate(`/admin/pages/pir/${url6}`);
            break;
    }
};
const ActionColumn = ({ row }: any) => {
    const navigate = useNavigate();

    return (
        <div className="action-icon">
            <div>
                <i
                    className="mdi mdi-eye me-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNavigation(row.original, navigate)}></i>
            </div>
        </div>
    );
};
const columns: ReadonlyArray<Column> = [
    { Header: 'Device', accessor: 'name', defaultCanSort: false },
    { Header: 'Location', accessor: 'buildingId.location', defaultCanSort: false },
    { Header: 'Building', accessor: 'buildingId.name', defaultCanSort: false },
    { Header: 'Floor', accessor: 'floorId.name', defaultCanSort: false },
    {
        Header: 'Last Updated',
        accessor: 'updatedAt',
        defaultCanSort: false,
        Cell: ({ value }: any) => convertEpochToIST(value),
    },
    { Header: 'Status', accessor: 'status', defaultCanSort: false },
    {
        Header: 'Action',
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
    },
];
export const columnConfig = (state: string) => {
    const ACTION_REQUIRED_STATES = new Set([
        'IAQ',
        'AHU',
        'Occupancy',
        'VRV/VRF Indoor',
        'VRV/VRF Outdoor',
        'Energy Meter',
        'PIR',
    ]);
    return ACTION_REQUIRED_STATES.has(state) ? columns : columns.slice(0, columns.length - 1);
};
