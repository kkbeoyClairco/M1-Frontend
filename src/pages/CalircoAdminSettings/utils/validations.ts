import { device } from 'helpers/api/services/Clairco/device';
import { customer } from 'pages/Sensiable-Dashboard/OccupancyTrends/data';
import * as yup from 'yup';

const validations = {
    customerId: yup.string().required('Customer selection is required'),
    type: yup.string().required('User Type is required'),
    name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters long'),
    email: yup.string().notRequired().email('Invalid email format'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long')
}
export const userValidationSchema = yup.object().shape({
    ...validations,
    buildingId: yup.string().required('building selection is required'),
    deviceType: yup
        .array()
        .of(yup.object().shape({
            id: yup.string().required('Device type ID is required'),
            type: yup.string().required('Device type name is required'),}))
        .min(1, 'At least one device type must be selected')
        .required('Device type selection is required'),
});
export const CustomerTypevalidationSchema = yup.object().shape({
   ...validations,
   access: yup.array().of(yup.object().shape(
    {
        customerId:validations.customerId,
        name:validations.name,
        deviceType:yup
        .array()
        .of(yup.object().shape({
            id: yup.string().required('Device type ID is required'),
            type: yup.string().required('Device type name is required'),}))
        .min(1, 'At least one device type must be selected')
        .required('Device type selection is required'),
    }
   ))
});

export const BuildingTypevalidationSchema = yup.object().shape({
   ...validations,
   buildingId: yup.string().required('building selection is required'),
});