// material-ui
import React, { useState } from 'react';
import { Avatar, Button, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'components/cards/SubCard';
import AnimateButton from 'components/AnimateButton';
import { gridSpacing } from 'store/constant';
import axios from 'axios';

// assets
// import Avatar1 from 'assets/images/users/user-1.png';

const Profile = () => {
    const { user } = useAuth();
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [phone, setPhone] = useState(user.phone);

    const test = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/updateUserDetails', {
                email,
                firstName,
                lastName,
                phone
            });

            // Handle the response (e.g., show a success message)
            console.log(response.data.message);
        } catch (error) {
            // Handle the error (e.g., show an error message)
            console.error('Error updating user details:', error);
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={4}>
                <SubCard title="Profile Picture" contentSX={{ textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Avatar alt="User 1" sx={{ width: 100, height: 100, margin: '0 auto' }} />
                            {/* <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} /> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="center">
                                Upload/Change Your Profile Image
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button variant="contained" size="small">
                                    Upload Avatar
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item sm={6} md={8}>
                <SubCard title="Edit Account Details">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <TextField onChange={(e) => setEmail(e.target.value)} fullWidth label="Email address" defaultValue={email} />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                onChange={(e) => setFirstName(e.target.value)}
                                fullWidth
                                label="First name"
                                defaultValue={user.firstName}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                onChange={(e) => setLastName(e.target.value)}
                                fullWidth
                                label="Last name"
                                defaultValue={user.lastName}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                onChange={(e) => setPhone(e.target.value)}
                                fullWidth
                                label="Phone number"
                                defaultValue={user.phone}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField fullWidth label="Organization" defaultValue={user.organization} disabled />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row">
                                <AnimateButton>
                                    <Button variant="contained" onClick={test}>
                                        Change Detail
                                    </Button>
                                </AnimateButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default Profile;
