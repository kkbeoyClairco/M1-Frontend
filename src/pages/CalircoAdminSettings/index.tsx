import { conforms } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { Card, Col, Nav, Tab } from 'react-bootstrap';

// Lazily import the settings components
const CustomerSettings1 = React.lazy(() => import('./settings/CustomerSet'));
const DeviceSettings1 = React.lazy(() => import('./settings/DeviceSet'));
const UserSettings1 = React.lazy(() => import('./settings/UserSet'));
const ScheduleSet = React.lazy(() => import('./settings/ScheduleSet'));

const Admin = () => {
    const [activeTab, setActiveTab] = useState('UserSettings');
    // CustomerSettings  DeviceSettings UserSettings
    const handleTabChange = (key: any) => {
        setActiveTab(key);
    };

    return (
        <div className="mt-2" style={{ paddingTop: '2em', marginLeft: '2em', marginRight: '2em' }}>
            <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
                {/* <Card> */}
                <Col xs={12} md={6}>
                    {' '}
                    <Nav variant="tabs" justify className="mt-0 w-100 w-md-50">
                        {/* <Nav.Item>
                            <Nav.Link
                                eventKey="CustomerSettings"
                                style={activeTab === 'CustomerSettings' ? { fontWeight: 'bold' } : {}}>
                                <span className=" d-md-block" style={{ cursor: 'pointer' }}>
                                    Customer
                                </span>
                            </Nav.Link>
                        </Nav.Item> */}
                        {/* <Nav.Item>
                            <Nav.Link
                                eventKey="DeviceSettings"
                                style={activeTab === 'DeviceSettings' ? { fontWeight: 'bold' } : {}}>
                                <span className=" d-md-block" style={{ cursor: 'pointer' }}>
                                    Device
                                </span>
                            </Nav.Link>
                        </Nav.Item> */}
                        <Nav.Item>
                            <Nav.Link
                                eventKey="UserSettings"
                                style={activeTab === 'UserSettings' ? { fontWeight: 'bold' } : {}}>
                                <span className=" d-md-block" style={{ cursor: 'pointer' }}>
                                    User
                                </span>
                            </Nav.Link>
                        </Nav.Item>
                        {/* <Nav.Item>
                            <Nav.Link
                                eventKey="ScheduleSettings"
                                style={
                                    activeTab === 'ScheduleSettings'
                                        ? {
                                              fontWeight: 'bold',
                                              // borderWidth: '0.15em', borderColor: '#008675', color: 'white'
                                          }
                                        : {}
                                }>
                                <span className=" d-md-block" style={{ cursor: 'pointer' }}>
                                    Schedule
                                </span>
                            </Nav.Link>
                        </Nav.Item> */}
                    </Nav>
                </Col>
                {/* </Card> */}
                <Tab.Content>
                    {/* {activeTab === 'CustomerSettings' && (
                        <Tab.Pane eventKey="CustomerSettings" id="CustomerSettings">
                            <Suspense fallback={<div>Loading...</div>}>
                                <CustomerSettings1 />
                            </Suspense>
                        </Tab.Pane>
                    )}
                    {activeTab === 'DeviceSettings' && (
                        <Tab.Pane eventKey="DeviceSettings" id="DeviceSettings">
                            <Suspense fallback={<div>Loading...</div>}>
                                <DeviceSettings1 />
                            </Suspense>
                        </Tab.Pane>
                    )} */}
                    {activeTab === 'UserSettings' && (
                        <Tab.Pane eventKey="UserSettings" id="UserSettings">
                            <Suspense fallback={<div>Loading...</div>}>
                                <UserSettings1 />
                            </Suspense>
                        </Tab.Pane>
                    )}
                    {/* {activeTab === 'ScheduleSettings' && (
                        <Tab.Pane eventKey="ScheduleSettings" id="ScheduleSettings">
                            <Suspense fallback={<div>Loading...</div>}>
                                <ScheduleSet />
                            </Suspense>
                        </Tab.Pane>
                    )} */}
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

export default Admin;
