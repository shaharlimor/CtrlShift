import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import {
    Avatar,
    CardContent,
    Grid,
    Typography,
    Button,
    ListItemButton,
    ListItem,
    ListItemText,
    Checkbox,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import useAuth from 'hooks/useAuth';

import { createSwapRequest, getShiftsByRoleType } from 'utils/api';

const SwitchTab = ({ event, onCancel }) => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [roleShifts, setRoleShifts] = useState([]);
    const [checked, setChecked] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null);

    const handleChangeShiftSelction = (value) => () => {
        const newChecked = [...checked];
        const index = newChecked.indexOf(value);

        if (index === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(index, 1);
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

            if (roleType !== null && event.roles && event.roles.length > 0) {
                const shiftsResponse = await getShiftsByRoleType(roleType, event.start);
                const roleShiftsData = shiftsResponse.data;

                const filteredShifts = roleShiftsData.filter((shift) => {
                    const hasShiftRole = event.roles.some((role) => role.employeeIds.includes(shift.employeeId));

                    return !hasShiftRole;
                });

                setRoleShifts(filteredShifts);
            }
        };

        fetchData();
    });

    const handleSave = async () => {
        /*eslint-disable */
        const swapRequests = checked.reduce((result, str) => {
            const [employeeId, _id] = str.toString().split('-');

            const swapRequest = {
                userId: user._id,
                shiftId: event.id,
                requestShiftId: _id,
                requestUserId: employeeId
            };

            result.push(swapRequest);

            return result;
        }, []);

        swapRequests.forEach((request) => {
            createSwapRequest(request);
        });

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
                                                        onChange={handleChangeShiftSelction(`${value.employeeId}-${value._id}`)}
                                                        checked={checked.includes(`${value.employeeId}-${value._id}`)}
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
