import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const Calendar = Loadable(lazy(() => import('components/calendar')));

/* eslint-disable */
const ShiftsBoard = () => (
    <MainCard title="Shifts Board">
        <Calendar isAdmin={false}/>
    </MainCard>
);
/* eslint-disable */

export default ShiftsBoard;
