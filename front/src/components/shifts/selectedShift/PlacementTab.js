import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
/* eslint-disable */
import { Avatar, CardContent, Grid, Typography } from '@mui/material';
import { getSpecificEmployeesDetails, getEmployeesByOrg } from 'utils/api';
import useAuth from 'hooks/useAuth';
import InputLabel from 'components/forms/InputLabel';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import {
    TextField,
    Button,
    CardActions,
    Collapse,
    ListItemButton,
    ListItem,
    List,
    ListItemText,
    Checkbox,
    FormControl,
    Select,
    MenuItem,
    IconButton
} from '@mui/material';
/* eslint-disable*/
const PlacementTab = ({ eventId, roles, allEmployess }) => {
    const [missingRoles, setMissingRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesToDisplayIds, setEmployeesIds] = useState([]);
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [checked, setChecked] = useState([]);
    const [open, setOpen] = useState(false);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const handleOpen = () => {
        setOpen(!open);
    };

    const handleRolesAndEmployess = () => {
        // for each role in roles check if amount === employeeIds.length
        // if not employess missing in that shifts from that type
        let result = 'Missing employees: ';
        // let combinedSet = [];
        let changeChecked = [];
        roles.forEach((role) => {
            const { amount, roleType, employeeIds } = role;
            const difference = amount - employeeIds.length;
            if (difference !== 0) {
                result = result + ' ' + difference + ' ' + roleType + ', ';
            }
            employeeIds.map((employeeId) => {
                const newObject = employeeId + '-' + roleType;
                changeChecked.push(newObject);
            });
        });

        setChecked(changeChecked);
        setMissingRoles(result.slice(0, -2));
    };
    useEffect(() => {
        handleRolesAndEmployess();
    }, []);

    const userRole = (id) => {
        // find the employee string in the checked array
        const checkedString = checked.find((str) => str.startsWith(id));
        // if no matching string was found, return null
        if (!checkedString) return null;
        const idAndRole = checkedString.split('-');
        return idAndRole[1];
    };

    useEffect(() => {
        const getEmp = async () => {
            // get the checked employees id's (from db and selected)
            const employeeIds = checked.map((employee) => {
                const idAndRole = employee.split('-');
                const id = idAndRole[0];
                return id;
            });
            const result = await getSpecificEmployeesDetails(employeeIds);
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
        };
        getEmp();
    }, [checked]);
    // TODO: create a state of all the emoloyess to display - from the db and from the manually inserted
    // display it
    // create post to db
    // add option to add

    /* eslint-disable */
    return (
        <CardContent>
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
                <Typography align="center" component="div" variant="h4">
                    {missingRoles.length !== 0 ? missingRoles : 'Change Assigment'}
                </Typography>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </Grid>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {open && (
                    <Grid container alignItems="center" justifyContent="center" sx={{ mt: 0.5 }}>
                        <Select labelId="Chane Assigment" sx={{ width: '90%', bgcolor: 'background.paper' }}>
                            {allEmployess?.map((value) => {
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
                )}
            </Collapse>
        </CardContent>
    );
};

PlacementTab.propTypes = {
    eventId: PropTypes.string,
    roles: PropTypes.array,
    allEmployess: PropTypes.array
};

export default PlacementTab;
