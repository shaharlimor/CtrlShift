import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';
import { Button } from '@mui/material';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

const Calendar = Loadable(lazy(() => import('components/calendar')));

/* eslint-disable */
const CreateShiftsBoard = () => (
    <MainCard title="CreateShiftsBoard">
        <Calendar calendarType={1} />
    </MainCard>
);
/* eslint-disable */

export default CreateShiftsBoard;
