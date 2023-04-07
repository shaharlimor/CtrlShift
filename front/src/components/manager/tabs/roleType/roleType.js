import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';
import React, { useEffect } from 'react';
// eslint-disable-next-line
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button } from '@mui/material';
import RoleTypeForm from './roleTypeForm';

/* eslint-disable */
const RoleTypes = () => {
    // eslint-disable-next-line
    const [showForm, setShowForm] = React.useState(false);

    const changeShowForm = () => {
        setShowForm(!showForm);
    };

    return (
        <MainCard title="RoleTypes">
            {showForm && <RoleTypeForm changeShowForm={changeShowForm} />}
            {!showForm && <RoleTypesList />}
            {!showForm && (
                <Button variant="contained" onClick={changeShowForm} size="small" startIcon={<AddCircleOutlineTwoToneIcon />}>
                    Add Role Type
                </Button>
            )}
        </MainCard>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default RoleTypes;
