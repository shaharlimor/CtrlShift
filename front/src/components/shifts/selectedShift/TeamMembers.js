import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import { getUsersWithConstraintsInShift } from 'utils/api';
import RenderGrid from './RenderGrid';
// assets
/* eslint-disable */
import Avatar1 from 'assets/images/user-1.png';
import Avatar2 from 'assets/images/user-1.png';
import Avatar3 from 'assets/images/user-1.png';
import Avatar4 from 'assets/images/user-1.png';

// ===========================|| DATA WIDGET - TEAM MEMBERS CARD ||=========================== //

const TeamMembers = ({ event }) => {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const getEmp = async () => {
            const result = await getUsersWithConstraintsInShift(event.id);
            let parsedData = [];
            result.data.map(async (item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    firstName: item.firstName,
                    lastName: item.lastName
                })
            );
            setEmployees(parsedData);
            setIsModalOpen(true);
            parsedData = [];
        };
        getEmp();
    }, [event]);

    return (
        <CardContent>
            <Grid container spacing={gridSpacing} alignItems="center">
                <Grid item>
                    {isModalOpen &&
                        employees.map((emp) => (
                            // eslint-disable-next-line
                            <Grid key={emp._id} item xs={12}>
                                <Grid key={emp._id + '1'} container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Avatar
                                            alt={emp.firstName}
                                            src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${emp.id}.png`}
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <Typography align="left" component="div" variant="subtitle1">
                                            {emp.firstName}
                                        </Typography>
                                        <Typography align="left" component="div" variant="subtitle2">
                                            {emp.lastName}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))}
                </Grid>
            </Grid>
        </CardContent>
    );
};

TeamMembers.propTypes = {
    event: PropTypes.object
};

export default TeamMembers;
