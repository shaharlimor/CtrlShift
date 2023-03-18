import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const Calendar = Loadable(lazy(() => import('components/calendar')));

const ShiftsBoard = () => (
    <MainCard title="Shifts Board">
        <Calendar />
    </MainCard>
);

export default ShiftsBoard;
