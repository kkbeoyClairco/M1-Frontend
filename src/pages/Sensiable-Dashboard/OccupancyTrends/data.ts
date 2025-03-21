import { Customer, Seller ,Washroom} from './types';
import { EnvironmentAlerts } from './types';

export const customer: Customer[] = [
    {
        id: '1',
        location: 'Location A',
        seats: '10/100',
        meetingroom: 'Meeting Room 1',
        openarea: 'Open Area A',
        status: 'On', 
        alerts: 'On', 
        timestamp:'7:30pm 25/12/23',
        building:'Bengaluru 1',
        floor:'2',
        businessunit:'ws1',
        temparature:'22',
        level:'80%',
        

    },
    {
        id: '1',
        location: 'Location A',
        seats: '10/100',
        meetingroom: 'Meeting Room 1',
        openarea: 'Open Area A',
        status: 'On', 
        alerts: 'On', 
        timestamp:'7:30pm 25/12/23',
        building:'Bengaluru 1',
        floor:'2',
        businessunit:'ws1',
        temparature:'22',
        level:'80%',

        

    },
    {
        id: '1',
        location: 'Location A',
        seats: '10/100',
        meetingroom: 'Meeting Room 1',
        openarea: 'Open Area A',
        status: 'On', 
        alerts: 'On', 
        timestamp:'7:30pm 25/12/23',
        building:'Bengaluru 1',
        floor:'2',
        businessunit:'ws1',
        temparature:'22',
        level:'80%',

        

    },
    {
        id: '1',
        location: 'Location A',
        seats: '10/100',
        meetingroom: 'Meeting Room 1',
        openarea: 'Open Area A',
        status: 'On', 
        alerts: 'On', 
        timestamp:'7:30pm 25/12/23',
        building:'Bengaluru 1',
        floor:'2',
        businessunit:'ws1',
        temparature:'22',
        level:'80%',

        

    },
    {
        id: '1',
        location: 'Location A',
        seats: '10/100',
        meetingroom: 'Meeting Room 1',
        openarea: 'Open Area A',
        status: 'On', 
        alerts: 'On', 
        timestamp:'7:30pm 25/12/23',
        building:'Bengaluru 1',
        floor:'2',
        businessunit:'ws1',
        temparature:'22',
        level:'80%',

        

    },

];
export const environmentalerts: EnvironmentAlerts[]=[
    {
        time: '17:24pm 23/2/23',
        building: 'Dubai',
        floor:'3',
        areaname:'B3',
        parameter:'Temp',
        value:'3%'
    },
    {
        time: '17:24pm 23/2/23',
        building: 'Dubai',
        floor:'3',
        areaname:'B3',
        parameter:'Temp',
        value:'3%'
    },
    {
        time: '17:24pm 23/2/23',
        building: 'Dubai',
        floor:'3',
        areaname:'B3',
        parameter:'Temp',
        value:'3%'
    },
    {
        time: '17:24pm 23/2/23',
        building: 'Dubai',
        floor:'3',
        areaname:'B3',
        parameter:'Temp',
        value:'3%'
    },
    
];
export const sellers: Seller[] = [
    {
        id: 1,
        name: 'IAQ',
        store: '22',
        products: 747,
        balance: '22%',
        created_on: '07/18/2019',
        image: 'https://robohash.org/voluptateesseaut.png?size=100x100&set=set1',
    },
    {
        id: 1,
        name: 'Temparature',
        store: '22',
        products: 747,
        balance: '22%',
        created_on: '07/18/2019',
        image: 'https://robohash.org/voluptateesseaut.png?size=100x100&set=set1',
    },
    {
        id: 1,
        name: 'Humidity',
        store: '22',
        products: 747,
        balance: '22%',
        created_on: '07/18/2019',
        image: 'https://robohash.org/voluptateesseaut.png?size=100x100&set=set1',
    },
    {
        id: 1,
        name: 'Humidity',
        store: '22',
        products: 747,
        balance: '22%',
        created_on: '07/18/2019',
        image: 'https://robohash.org/voluptateesseaut.png?size=100x100&set=set1',
    },
    {
        id: 1,
        name: 'Humidity',
        store: '22',
        products: 747,
        balance: '22%',
        created_on: '07/18/2019',
        image: 'https://robohash.org/voluptateesseaut.png?size=100x100&set=set1',
    },

];
export const washroom: Washroom[] = [
    {
        timestamp:' 07/18/2019',
        parameter: 'IAQ',
        building: '22',
        floor: 747,
        washroom: '22%',
        level: '1',
    },
    {
        timestamp:' 07/18/2019',
        parameter: 'IAQ',
        building: '22',
        floor: 747,
        washroom: '22%',
        level: '1',
    },
    {
        timestamp:' 07/18/2019',
        parameter: 'IAQ',
        building: '22',
        floor: 747,
        washroom: '22%',
        level: '1',
    },

 

];
const Buildings = [
    { label: 'Building 1', value: 'building1' },
    { label: 'Building 2', value: 'building2' },
    { label: 'Building 3', value: 'building3' },
    { label: 'Building 4', value: 'building4' },
    { label: 'Building 5', value: 'building5' },
    { label: 'Building 6', value: 'building6' },
];

const Floors = [
    { label: 'Floor 1', value: 'floor1' },
    { label: 'Floor 2', value: 'floor2' },
    { label: 'Floor 3', value: 'floor3' },
    { label: 'Floor 4', value: 'floor4' },
    { label: 'Floor 5', value: 'floor5' },
    { label: 'Floor 6', value: 'floor6' },
];
const Seats = [
    { label: 'Seat 1', value: 'seat1' },
    { label: 'Seat 2', value: 'seat2' },
    { label: 'Seat 3', value: 'seat3' },
    { label: 'Seat 4', value: 'seat4' },
    { label: 'Seat 5', value: 'seat5' },
    { label: 'Seat 6', value: 'seat6' },
];
const Unit = [
    { label: 'Unit 1', value: 'unit1' },
    { label: 'Unit 2', value: 'unit2' },
    { label: 'Unit 3', value: 'unit3' },
    { label: 'Unit 4', value: 'unit4' },
    { label: 'Unit 5', value: 'unit5' },
    { label: 'Unit 6', value: 'unit6' },
];



const Sensors = [
    { label: 'Day', value: 'Day' },
    { label: 'Week', value: 'Week' },
    { label: 'Month', value: 'Month' },
    { label: 'Quarter', value: 'Quarter' },
    { label: 'Year', value: 'Year' },
];

export { Buildings, Floors, Unit, Sensors, Seats };