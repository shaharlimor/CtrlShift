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

import { getSpecificEmployeesDetails, changeEmployeesInShift } from 'utils/api';

const PlacementTab = ({ eventId, roles, allEmployess, onCancel, initCheck }) => {
    const [employees, setEmployees] = useState([]);
    const [checked, setChecked] = useState(initCheck);

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
            if (employeeIds.length !== 0) {
                const result = await getSpecificEmployeesDetails(employeeIds);
                let parsedData = [];

                parsedData = result.data.map((item) => ({
                    // eslint-disable-next-line
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    // eslint-disable-next-line
                    role: userRole(item._id)
                }));

                setEmployees(parsedData);
                parsedData = [];
            }
        };
        getEmp();
    }, []);

    return (
        <CardContent>
            <Grid container spacing={0} alignItems="center">
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
        </CardContent>
    );
};

PlacementTab.propTypes = {
    eventId: PropTypes.string,
    roles: PropTypes.array,
    allEmployess: PropTypes.array,
    onCancel: PropTypes.func,
    initCheck: PropTypes.array
};

export default PlacementTab;
