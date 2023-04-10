import axios from 'utils/axios';
import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';

// material-ui imports
import { useTheme, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Avatar, Button, Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

// icon imports
import { IconBrandTelegram } from '@tabler/icons';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
    const theme = useTheme();
    const [notifications, setNotificatinos] = useState(null);

    const readNotification = async (id) => {
        await axios.put(`/notifications/markAsRead/${id}`);
        // eslint-disable-next-line no-use-before-define
        fetchData();
    };

    const removeNotification = async (id) => {
        await axios.delete(`/notifications/deleteNotificationById/${id}`);
        // eslint-disable-next-line no-use-before-define
        fetchData();
    };

    const fetchData = async () => {
        const response = await axios.get(`/notifications/`);
        setNotificatinos(
            response.data.map((notification) => (
                <React.Fragment key={notification.id}>
                    <ListItemWrapper
                        style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 4, paddingBottom: 4 }}
                        sx={{ width: 450 }}
                        /* eslint-disable no-underscore-dangle */
                        onClick={() => {
                            if (!notification.isRead) {
                                readNotification(notification._id);
                            }
                        }}
                    >
                        <ListItem alignItems="center">
                            <Avatar alt="John Doe" />
                            <ListItemWrapper style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 4, paddingBottom: 4 }}>
                                <ListItemText
                                    primary={<Typography variant="body1" dangerouslySetInnerHTML={{ __html: notification.message }} />}
                                />
                                <ListItemText
                                    primary={
                                        <Typography variant="subtitle2">
                                            {formatDistance(new Date(notification.date), new Date(), { addSuffix: true })}
                                        </Typography>
                                    }
                                />
                            </ListItemWrapper>
                            {notification.isRead === false && (
                                <Box
                                    sx={{
                                        bgcolor: '#5e35b1',
                                        borderRadius: '50%',
                                        width: 8,
                                        height: 8,
                                        marginLeft: 'auto',
                                        marginRight: 1
                                    }}
                                />
                            )}
                            {notification.isRead === true && (
                                <IconButton
                                    edge="end"
                                    aria-label="remove"
                                    onClick={() => removeNotification(notification._id)}
                                    sx={{ marginLeft: 'auto', color: `#E63946` }}
                                    style={{ marginRight: -6 }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </ListItem>
                        {notification.type === 'switch' && (
                            <Grid container direction="column" className="list-container">
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                style={{
                                                    marginBottom: 4,
                                                    marginRight: 4,
                                                    padding: '3px 8px',
                                                    color: '#000',
                                                    border: '1px solid #333',
                                                    borderColor: '#b6bbbf'
                                                }}
                                                sx={{
                                                    bgcolor: 'white',
                                                    color: 'black',
                                                    '&:hover': {
                                                        bgcolor: '#e0e0e0'
                                                    }
                                                }}
                                            >
                                                Decline
                                            </Button>
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                style={{
                                                    marginBottom: 4,
                                                    padding: '3px 8px',
                                                    color: 'white',
                                                    border: '1px solid #333',
                                                    borderColor: '#b6bbbf'
                                                }}
                                                sx={{
                                                    bgcolor: '#5e35b1',
                                                    '&:hover': {
                                                        bgcolor: '#4527a0'
                                                    }
                                                }}
                                            >
                                                Approve
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                        {notification.type === 'route' && (
                            <Grid container direction="column" className="list-container">
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                disableElevation
                                                endIcon={<IconBrandTelegram stroke={1.5} size="20px" />}
                                                style={{
                                                    marginBottom: 4
                                                }}
                                            >
                                                Go
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </ListItemWrapper>
                    <Divider sx={{ width: 450 }} />
                </React.Fragment>
            ))
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (!notifications) {
        return <div>Loading...</div>;
    }

    const chipSX = {
        height: 24,
        padding: '0 6px'
    };
    const chipErrorSX = {
        ...chipSX,
        color: theme.palette.orange.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.orange.light,
        marginRight: '5px'
    };

    const chipWarningSX = {
        ...chipSX,
        color: theme.palette.warning.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.warning.light
    };

    const chipSuccessSX = {
        ...chipSX,
        color: theme.palette.success.dark,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.success.light,
        height: 28
    };

    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 330,
                py: 0,
                borderRadius: '10px',
                [theme.breakpoints.down('md')]: {
                    maxWidth: 300
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
        >
            {notifications}
        </List>
    );
};

export default NotificationList;
