import React from 'react';

type switchType = {
    switchState?: boolean;
    switchControlFunction: (newState: boolean) => void;
    disabled?: boolean;
};
const Switch = ({ switchState, switchControlFunction, disabled }: switchType) => {
    const handleSwitchControl = async () => {
        try {
            switchControlFunction(!switchState);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <div
                className="form-check form-switch"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5em', width: '60px' }}>
                <input
                    onChange={handleSwitchControl}
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    disabled={disabled}
                    checked={switchState}
                />
                <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    {switchState ? 'On' : 'Off'}{' '}
                </label>
            </div>
        </div>
    );
};

export default Switch;
