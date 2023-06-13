import axios from 'utils/axios';

// material-ui
import React, { useState } from 'react';
import { Avatar, Button, Grid, Stack, TextField, Typography } from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'components/cards/SubCard';
import AnimateButton from 'components/AnimateButton';
import { gridSpacing } from 'store/constant';
import { updateUserDetails } from 'utils/userApi';

const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post('/user/changeImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (error) {
        // Handle the error as needed
        console.error('Error uploading the image:', error);
    }
};

const Profile = () => {
    const { user, logout, setUser } = useAuth();
    const [email, setEmail] = useState(user.email);
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [phone, setPhone] = useState(user.phone);

    // eslint-disable-next-line no-underscore-dangle
    const userId = user._id;

    const test = async () => {
        updateUserDetails(email, firstName, lastName, phone)
            .then((res) => {
                setUser(res.data.user);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const [avatarSrc, setAvatarSrc] = useState(`https://controlshift-images.s3.eu-central-1.amazonaws.com/${userId}.png`);
    const maxFileSize = 500000; // 500 KB

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    if (img.width === img.height && file.size <= maxFileSize) {
                        setAvatarSrc(img.src);

                        uploadImage(file);
                    } else {
                        alert('Image must be square and not exceed 500 KB.');
                    }
                };
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={4}>
                <SubCard title="Profile Picture" contentSX={{ textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Avatar alt={user.firstName} sx={{ width: 100, height: 100, margin: '0 auto' }} src={avatarSrc} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="center">
                                Upload/Change Your Profile Image
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <input accept="image/*" id="contained-button-file" type="file" hidden onChange={handleFileUpload} />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label htmlFor="contained-button-file">
                                <AnimateButton>
                                    <Button variant="contained" size="small" component="span">
                                        Upload Avatar
                                    </Button>
                                </AnimateButton>
                            </label>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item sm={6} md={8}>
                <SubCard title="Edit Account Details">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <TextField
                                disabled
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                label="Email address"
                                defaultValue={email}
                            />
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
                            <Stack direction="row" spacing={gridSpacing}>
                                <AnimateButton>
                                    <Button variant="contained" onClick={test}>
                                        Change Detail
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button variant="contained" onClick={logout}>
                                        Logout
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
