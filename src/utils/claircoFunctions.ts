//Function that takes unix time and returns in this format:(10.42 am)
export const formatUnixTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);

    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
    });
};

//For Occupancy Graph
export const convertEpochToIST = (epochTime: number) => {
    // Create a new Date object with the epoch time
    const date = new Date(epochTime);

    // Format the date to IST
    const options: any = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',

        // second: '2-digit',
        hour12: false,
    };

    // Convert the date to a string in IST
    const istDate = date.toLocaleString('en-IN', options);

    return istDate;
};
export const convertUnixToISTForTable = (unixTimestamp: any) => {
    const date = new Date(unixTimestamp * 1000);

    const istTime = date.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',

        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        year: '2-digit',
        month: 'long',
        day: 'numeric',
    });

    return istTime;
};

// Fuction takes array as input and return map<string,string>
export const mapIdToName = (data:any,map:Map<string,string>) =>{
    for(let item of data){
        const name = item?.name || item?.deviceTypeName;
        if(!map.has(item.id)){
        map.set(item.id,name);}
    }
    return map;
}

export const mapNameToId = (data:any,map:Map<string,string>) =>{
    for(let item of data){
        const name = item?.name || item?.deviceTypeName;
        if(!map.has(name)){
        map.set(name,item.id);}
    }
    return map;
}