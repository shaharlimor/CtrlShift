import React from 'react';

// material-ui
import {
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    FormControl,
    Select,
    Chip
} from '@mui/material';
// eslint-disable-next-line
import Avatar from 'components/users/Avatar';
// assets
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import PropTypes from 'prop-types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// const avatarImage = require.context('assets/images/users', true);
import value from 'assets/scss/_themes-vars.module.scss';

// ==============================|| USER LIST 1 ||============================== //

const UserList = (props) => {
    const { users, currentPage, pageSize, handleDelete, handleEditUser } = props;
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        let lastIndex = currentPage * pageSize;
        const firstIndex = lastIndex - pageSize;
        if (lastIndex > users.length) {
            lastIndex = users.length;
        }
        setData(users.slice(firstIndex, lastIndex));
    }, [users, currentPage, pageSize]);

    const deleteUser = async (index) => {
        /* eslint-disable */
        const id = data.at(index)._id;
        handleDelete(id);
        setData(data.filter((us) => us._id !== id));
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
                        <TableCell align="center">Actions</TableCell>
                        <TableCell sx={{ pr: 3 }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data &&
                        data.map((row, index) => (
                            <TableRow hover key={row._id}>
                                <TableCell sx={{ pl: 3 }}>
                                    <Avatar src={`https://controlshift-images.s3.eu-central-1.amazonaws.com/${row._id}.png`} />
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
                                <TableCell>
                                    <FormControl sx={{ m: 1 }}>
                                        <Select
                                            SelectDisplayProps={{ style: { paddingTop: 2, paddingBottom: 2 } }}
                                            variant="outlined"
                                            style={{ height: 30, width: 80 }}
                                            multiple
                                            value={[]}
                                        >
                                            {row.role_types?.length === 0 ? (
                                                <option disabled>none.</option>
                                            ) : (
                                                row.role_types?.map((role, index) => <option key={role}> {role} </option>)
                                            )}
                                        </Select>
                                    </FormControl>
                                </TableCell>

                                <TableCell>{row.phone}</TableCell>
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Delete">
                                            <IconButton onClick={() => deleteUser(index)} color="inherit" size="medium">
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Edit">
                                            <IconButton onClick={() => handleEditUser(row)} color="inherit" size="medium">
                                                <EditOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                                <TableCell>{row.isAdmin && <Chip label="Admin" size="small" />}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

UserList.propTypes = {
    users: PropTypes.array,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    handleDelete: PropTypes.func,
    handleEditUser: PropTypes.func
};

export default UserList;
