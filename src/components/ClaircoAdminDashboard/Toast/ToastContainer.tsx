import Toast from './Toast';
import './toast.scss';

type ToastContainerType = {
    toasts:any[]
}
const ToastContainer = (props:ToastContainerType) =>{
    return (
        <div className="toasts-container">
        {props.toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    )
}

export default ToastContainer;