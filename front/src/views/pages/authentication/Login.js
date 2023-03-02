import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = () => {
    const theme = useTheme();

    return (
        <Typography color={theme.palette.secondary.main} gutterBottom variant={'h3'}>
            Login page
        </Typography>
    );
};

export default Login;
