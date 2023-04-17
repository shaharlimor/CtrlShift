import axios from 'utils/axios';

// material-ui
import { Button, Grid, Stack, TextField } from '@mui/material';

// project imports
import AnimateButton from 'components/AnimateButton';
import { gridSpacing } from 'store/constant';

import { useState } from 'react';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleClick = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            alert('New password and confirm password do not match!');
        } else {
            try {
                const response = await axios.post('/user/changePassword', {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                });
                console.log(response.data.message);

                if (response.data.message === 'Password changed successfully') {
                    alert('Password changed successfully!');
                } else {
                    alert('An error occurred, please try again later.');
                }
            } catch (error) {
                if (error === 'Current password is incorrect') {
                    alert('Current password is incorrect!');
                } else {
                    alert('An error occurred, please try again later.');
                }
            }
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sm={6}>
                <TextField
                    type="password"
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={6}>
                <TextField
                    type="password"
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    type="password"
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Stack direction="row">
                    <AnimateButton>
                        <Button variant="outlined" size="large" onClick={handleClick}>
                            Change Password
                        </Button>
                    </AnimateButton>
                </Stack>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
