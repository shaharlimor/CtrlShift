import React from 'react';
import { Button, CardContent, CardActions, Divider, Grid, TextField, FormControl, FormHelperText } from '@mui/material';
import InputLabel from 'components/forms/InputLabel';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';

// third party
import * as Yup from 'yup';
import { useFormik, Field } from 'formik';
import { saveRoleType, updateRoleType } from 'utils/roleTypeServices';

/* eslint-disable */
const RoleTypeForm = (props) => {
    const theme = useTheme();
    const { changeShowForm, roleToEdit } = props;
    const { user } = useAuth();
    const validationSchema = Yup.object({
        roleType: Yup.string().required('roleType is required')
    });

    const formik = useFormik({
        initialValues: {
            roleType: roleToEdit ? roleToEdit.roleType : ""
        },
        validationSchema,
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            let data = {};
            if(roleToEdit) {
                data = {
                    _id: roleToEdit._id,
                    roleType: values.roleType,
                    organization: user.organization
                };
            } else {
                data = {
                    roleType: values.roleType,
                    organization: user.organization
                };
            }
            try {
                if(data._id) {
                    await updateRoleType(data).then(
                        () => {
                            changeShowForm();
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
                    await saveRoleType(data).then(
                        () => {
                            changeShowForm();
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
            console.log('submit');
            changeShowForm();
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <InputLabel>Role Type</InputLabel>
                        <TextField
                            fullWidth
                            label="role type"
                            margin="normal"
                            name="roleType"
                            value={formik.values.roleType}
                            onChange={formik.handleChange}
                            type="text"
                            sx={{ ...theme.typography.customInput }}
                            error={formik.touched.roleType && Boolean(formik.errors.roleType)}
                            helperText={formik.touched.roleType && formik.errors.roleType}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
            <CardActions>
                <Grid container spacing={1}>
                    <Grid item>
                        <Button variant="contained" type="submit" color="secondary">
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
        </form>
    );
};
/* eslint-disable */

// eslint-disable-next-line
export default RoleTypeForm;
