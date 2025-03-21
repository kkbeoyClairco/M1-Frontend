import { useCallback, useEffect, useState, useContext } from 'react';
import UserModal from '../modals/UserModal/UserModal';
import { user } from 'helpers/api/services/Clairco/user';
import { formatDateToLocalTime } from 'helpers/utils';
import { useRedux } from 'hooks';
import { Section } from '../utils/Section';
import { columnConfig } from '../utils/columns';
import { ToastContext } from 'context/ToastContext';

type User = {
    id: number;
    name: string;
    createdAt: string;
    customerId: number;
    buildingId: number;
    customer?: string;
    building?: string;
};

const UserSettings1 = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [userTableData, setUserTableData] = useState<User[]>([]);
    const { appSelector } = useRedux();
    const { customerMap, buildingMap } = appSelector((state) => ({
        customerMap: state.Customer.customerMap,
        buildingMap: state.Building.buildingMap,
    }));
    const toast = useContext(ToastContext);

    const getUsers = async () => {
        try {
            const res = await user.all();
            if (!res) return;
            if (res?.data) {
                // toast?.showToast('Users received successfully', 'success');
                const users = res.data.map((user: any) => ({
                    ...user,
                    createdAt: formatDateToLocalTime(user?.createdAt),
                    customer: customerMap.get(user?.customerId),
                    building: buildingMap.get(user?.buildingId),
                }));
                setUserTableData(users);
            } else {
                throw new Error('No data returned from API');
            }
        } catch (error: any) {
            toast?.showToast(error, 'error');
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowAddModal(false);
    }, []);

    const handleSubmit = async (event: any, data: any) => {
        event.preventDefault();
        event.stopPropagation();
        const formData = new FormData(event.target);
        const userData: any = {};
        formData.forEach((value: any, key: string) => {
            userData[key] = value;
        });
        // console.log('Form data', data, userData);
        try {
            const newUserData = await user.create(data);
            if (newUserData) {
                toast?.showToast('User created successfully', 'success');
                const newUser = {
                    ...newUserData.data.createdUser,
                    createdAt: formatDateToLocalTime(newUserData?.data?.createdUsercreatedAt),
                    customer: customerMap.get(newUserData?.data?.createdUser?.customerId),
                };
                setUserTableData((prevUsers) => [...prevUsers, newUser]);
            }
        } catch (error: any) {
            toast?.showToast(error, 'error');
            console.log(error);
        }
    };

    return (
        <>
            <Section
                title="Users"
                onAddClick={() => setShowAddModal(true)}
                data={userTableData}
                columns={columnConfig?.user}
                modal={{ Component: UserModal }}
                modalProps={{
                    show: showAddModal,
                    onClose: handleCloseModal,
                    onSubmit: handleSubmit,
                }}
            />
        </>
    );
};

export default UserSettings1;
