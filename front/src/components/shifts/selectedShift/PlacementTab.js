import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
/* eslint-disable */
import { Avatar, CardContent, Grid, Typography } from '@mui/material';
import { getSpecificEmployeesDetails, getEmployeesByOrg } from 'utils/api';
import useAuth from 'hooks/useAuth';
import InputLabel from 'components/forms/InputLabel';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import {
    TextField,
    Button,
    CardActions,
    ListItemButton,
    ListItem,
    List,
    ListItemText,
    Checkbox,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
/* eslint-disable*/
const PlacementTab = ({ eventId, roles }) => {
    const [missingRoles, setMissingRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesToDisplayIds, setEmployeesIds] = useState([]);
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState(['shahar']);

    const handleToggle = (value) => () => {
        console.log('selected is:');
        console.log(checked);
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleRolesAndEmployess = () => {
        // for each role in roles check if amount === employeeIds.length
        // if not employess missing in that shifts from that type
        let result = 'Missing employees: ';
        let combinedSet = [];
        roles.forEach((role) => {
            const { amount, roleType, employeeIds } = role;
            const difference = amount - employeeIds.length;
            if (difference !== 0) {
                result = result + ' ' + difference + ' ' + roleType + ', ';
            }
            combinedSet = new Set([...combinedSet, ...employeeIds]);
        });

        // Convert the Set back to an array
        const tmp = new Set([...employeesToDisplayIds, ...combinedSet]);
        setEmployeesIds(...tmp);
        setMissingRoles(result.slice(0, -2));
    };
    useEffect(() => {
        handleRolesAndEmployess();
    }, []);

    useEffect(() => {
        const getEmployees = async () => {
            /* eslint-disable-next-line */
            const res = await getEmployeesByOrg(user.organization);
            let parsedData = [];
            res.data.users.map(async (item) => {
                item.role_types.forEach((rl) => {
                    parsedData.push({
                        id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        role: rl
                    });
                });
            });
            setData(parsedData);
            parsedData = [];
        };
        getEmployees();
    }, []);

    const userRole = (id) => {
        let ans = '';
        roles.forEach((role) => {
            const { roleType, employeeIds } = role;
            if (employeeIds.includes(id)) {
                ans = roleType;
                // return;
            }
        });
        return ans;
    };

    useEffect(() => {
        const getEmp = async () => {
            if (employeesToDisplayIds && employeesToDisplayIds.length !== 0) {
                const result = await getSpecificEmployeesDetails(employeesToDisplayIds);
                let parsedData = [];
                parsedData = result.data.map((item) => ({
                    // eslint-disable-next-line
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    role: userRole(item._id)
                }));

                setEmployees(parsedData);
                parsedData = [];
            }
        };
        getEmp();
    }, [employeesToDisplayIds]);
    // TODO: create a state of all the emoloyess to display - from the db and from the manually inserted
    // display it
    // create post to db
    // add option to add

    /* eslint-disable */
    return (
        <CardContent>
            <Typography align="center" component="div" variant="h3" sx={{ mb: 1 }}>
                {missingRoles}
            </Typography>
            <Grid container spacing={1} alignItems="center">
                {employees &&
                    employees.map((emp) => (
                        /*eslint-disable */
                        <Grid key={emp.id} item xs={4}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid key={emp.LastName} item>
                                    <Avatar
                                        alt={emp.firstName}
                                        src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${emp.id}.png`}
                                    />
                                </Grid>
                                <Grid key={emp.firstName} item xs>
                                    <Typography align="left" component="div" variant="subtitle1">
                                        {emp.firstName} {emp.lastName}
                                    </Typography>
                                    <Typography align="left" component="div" variant="subtitle2">
                                        {emp.role}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    ))}
            </Grid>

            <Grid container alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                <Select labelId="Chane Assigment" sx={{ width: '90%', bgcolor: 'background.paper' }}>
                    {data?.map((value) => {
                        const test = '';
                        return (
                            <ListItem
                                key={value.id + value.role}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={handleToggle(value.id + '-' + value.role)}
                                        checked={checked.indexOf(value.id + '-' + value.role) !== -1}
                                    />
                                }
                                disablePadding
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar
                                            alt={value.firstName.toUpperCase()}
                                            src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${value.id}.png`}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText primary={value.firstName + ' ' + value.lastName + ' - ' + value.role} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </Select>
            </Grid>
        </CardContent>
    );
};

PlacementTab.propTypes = {
    eventId: PropTypes.string,
    roles: PropTypes.array
};

export default PlacementTab;
