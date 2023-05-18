import EmployeeList from 'components/manager/tabs/employees/employeeList';
import React from 'react';
// eslint-disable-next-line
import AddIcon from '@mui/icons-material/Add';

import { IconButton, Grid, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EmployeeForm from './employeeForm';

const Employees = () => {
    const theme = useTheme();

    // eslint-disable-next-line
    const [showForm, setShowForm] = React.useState(false);

    const changeShowForm = () => {
        setShowForm(!showForm);
    };

    return (
        <fragment>
            {showForm && <EmployeeForm changeShowForm={changeShowForm} />}
            {!showForm && <EmployeeList />}
            {!showForm && (
                // eslint-disable-next-line
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
        </fragment>
    );
};

export default Employees;
