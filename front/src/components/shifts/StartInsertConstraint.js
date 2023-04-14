import PropTypes from 'prop-types';

import { Button } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { startInsertConstraints } from 'utils/api';

const StartInsertConstraintButton = ({ date }) => {
    const { user } = useAuth();

    const handleClick = async () => {
        const body = {
            organization: user.organization,
            month: (date.getMonth() + 1) % 12,
            year: date.getYear() + 2000 - 100
        };
        await startInsertConstraints(body);
    };

    return (
        <Button
            variant="contained"
            sx={{
                width: '100%'
            }}
            size="large"
            onClick={handleClick}
        >
            Start Insert Constraint
        </Button>
    );
};
StartInsertConstraintButton.propTypes = {
    date: PropTypes.instanceOf(Date)
};

export default StartInsertConstraintButton;