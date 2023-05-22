import React, { Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    Checkbox,
    Divider,
    IconButton,
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
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

// third party
import * as Yup from 'yup';
import { useFormik, Field, FieldArray } from 'formik';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from '../../../AnimateButton';
import { savePermanentShift, updatePermanentShift } from '../../../../utils/permenentShift';
import { getRoleTypesByOrg } from 'utils/roleTypeServices';

const AddPermenentShift = (props) => {
    const theme = useTheme();
    const { user } = useAuth();
    const [roleTypes, setRoleTypes] = React.useState([]);
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const { handleAddOpenClose, shiftToEdit } = props;

    React.useEffect(() => {
        const getRole = async () => {
            const result = await getRoleTypesByOrg(user.organization);
            setRoleTypes(result.data);
        };
        getRole();
    }, []);

    const validationSchema = Yup.object({
        startTime: Yup.string().required('start time is required'),
        endTime: Yup.string().required('end time is required'),
        name: Yup.string().required('name is required'),
        days: Yup.array().min(1, 'days is required'),
        roles: Yup.array()
            .of(
                Yup.object().shape({
                    roleType: Yup.string().min(3).required('Role type is required'), // these constraints take precedence
                    amount: Yup.number().required('Amount of employess is required').min(1, 'Minimum 1 employee in each role') // these constraints take precedence
                })
            )
            .min(1, 'Minimum of 1 role is required')
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
                        <Fragment key={index}>
                            <Grid item xs={5.3} sm={4}>
                                <Select
                                    fullWidth
                                    label="Role Type"
                                    labelId="select-label"
                                    value={role.roleType}
                                    name={`roles[${index}].roleType`}
                                    onChange={formik.handleChange}
                                    renderValue={(selected) => selected}
                                    error={Boolean(
                                        formik.touched.roles &&
                                            formik.touched.roles[index] &&
                                            formik.errors.roles &&
                                            formik.errors.roles[index]?.roleType
                                    )}
                                >
                                    {roleTypes?.map((role) => (
                                        <MenuItem key={role.roleType} value={role.roleType}>
                                            <ListItemText primary={role.roleType} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={5.3} sm={4}>
                                <TextField
                                    value={role.amount}
                                    type="number"
                                    onChange={formik.handleChange}
                                    name={`roles[${index}].amount`}
                                    label="Amount"
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.roles &&
                                            formik.touched.roles[index] &&
                                            formik.errors.roles &&
                                            formik.errors.roles[index]?.amount
                                    )}
                                    helperText={
                                        formik.touched.roles &&
                                        formik.touched.roles[index] &&
                                        formik.errors.roles &&
                                        formik.errors.roles[index]?.amount
                                    }
                                />
                            </Grid>
                            <Grid item xs={1} sm={1} sx={{ mr: 2 }}>
                                <IconButton
                                    variant="outlined"
                                    sx={{ fontWeight: 'bold' }}
                                    onClick={() => {
                                        if (formik.values.roles.length !== 1) {
                                            formik.setFieldValue('roles', formik.values.roles.splice(index, 1));
                                        }
                                    }}
                                >
                                    <DeleteForeverOutlinedIcon sx={{ color: theme.palette.primary[800] }} />
                                </IconButton>
                            </Grid>
                        </Fragment>
                    ))}
                    <Grid container justifyContent="center" alignItems="center" sx={{ pt: 3, ml: 3.2 }}>
                        <Button
                            type="button"
                            onClick={() => formik.setFieldValue('roles', [...formik.values.roles, { roleType: '', amount: '' }])}
                            variant="contained"
                            sx={{
                                width: '20%',
                                backgroundColor: theme.palette.grey[300],
                                // eslint-disable-next-line
                                color: theme.palette.common['black'],
                                '&:hover': {
                                    background: theme.palette.grey[200]
                                }
                            }}
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
