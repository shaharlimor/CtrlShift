import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Typography from 'themes/typography';

const Calendar = Loadable(lazy(() => import('components/calendar')));

/* eslint-disable */
const Constrainsts = (props) => {
    const x = 1;
    return (
        <div>
            <Calendar calendarType={0} />
        </div>
    );
};

export default Constrainsts;
