import { convertUnixToIST } from 'utils/timeFunctions';

//Gives AHU Table Column Config
export const getAHUTableColumn = (ActionColumn?: React.FC) => [
    {
        Header: 'Building',
        accessor: 'buildingId.name',
        defaultCanSort: true,
    },
    {
        Header: 'Floor',
        accessor: 'floorId.name',
        defaultCanSort: true,
    },

    {
        Header: 'Location',
        accessor: 'buildingId.location',
        defaultCanSort: true,
    },

    {
        Header: 'Device',
        accessor: 'name',
        defaultCanSort: true,
    },

    {
        Header: 'Updated on',
        accessor: 'updatedAt',
        defaultCanSort: true,
        Cell: ({ value }: any) => {
            if (!value) return 'N/A';
            const time = convertUnixToIST(value);
            return time;
        },
    },
    {
        Header: 'View',
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
    },
];
