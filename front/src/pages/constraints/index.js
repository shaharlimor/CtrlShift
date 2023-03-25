import { Typography } from '@mui/material';

import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainCard from 'components/cards/MainCard';

const ConstrainstsComp = Loadable(lazy(() => import('components/constraints')));

const Constraints = () => (
    <MainCard title="Constraints">
        <ConstrainstsComp />
    </MainCard>
);

export default Constraints;
