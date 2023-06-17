import { useState, useEffect } from 'react';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Grid,
    TextField,
    Button,
    CardActions,
    ListItemIcon,
    ListItemText,
    Checkbox,
    FormControl,
    Select,
    MenuItem,
    Typography,
    FormControlLabel
} from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import { createUser, updateUser } from 'utils/userApi';
import { getRoleTypesByOrg } from 'utils/roleTypeServices';
import MainCard from 'components/cards/MainCard';

const EmployeeForm = (props) => {
    const { selectedUser, changeShowForm } = props;
    const { user } = useAuth();
    const [roleTypes, setRoleTypes] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [selected, setSelected] = useState(selectedUser != null ? selectedUser.role_types : []);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const getRoles = async () => {
            const result = await getRoleTypesByOrg(user.organization);
            setRoleTypes(result.data);
        };
        getRoles();
    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required('First name is required')
            .matches(/^[a-zA-Z]+$/, 'First name should contain only letters'),
        lastName: Yup.string()
            .required('Last name is required')
            .matches(/^[a-zA-Z\s-]+$/, 'Last name should contain only letters, spaces, and hyphens'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().required('Password is required'),
        phone: Yup.string()
            .matches(/^\d{10}$/, 'Invalid phone number')
            .required('Phone is required'),
        isAdmin: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            email: selectedUser?.email,
            password: selectedUser ? '****' : '',
            firstName: selectedUser?.firstName,
            lastName: selectedUser?.lastName,
            phone: selectedUser?.phone,
            organization: selectedUser?.organization,
            isAdmin: selectedUser ? selectedUser.isAdmin : false
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
            try {
                values.roles = selected;
                values.organization = user.organization;
                if (!selectedUser) {
                    // eslint-disable-next-line
                    const id = chance.bb_pin();
                    values.id = id;

                    await createUser(values).then(
                        () => {
                            resetForm();
                            changeShowForm();
                            setSubmit(false);
                            setMessage(null);
                        },
                        (err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err });
                            setMessage(err);
                            setSubmitting(false);
                        }
                    );
                } else {
                    // eslint-disable-next-line
                    values.id = selectedUser._id;
                    values.tokens = selectedUser.tokens;
                    values.password = selectedUser.password;

                    await updateUser(values).then(
                        () => {
                            resetForm();
                            changeShowForm();
                            setSubmit(false);
                            setMessage(null);
                        },
                        (err) => {
                            setStatus({ success: false });
                            setErrors({ submit: err });
                            setMessage(err);
                            setSubmitting(false);
                        }
                    );
                }
            } catch (err) {
                setStatus({ success: false });
                setErrors({ submit: err });
                setMessage(err);
                setSubmitting(false);
            }
        }
    });

    const handleChange = (event) => {
        const value = event.target.value;
        setSelected(value);
    };

    const changeData = () => {
        setMessage(null);
    };

    return (
        <>
            <MainCard title={selectedUser ? 'Edit employee' : 'Add employee'}>
                <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} onChange={changeData}>
                    <Grid container spacing={1.5} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="First name"
                                margin="normal"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                type="text"
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Last name"
                                margin="normal"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                type="text"
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                disabled
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                type="text"
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Password"
                                margin="normal"
                                name="password"
                                value={selectedUser ? '****' : formik.values.password}
                                onChange={formik.handleChange}
                                type="password"
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={5} sx={{ mt: 1 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                margin="normal"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ minWidth: 120 }} fullWidth>
                                <Typography variant="subtitle2">Roles</Typography>
                                <Select
                                    labelId="mutiple-select-label"
                                    multiple
                                    value={selected}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    <MenuItem disabled value="">
                                        <ListItemText primary="Roles" />
                                    </MenuItem>
                                    {roleTypes?.map((role) => (
                                        <MenuItem key={role.roleType} value={role.roleType}>
                                            <ListItemIcon>
                                                <Checkbox checked={selected?.indexOf(role.roleType) > -1} />
                                            </ListItemIcon>
                                            <ListItemText primary={role.roleType} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1} sx={{ mt: 1 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        margin="normal"
                                        name="isAdmin"
                                        checked={formik.values.isAdmin}
                                        onChange={formik.handleChange}
                                        error={formik.touched.isAdmin && Boolean(formik.errors.isAdmin)}
                                    />
                                }
                                label="Admin"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CardActions>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item>
                                        <Button type="submit" variant="contained" color="secondary" onClick={() => setSubmit(true)}>
                                            Submit
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button onClick={changeShowForm} variant="outlined">
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardActions>
                        </Grid>
                    </Grid>
                    {submit && message?.length > 0 ? (
                        <ListItemText
                            primary={
                                <Typography variant="h6" style={{ color: '#ff6f00' }}>
                                    {message}
                                </Typography>
                            }
                        />
                    ) : (
                        <></>
                    )}
                </form>
            </MainCard>
        </>
    );
};

export default EmployeeForm;
