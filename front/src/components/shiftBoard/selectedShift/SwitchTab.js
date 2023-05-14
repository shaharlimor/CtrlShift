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

const SwitchTab = ({ event, roles, allEmployees, onCancel, initCheck }) => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [roleShifts, setRoleShifts] = useState([]);
    const [checked, setChecked] = useState(initCheck);
    const [selectedShift, setSelectedShift] = useState(null);

    const handleChangeShiftSelction = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        setChecked(newChecked);
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
            // eslint-disable-next-line
            const [employeeId, _id] = str.split('-');
            const swapRequest = {
                // eslint-disable-next-line
                userId: user._id,
                // eslint-disable-next-line
                shiftId: event._id,
                // eslint-disable-next-line
                requestShiftId: _id,
                requestUserId: employeeId,
                status: 'open'
            };

            result.push(swapRequest);

            return result;
        }, []);

        //TODO send a request to server to create swapRequest
        // // eslint-disable-next-line
        // await postSwapRequest(event._id, {
        //     roles: body
        // });

        onCancel();
    };

    const handleSelect = (event) => {
        setSelectedShift(event.target.value);
    };

    return (
        <CardContent>
            {/*eslint-disable */}
            <Grid container alignItems="center" justifyContent="center" sx={{ mt: 0.5 }}>
                <Typography align="center" component="div" variant="h4">
                    {userRole == null ? "You don't have a shift" : 'Ask for a switch'}
                </Typography>
            </Grid>
            {userRole && (
                <Grid container alignItems="center" justifyContent="center" sx={{ mt: 2 }}>
                    <Grid item xs={10}>
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel id="Chane Assigment">Shift List</InputLabel>
                            <Select
                                labelId="Change Assignment"
                                sx={{ width: '90%', bgcolor: 'background.paper' }}
                                value={selectedShift || ''}
                                onChange={handleSelect}
                            >
                                {Array.isArray(roleShifts) &&
                                    roleShifts.map((value) => {
                                        const test = '';
                                        return (
                                            <ListItem
                                                key={value.employeeId + value._id}
                                                secondaryAction={
                                                    <Checkbox
                                                        edge="end"
                                                        onChange={handleChangeShiftSelction(value.employeeId + '-' + value._id)}
                                                        checked={checked.indexOf(value.employeeId + '-' + value._id) !== -1}
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
                                                            new Date(value.startTime).toLocaleString('en-US', {
                                                                dateStyle: 'short',
                                                                timeStyle: 'short'
                                                            }) +
                                                            ' - ' +
                                                            new Date(value.endTime).toLocaleString('en-US', {
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
    allEmployees: PropTypes.array,
    onCancel: PropTypes.func,
    initCheck: PropTypes.array
};

export default SwitchTab;
