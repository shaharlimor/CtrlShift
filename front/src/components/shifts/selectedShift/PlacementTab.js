import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Avatar, CardContent, Grid, Typography } from '@mui/material';

/* eslint-disable*/
const PlacementTab = ({ employees, roles }) => {
    const [missingRoles, setMissingRoles] = useState([]);

    const handleRolesAndEmployess = () => {
        // for each role in roles check if amount === employeeIds.length
        // if not employess missing in that shifts from that type
        let result = 'Missing employees: ';
        roles.forEach((role) => {
            const { amount, roleType, employeeIds } = role;
            const difference = amount - employeeIds.length;
            if (difference !== 0) {
                result = result + ' ' + difference + ' ' + roleType + ', ';
            }
        });
        setMissingRoles(result.slice(0, -2));
    };
    useEffect(() => {
        handleRolesAndEmployess();
    }, []);

    return (
        <CardContent>
            <Typography align="center" component="div" variant="h3">
                {/* {missingRoles[0].roleType} */}
                {missingRoles}
            </Typography>
        </CardContent>
    );
};

PlacementTab.propTypes = {
    employees: PropTypes.array,
    roles: PropTypes.array
};

export default PlacementTab;
