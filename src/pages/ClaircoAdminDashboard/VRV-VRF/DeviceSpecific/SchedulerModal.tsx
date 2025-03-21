import { Modal } from 'react-bootstrap';
import '@fullcalendar/react';
import ReactEcharts from 'echarts-for-react';

import FullCalendarWidget from 'pages/apps/Calendar/FullCalendarWidget';
import { useCalendar } from 'pages/apps/Calendar/hooks';
// import { weekdays } from 'moment';
import { useEffect, useRef, useState } from 'react';
interface SchedulerModalProps {
    schedulerModalState?: boolean;
    modalControlFunction?: any;
    data?: any;
}
export const SchedulerModal: React.FC<SchedulerModalProps> = ({ schedulerModalState, modalControlFunction, data }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [zoomToChart, setZoomToChart] = useState(false);
    // const {
    //     isOpen,
    //     onOpenModal,
    //     onCloseModal,
    //     isEditable,
    //     eventData,
    //     events,
    //     onDateClick,
    //     onEventClick,
    //     onDrop,
    //     onEventDrop,
    //     onUpdateEvent,
    //     onRemoveEvent,
    //     onAddEvent,
    // } = useCalendar();
    const [activeTemplate, setActiveTemplate] = useState('Weekdays');
    const templateNames = { Weekdays: 'Weekdays', Weekends: 'Weekdays', SpecialDays: 'SpecialDays ' };

    const events = [
        {
            title: 'Weekends',
            start: '2024-08-10T10:00:00',
            end: '2024-08-10T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #5470C6)',
        },
        {
            title: 'Holiday',
            start: '2024-08-11T10:00:00',
            end: '2024-08-11T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #FAC858)',
        },
        {
            title: 'Weekdays',
            start: '2024-08-12T10:00:00',
            end: '2024-08-12T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #91CC75)',
        },
        {
            title: 'Weekdays',
            start: '2024-08-13T10:00:00',
            end: '2024-08-13T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #91CC75)',
        },
        {
            title: 'Weekdays',
            start: '2024-08-14T10:00:00',
            end: '2024-08-14T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #91CC75)',
        },
        {
            title: 'Weekdays',
            start: '2024-08-15T10:00:00',
            end: '2024-08-15T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #91CC75)',
        },
        {
            title: 'Weekdays',
            start: '2024-08-16T10:00:00',
            end: '2024-08-16T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #91CC75)',
        },
        {
            title: 'Weekends',
            start: '2024-08-17T10:00:00',
            end: '2024-08-17T18:00:00',
            backgroundColor: 'var(--fc-event-bg-color, #5470C6)',
        },
    ];
    const handleDateSelection = async (e: any) => {
        try {
            console.log('Clicked on date');
        } catch (error) {
            console.log(error);
        }
    };
    const handleEventSelection = async (e: any) => {
        try {
            console.log('Clicked on event', e.event._def.title);
            setActiveTemplate(e.event._def.title);
            setZoomToChart((currentState) => !currentState);
        } catch (error) {
            console.log(error);
        }
    };
    const handleEventDrop = async () => {
        try {
            console.log('Event dropped');
        } catch (error) {
            console.log(error);
        }
    };
    const handleOnDrop = async () => {
        try {
            console.log('Event Dropped');
        } catch (error) {
            console.log(error);
        }
    };

    //Echarts Graph Option
    const option = {
        xAxis: {
            type: 'category',
            name: 'Time(hr)',
            data: ['10am', '11am', '12pm', '1pm', ' 2pm', '3pm', '4pm', '6pm'],
            nameLocation: 'middle',
            nameTextStyle: {
                padding: [20, 40, 40, 0], // Adjust padding to move the label away from the axis
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        yAxis: [
            {
                type: 'value',
                name: 'Set Temperature (°C)',
                position: 'left',
                nameLocation: 'middle',
                nameTextStyle: {
                    padding: [0, 40, 40, 0], // Adjust padding to move the label away from the axis
                },
                axisLine: {
                    lineStyle: {
                        // color: [graphLineColour],
                    },
                },
                axisLabel: {
                    formatter: `{value}`,
                },
            },
        ],
        series: [
            {
                name: 'Temperature',
                data: [22, 25, 23, 24, 23, 25, 26, 22],
                type: 'line',
                symbol: 'diamond', // stack: 'Total',

                lineStyle: {
                    // color: graphLineColour,
                },
            },
        ],
    };

    useEffect(() => {
        const y = chartRef?.current?.offsetTop || 0;
        if (modalRef && modalRef.current) {
            modalRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    }, [zoomToChart]);
    return (
        <Modal show={schedulerModalState} onHide={modalControlFunction} animation={true} size="lg">
            <Modal.Header style={{ background: '#008675' }}>
                <Modal.Title style={{ marginInline: 'auto', color: 'white' }}>
                    {' '}
                    <h5 className="modal-title">{data.unitName} Scheduler</h5>
                </Modal.Title>{' '}
                <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ background: '#008675', borderWidth: '0px' }}
                    onClick={() => modalControlFunction()}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </Modal.Header>
            <Modal.Body ref={modalRef}>
                <div style={{ height: 'auto', padding: '20px' }}>
                    <FullCalendarWidget
                        onDateClick={handleDateSelection}
                        onEventClick={handleEventSelection}
                        onDrop={handleOnDrop}
                        onEventDrop={handleEventDrop}
                        events={events}
                        height={800}
                        isEditable={false}
                    />
                    <div style={{ marginTop: '40px' }}>
                        <h4>SCHEDULE</h4>
                        <h6>Date &gt; {activeTemplate}</h6>
                    </div>{' '}
                    <div ref={chartRef} style={{ display: 'flex', justifyContent: 'center', paddingLeft: '40px' }}>
                        <ReactEcharts option={option} style={{ height: '400px', width: '700px' }} />
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};
