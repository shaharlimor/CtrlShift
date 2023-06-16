import { Link as RouterLink } from 'react-router-dom';

import { Link } from '@mui/material';

import logo from 'assets/images/logo.jpg';
import { activeItem } from 'store/slices/menu';
import { useDispatch } from 'store';

/* eslint-disable */
const LogoSection = () => {
    const dispatch = useDispatch();
    const itemHandler = (id) => {
        dispatch(activeItem([id]));
    };

    return (
        <Link component={RouterLink} to="/shifts-board">
            <img src={logo} alt="CtrlShift" width="160" onClick={() => itemHandler('Shifts-Board')} />
        </Link>
    );
};

export default LogoSection;
