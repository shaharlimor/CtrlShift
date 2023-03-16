// material-ui
import { useTheme } from '@mui/material/styles';
import logo from '../assets/images/logo.jpg';

const Logo = () => {
    const theme = useTheme();

    return <img src={theme.palette.mode === 'dark' ? logo : logo} alt="CtrlShift" width="100" />;
};

export default Logo;
