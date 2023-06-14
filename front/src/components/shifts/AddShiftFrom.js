import PropTypes from 'prop-types';
import { Fragment, useState, useEffect } from 'react';
// eslint-disable-next-line
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, InputAdornment, IconButton, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Field, FieldArray } from 'formik';
import { gridSpacing } from 'store/constant';
import { addMonthlyShift } from 'utils/api';
import useAuth from 'hooks/useAuth';
import { getRoleTypesByOrg } from 'utils/roleTypeServices';

const AddShiftFrom = ({ onCancel }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const [roleTypes, setRoleTypes] = useState([]);

    useEffect(() => {
        const getRole = async () => {
            const result = await getRoleTypesByOrg(user.organization);
            setRoleTypes(result.data);
        };
        getRole();
    }, []);

    const ValidationCheck = Yup.object().shape({
        name: Yup.string().max(5000).required('Shift name is required'),
        end: Yup.date()
            .when('start', (start, schema) => start && schema.min(start, 'End date must be later than start date'))
            .required('End date is required'),
        start: Yup.date().required('Start date is required'),
        roles: Yup.array()
            .of(
                Yup.object().shape({
                    roleType: Yup.string().min(3, 'Role type must be at least 3 characters').required('Role type is required'), // these constraints take precedence
                    amount: Yup.number().required('Amount of employess is required').min(1, 'Minimum 1 employee in each role') // these constraints take precedence
                })
            )
            .min(1, 'Minimum of 1 role is required')
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            end: new Date(),
            start: new Date(),
            roles: [{ roleType: '', amount: '' }]
        },
        validationSchema: ValidationCheck,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            // TODO: first check if permanent shifts for this month and year already generated.
            try {
                const parsedRoles = values.roles.map((obj) => ({ ...obj, employeeIds: [] }));
                const data = {
                    organization: user.organization,
                    startTime: values.start,
                    endTime: values.end,
                    name: values.name,
                    roles: parsedRoles
                };
                await addMonthlyShift(data);
                resetForm();
                onCancel();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle color="primary.800">Add new shift</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 2 }}>
                        <Grid container spacing={gridSpacing} justifyContent="space-between" alignItems="center">
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
                                    error={Boolean(touched.start && errors.start)}
                                    helperText={touched.start && errors.start}
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
                                    error={Boolean(touched.end && errors.end)}
                                    helperText={touched.end && errors.end}
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

                            <FieldArray name="roles">
                                {({ push, remove }) => (
                                    <>
                                        {values.roles.map((role, index) => (
                                            <Fragment key={index}>
                                                <Grid item xs={5.3} sm={4}>
                                                    <Typography variant="subtitle2">Roles</Typography>
                                                    <Select
                                                        fullWidth
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
                                                <Grid item xs={5.3} sm={5.3}>
                                                    <Field
                                                        name={`roles[${index}].amount`}
                                                        label="Amount"
                                                        as={TextField}
                                                        type="number"
                                                        fullWidth
                                                        error={Boolean(
                                                            touched.roles &&
                                                                touched.roles[index] &&
                                                                errors.roles &&
                                                                errors.roles[index]?.amount
                                                        )}
                                                        helperText={
                                                            touched.roles &&
                                                            touched.roles[index] &&
                                                            errors.roles &&
                                                            errors.roles[index]?.amount
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item xs={1} sm={1} sx={{ mr: 2 }}>
                                                    <IconButton
                                                        variant="outlined"
                                                        sx={{ fontWeight: 'bold' }}
                                                        onClick={() => {
                                                            if (values.roles.length !== 1) {
                                                                remove(index);
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
                                                onClick={() => push({ roleType: '', amount: '' })}
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
                                    </>
                                )}
                            </FieldArray>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
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

AddShiftFrom.propTypes = {
    onCancel: PropTypes.func
};

export default AddShiftFrom;
