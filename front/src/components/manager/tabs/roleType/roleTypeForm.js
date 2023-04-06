import RoleTypesList from 'components/manager/tabs/roleType/roleTypeList';
import MainCard from 'components/cards/MainCard';
import { Button, CardContent, CardActions, Divider, Grid, TextField, FormHelperText, Typography } from '@mui/material';
import InputLabel from 'components/forms/InputLabel';
// project imports
import { gridSpacing } from 'store/constant';

/* eslint-disable */
const RoleTypeForm = (props) => (
    <React.Fragment>
        <CardContent>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <InputLabel>Name</InputLabel>
                    <TextField fullWidth placeholder="Enter Role Type" />
                </Grid>
            </Grid>
        </CardContent>
        <Divider />
        <CardActions>
            <Grid container spacing={1}>
                <Grid item>
                    <Button variant="contained" color="secondary">
                        Submit
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined">Clear</Button>
                </Grid>
                <Grid item>
                    <Button onClick={props.changeShowForm} variant="outlined">
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </CardActions>
    </React.Fragment>
);
/* eslint-disable */

// eslint-disable-next-line
export default RoleTypeForm;
