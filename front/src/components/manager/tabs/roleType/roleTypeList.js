import React, { useEffect, useState } from 'react';
// material-ui
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

import { deleteRoleType, getRoleTypes } from 'utils/roleTypeServices';

// assets
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useAuth from 'hooks/useAuth';

// table data
function createData(roleType) {
    return { roleType };
}

// TODO: get events by props / from server
// eslint-disable-next-line
const rows = [createData('Day waiter'), createData('Day chef'), createData('Shift supervisor'), createData('Bartender')];

export default function RoleTypesList(props) {
    const { handleEdit } = props;
    const [roleTypes, setRoleTypes] = useState([]);
    const { user } = useAuth();

    const handleDeleteClick = async (row) => {
        console.log('Delete row:', row);
        // eslint-disable-next-line
        await deleteRoleType(row);
    };

    const handleEditClick = async (row) => {
        handleEdit(row);
    };

    useEffect(() => {
        const getRoles = async () => {
            /* eslint-disable-next-line */
            const result = await getRoleTypes(user.organization);
            setRoleTypes(result.data);
        };
        getRoles();
    }, []);
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }}>Type</TableCell>
                            <TableCell align="center" sx={{ pl: 35 }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roleTypes.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell>{row.roleType}</TableCell>
                                <TableCell sx={{ pl: 35 }}>
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Tooltip placement="top" title="Delete">
                                            <IconButton color="inherit" size="medium" onClick={() => handleDeleteClick(row)}>
                                                <DeleteOutlineOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip placement="top" title="Edit">
                                            <IconButton color="primary" size="medium" onClick={() => handleEditClick(row)}>
                                                <EditOutlinedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
