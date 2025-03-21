import { Column } from 'react-table';
import { Table, PageSize, CellFormatter } from 'components';
import { MeetingRoom } from './types';
import data from './data';
import { Link } from 'react-router-dom';
import FlagIcon from './images/flag-icon.svg';
import { useState } from 'react';

const ActionColumn = ({ row }: CellFormatter<MeetingRoom>) => {
    return (
        <>
            <Link to="#" className="action-icon">
                {' '}
                <img src={FlagIcon} alt="Action-icon" />
            </Link>
        </>
    );
};

const columns: ReadonlyArray<Column> = [
    {
        Header: 'Building Name',
        accessor: 'building_name',
        defaultCanSort: true,
    },
    {
        Header: 'Capacity',
        accessor: 'capacity',
        defaultCanSort: false,
    },
    {
        Header: 'Area (sqft)',
        accessor: 'area',
        defaultCanSort: false,
    },
    {
        Header: 'Action',
        accessor: 'action',
        defaultCanSort: false,
        Cell: ActionColumn,
    }
    
];

const sizePerPageList: PageSize[] = [
    {
        text: '5',
        value: 5,
    },
    {
        text: '10',
        value: 10,
    },
    {
        text: '20',
        value: 20,
    },
];


const MeetingRoomTable = () => {   
//     const[meeting , setMeeting] = useState();
//     const getMeeting=async()=>{
//         try{
// const response=await getMeeting();
// setMeeting(response);

//         }
//         catch(error){
//             console.log('Error',Error)

//         }
//     }
    return (
        <Table<MeetingRoom>
                columns={columns}
                data={data}
                pageSize={10}
                sizePerPageList={sizePerPageList}
                isSortable={true}
                pagination={true}
                tableClass="table-striped text-center"
            />
    );
}

export default MeetingRoomTable;