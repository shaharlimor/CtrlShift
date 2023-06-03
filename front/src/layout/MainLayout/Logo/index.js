import { Link as RouterLink } from 'react-router-dom';

import { Link } from '@mui/material';

import logo from 'assets/images/logo.jpg';

const LogoSection = () => (
    <Link component={RouterLink} to="/shifts-board">
        <img src={logo} alt="CtrlShift" width="160" />
    </Link>
);

export default LogoSection;
