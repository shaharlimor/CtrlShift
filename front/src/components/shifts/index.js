import { lazy, useState, useEffect } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import { Dialog } from '@mui/material';
import { getMonthlyShifts } from 'utils/api';
import useAuth from 'hooks/useAuth';
import AddShiftFrom from './AddShiftFrom';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const Shifts = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    // TODO: get shifts by month (only if permenant shifts generated) + by organization
    useEffect(() => {
        const getShifts = async () => {
            /* eslint-disable-next-line */
            const result = await getMonthlyShifts(user.organization);
            let parsedData = [];
            result.data.map((item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    color: value.secondary200,
                    description: item.name,
                    start: new Date(item.startTime.toString()),
                    end: new Date(item.endTime.toString()),
                    title: item.name
                })
            );
            setEvents(parsedData);
            parsedData = [];
        };
        getShifts();
    }, []);

    const handleEventSelect = (arg) => {
        // if (arg.event.id) {
        //     const selectEvent = events.find((_event) => _event.id === arg.event.id);
        //     setSelectedEvent(selectEvent);
        // } else {
        //     setSelectedEvent(null);
        // }
        // setIsModalOpen(true);
    };

    return (
        <div>
            <Calendar calendarType={1} events={events} handleEventSelect={handleEventSelect} />
        </div>
    );
};

export default Shifts;
