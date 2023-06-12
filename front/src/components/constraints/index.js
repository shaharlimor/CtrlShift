import { lazy, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { getMonthlyShiftsOpenToConstraintsByRoles, getConstraintsByUserId, getMonthlyShiftsOpenToConstraints } from 'utils/api';
import { colorGenerator } from 'utils/color-generator';

import Loadable from 'components/Loadable';
import AddEventForm from './AddConstraintFrom';
import value from 'assets/scss/_themes-vars.module.scss';

import { IconUserCheck } from '@tabler/icons';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const Constrainsts = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [shiftsWithConstraints, setShiftsWithConstraints] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const getShifts = async () => {
            /* eslint-disable-next-line */
            const result = await getConstraintsByUserId(user._id);
            let parsedData = [];
            result.data.map(async (item) =>
                parsedData.push({
                    id: item.shiftId
                })
            );
            setShiftsWithConstraints(parsedData);
            parsedData = [];
        };
        getShifts();
    }, []);

    const handleIsConstraintInsertTitle = async (name, shiftId) => {
        let ans = name;
        if (await shiftsWithConstraints.some((shift) => shift.id === shiftId)) {
            ans += ' ✔️';
        }
        return ans;
    };

    useEffect(() => {
        const getShifts = async () => {
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
                    /* eslint-disable-next-line */
                    title: await handleIsConstraintInsertTitle(item.name, item._id)
                })
            );
            setEvents(parsedData);
            parsedData = [];
        };
        getShifts();
    }, [shiftsWithConstraints]);

    const handleEventSelect = (arg) => {
        if (arg.event.id) {
            const selectEvent = events.find((_event) => _event.id === arg.event.id);
            setSelectedEvent(selectEvent);
        } else {
            setSelectedEvent(null);
        }
        setIsModalOpen(true);
    };

    const handleModalClose = async () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        // eslint-disable-next-line
        const result = await getConstraintsByUserId(user._id);
        let parsedData = [];
        result.data.map(async (item) =>
            parsedData.push({
                id: item.shiftId
            })
        );
        setShiftsWithConstraints(parsedData);
        parsedData = [];
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
