import PropTypes from 'prop-types';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, InputAdornment } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { Fragment } from 'react';
// project imports
import { gridSpacing } from 'store/constant';
import { addMonthlyShift } from 'utils/api';
import useAuth from 'hooks/useAuth';
import { useTheme } from '@mui/material/styles';
import DateRangeIcon from '@mui/icons-material/DateRange';

const AddShiftFrom = ({ onCancel }) => {
    const { user } = useAuth();
    const theme = useTheme();

    const EventSchema = Yup.object().shape({
        name: Yup.string().max(5000).required('Shift name is required'),
        end: Yup.date()
            .when('start', (start, schema) => start && schema.min(start, 'End date must be later than start date'))
            .required('End date is required'),
        start: Yup.date().required('Start date is required'),
        roles: Yup.array().min(1, 'roles is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            end: new Date(),
            start: new Date(),
            roles: [{ roleType: '', amount: '' }]
        },
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            // TODO: first check if permanent shifts for this month and year already generated.
            try {
                /* eslint-disable */
                console.log(values);
                // const data = {
                //     organization: user.organization,
                //     startTime: values.start,
                //     endTime: values.end,
                //     name: values.name,
                //     roles: []
                // };
                // /* eslint-enable */
                // await addMonthlyShift(data);
                // resetForm();
                // onCancel();
                // setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    // const { errors, touched, handleSubmit, getFieldProps } = formik;
    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle color="primary.800">Add new shift</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 2 }}>
                        <Grid container spacing={gridSpacing} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={1}
                                    label="name"
                                    {...getFieldProps('name')}
                                    error={Boolean(touched.name && errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="Start date"
                                    value={values.start}
                                    inputFormat="dd/MM/yyyy hh:mm a"
                                    onChange={(date) => setFieldValue('start', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <MobileDateTimePicker
                                    label="End date"
                                    value={values.end}
                                    inputFormat="dd/MM/yyyy hh:mm a"
                                    onChange={(date) => setFieldValue('end', date)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={Boolean(touched.end && errors.end)}
                                            helperText={touched.end && errors.end}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <DateRangeIcon />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            {formik.values.roles.map((role, index) => (
                                <Fragment key={index}>
                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            name={`roles.${index}.roleType`}
                                            label="Role Type"
                                            fullWidth
                                            error={formik.touched.roles && Boolean(formik.errors.roles)}
                                            helperText={formik.touched.roles && formik.errors.roles}
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <TextField
                                            name={`roles.${index}.amount`}
                                            label="Amount"
                                            type="number"
                                            fullWidth
                                            error={formik.touched.roles && Boolean(formik.errors.roles)}
                                            helperText={formik.touched.roles && formik.errors.roles}
                                        />
                                    </Grid>
                                </Fragment>
                            ))}
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Button
                                type="button"
                                variant="contained"
                                sx={{
                                    width: '30%',
                                    mr: 1,
                                    backgroundColor: theme.palette.grey[300],
                                    // eslint-disable-next-line
                                    color: theme.palette.common['black'],
                                    '&:hover': {
                                        background: theme.palette.grey[200]
                                    }
                                }}
                                onClick={() => formik.setFieldValue('roles', [...formik.values.roles, { roleType: '', amount: '' }])}
                            >
                                Add Role
                            </Button>
                            <Button type="submit" variant="contained" color="secondary" sx={{ width: '30%', ml: 1 }}>
                                Save
                            </Button>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

AddShiftFrom.propTypes = {
    onCancel: PropTypes.func
};

export default AddShiftFrom;
