import MainCard from 'components/cards/MainCard';
import { lazy } from 'react';
import Loadable from 'components/Loadable';

const ShiftsComp = Loadable(lazy(() => import('components/shifts')));

const CreateShiftsBoard = () => (
    <MainCard title="Manage Your Shifts Board">
        <ShiftsComp />
    </MainCard>
);

export default CreateShiftsBoard;
