import PropTypes from 'prop-types';

import { Button, Tooltip, Typography } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { publishSchdule } from 'utils/api';

const PublishScheduleButton = ({ date }) => {
    const { user } = useAuth();

    const handleClick = async () => {
        const body = {
            organization: user.organization,
            month: (date.getMonth() + 1) % 12,
            year: date.getYear() + 2000 - 100
        };
        await publishSchdule(body);
    };

    return (
        <Tooltip
            placement="top"
            title={
                <Typography align="center" fontSize="1.3em">
                    Employees will be able to see the shift schedule for this month
                </Typography>
            }
        >
            <Button
                variant="contained"
                sx={{
                    width: '100%'
                }}
                size="large"
                onClick={handleClick}
            >
                Publish Schedule
            </Button>
        </Tooltip>
    );
};
PublishScheduleButton.propTypes = {
    date: PropTypes.instanceOf(Date)
};

export default PublishScheduleButton;
