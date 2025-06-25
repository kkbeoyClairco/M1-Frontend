import * as yup from 'yup';

export const iaqFormValidator = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    customer: yup.string().required('Customer selection is required'),
    building: yup.string().min(3, 'Building selection is require').required('Building selection is required'),
    floor: yup.string().min(3, 'Floor selection is require').required('Floor selection is required'),
    deviceType: yup.string().notRequired(),
    // outdoorDeviceType
});
// required('Device Type is required'),
// limits: yup
//     .number()
//     .required('Limits are required')
//     .typeError('Limits must be a number')
//     .min(0, 'Limits must be greater than or equal to 0'),
// calibrationValues: yup
//     .number()
//     .required('Calibration Values are required')
//     .typeError('Calibration Values must be a number')
//     .min(0, 'Calibration Values must be greater than or equal to 0'),
