import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';
import React, { useEffect } from 'react';
// eslint-disable-next-line

import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { IconButton, Grid } from '@mui/material';
import RoleTypeForm from './roleTypeForm';

/* eslint-disable */
const RoleTypes = () => {
    const theme = useTheme();

    // eslint-disable-next-line
    const [showForm, setShowForm] = React.useState(false);
    const [roleToEdit, setRoleToEdit] = React.useState();

    const changeShowForm = () => {
        setRoleToEdit();
        setShowForm(!showForm);
    };

    const handleEdit = (row) => {
        changeShowForm();
        setRoleToEdit(row);
    };

    return (
        <MainCard title="RoleTypes">
            {showForm && <RoleTypeForm roleToEdit={roleToEdit} changeShowForm={changeShowForm} />}
            {!showForm && <RoleTypesList handleEdit={handleEdit} />}
            {!showForm && (
                <Grid container direction="column" justifyContent="center" alignItems="flex-end">
                    <Grid item xs={3} sx={{ mt: 2 }}>
                        <IconButton
                            variant="contained"
                            sx={{
                                fontSize: '35px',
                                bgcolor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText
                            }}
                            onClick={changeShowForm}
                            size="large"
                        >
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </MainCard>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default RoleTypes;
