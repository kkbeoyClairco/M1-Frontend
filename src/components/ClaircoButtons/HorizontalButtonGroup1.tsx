import React, { useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
interface ButtonProps {
    choices: (string | number)[];
    currentState?: string | number | null;
    choicesDisplayNames?: Record<string, string>;
    height?: string;
    onSelectFn?: (selection?: string | number) => void;
}
const HorizontalButtonGroup1: React.FC<ButtonProps> = ({
    choices,
    currentState,
    choicesDisplayNames,
    onSelectFn,
    height = '48px',
}) => {
    const [hovered, setHovered] = useState<string | number | null>(null);

    return (
        <ButtonGroup
            className="w-100 mb-2"
            style={{
                height: height, // or any height you prefer (e.g., '40px', '3rem')
                alignItems: 'stretch', // ensures buttons fill the height
            }}>
            {choices.map((item) => {
                const isActive = item === currentState;
                const isHovered = item === hovered;
                let background = isActive ? '#00695C' : '#008675';
                if (isHovered) background = isActive ? '#00564d' : '#009688';

                return (
                    <Button
                        active={isActive}
                        key={item}
                        onClick={() => (onSelectFn ? onSelectFn(item) : '')}
                        style={{
                            background,
                            color: '#fff',
                            // borderRadius: '8px',
                            cursor: 'pointer',
                            border: isActive ? '2px solid #008675' : '1px solid #eee', // colored border
                            fontWeight: isActive ? 'bold' : 500,
                            boxShadow: isActive ? '0 2px 8px rgba(0,105,92,0.08)' : 'none',
                            outline: 'none',
                            marginRight: 0,
                            height: '100%',
                            transition: 'background 0.2s, border 0.2s',
                        }}
                        onMouseEnter={() => setHovered(item)}
                        onMouseLeave={() => setHovered(null)}>
                        {choicesDisplayNames ? choicesDisplayNames[item] : item}
                    </Button>
                );
            })}
        </ButtonGroup>
    );
};

export default HorizontalButtonGroup1;
