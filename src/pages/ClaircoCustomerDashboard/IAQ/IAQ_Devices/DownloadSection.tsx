import React from 'react';
import { Card } from 'react-bootstrap';
import downloadIcon from 'assets/icons/downloads.png';
const DownloadSection = () => {
    return (
        <Card style={{ height: '12em' }}>
            <Card.Body>
                <img src={downloadIcon} alt="" height={'20%'} />
            </Card.Body>
        </Card>
    );
};

export default DownloadSection;
