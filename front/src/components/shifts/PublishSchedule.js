import { Button } from '@mui/material';
import { publishSchdule } from 'utils/api';
import PropTypes from 'prop-types';
import useAuth from 'hooks/useAuth';

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
        <Button variant="contained" sx={{ width: '100%' }} size="large" onClick={handleClick}>
            Publish Schedule
        </Button>
    );
};
PublishScheduleButton.propTypes = {
    date: PropTypes.instanceOf(Date)
};

export default PublishScheduleButton;
