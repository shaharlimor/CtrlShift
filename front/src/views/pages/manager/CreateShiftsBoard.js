import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const CreateShiftsBoard = () => {
    const theme = useTheme();

    return (
        <Typography color={theme.palette.secondary.main} gutterBottom variant={'h3'}>
            Create Shifts Board page
        </Typography>
    );
};

export default CreateShiftsBoard;
