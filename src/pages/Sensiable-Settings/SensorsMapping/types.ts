import { type } from "os";

// export type HighlightedText = {
//     className: string;
//     label: string;

// };

export type Customer = {
    
    status: string;
    id: string;
    location: string;
    seats:string;
    meetingroom:string;
    openarea:string;
    action?:React.ReactNode;   
    alerts:string;   
    isSelected: boolean; // Add the 'isSelected' property


    
};

