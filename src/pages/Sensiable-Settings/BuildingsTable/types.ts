import { type } from "os";


export type Customer = {
    
    status: string;
    id: string;
    location: string;
    seats:string;
    meetingroom:string;
    openarea:string;
    action?:React.ReactNode;   
    alerts:string;
    
};

