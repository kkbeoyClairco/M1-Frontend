import react, { useContext } from 'react';
import { ToastContext } from 'context/ToastContext';
import './toast.scss';
const toastTypes: any = {
    success: {
      backgroundColor: '#20c997',
    },
    error: {
      backgroundColor: '#dc3545',
    },
};

const Toast = (props: { message: string; id: Number; type: string }) => {
    const toast = useContext(ToastContext);
    setTimeout(() => {
        toast?.hideToast(props.id);
    }, 3000);
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
                backgroundColor: toastTypes[props.type].backgroundColor,
                padding: '12px',
                position: 'relative',
                width: '320px',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                color:'white',
                fontSize:'1rem'
            }}>
            <p>{props.message}</p>
            {/* <button
                style={{ cursor: 'pointer', border: 'none', background: 'none', marginLeft: 'auto' }}
                onClick={() => toast?.hideToast(props.id)}>
                close
            </button> */}
        </div>
    );
};

export default Toast;
