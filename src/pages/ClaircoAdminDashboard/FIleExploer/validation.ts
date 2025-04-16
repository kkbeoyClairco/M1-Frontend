import * as Yup from 'yup';

export const controlsInputValidation = Yup.object().shape({
    Mode: Yup.string().oneOf(['Manual', 'AI'], 'Invalid mode').required('Mode is required'),
    DeviceID: Yup.string().required('DeviceID is required'),
    Parameters: Yup.object().shape({
        STEMP: Yup.number()
            .typeError('Set Temperature must be a number')
            .min(16, 'Enter a value above 16')
            .max(40, 'Enter a value not exceeding 40')
            .nullable()
            .notRequired(),
        // thermostat: Yup.string().oneOf(['Cool', 'Heat', 'Ventilation'], 'Invalid thermostat mode').nullable().notRequired(), // Optional field
        RELAY1_SET: Yup.string().oneOf(['ON', 'OFF'], 'Invalid Device mode').nullable().notRequired(),
        THSTAT: Yup.string().oneOf(['ON', 'OFF'], 'Invalid thermostat status').nullable().notRequired(),
        MODE: Yup.string().oneOf(['Cool', 'Heat', 'Ventilation'], 'Invalid thermostat mode').nullable().notRequired(),
    }),
});
