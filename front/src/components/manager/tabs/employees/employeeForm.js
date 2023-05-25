import MainCard from 'components/cards/MainCard';
import React from 'react';
import InputLabel from 'components/forms/InputLabel';
/* eslint-disable */
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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { createUser, updateUser } from 'utils/userApi';
import { getRoleTypesByOrg } from 'utils/roleTypeServices';

/* eslint-disable */
const EmployeeForm = (props) => {
    const { selectedUser, changeShowForm } = props;
    const { user } = useAuth();
    const [roleTypes, setRoleTypes] = React.useState([]);
    const [submit, setSubmit] = React.useState(false);
    const [selected, setSelected] = React.useState(selectedUser != null ? selectedUser.role_types : []);
    const [message, setMessage] = React.useState(null);

    React.useEffect(() => {
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
            .matches(/^[a-zA-Z]+$/, 'Last name should contain only letters'),
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
                // values.isAdmin = false;
                values.roles = selected;
                values.organization = user.organization;
                if (!selectedUser) {
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
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="First name"
                                margin="normal"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                type="text"
                                defaultValue=""
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
                                defaultValue=""
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Email"
                                margin="normal"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                type="text"
                                defaultValue=""
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
                                type="text"
                                defaultValue=""
                                disabled={selectedUser}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Phone"
                                margin="normal"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                // type="number"
                                defaultValue=""
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    labelId="mutiple-select-label"
                                    multiple
                                    value={selected}
                                    onChange={handleChange}
                                    renderValue={(selected) => selected.join(', ')}
                                    label="roles"
                                    fullWidth
                                >
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
                        <Grid item xs={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        fullWidth
                                        margin="normal"
                                        name="isAdmin"
                                        checked={formik.values.isAdmin}
                                        onChange={formik.handleChange}
                                        error={formik.touched.isAdmin && Boolean(formik.errors.isAdmin)}
                                        helperText={formik.touched.isAdmin && formik.errors.isAdmin}
                                    />
                                }
                                label="Admin"
                            />
                        </Grid>
                        <CardActions>
                            <Grid container spacing={1} sx={{ alignItems: 'flex-start' }}>
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
                    {submit && message?.length > 0 ? (
                        <ListItemText
                            primary={
                                <Typography variant="h6" style={{ color: '#ff6f00' }}>
                                    {message}
                                </Typography>
                            }
                        ></ListItemText>
                    ) : (
                        <div></div>
                    )}
                </form>
            </MainCard>
        </>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default EmployeeForm;
