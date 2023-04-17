import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Chip,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
// eslint-disable-next-line
import Avatar from 'components/users/Avatar';
import useAuth from 'hooks/useAuth';
import { useDispatch, useSelector } from 'store';
import { deleteUser } from 'utils/userApi';
// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getEmployeesByOrg } from 'utils/api';

// const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER LIST 1 ||============================== //

const UserList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        async function getEmployees() {
            const response = await getEmployeesByOrg(user.organization);
            const { users } = response.data;
            setData(users);
        }
        getEmployees();
    }, []);

    const handleDelete = async (index) => {
        /* eslint-disable*/
        let id = data.at(index)._id;
        deleteUser(id)
        .then(() => {
            setData(data.filter(us => us._id !== id))})
        .catch((err) => { console.log(err.message); });
        /* eslint-disable */
    };

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }} />
                        <TableCell>First name</TableCell>
                        <TableCell>Last name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell align="center" sx={{ pr: 3 }}>
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell sx={{ pl: 3 }}>
                                    <Avatar alt="User 1" />
                                </TableCell>
                                <TableCell>
                                    <Typography align="left" variant="subtitle1" component="div">
                                        {row.firstName}{' '}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography align="left" variant="subtitle1" component="div">
                                        {row.lastName}{' '}
                                    </Typography>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                <TableCell>{row.phone}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Delete user">
                                            <IconButton onClick={() => handleDelete(index)} color="inherit" size="medium">
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserList;
