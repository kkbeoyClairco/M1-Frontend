import * as yup from 'yup';

export const btuFormValidator = yup.object().shape({
    deviceType: yup.string().required('Device Type is required'),
    customerId: yup.string().required('Customer selection is required'),
    buildingId: yup.string().min(3, 'Building selection is require').required('Building selection is required'),
    floorId: yup.string().min(3, 'Floor selection is require').required('Floor selection is required'),
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    zoneId: yup.string().min(3, 'Zone selection is require').notRequired('Zone selection is required'),
    alias: yup
        .string()
        .notRequired()
        .min(0, 'Alias must be at least 3 characters long')
        .max(50, 'Alias cannot exceed 50 characters'),
    limits: yup
        .number()
        .required('Limits are required')
        .typeError('Limits must be a number')
        .min(0, 'Limits must be greater than or equal to 0'),
    calibrationValues: yup
        .number()
        .required('Calibration Values are required')
        .typeError('Calibration Values must be a number')
        .min(0, 'Calibration Values must be greater than or equal to 0'),
});

const parentDeviceTypes = ['AHU', 'VRV/VRF Outdoor'];

export const occupancyFormValidator = yup.object().shape({
    deviceType: yup.string().required('Device Type is required'),
    customerId: yup.string().required('Customer selection is required'),
    buildingId: yup.string().min(3, 'Building selection is require').required('Building selection is required'),
    floorId: yup.string().min(3, 'Floor selection is require').required('Floor selection is required'),
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    zoneId: yup.string().min(3, 'Zone selection is require').notRequired('Zone selection is required'),
    parentDeviceType: yup
        .string()
        .notRequired()
        .oneOf(parentDeviceTypes, 'Parent Device Type must be one of the following: AHU, VRV/VRF Outdoor'),
    parentDeviceId: yup
        .string()
        .notRequired()
        .when('parentDeviceType', {
            is: (value) => !!value,
            then: yup.string().required('Parent Device is Required'),
            otherwise: yup.string().notRequired(),
        }),
});
