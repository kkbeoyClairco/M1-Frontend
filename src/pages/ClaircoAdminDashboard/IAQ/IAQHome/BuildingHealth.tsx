import React ,{useEffect}from 'react';
import { Modal } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import {Row , Col ,Button} from 'react-bootstrap'
import { getBuildingHealth } from 'helpers/api/services/Clairco/customerSide/iaq';
import { set } from 'react-hook-form';

type NewType = CellFormatter<DeviseTables>;
export type DeviseTables = {
    name: string;
    customer: string;
    seat_no: string;
    building: string;
    floor: string;
    health_status: string;
    last_refreshed_on: any;
    last_diagnosed_on: any;
    battery_level: string;
    sensor_address: string;
};

interface BuidingModalPropTypes {
    modalState?: boolean;
    modalControlFn?: any;
    customerId?: string;
    // dataArray?: any[];
    // name?: string;
    // zoneId?: any
    // floorsData?: [];
}
const BuildingHealthModal: React.FC<BuidingModalPropTypes > = ({ modalState, modalControlFn,customerId}) => {
    const [buildingHealth, setBuildingHealth] = React.useState<any[]>([]);
    const [tempBuildingHealth, setTempBuildingHealth] = React.useState<any[]>([]);
    const status :string[]= ['Good' ,'Moderate' , 'Poor' , 'Unhealthy' , 'Severe']

    const fetchBuildingHealth = async () =>{
            try {
                if (!customerId) {
                    console.error('Customer ID is required to fetch building health data.');
                    return;
                }
                const res = await getBuildingHealth(customerId?? '');
                setBuildingHealth(res?.data ?? []);
                setTempBuildingHealth(res?.data ?? []);
                // console.log('building health', res);
            } catch (error) {
                console.log(error);
            }
        }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Good':
                return '#008675';
            case 'Moderate':
                return '#F2C94C';
            case 'Poor':
                return '#F2994A';
            case 'Unhealthy':
                return '#EB5757';
            case 'Severe':
                return '#9B51E0';
            default:
                return '#000000'; // Default color if no match
        }
    };
    const statusTab = status.map((item) => {
        return (
            <Button
                key={item}
                style={{
                    background: getStatusColor(item),
                    border: '0',
                    marginRight: '10px',
                    color: 'white',
                }}
                onClick={ ()=>{
                    const buildings = buildingHealth.filter((building: any) => building.airQualityCategory === item);
                    setTempBuildingHealth(buildings);
                }}
            >
                {item}
            </Button>
        );
    });
    const columns = [
        {
            Header: 'Building',
            accessor: "buildingName",
        },
        {
            Header : 'Air Quality',
            accessor : 'airQualityCategory',
            defaultCanSort : true
        },
        {
            Header : 'PM 2.5 µg/m³',
            accessor : 'averagePM25',
            defaultCanSort : true
        }
    ];
    useEffect(() => {
        if (!modalState) return;
        fetchBuildingHealth();
    }, [modalState]);

    return (
        <Modal show={modalState} onHide={modalControlFn} animation={true} size="xl">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    <h5 className="modal-title"> Building Health </h5>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12} className="d-flex justify-content-end">
                       {statusTab}
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    data={tempBuildingHealth || []}
                    pageSize={0}
                    // sizePerPageList={sizePerPageList}
                    isSortable={true}
                    pagination={true}
                    isSearchable={true}
                    tableClass=" mt-3 "
                    searchBoxClass="mb-2"
                />
            </Modal.Body>
        </Modal>
    );
};

export default BuildingHealthModal;
