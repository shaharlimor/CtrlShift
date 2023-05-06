import PropTypes from 'prop-types';

import { Avatar, CardContent, Grid, Typography } from '@mui/material';

/* eslint-disable*/
const ConstraintsTab = ({ employees }) => {
    return (
        <CardContent>
            {employees.length === 0 ? (
                <Typography align="center" component="div" variant="h3">
                    Everyone is available!
                </Typography>
            ) : (
                ''
            )}
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
                                        {emp.firstName}
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

ConstraintsTab.propTypes = {
    employees: PropTypes.array
};

export default ConstraintsTab;
