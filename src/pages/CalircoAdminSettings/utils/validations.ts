import * as yup from 'yup';

export const userValidationSchema = yup.object().shape({
    type: yup.string().required('User Type is required'),
    customerId: yup.string().required('Customer selection is required'),
    buildingIds: yup
        .array()
        .of(yup.string())
        .min(1, 'At least one building must be selected')
        .required('Building selection is required'),
    assignedDeviceTypes: yup
        .array()
        .of(yup.string())
        .min(1, 'At least one device type must be selected')
        .required('Device type selection is required'),
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    phone: yup
        .string()
        .notRequired()
        .matches(/^[0-9]{10}$/, 'Phone Number must be exactly 10 digits'),
    email: yup.string().notRequired().email('Invalid email format'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
});
