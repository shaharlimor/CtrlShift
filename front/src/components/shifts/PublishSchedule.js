import PropTypes from 'prop-types';

import { Button } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { publishSchdule } from 'utils/api';
import { useToaster } from 'react-hot-toast';

const PublishScheduleButton = ({ date }) => {
    const { user } = useAuth();
    const toaster = useToaster();

    const handleClick = async () => {
        const body = {
            organization: user.organization,
            month: (date.getMonth() + 1) % 12,
            year: date.getYear() + 2000 - 100
        };

        try {
            await publishSchdule(body);
            toaster.success('Schedule published successfully!');
        } catch (error) {
            toaster.error('Failed to publish schedule.');
        }
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
            Publish Schedule
        </Button>
    );
};
PublishScheduleButton.propTypes = {
    date: PropTypes.instanceOf(Date)
};

export default PublishScheduleButton;
