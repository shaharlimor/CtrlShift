import { useEffect, useRef, useState, Fragment } from 'react';
import { useMediaQuery, Button, Grid } from '@mui/material';
import PropTypes from 'prop-types';

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';

import SubCard from 'components/cards/SubCard';
import CalendarStyled from './CalendarStyled';
import Toolbar from './Toolbar';

// According to the page and the type of the calendar
// 0 - Insert Constraints
// 1 - Manager
// 2 - Monthly Planner
const Calendar = ({ events, calendarType, handleEventSelect }) => {
    const calendarRef = useRef(null);

    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const displayEvents = events !== null ? events : [];

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
                        events={displayEvents}
                        ref={calendarRef}
                        rerenderDelay={10}
                        initialDate={date}
                        initialView={view}
                        dayMaxEventRows={3}
                        eventDisplay="block"
                        headerToolbar={false}
                        allDayMaintainDuration
                        eventResizableFromStart
                        eventClick={handleEventSelect}
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
};
Calendar.propTypes = {
    events: PropTypes.array,
    handleEventSelect: PropTypes.func,
    calendarType: PropTypes.number
};

export default Calendar;
