import React from 'react';

type LastUpdatedType = {
    lastUpdated?: string;
};
const LastUpdated = ({ lastUpdated }: LastUpdatedType) => {
    return (
        <div>
            {' '}
            <p style={{ fontSize: '11px', paddingTop: '0px' }}> Updated on {lastUpdated}</p>
        </div>
    );
};

export default LastUpdated;
