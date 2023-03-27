import PropTypes from 'prop-types';

// material-ui
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
// import ColorPalette from './ColorPalette';
import { gridSpacing } from 'store/constant';
import NestedList from 'components/list/NestedList';
import { addConstraint } from 'utils/api';

// constant
const getInitialValues = (event) => {
    const newEvent = {
        level: '1',
        comment: ''
    };

    if (event) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

const levelOptions = [1, 2, 3, 4, 5];

const AddEventFrom = ({ event, handleDelete, onCancel }) => {
    const EventSchema = Yup.object().shape({
        level: Yup.number(),
        comment: Yup.string().max(5000)
    });

    const formik = useFormik({
        initialValues: getInitialValues(event),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    level: values.level,
                    description: values.comment,
                    shiftId: event.id,
                    employeeId: '964018ac'
                };
                await addConstraint(data);

                resetForm();
                onCancel();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
                            <Grid item xs={10}>
                                <NestedList />
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

AddEventFrom.propTypes = {
    event: PropTypes.object,
    handleDelete: PropTypes.func,
    onCancel: PropTypes.func
};

export default AddEventFrom;
