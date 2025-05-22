import React from 'react';

const GrowingTree = () => {
    return (
        <svg width="200" height="300" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
            <style>
                {`
          @keyframes growTrunk {
            0% { height: 60px; }
            100% { height: 100px; }
          }
          @keyframes growBranch {
            0% { transform: scaleY(0); }
            100% { transform: scaleY(1); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
            </style>

            {/* Tree Trunk */}
            <rect
                x="90"
                y="200"
                width="20"
                height="100"
                fill="#8B4513"
                style={{ animation: 'growTrunk 2s ease-in-out forwards' }}
            />

            {/* Branches */}
            <line
                x1="100"
                y1="200"
                x2="50"
                y2="150"
                stroke="#8B4513"
                strokeWidth="5"
                style={{ animation: 'growBranch 2s ease-in-out forwards' }}
            />
            <line
                x1="100"
                y1="200"
                x2="150"
                y2="150"
                stroke="#8B4513"
                strokeWidth="5"
                style={{ animation: 'growBranch 2s ease-in-out forwards' }}
            />

            {/* Leaves */}
            <circle cx="50" cy="140" r="15" fill="green" style={{ animation: 'fadeIn 2s ease-in-out forwards' }} />
            <circle cx="150" cy="140" r="15" fill="green" style={{ animation: 'fadeIn 2s ease-in-out forwards' }} />
            <circle cx="100" cy="130" r="20" fill="green" style={{ animation: 'fadeIn 2s ease-in-out forwards' }} />
        </svg>
    );
};

export default GrowingTree;
