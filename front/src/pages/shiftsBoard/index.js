import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const ShiftBoardCom = Loadable(lazy(() => import('components/shiftBoard')));

/* eslint-disable */
const ShiftsBoard = () => (
    <MainCard title="Shifts Board">
        <ShiftBoardCom />
    </MainCard>
);

export default ShiftsBoard;
