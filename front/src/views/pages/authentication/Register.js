import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

const Register = () => {
    const theme = useTheme();

    return (
        <Typography color={theme.palette.primary.main} gutterBottom variant={'h3'}>
            Register page
        </Typography>
    );
};

export default Register;
