import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
    Avatar,
    CardContent,
    Grid,
    Typography,
    Button,
    Collapse,
    ListItemButton,
    ListItem,
    ListItemText,
    Checkbox,
    Select,
    IconButton,
    InputLabel,
    FormControl,
    TableContainer
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useAuth from 'hooks/useAuth';

import { getSpecificEmployeesDetails, changeEmployeesInShift, getShiftsByRoleType } from 'utils/api';

const SwitchTab = ({ event, roles, allEmployess, onCancel, initCheck }) => {
    const { user } = useAuth();

    const [userRole, setUserRole] = useState(null);

    const [roleShifts, setRoleShifts] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [checked, setChecked] = useState(initCheck);
    const [open, setOpen] = useState(false);

    const handleChangeEmployeesSelction = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
    };

    const usersRole = (id) => {
        // find the employee string in the checked array
        const checkedString = checked.find((str) => str.startsWith(id));
        // if no matching string was found, return null
        if (!checkedString) return null;
        const idAndRole = checkedString.split('-');
        return idAndRole[1];
    };

    useEffect(() => {
        const handleUserShift = () => {
            // eslint-disable-next-line
            const userRole = event.roles.find((role) => role.employeeIds.includes(user._id));
            if (userRole) {
                setUserRole(userRole.roleType);
                return userRole.roleType;
            }
            return null;
        };

        const fetchData = async () => {
            const roleType = handleUserShift();
            const employeeIds = checked.map((employee) => {
                const idAndRole = employee.split('-');
                const id = idAndRole[0];
                return id;
            });

            if (employeeIds.length !== 0) {
                const result = await getSpecificEmployeesDetails(employeeIds);
                let parsedData = [];

                parsedData = result.data.map((item) => ({
                    // eslint-disable-next-line
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    // eslint-disable-next-line
                    role: usersRole(item._id)
                }));

                setEmployees(parsedData);
                parsedData = [];
            }

            if (roleType !== null) {
                const shiftsResponse = await getShiftsByRoleType(roleType, event.start);
                const roleShiftsData = shiftsResponse.data;
                setRoleShifts(roleShiftsData);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        const body = checked.reduce((result, str) => {
            const [id, roleType] = str.split('-');
            const existingRole = result.find((r) => r.roleType === roleType);
            if (existingRole) {
                existingRole.employeeIds.push(id);
            } else {
                result.push({ roleType, employeeIds: [id] });
            }
            return result;
        }, []);

        // eslint-disable-next-line
        await changeEmployeesInShift(event._id, {
            roles: body
        });
        onCancel();
    };

    return (
        <CardContent>
            {/*eslint-disable */}
            <Grid container alignItems="center" justifyContent="center" sx={{ mt: 0.5 }}>
                <Typography align="center" component="div" variant="h4">
                    {userRole == null ? "You don't have a shift " : 'Ask for a switch'}
                </Typography>
            </Grid>
            {userRole && (
                <Grid container alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={10}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="Chane Assigment">Shift List</InputLabel>
                            <Select labelId="Chane Assigment" sx={{ width: '90%', bgcolor: 'background.paper' }}>
                                {Array.isArray(roleShifts) &&
                                    roleShifts.map((value) => {
                                        const test = '';
                                        return (
                                            <ListItem
                                                key={value.employeeId + value._id}
                                                secondaryAction={
                                                    <Checkbox
                                                        edge="end"
                                                        onChange={handleChangeEmployeesSelction(value.employeeId + '-' + value.role)}
                                                        checked={checked.indexOf(value.employeeId + value._id) !== -1}
                                                    />
                                                }
                                                disablePadding
                                            >
                                                <ListItemButton>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            alt={value.firstName.toUpperCase()}
                                                            src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${value.employeeId}.png`}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            value.firstName +
                                                            ' ' +
                                                            value.lastName +
                                                            ' - ' +
                                                            value.startTime.toLocaleString('en-US', {
                                                                dateStyle: 'short',
                                                                timeStyle: 'short'
                                                            }) +
                                                            ' - ' +
                                                            value.endTime.toLocaleString('en-US', {
                                                                dateStyle: 'short',
                                                                timeStyle: 'short'
                                                            })
                                                        }
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            onClick={handleSave}
                            sx={{
                                width: '100%',
                                backgroundColor: 'primary.800',
                                '&:hover': {
                                    background: 'primary.dark'
                                }
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            )}
        </CardContent>
    );
};

SwitchTab.propTypes = {
    event: PropTypes.object,
    roles: PropTypes.array,
    allEmployess: PropTypes.array,
    onCancel: PropTypes.func,
    initCheck: PropTypes.array
};

export default SwitchTab;
