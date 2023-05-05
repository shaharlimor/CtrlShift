import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { gridSpacing } from 'store/constant';
// import { SwitchShiftRequest } from 'utils/api';
import useAuth from 'hooks/useAuth';

const SwitchShiftPopup = ({ onCancel, events }) => {
    const { user } = useAuth();
    const theme = useTheme();

    const handleSwitchShift = async () => {
        // await SwitchShiftRequest(event.id);
        onCancel();
    };

    return (
        // eslint-disable-next-line
        <Fragment>
            <DialogTitle color="primary.800">Switch Shift</DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                    {console.log(events)}
                </Grid>
            </DialogContent>
            <DialogActions sx={{ pb: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.grey[400],
                            '&:hover': {
                                background: theme.palette.grey[300]
                            },
                            width: '15%'
                        }}
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.error.dark,
                            '&:hover': {
                                background: theme.palette.error.main
                            },
                            width: '15%'
                        }}
                        onClick={handleSwitchShift}
                    >
                        Submit
                    </Button>
                </Grid>
            </DialogActions>
        </Fragment>
    );
};

SwitchShiftPopup.propTypes = {
    events: PropTypes.array,
    onCancel: PropTypes.func
};

export default SwitchShiftPopup;
