


export type Customer = {
    
    status: string;
    id: string;
    location: string;
    seats:string;
    meetingroom:string;
    openarea:string;
    action?:React.ReactNode;   
    alerts:string;
    timestamp:string;
    building:string;
    floor:string;
    businessunit:string;
    temparature:string;
    level:string;
    
};
export type EnvironmentAlerts = {
    
    time: string;
    building: string;
    floor: string;
    areaname:string;
    parameter:string;
    value:string;
   
    
};
export type Seller = {
    id: number;
    name: string;
    store: string;
    products: number;
    created_on: string;
    balance: string;
    image: string;
};
export type Washroom = {
    timestamp: string;
    parameter: string;
    building: string;
    floor: number;
    washroom: string;
    level: string;
};

