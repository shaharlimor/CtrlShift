import { lazy, useState, useEffect } from 'react';
import { Dialog } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { getMonthlyShiftsPublished } from 'utils/api';
import { colorGenerator } from 'utils/color-generator';

import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';

import { IconUserCheck } from '@tabler/icons';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import SwitchShiftPopup from './SwitchShiftPopup';
import { constant } from 'lodash';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const ShiftBoard = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const [filteredByEmplyee, setFilteredByEmplyee] = [];

    useEffect(() => {
        const getShifts = async () => {
            const result = await getMonthlyShiftsPublished(user.organization);
            let parsedData = [];
            result.data.map(async (item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    color: await colorGenerator(item.startTime.toString()),
                    description: item.name,
                    start: new Date(item.startTime.toString()),
                    end: new Date(item.endTime.toString()),
                    title: item.name,
                    roles: item.roles
                })
            );
            console.log('parsedData', parsedData);
            setEvents(parsedData);
            parsedData = [];
        };
        getShifts();
    }, []);

    const getShiftsForEmployee = () => {
        // eslint-disable-next-line
        const employeeID = user._id;
        const shiftsForEmployee = [];

        // eslint-disable-next-line
        for (const shift of events) {
            const roles = shift.roles;

            // eslint-disable-next-line
            for (const role of roles) {
                if (role.employeeIds === employeeID) {
                    shiftsForEmployee.push(shift);
                    break;
                }
            }
        }

        setFilteredByEmplyee(shiftsForEmployee);
    };

    const removeGetShiftsByEmployee = () => {
        setFilteredByEmplyee([]);
    };

    const handleChangeMyShifts = () => {
        if (filteredByEmplyee === []) {
            getShiftsForEmployee();
        } else {
            removeGetShiftsByEmployee();
        }
    };

    const handleEventSelect = (arg) => {
        // TODO: add show details of the shift
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
    };

    const handleSwitchShiftClick = () => {
        console.log('clicked');
        setIsModalOpen(true);
    };

    return (
        <div>
            <Calendar calendarType={2} events={events} handleEventSelect={handleEventSelect} />
            {/* Dialog renders its body even if not open */}
            <Dialog maxWidth="sm" fullWidth onClose={handleModalClose} open={isModalOpen} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
                {isModalOpen && (
                    <SwitchShiftPopup
                        handleChangeMyShifts={handleChangeMyShifts()}
                        handleSwitchShiftClick={handleSwitchShiftClick()}
                        onCancel={handleModalClose}
                        events={filteredByEmplyee !== null ? filteredByEmplyee : events}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default ShiftBoard;
