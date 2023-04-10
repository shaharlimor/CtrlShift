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
import { getMonthOpendToAddShifts } from 'utils/api';
import useAuth from 'hooks/useAuth';

// According to the page and the type of the calendar
// 0 - Insert Constraints
// 1 - Manager - Monthly Planner
// 2 - Shifts Board
const Calendar = ({ events, calendarType, handleEventSelect }) => {
    const calendarRef = useRef(null);
    const { user } = useAuth();
    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const displayEvents = events !== null ? events : [];

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState(matchSm ? 'listWeek' : 'dayGridMonth');
    const [openMonths, setOpenMonths] = useState([]);

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

    useEffect(() => {
        const getOpenMonths = async () => {
            const result = await getMonthOpendToAddShifts(user.organization);
            setOpenMonths(result.data);
        };
        getOpenMonths();
    }, []);

    const handleDatePrev = () => {
        const calendarEl = calendarRef.current;

        if (calendarEl) {
            const calendarApi = calendarEl.getApi();

            calendarApi.prev();
            setDate(calendarApi.getDate());
        }
    };

    const checkIfNextDateAvailable = (calendarApi) => {
        let newDateObj;
        if (view === 'dayGridMonth') {
            newDateObj = {
                year: calendarApi.getDate().getYear() + 2000 - 100,
                month: (calendarApi.getDate().getMonth() + 2) % 12
            };
        } else if (view === 'timeGridWeek') {
            const nextWeek = new Date(calendarApi.getDate().getTime() + 7 * 24 * 60 * 60 * 1000);
            newDateObj = {
                year: calendarApi.getDate().getYear() + 2000 - 100,
                month: (nextWeek.getMonth() + 1) % 12
            };
        } else {
            const nextDay = new Date(calendarApi.getDate().getTime() + 24 * 60 * 60 * 1000);
            newDateObj = {
                year: calendarApi.getDate().getYear() + 2000 - 100,
                month: (nextDay.getMonth() + 1) % 12
            };
        }

        // Check if the next click date is open to insert shifts (permanent shift already generated - "open")
        return openMonths.some((obj) => obj.month === newDateObj.month && obj.year === newDateObj.year);
    };

    const handleDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            if (calendarType === 1) {
                if (checkIfNextDateAvailable(calendarApi)) {
                    calendarApi.next();
                    setDate(calendarApi.getDate());
                }
            } else {
                calendarApi.next();
                setDate(calendarApi.getDate());
            }
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
