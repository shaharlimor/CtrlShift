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
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

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
                    startTime: Yup.string().required('start time is required'),
                    endTime: Yup.string().required('end time is required'),
                    name: Yup.string().required('name is required'),
                    days: Yup.array().min(1, 'days is required'),
                    roles: Yup.array().min(1, 'roles is required')
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
                    console.log('submit');
                    handleAddOpenClose();
                }}
            >
                {({ errors, handleBlur, handleChange, setFieldValue, handleSubmit, isSubmitting, touched, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={matchDownSM ? 0 : 2} justifyContent="center" alignItems="center">
                            <Grid item xs={12}>
                                <Grid container spacing={matchDownSM ? 0 : 2} justifyContent="center" alignItems="center">
                                    <Grid item xs={12} sm={6}>
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
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Grid container spacing={matchDownSM ? 0 : 2} justifyContent="center" alignItems="center">
                                    <Grid item xs={6} sm={3}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopTimePicker
                                                label="start time"
                                                fullWidth
                                                value={values.startTime}
                                                onChange={(newValue) => setFieldValue('startTime', newValue)}
                                                renderInput={(props) => <TextField fullWidth {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DesktopTimePicker
                                                label="end time"
                                                fullWidth
                                                value={values.endTime}
                                                onChange={(newValue) => setFieldValue('endTime', newValue)}
                                                renderInput={(props) => <TextField fullWidth {...props} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} container justifyContent="center" sx={{ flexDirection: 'row' }}>
                                <FormControl component="fieldset">
                                    {/* <FormLabel component="legend">Days</FormLabel> */}
                                    <FormGroup sx={{ justifyContent: 'center', flexDirection: 'row' }}>
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                                            <React.Fragment key={day}>
                                                <FormControlLabel
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
                                            </React.Fragment>
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

                            <Grid item xs={1.5}>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{
                                        fontSize: '15px',
                                        bgcolor: theme.palette.grey.main,
                                        color: theme.palette.grey.contrastText
                                    }}
                                    onClick={() => setFieldValue('roles', [...values.roles, { roleType: '', amount: '' }])}
                                >
                                    Add Role
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} container spacing={5} justifyContent="center">
                            <Grid item xs={5}>
                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button
                                            fullWidth
                                            size="large"
                                            onSubmit={handleSubmit}
                                            type="submit"
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Add
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <Box sx={{ mt: 2 }}>
                                    <AnimateButton>
                                        <Button fullWidth size="large" onClick={handleAddOpenClose} variant="contained" color="secondary">
                                            Cancel
                                        </Button>
                                    </AnimateButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Grid>
    );
};

export default AddPermenentShift;
