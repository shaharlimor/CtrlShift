import EmployeeList from 'components/manager/tabs/employees/employeeList';
import React, { useEffect } from 'react';
// eslint-disable-next-line
import AddIcon from '@mui/icons-material/Add';

import { IconButton, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EmployeeForm from './employeeForm';

/* eslint-disable */
const Employees = () => {
    const theme = useTheme();

    // eslint-disable-next-line
    const [showForm, setShowForm] = React.useState(false);

    const changeShowForm = () => {
        setShowForm(!showForm);
    };

    return (
        <React.Fragment>
            {showForm && <EmployeeForm changeShowForm={changeShowForm} />}
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
                            <AddIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default Employees;
