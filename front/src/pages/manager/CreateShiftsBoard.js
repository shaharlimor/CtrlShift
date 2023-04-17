import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const ShiftsComp = Loadable(lazy(() => import('components/shifts')));

/* eslint-disable */
const CreateShiftsBoard = () => (
    <MainCard title="Manage your shifts board">
        <ShiftsComp />
    </MainCard>
);

export default CreateShiftsBoard;
