import { lazy, useState, useEffect } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import AddEventForm from './AddEventForm';
import { Dialog } from '@mui/material';
import { getMonthlyShifts } from 'utils/api';

const Calendar = Loadable(lazy(() => import('components/calendar')));

/* eslint-disable */
const Constrainsts = (props) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);

    useEffect(async () => {
        const r = await getMonthlyShifts();
        let parsedData = [];
        r.data.map((item) =>
            parsedData.push({
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
        // setSelectedRange(null);
    };

    return (
        <div>
            <Calendar calendarType={0} events={events} handleEventSelect={handleEventSelect} />
            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && (
                    <AddEventForm
                        event={selectedEvent}
                        // range={selectedRange}
                        onCancel={handleModalClose}
                        // handleDelete={handleEventDelete}
                        // handleCreate={handleEventCreate}
                        // handleUpdate={handleUpdateEvent}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default Constrainsts;
