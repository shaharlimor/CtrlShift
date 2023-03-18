import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const CreateShiftsBoard = () => (
    <MainCard title="CreateShiftsBoard">
        <Calendar />
    </MainCard>
);

export default CreateShiftsBoard;
