import { useState } from 'react';

import { IconButton, Grid, Tooltip, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
// import { useTheme } from '@mui/material/styles';

import EmployeeForm from './employeeForm';
import EmployeeList from 'components/manager/tabs/employees/employeeList';

const Employees = () => {
    const theme = useTheme();
    const [showForm, setShowForm] = useState(false);

    const changeShowForm = () => {
        setShowForm(!showForm);
    };

    return (
        <>
            {showForm && <EmployeeForm changeShowForm={changeShowForm} edit={false} />}
            {!showForm && <EmployeeList />}
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
                            <Tooltip placement="top" title="Add">
                                <AddIcon />
                            </Tooltip>
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default Employees;
