import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button } from '@mui/material';

/* eslint-disable */
const RoleTypes = () => (
    <MainCard title="RoleTypes">
        <RoleTypesList />
        <Button
                variant="contained"
                sx={{ width: '15%' }}
                size="large"
                startIcon={(<AddCircleOutlineTwoToneIcon />)}>
               Add Role Type
            </Button>
    </MainCard>
);
/* eslint-disable */

// eslint-disable-next-line
export default RoleTypes;