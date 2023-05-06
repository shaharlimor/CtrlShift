import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';
import Avatar1 from 'assets/images/user-1.png';

const RenderGrid = ({ data }) =>
    data.map((emp) => (
        // eslint-disable-next-line
        <Grid key={emp._id} item xs={12}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Avatar src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${emp.id}.png`} />
                </Grid>
                <Grid item xs>
                    <Typography align="left" component="div" variant="subtitle1">
                        {emp.firstName}
                    </Typography>
                    <Typography align="left" component="div" variant="subtitle2">
                        {emp.lastName}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    ));
export default RenderGrid;
