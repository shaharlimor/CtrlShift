import { lazy, useState } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import { add, set, sub } from 'date-fns';
import AddEventForm from './AddEventForm';
import { Dialog } from '@mui/material';

const Calendar = Loadable(lazy(() => import('components/calendar')));

/* eslint-disable */
const Constrainsts = (props) => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleEventSelect = (arg) => {
        if (arg.event.id) {
            const selectEvent = events.find((_event) => _event.id === arg.event.id);
            setSelectedEvent(selectEvent);
        } else {
            setSelectedEvent(null);
        }
        setIsModalOpen(true);
        console.log('clicke');
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
