import FullCalendar, { EventClickArg, EventDropArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg, DropArg } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import BootstrapTheme from '@fullcalendar/bootstrap';
import { EventInput } from '@fullcalendar/core';

type FullCalendarWidgetProps = {
    onDateClick: (value: DateClickArg) => void;
    onEventClick: (value: EventClickArg) => void;
    onEventDrop: (value: EventDropArg) => void;
    onDrop: (value: DropArg) => void;
    isEditable?: boolean;
    height?: number;
    events: Array<EventInput>;
};

const FullCalendarWidget = ({
    onDateClick,
    onEventClick,
    onDrop,
    onEventDrop,
    height,
    events,
    isEditable,
}: FullCalendarWidgetProps) => {
    const renderEventContent = (eventInfo: any) => {
        return (
            <div
                style={{
                    backgroundColor: eventInfo.event.backgroundColor,
                    color: 'white',
                    borderRadius: '5px',
                    padding: '10px',
                    // fontStyle: '',
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                {/* <b>{eventInfo.timeText}</b> */}
                <i>{eventInfo.event.title}</i>
            </div>
        );
    };
    return (
        <>
            {/* full calendar control */}
            <div id="calendar">
                <FullCalendar
                    height={`${height}px`}
                    aspectRatio={1}
                    contentHeight={50}
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin, BootstrapTheme]}
                    handleWindowResize={true}
                    themeSystem="bootstrap"
                    buttonText={{
                        today: 'Today',
                        month: 'Month',
                        week: 'Week',
                        day: 'Day',
                        // list: 'List',
                        prev: 'Prev',
                        next: 'Next',
                    }}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    eventContent={renderEventContent}
                    editable={isEditable}
                    selectable={true}
                    droppable={true}
                    events={events}
                    dateClick={(arg: DateClickArg) => onDateClick(arg)}
                    eventClick={(arg: EventClickArg) => onEventClick(arg)}
                    drop={(arg: DropArg) => onDrop(arg)}
                    eventDrop={(arg: EventDropArg) => onEventDrop(arg)}
                />
            </div>
        </>
    );
};

export default FullCalendarWidget;
