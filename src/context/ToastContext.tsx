import { useState ,createContext, ReactNode} from "react";
import ToastContainer from "components/ClaircoAdminDashboard/Toast/ToastContainer";
type ToastContextType = {
    showToast: (message:string, type:string) => void,
    hideToast: (toastId:Number) => void,
}

export const  ToastContext =  createContext<ToastContextType | undefined>(undefined);

type ToastContextProviderProps = {
    children:ReactNode
}

type ToastType = {
    message:string,
    type:string,
    id:number
}
export  const ToastContextProvider = ({children}:ToastContextProviderProps)=>{

    const [toast , setToast]   = useState<ToastType[]>([]);
    const showToast  = (message:string , type:string) =>{
        const id = Math.floor(Math.random() * 10000000);
        setToast((prev) => {
            return [...prev , {message , type, id}]
        });
            }
    const hideToast =  (toastId:Number) =>{
        setToast((prev) => {
            return prev.filter((t) => t.id!== toastId)
        });
    }
    
    return (
        <ToastContext.Provider value={{showToast,hideToast}}>
            {children}  {/* Render the children components */}
            <ToastContainer toasts={toast}/>
        </ToastContext.Provider>
    )

}
