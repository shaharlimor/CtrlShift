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
    FormControl
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useAuth from 'hooks/useAuth';

import { getSpecificEmployeesDetails, changeEmployeesInShift } from 'utils/api';

const SwitchTab = ({ event, roles, allEmployess, onCancel, initCheck }) => {
    const { user } = useAuth();

    const [missingRoles, setMissingRoles] = useState([]);
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

    const handleUserShift = () => {
        // eslint-disable-next-line
        const userRole = event.roles.find((role) => role.employeeIds.includes(user._id));
        if (userRole) {
            setUserRole(userRole.roleType);
        }
    };

    const handleMissingEmployess = () => {
        let result = '';

        // for each role in roles check if amount === assigned employess amount
        roles.forEach((role) => {
            const { amount, roleType } = role;

            const insertedEmployessAmount = checked.reduce((count, employee) => {
                const [, role] = employee.split('-'); // extract the role type from the employee string
                if (role === roleType) {
                    return count + 1; // increment the count if the role type matches the given value
                }
                return count;
            }, 0);
            const difference = amount - insertedEmployessAmount;

            if (difference > 0) {
                // eslint-disable-next-line
                result = result + ' ' + difference + ' ' + roleType + ', ';
            }
        });

        setMissingRoles(result.slice(0, -2));
    };

    useEffect(() => {
        handleUserShift();
        handleMissingEmployess();
    }, []);

    const usersRole = (id) => {
        // find the employee string in the checked array
        const checkedString = checked.find((str) => str.startsWith(id));
        // if no matching string was found, return null
        if (!checkedString) return null;
        const idAndRole = checkedString.split('-');
        return idAndRole[1];
    };

    useEffect(() => {
        handleMissingEmployess();
        const getEmp = async () => {
            // get the checked employees id's (from db and selected)
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
        };
        getEmp();
    }, [checked]);

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
                            <InputLabel id="Change Assigment">Employees List</InputLabel>
                            <Select labelId="Change Assigment" sx={{ width: '90%', bgcolor: 'background.paper' }}>
                                {allEmployess?.map((value) => {
                                    const test = '';
                                    return (
                                        <ListItem
                                            key={value.id + value.role}
                                            secondaryAction={
                                                <Checkbox
                                                    edge="end"
                                                    onChange={handleChangeEmployeesSelction(value.id + '-' + value.role)}
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
    event: PropTypes.array,
    roles: PropTypes.array,
    allEmployess: PropTypes.array,
    onCancel: PropTypes.func,
    initCheck: PropTypes.array
};

export default SwitchTab;
