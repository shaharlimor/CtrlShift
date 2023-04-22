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
    ListItemText,
    MenuItem,
    FormHelperText,
    Grid,
    TextField,
    FormGroup,
    useMediaQuery,
    Select
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

// third party
import * as Yup from 'yup';
import { useFormik, Field } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from '../../../AnimateButton';
import { savePermanentShift, updatePermanentShift } from '../../../../utils/permenentShift';
import { getRoleTypes } from 'utils/roleTypeServices';

const AddPermenentShift = (props) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [roleTypes, setRoleTypes] = React.useState([]);
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { handleAddOpenClose, shiftToEdit } = props;

    React.useEffect(() => {
        async function getRoles() {
            // TODO - when a role schema will be
        }
        const getRole = async () => {
            const result = await getRoleTypes(user.organization);
            setRoleTypes(result.data);
        };
        getRole();
    }, []);

    const validationSchema = Yup.object({
        startTime: Yup.string().required('start time is required'),
        endTime: Yup.string().required('end time is required'),
        name: Yup.string().required('name is required'),
        days: Yup.array().min(1, 'days is required'),
        roles: Yup.array().min(1, 'roles is required')
    });

    const formik = useFormik({
        initialValues: {
            startTime: shiftToEdit?.startTime ? shiftToEdit.startTime : null,
            endTime: shiftToEdit?.endTime ? shiftToEdit.endTime : null,
            days: shiftToEdit?.days ? shiftToEdit.days : [],
            name: shiftToEdit?.name ? shiftToEdit.name : '',
            roles: shiftToEdit?.roles ? shiftToEdit.roles : [{ roleType: '', amount: '' }]
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            let data = {};
            if (shiftToEdit) {
                data = {
                    // eslint-disable-next-line
                    _id: shiftToEdit.id,
                    startTime: values.startTime,
                    endTime: values.endTime,
                    days: values.days,
                    name: values.name,
                    roles: values.roles,
                    organization: user.organization
                };
            } else {
                data = {
                    startTime: values.startTime,
                    endTime: values.endTime,
                    days: values.days,
                    name: values.name,
                    roles: values.roles,
                    organization: user.organization
                };
            }
            try {
                // eslint-disable-next-line
                if (data._id) {
                    await updatePermanentShift(data).then(
                        () => {
                            handleAddOpenClose();
                        },
                        (err) => {
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    );
                } else {
                    await savePermanentShift(data).then(
                        () => {
                            handleAddOpenClose();
                        },
                        (err) => {
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    );
                }
            } catch (err) {
                console.error(err);
                if (scriptedRef.current) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }
            handleAddOpenClose();
        }
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={matchDownSM ? 0 : 2} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <Grid container spacing={matchDownSM ? 0 : 2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Name"
                                    margin="normal"
                                    name="name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    type="text"
                                    sx={{ ...theme.typography.customInput }}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helperText={formik.touched.name && formik.errors.name}
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
                                        value={formik.values.startTime}
                                        onChange={(newValue) => formik.setFieldValue('startTime', newValue)}
                                        error={formik.touched.startTime && Boolean(formik.errors.startTime)}
                                        helperText={formik.touched.startTime && formik.errors.startTime}
                                        renderInput={(props) => <TextField fullWidth {...props} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopTimePicker
                                        label="end time"
                                        fullWidth
                                        value={formik.values.endTime}
                                        onChange={(newValue) => formik.setFieldValue('endTime', newValue)}
                                        error={formik.touched.endTime && Boolean(formik.errors.endTime)}
                                        helperText={formik.touched.endTime && formik.errors.endTime}
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
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                    <React.Fragment key={day}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formik.values.days.includes(day)}
                                                    onChange={() => {
                                                        const newDays = formik.values.days.includes(day)
                                                            ? formik.values.days.filter((d) => d !== day)
                                                            : [...formik.values.days, day];
                                                        formik.setFieldValue('days', newDays);
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

                    {formik.values.roles.map((role, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={6} sm={3}>
                                <Select
                                    fullWidth
                                    labelId="mutiple-select-label"
                                    value={role.roleType}
                                    name={`roles[${index}].roleType`}
                                    onChange={formik.handleChange}
                                    renderValue={(selected) => selected}
                                >
                                    {roleTypes?.map((role) => (
                                        <MenuItem key={role.roleType} value={role.roleType}>
                                            <ListItemText primary={role.roleType} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={6} sm={3}>
                                <TextField
                                    value={role.amount}
                                    name={`roles[${index}].amount`}
                                    label="Amount"
                                    type="number"
                                    onChange={formik.handleChange}
                                    fullWidth
                                    error={formik.touched.roles && Boolean(formik.errors.roles)}
                                    helperText={formik.touched.roles && formik.errors.roles}
                                />
                            </Grid>
                        </React.Fragment>
                    ))}

                    <Grid item xs={1.5}>
                        <Button
                            type="button"
                            variant="outlined"
                            sx={{
                                fontSize: '13px',
                                bgcolor: theme.palette.grey.main,
                                color: theme.palette.grey.contrastText
                            }}
                            onClick={() => formik.setFieldValue('roles', [...formik.values.roles, { roleType: '', amount: '' }])}
                        >
                            Add Role
                        </Button>
                    </Grid>
                </Grid>

                <Grid item xs={12} container spacing={5} justifyContent="center">
                    <Grid item xs={5}>
                        {formik.errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{formik.errors.submit}</FormHelperText>
                            </Box>
                        )}
                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button fullWidth size="large" type="submit" variant="contained" color="secondary">
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
        </>
    );
};

export default AddPermenentShift;
