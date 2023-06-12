import PropTypes from 'prop-types';

import { Avatar, CardContent, Grid, Typography, Tooltip } from '@mui/material';

// eslint-disable-next-line
const ConstraintsTab = ({ employees }) => {
    /* eslint-disable */
    const baseComponent = (emp) => {
        return (
            <Grid container spacing={2} alignItems="center">
                <Grid key={emp.LastName} item>
                    <Avatar alt={emp.firstName} src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${emp.id}.png`} />
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
        );
    };

    const tooltipText = (emp) => {
        if (emp.level !== '1' && emp.description !== '') return 'urgency: ' + emp.level + ' - comment: ' + emp.description;
        else if (emp.level !== '1') return 'urgency: ' + emp.level;
        return 'comment: ' + emp.description;
    };

    // eslint-disable-next-line
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
                        <Grid key={emp.id} item xs={4}>
                            {emp.description === '' && emp.level === '1' ? (
                                <>{baseComponent(emp)}</>
                            ) : (
                                <Tooltip placement="bottom-start" title={<Typography fontSize="1.3em">{tooltipText(emp)}</Typography>}>
                                    {baseComponent(emp)}
                                </Tooltip>
                            )}
                        </Grid>
                    ))}
            </Grid>
        </CardContent>
    );
};

ConstraintsTab.propTypes = {
    employees: PropTypes.array
};

export default ConstraintsTab;
