import { addHours, compareAsc, format, parse } from 'date-fns';

export const convertTimeToDates = (timestamp: any) => {
    try {
        const date = new Date(timestamp * 1000);

        return date.toLocaleTimeString('en-IN', {
            // hour: '2-digit',
            day: '2-digit',
            hour: '2-digit',

            hour12: true,
            timeZone: 'Asia/Kolkata',
        });
    } catch (error) {
        console.log(error);
    }
};

// Create time  to ISO standards.
export function convertEpochToFormattedDate(epoch: any) {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function convertEpochToForGraphs(epoch: any) {
    const date = new Date(epoch * 1000); // Convert seconds to milliseconds
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String((date.getUTCHours() + 5) % 24).padStart(2, '0'); // Add 5 hours for GMT+5
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}, ${hours}:${minutes}`;
}

export function convertEpochToDate1(epoch: any) {
    const adjustedTimestamp = epoch * 1000;
    const date = new Date(adjustedTimestamp);
    const newDate = date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }); // Adjust the format as needed
    // console.log('Date:', adjustedTimestamp, newDate);
    return newDate;
}

// Returns Time in readable format irrespective of the unix (Works for both unix input in millisecond and second)
// Return format: 26/08/24, 11:31
export function convertUnixToIST(epoch: any) {
    if (epoch < 1e12) epoch = epoch * 1000;
    // const adjustedTimestamp = epoch * 1000;
    const date = new Date(epoch);
    const newDate = date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }); // Adjust the format as needed
    // console.log('Date:', epoch, newDate);
    return newDate;
}
export const convertDateToEpoch = (dateString?: any) => {
    try {
        // console.log(dateString);
        // dateString = dateString.setHours(0, 0, 0, 0);
        let date = new Date(dateString);
        const epoch = date.getTime();
        return epoch;
    } catch (error) {
        console.log(error);
        return new Date().getTime();
    }
};

export const convertGmtToIST = (timeInGMT: string) => {
    try {
        // const time=zonedTimeToUtc()
        // console.log('time', time);
        const parsedDate = parse(timeInGMT, 'dd/MM/yy, HH:mm', new Date());
        // Add 5.30 hours
        const updatedDate = addHours(parsedDate, 5.5);
        // Format the result back to "DD/MM/YY, HH:mm"
        const formattedDate = format(updatedDate, 'dd/MM/yy, HH:mm');
        return formattedDate;
    } catch (error) {
        console.log(error);
    }
};

// Returns the current Epoch Time
export const getCurrentEpochTime = () => {
    try {
        const date = new Date();
        return Math.floor(date.getTime() / 1000);
    } catch (error) {
        return 0;
    }
};

export const getHourFromEpoch = (epochTime: any) => {
    try {
        if (epochTime < 1e12) epochTime = epochTime * 1000;
        const date = new Date(epochTime);
        // console.log(date);
        return date.getHours();
    } catch (error) {
        return new Date().getUTCHours();
    }
};

export const getDateOnly = (input: any) => {
    try {
        const date = new Date(input);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.log(error);
    }
};

export const getDateNow = () => {
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate;
    } catch (error) {
        return '';
    }
};
// const dateStr = "Mon Oct 21 2024 23:18:45 GMT+0530 (India Standard Time)";

//   return formattedDate
