import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    FormGroup,
    FormLabel,
    Typography,
    useMediaQuery
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// third party
import * as Yup from 'yup';
import { Formik, Field } from 'formik';

import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from '../AnimateButton';

const AddPermenentShift = (props) => {
    const theme = useTheme();

    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { handleAddOpenClose } = props;

    return (
        <Grid container direction="column" justifyContent="center" spacing={2} padding={5}>
            <Formik
                initialValues={{
                    startTime: null,
                    endTime: null,
                    days: [],
                    name: '',
                    roles: [{ roleType: '', amount: '' }]
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    // // TODO: send to new perment shift to the server
                    // try {
                    //     await savePermentShidt.then(
                    //         () => {
                    //    handleAddOpenClose();
                    //         },
                    //         (err) => {
                    //             if (scriptedRef.current) {
                    //                 setStatus({ success: false });
                    //                 setErrors({ submit: err.message });
                    //                 setSubmitting(false);
                    //             }
                    //         }
                    //     );
                    // } catch (err) {
                    //     console.error(err);
                    //     if (scriptedRef.current) {
                    //         setStatus({ success: false });
                    //         setErrors({ submit: err.message });
                    //         setSubmitting(false);
                    //     }
                    // }
                    handleAddOpenClose();
                }}
            >
                {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    name="name"
                                    type="text"
                                    defaultValue=""
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="start time"
                                        fullWidth
                                        value={values.startTime}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={handleChange('startTime')}
                                        renderInput={(props) => <TextField fullWidth {...props} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker
                                        label="end time"
                                        value={values.endTime}
                                        fullWidth
                                        inputFormat="dd/MM/yyyy"
                                        onChange={handleChange('endTime')}
                                        renderInput={(props) => <TextField fullWidth {...props} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Days</FormLabel>
                                    <FormGroup>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                            <FormControlLabel
                                                key={day}
                                                control={
                                                    <Checkbox
                                                        checked={values.days.includes(day)}
                                                        onChange={() => {
                                                            const newDays = values.days.includes(day)
                                                                ? values.days.filter((d) => d !== day)
                                                                : [...values.days, day];
                                                            setFieldValue('days', newDays);
                                                        }}
                                                        name={day}
                                                    />
                                                }
                                                label={day}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            </Grid>

                            {values.roles.map((role, index) => (
                                <React.Fragment key={index}>
                                    <Grid item xs={6} sm={3}>
                                        <Field component={TextField} name={`roles.${index}.roleType`} label="Role Type" fullWidth />
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Field
                                            component={TextField}
                                            name={`roles.${index}.amount`}
                                            label="Amount"
                                            type="number"
                                            fullWidth
                                        />
                                    </Grid>
                                </React.Fragment>
                            ))}

                            <Grid item xs={12}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{ backgroundColor: theme.palette.secondary.light }}
                                    onClick={() => setFieldValue('roles', [...values.roles, { roleType: '', amount: '' }])}
                                >
                                    Add Role
                                </Button>
                            </Grid>
                        </Grid>

                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Add
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </Grid>
    );
};

export default AddPermenentShift;
