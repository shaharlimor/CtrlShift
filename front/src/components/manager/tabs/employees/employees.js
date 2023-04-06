import EmployeeList from 'components/manager/tabs/employees/employeeList';
import MainCard from 'components/cards/MainCard';
import React, { useEffect } from 'react';
// eslint-disable-next-line
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button } from '@mui/material';
import EmployeeForm from './employeeForm';

/* eslint-disable */
const Employees = () => {
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
                <Button
                    variant="contained"
                    sx={{ width: '15%' }}
                    onClick={changeShowForm}
                    size="large"
                    startIcon={<AddCircleOutlineTwoToneIcon />}
                >
                    Add Emloyee
                </Button>
            )}
        </React.Fragment>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default Employees;
