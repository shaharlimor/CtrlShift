import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';
import React from 'react';
import InputLabel from 'components/forms/InputLabel';
import { Divider, Grid, TextField, Button, CardActions, FormHelperText, Typography, FormControl, Select, MenuItem } from '@mui/material';
// project imports
import { gridSpacing } from 'store/constant';

/* eslint-disable */
const EmployeeForm = (props) => (
    <MainCard title="Add employee form">
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <InputLabel>Name</InputLabel>
                <TextField fullWidth placeholder="Enter full name" />
                <FormHelperText>Please enter your full name</FormHelperText>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Email</InputLabel>
                <TextField fullWidth placeholder="Enter email" />
                <FormHelperText>Please enter your Email</FormHelperText>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Password</InputLabel>
                <TextField type="password" fullWidth placeholder="Enter Password" />
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Phone</InputLabel>
                <TextField fullWidth placeholder="Enter email" />
                <FormHelperText>Please enter your phone number</FormHelperText>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Role</InputLabel>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="role-select">Role</InputLabel>
                    <Select labelId="role-select" id="role" name="role" label="role">
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Manager'}>Manager</MenuItem>
                        <MenuItem value={'Waiter'}>Waiter</MenuItem>
                        <MenuItem value={'Trainee'}>Trainee</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <CardActions>
                <Grid container spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <Grid item>
                        <Button variant="contained" color="secondary">
                            Submit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button variant="outlined">Clear</Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={props.changeShowForm} variant="outlined">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Grid>
    </MainCard>
);
/* eslint-disable */

// eslint-disable-next-line
export default EmployeeForm;
