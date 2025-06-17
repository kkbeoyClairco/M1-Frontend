import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    technicianId: Yup.string().min(2, 'Enter Correct name').required('Technician Name is required'),
    clientSupervisorName: Yup.string().required('Client supervisor is required'),
    customerId: Yup.string().required('Customer is required'),
    buildingId: Yup.string().required('Building is required'),
    floorId: Yup.string().required('Floor is required'),
    deviceType: Yup.string().required('Device is required'),
    maintainedAt: Yup.string().required('Maintenance time is required'),
    workDescription: Yup.string().min(2, 'Please explain the work').required('Work Description is required'),
    workDoneImg: Yup.mixed().notRequired(),
});
