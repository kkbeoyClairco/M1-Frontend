import { FormInput } from 'components';
import PageHeading from 'components/ClaircoCustomerDashboard/Headings/PageHeading';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import LogInputModal from './LogInputModal';
import MaintenanceTable from './MaintenanceTable';
import { isAdmin as isAdminFn } from 'utils/storageFunctions';

const MaintananceLogsPage = () => {
    const [modalState, setModalState] = useState(false);
    const [refresh, setRefresh] = useState(0);
    const isAdmin = isAdminFn();
    const handleModalState = () => {
        try {
            setModalState((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            {' '}
            {modalState && isAdmin && (
                <LogInputModal modalState={modalState} modalControlFn={handleModalState} refreshFn={setRefresh} />
            )}{' '}
            <Row>
                <Col xs={6}>
                    {' '}
                    <PageHeading title={'Maintenance Logs'} />
                </Col>
                {isAdmin && (
                    <Col
                        xs={6}
                        style={{
                            display: 'flex',
                            justifyContent: 'end',
                            marginTop: '1em',
                            maxHeight: '3em',
                        }}>
                        <Button
                            style={{ backgroundColor: '#008675', borderColor: '#008675', maxWidth: '10em' }}
                            onClick={handleModalState}>
                            Add New Log
                        </Button>
                    </Col>
                )}
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'end' }}>
                <Col xs={3}></Col>
            </Row>
            <Row style={{ marginLeft: '10px' }}>
                <MaintenanceTable refresh={refresh} />
            </Row>
        </>
    );
};

export default MaintananceLogsPage;
