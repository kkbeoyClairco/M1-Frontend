import React, { useEffect, useMemo } from 'react';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CellFormatter, Table } from 'components';
import { Row, Col, Button } from 'react-bootstrap';
import { getBuildingHealth } from 'helpers/api/services/Clairco/customerSide/iaq';

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
}

const BuildingHealthModal: React.FC<BuidingModalPropTypes> = ({ modalState, modalControlFn, customerId }) => {
    const [buildingHealth, setBuildingHealth] = React.useState<any[]>([]);
    const [tempBuildingHealth, setTempBuildingHealth] = React.useState<any[]>([]);
    const status: string[] = ['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe'];

    const fetchBuildingHealth = async () => {
        try {
            if (!customerId) {
                console.error('Customer ID is required to fetch building health data.');
                return;
            }
            const res = await getBuildingHealth(customerId ?? '');
            setBuildingHealth(res?.data ?? []);
            setTempBuildingHealth(res?.data ?? []);
        } catch (error) {
            console.log(error);
        }
    };

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
                return '#000000';
        }
    };

    const getPm25Range = useMemo(() => {
        return (status: string) => {
            switch (status) {
                case 'Good':
                    return '(0-12) µg/m³';
                case 'Moderate':
                    return '(12-35) µg/m³';
                case 'Poor':
                    return '(36-55) µg/m³';
                case 'Unhealthy':
                    return '(56-150) µg/m³';
                case 'Severe':
                    return '(151-249) µg/m³';
                default:
                    return '(250 µg/m³ or greater)';
            }
        };
    }, []);

    const statusTab = status.map((item, index) => {
        const renderTooltip = (props: any) => (
            <Tooltip id={`tooltip-${item}`} {...props}>
                PM2.5 Range: {getPm25Range(item)}
            </Tooltip>
        );

        // Use bottom-end for the last button to prevent it from moving out
        const placement = index === status.length - 1 ? "bottom-end" : "bottom-start";

        return (
            <OverlayTrigger
                key={item}
                placement={placement}
                overlay={renderTooltip}
                delay={{ show: 250, hide: 400 }}
            >
                <Button
                    style={{
                        background: getStatusColor(item),
                        border: '0',
                        marginRight: '10px',
                        color: 'white',
                    }}
                    onClick={() => {
                        const buildings = buildingHealth.filter((building: any) => building.airQualityCategory === item);
                        setTempBuildingHealth(buildings);
                    }}>
                    {item}
                </Button>
            </OverlayTrigger>
        );
    });

    const columns = [
        {
            Header: 'Building',
            accessor: 'buildingName',
        },
        {
            Header: 'Air Quality',
            accessor: 'airQualityCategory',
            defaultCanSort: true,
        },
        {
            Header: 'PM 2.5 µg/m³',
            accessor: 'averagePM25',
            defaultCanSort: true,
        },
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