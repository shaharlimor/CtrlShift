import { lazy, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { getMonthlyShiftsOpenToConstraintsByRoles } from 'utils/api';
import { colorGenerator } from 'utils/color-generator';

import Loadable from 'components/Loadable';
import AddEventForm from './AddConstraintFrom';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const Constrainsts = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getShifts = async () => {
            /* eslint-disable-next-line */
            const result = await getMonthlyShiftsOpenToConstraintsByRoles(user.organization, user.role_types);
            let parsedData = [];
            result.data.map(async (item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    color: await colorGenerator(item.startTime.toString()),
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
        if (arg.event.id) {
            const selectEvent = events.find((_event) => _event.id === arg.event.id);
            setSelectedEvent(selectEvent);
        } else {
            setSelectedEvent(null);
        }
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    return (
        <div>
            <Calendar calendarType={0} events={events} handleEventSelect={handleEventSelect} />
            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && <AddEventForm event={selectedEvent} onCancel={handleModalClose} employess />}
            </Dialog>
        </div>
    );
};

export default Constrainsts;
