import { useEffect, useRef, useState, Fragment } from 'react';
import { useMediaQuery, Button, Grid } from '@mui/material';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { add, set, sub } from 'date-fns';

import SubCard from 'components/cards/SubCard';
import CalendarStyled from './CalendarStyled';
import Toolbar from './Toolbar';

import value from 'assets/scss/_themes-vars.module.scss';
import Constraints from 'pages/constraints';

// eslint-disable-next-line
const Calendar = (props) => {
    const calendarRef = useRef(null);
    // According to the page and the type of the calendar
    // 0 - Insert Constraints
    // 1 - Manager
    // 2 - Monthly Planner
    // eslint-disable-next-line
    const calendarType = props.calendarType;
    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

    // TODO: get events by props / from server
    // const [events, setEvents] = useState([]);
    const events = [
        {
            id: '1',
            allDay: false,
            color: value.primaryMain,
            description: 'Morning Shift',
            start: sub(new Date(), { days: 12, hours: 1, minutes: 0 }),
            end: sub(new Date(), { days: 12, hours: 3, minutes: 0 }),
            title: 'Morning Shift'
        },
        {
            id: '2',
            allDay: false,
            color: value.primaryMain,
            description: 'Morning Shift',
            start: set(new Date(), { hours: 10, minutes: 30 }),
            end: set(new Date(), { hours: 13, minutes: 30 }),
            title: 'Morning Shift'
        },
        {
            id: '3',
            allDay: true,
            color: value.secondaryMain,
            description: 'All day Shift',
            start: sub(new Date(), { days: 3, hours: 6, minutes: 30 }),
            end: sub(new Date(), { days: 4, hours: 4, minutes: 30 }),
            title: 'All day Shift'
        },
        {
            id: '4',
            allDay: false,
            color: value.primaryMain,
            description: 'Morning Manager',
            start: add(new Date(), { days: 8, hours: 3, minutes: 30 }),
            end: add(new Date(), { days: 8, hours: 5, minutes: 40 }),
            title: 'Morning Manager'
        },
        {
            id: '5',
            allDay: false,
            color: value.primary200,
            description: 'Morning Emloyee',
            start: add(new Date(), { days: 8, hours: 3, minutes: 30 }),
            end: add(new Date(), { days: 8, hours: 5, minutes: 40 }),
            title: 'Morning Emloyee'
        },
        {
            id: '6',
            allDay: false,
            color: value.secondaryMain,
            description: 'Evening Manager',
            start: add(new Date(), { days: 8, hours: 6, minutes: 30 }),
            end: add(new Date(), { days: 8, hours: 7, minutes: 30 }),
            title: 'Evening Manager'
        },
        {
            id: '7',
            allDay: false,
            color: value.secondary200,
            description: 'Evening Employee',
            start: add(new Date(), { days: 8, hours: 6, minutes: 30 }),
            end: add(new Date(), { days: 8, hours: 7, minutes: 30 }),
            title: 'Evening Employee'
        }
    ];

    const [date, setDate] = useState(new Date());

    // Selected view
    const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');

    const handleViewChange = (newView) => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.changeView(newView);
            setView(newView);
        }
    };

    // set calendar view
    useEffect(() => {
        handleViewChange(matchSm ? 'listWeek' : 'dayGridMonth');
    }, [matchSm]);

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.next();
            setDate(calendarApi.getDate());
        }
    };

    /* eslint-disable */
    return (
        // eslint-disable-next-line
        <Fragment>
            <CalendarStyled>
                <Toolbar
                    date={date}
                    view={view}
                    onClickNext={handleDateNext}
                    onClickPrev={handleDatePrev}
                    onChangeView={handleViewChange}
                    calendarType={calendarType}
                />
                <SubCard>
                    <FullCalendar
                        weekends
                        editable
                        droppable
                        selectable
                        // TODO: events from props
                        events={events}
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        initialView={view}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        headerToolbar={false}
                        allDayMaintainDuration
                        eventResizableFromStart
                        height={matchSm ? 'auto' : 720}
                        plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
                    />
                </SubCard>
            </CalendarStyled>
            <Grid alignItems="center" justifyContent="space-between" container sx={{ pb: 3 }}>
                {calendarType === 1 && (
                    <Grid item>
                        <Grid alignItems="center" justifyContent="space-between" container spacing={2}>
                            <Grid item>
                                <Button variant="contained" sx={{ width: '100%' }} size="large">
                                    Start Insert Constraint
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" sx={{ width: '100%' }} size="large">
                                    Create Schedule
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {calendarType !== 0 ? (
                    <Grid item>
                        <Button variant="contained" sx={{ width: '100%' }} size="large">
                            {calendarType === 1 ? 'Publish Schedule' : 'Switch shift'}
                        </Button>
                    </Grid>
                ) : (
                    ''
                )}
            </Grid>
        </Fragment>
    );
    /* eslint-enable */
};

export default Calendar;
