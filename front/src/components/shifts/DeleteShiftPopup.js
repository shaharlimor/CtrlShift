import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, MenuItem, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import { gridSpacing } from 'store/constant';
import { addConstraint, employeeHasConstraintInShift } from 'utils/api';
import useAuth from 'hooks/useAuth';

// constant
const getInitialValues = () => {
    const newEvent = {
        level: '1',
        comment: ''
    };
    return newEvent;
};

const DeleteShiftPopup = ({ event, onCancel }) => {
    const { user } = useAuth();
    const theme = useTheme();

    const EventSchema = Yup.object().shape({
        level: Yup.number(),
        comment: Yup.string().max(5000)
    });

    const formik = useFormik({
        initialValues: getInitialValues(event),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                /* eslint-disable-next-line */
                const alreadyHasConstraint = await employeeHasConstraintInShift(user._id, event.id);
                if (!alreadyHasConstraint.data) {
                    /* eslint-disable */
                    const data = {
                        level: values.level,
                        description: values.comment,
                        shiftId: event.id,
                        employeeId: user._id
                    };
                    /* eslint-enable */
                    await addConstraint(data);

                    resetForm();
                    onCancel();
                    setSubmitting(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
    });

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
