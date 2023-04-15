import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { gridSpacing } from 'store/constant';
import { deleteMonthlyShift } from 'utils/api';
import useAuth from 'hooks/useAuth';

const DeleteShiftPopup = ({ event, onCancel }) => {
    const { user } = useAuth();
    const theme = useTheme();

    const handleDeleteClicked = async () => {
        await deleteMonthlyShift(event.id);
        onCancel();
    };

    return (
        // eslint-disable-next-line
        <Fragment>
            <DialogTitle color="primary.800">
                Delete - {event.title} - {new Date(event.start).toLocaleDateString('de-DE')}
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                    <Grid item justifyContent="center">
                        <Typography variant="h3">Are you sure?</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">Do you really want to delete this shift? This process cannot be undone</Typography>
                    </Grid>
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
                        onClick={handleDeleteClicked}
                    >
                        Delete
                    </Button>
                </Grid>
            </DialogActions>
        </Fragment>
    );
};

DeleteShiftPopup.propTypes = {
    event: PropTypes.object,
    onCancel: PropTypes.func
};

export default DeleteShiftPopup;
