import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Avatar, CardContent, Grid, Typography } from '@mui/material';
import { getSpecificEmployeesDetails } from 'utils/api';

/* eslint-disable*/
const PlacementTab = ({ eventId, roles }) => {
    const [missingRoles, setMissingRoles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesToDisplayIds, setEmployeesIds] = useState([]);
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
        const getEmp = async () => {
            if (employeesToDisplayIds && employeesToDisplayIds.length !== 0) {
                const result = await getSpecificEmployeesDetails(employeesToDisplayIds);
                let parsedData = [];
                parsedData = result.data.map((item) => ({
                    // eslint-disable-next-line
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName
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

    return (
        <CardContent>
            <Typography align="center" component="div" variant="h3" sx={{ mb: 1 }}>
                {/* {missingRoles[0].roleType} */}
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
                                        {emp.lastName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        /* eslint-enable */
                    ))}
            </Grid>
        </CardContent>
    );
};

PlacementTab.propTypes = {
    eventId: PropTypes.string,
    roles: PropTypes.array
};

export default PlacementTab;
