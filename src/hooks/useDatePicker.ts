import { useState } from 'react';

export default function useDatePicker() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    /*
     * handle date change
     */
    const onDateChange = (date: Date) => {
        if (date) {
            console.log('Date selected', date);
            setSelectedDate(date);
        }
    };

    return { selectedDate, onDateChange };
}
