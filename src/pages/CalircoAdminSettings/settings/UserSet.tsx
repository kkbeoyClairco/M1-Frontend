import { useCallback, useEffect, useState, useContext } from 'react';
import UserModal from '../modals/UserModal/UserModal';
import { user } from 'helpers/api/services/Clairco/user';
import { formatDateToLocalTime } from 'helpers/utils';
import { Section } from '../utils/Section';
import { columnConfig } from '../utils/columns';
import { ToastContext } from 'context/ToastContext';
import { set } from 'react-hook-form';


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
    const toast = useContext(ToastContext);

    const getUsers = async () => {
        try {
            const res = await user.all();
            if (!res) return;

            if (res?.data) {

                const users = res.data.records.map((user: any) => ({
                    ...user,
                    createdAt: formatDateToLocalTime(user?.createdAt),
                }));
                setUserTableData(users);
            } else {
                throw new Error('No data returned from API');
            }
        } catch (error: any) {
            toast?.showToast(error, 'error');
        }
    };

    const handleCloseModal = useCallback(() => {
        setShowAddModal(false);
    }, []);

    useEffect(() => {
        getUsers();
    }, []);

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
                    setUserTableData,
                    onClose: handleCloseModal,
                }}
            />
        </>
    );
};

export default UserSettings1;
