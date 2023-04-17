import PropTypes from 'prop-types';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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

const levelOptions = [1, 2, 3, 4, 5];

const AddConstraintFrom = ({ event, onCancel }) => {
    const { user } = useAuth();
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

    const { errors, touched, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle color="primary.800">
                        Add Constraint - {event.title} - {new Date(event.start).toLocaleDateString('de-DE')}
                    </DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 2 }}>
                        <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                            <Grid item xs={4}>
                                <TextField
                                    error={Boolean(touched.level && errors.level)}
                                    fullWidth
                                    select
                                    helperText={touched.level && errors.level}
                                    label="Urgency"
                                    value={formik.values.level}
                                    onChange={(opt) => {
                                        formik.setFieldValue('level', opt.target.value);
                                    }}
                                >
                                    {levelOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={8.1}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={1}
                                    label="comment"
                                    {...getFieldProps('comment')}
                                    error={Boolean(touched.comment && errors.comment)}
                                    helperText={touched.comment && errors.comment}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Button type="submit" variant="contained" color="secondary" sx={{ width: '30%' }}>
                                Save
                            </Button>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

AddConstraintFrom.propTypes = {
    event: PropTypes.object,
    onCancel: PropTypes.func
};

export default AddConstraintFrom;
