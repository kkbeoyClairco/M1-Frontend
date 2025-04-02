import * as Yup from 'yup';

export const controlsInputValidation = Yup.object().shape({
    setTemp: Yup.number()
        .typeError('Set Temperature must be a number')
        .min(16, 'Enter a value above 16')
        .max(40, 'Enter a value not exceeding 40')
        .notRequired(),
    thermostat: Yup.string()
        .min(4, 'Wrong Thermostat Mode ')
        .max(11, 'Wrong Thermostat Mode ')
        .notRequired()
        .nullable(),
});

export const setTemperatureValidation = Yup.object().shape({
    setTemp: Yup.number()
        .typeError('Set Temperature must be a number')
        .min(16, 'Enter a value above 16')
        .max(40, 'Enter a value not exceeding 40')
        .notRequired(),
});
