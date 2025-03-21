import React from 'react';

export const InformationIcon = () => {
    return (
        <div style={{ marginTop: '-5px', cursor: 'pointer' }}>
            {/* Margin top is set to -5 to align with the iaq componenet title */}{' '}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                data-state="closed">
                <path
                    fill-rule="evenodd"
                    d="M12 11a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm0-3a1 1 0 110 2 1 1 0 010-2zm0 14C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"
                    clip-rule="evenodd"></path>
            </svg>
        </div>
    );
};
