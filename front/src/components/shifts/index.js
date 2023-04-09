import { lazy, useState, useEffect } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import { Dialog } from '@mui/material';
import { getMonthlyShifts } from 'utils/api';
import useAuth from 'hooks/useAuth';
import AddConstraintFrom from './AddShiftFrom';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const Shifts = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    // TODO: get shift by month (only if open to insert)
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
            console.log(result.data);
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

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div>
            <Calendar calendarType={1} events={events} handleEventSelect={handleEventSelect} />
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && <AddConstraintFrom event={selectedEvent} onCancel={handleModalClose} employess />}
            </Dialog>
        </div>
    );
};

export default Shifts;
