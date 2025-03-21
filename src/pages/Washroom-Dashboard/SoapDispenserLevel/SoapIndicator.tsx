import React, { useState } from 'react';
import { Card, Table, ProgressBar } from 'react-bootstrap';
import SimpleBar from 'simplebar';

const SoapIndicator = () => {
    const [soap, setSoap] = useState([
        { sensorid: 1, level: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101), status:'full'},
        { sensorid: 2, level: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101), status:'partial Refill'},
        { sensorid: 3, level: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101), status:'Refill Required'},
        { sensorid: 4, level: Math.floor(Math.random() * 100), indicatorValue: Math.floor(Math.random() * 101),status:'full'},
    ]);

    const getRandomColor = () => {
        const colors = ['info', 'warning', 'danger', 'success', 'primary', 'secondary'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    };

    return (
        <Card>
            <Card.Body>
            


                <Table responsive className="table table-sm table-centered mb-0 font-14">
                    <thead className="bg-primary">
                        <tr>
                            <th  >Soap Level</th>
                            <th>Level</th>
                            <th>Level Indicator</th>
                            <th>Status</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    {/* <SimpleBar style={{ maxHeight: '600px', width: '100%' }}> */}
                    <tbody>
                        {soap.map((soap) => (
                            <tr key={soap.sensorid}>
                                <td>WS{soap.sensorid}</td>
                                <td>{soap.level}</td>
                                <td>
                                    <ProgressBar
                                        now={soap.indicatorValue % 101}
                                        style={{ height: '3px', width: '120px' }}
                                        variant={getRandomColor()}
                                    />
                                </td>
                                <td>
    <span
        className={`mdi mdi-circle mdi-15px  text-${getRandomColor()} `}
        style={{
            color: getRandomColor(), marginRight: '10px' 
        }}
    >    </span>
      {soap.status}
      </td>
{/* 
                                <td> 
                                <span className="mdi mdi-eye " 
                                style={{padding:'10px' ,            fontSize: '25px'                             }}

                                >
        
                                    </span></td> */}
                            </tr>
                        ))}
                    </tbody>
                    {/* </SimpleBar> */}
                </Table>
            </Card.Body>
        </Card>
    );
};

export default SoapIndicator;
