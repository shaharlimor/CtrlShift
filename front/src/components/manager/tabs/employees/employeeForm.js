import MainCard from 'components/cards/MainCard';
import React from 'react';
import InputLabel from 'components/forms/InputLabel';
import { Grid, TextField, Button, CardActions, FormHelperText, Typography, FormControl, Select, MenuItem } from '@mui/material';
// project imports
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'hooks/useAuth';
import { createUser } from 'utils/userApi';
import { getRoleTypes } from 'utils/roleTypeServices';

/* eslint-disable */
const EmployeeForm = (props) => {
    const { user } = useAuth();
    const [roleTypes, setRoleTypes] = React.useState([]);

    React.useEffect(() => {
        const getRoles = async () => {
            const result = await getRoleTypes("hello");
            setRoleTypes(result.data);
        };
        getRoles();
    }, []);

    const validationSchema = Yup.object({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        phone: Yup.string().required('Phone is required'),
        role: Yup.string().required('role is required')
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phone:'',
            organization: '',
            role: ''
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
            try {
                values.organization = user.organization;
                const id = chance.bb_pin();
                values.id = id;
                values.isAdmin = false;

                // TODO - send also role id
                await createUser(values).then(
                    () => {
                        resetForm();
                        props.changeShowForm();
                    },
                    (err) => {
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                );
            } catch (err) {
                console.error(err);
                if (scriptedRef.current) {
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                }
            }
        }
    });

    return (
    <>
    <MainCard title="Add employee form">
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
                <InputLabel>First name</InputLabel>
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
                    helperText={formik.touched.firstName && formik.errors.firstName}/>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Last name</InputLabel>
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
                    helperText={formik.touched.lastName && formik.errors.lastName}/>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Email</InputLabel>
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
                    helperText={formik.touched.email && formik.errors.email}/>
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Password</InputLabel>
                <TextField  
                    fullWidth
                    label="Password"
                    margin="normal"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    type="text"
                    defaultValue=""
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password} />
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Phone</InputLabel>
                <TextField 
                    fullWidth
                    label="Phone"
                    margin="normal"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    type="text"
                    defaultValue=""
                    error={formik.touched.phone && Boolean(formik.errors.phone)}
                    helperText={formik.touched.phone && formik.errors.phone} />
            </Grid>
            <Grid item xs={12}>
                <InputLabel>Role</InputLabel>
                <FormControl  
                sx={{ minWidth: 120 }}>
                    <Select  
                        id="role" 
                        name="role" 
                        label="role"
                        fullWidth
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        defaultValue=""
                        error={formik.touched.role && Boolean(formik.errors.role)}
                        helperText={formik.touched.role && formik.errors.role}>
                        {roleTypes?.map((role, index) => (
                            <MenuItem key={index} value={role.roleType}>
                                {role.roleType}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText error>{formik.errors.role}</FormHelperText>
                </FormControl>
            </Grid>
            <CardActions>
                <Grid container spacing={1} sx={{ alignItems: 'flex-start' }}>
                    <Grid item>
                        <Button type="submit" variant="contained" color="secondary">
                            Submit
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button onClick={props.changeShowForm} variant="outlined">
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Grid>
        </form>
        </MainCard>
        </>
    
    );
}
/* eslint-disable */

// eslint-disable-next-line
export default EmployeeForm;
