import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { IconButton, Grid } from '@mui/material';

import RoleTypeForm from './roleTypeForm';
import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';

const RoleTypes = () => {
    const theme = useTheme();
    const [showForm, setShowForm] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState();

    const changeShowForm = () => {
        setRoleToEdit();
        setShowForm(!showForm);
    };

    const handleEdit = (row) => {
        changeShowForm();
        setRoleToEdit(row);
    };

    return (
        <MainCard title="Role Types">
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

export default RoleTypes;
