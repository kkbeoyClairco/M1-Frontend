import * as yup from 'yup';

const parameterSchema = yup.object({
    isActive: yup.boolean().required('isActive is required'),
    low: yup.number().required('Low value is required'),
    high: yup.number().required('High value is required'),
    calib: yup.string().required('Calibration value is required'),
});

// const parametersSchema = yup.object({
//     PM1: parameterSchema.notRequired(),
//     PM25: parameterSchema.notRequired(),
//     // PM4: parameterSchema.notRequired(),
//     // PM10: parameterSchema.notRequired(),
//     // CO2: parameterSchema.notRequired(),
//     TEMP: parameterSchema.nullable().optional().notRequired(),
//     // HUM: parameterSchema.notRequired(),
// });
const parametersSchema = yup
    .object()
    .shape({})
    .test('parameters-object', 'Invalid parameter object', function (value) {
        if (!value || typeof value !== 'object') return true;
        const keys = Object.keys(value);
        for (const key of keys) {
            try {
                parameterSchema.validateSync(value[key]);
            } catch (err) {
                return this.createError({ path: `parameters.${key}`, message: err.errors[0] });
            }
        }
        return true;
    });

export const emailValidator = yup.string().email('Invalid email address').required('Email is required');
export const iaqFormValidator = yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    customerId: yup.string().required('Customer selection is required'),
    buildingId: yup.string().min(3, 'Building selection is required').required('Building selection is required'),
    floorId: yup.string().min(3, 'Floor selection is required').required('Floor selection is required'),
    deviceType: yup.string().notRequired(),
    parameters: parametersSchema.notRequired(),
    expiringAt: yup.date().required('Expiry date is required').typeError('Expiry date must be a valid date'),
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
