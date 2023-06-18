import React, { useEffect, useState } from 'react';
// material-ui
import { IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

import { deleteRoleType, getRoleTypesByOrg } from 'utils/roleTypeServices';

// assets
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useAuth from 'hooks/useAuth';

// table data
function createData(roleType) {
    return { roleType };
}

// eslint-disable-next-line
const rows = [createData('Day waiter'), createData('Day Chef'), createData('Shift supervisor'), createData('Bartender')];

export default function RoleTypesList(props) {
    const { handleEdit } = props;
    const [roleTypes, setRoleTypes] = useState([]);
    const { user } = useAuth();

    const handleDeleteClick = async (row) => {
        // eslint-disable-next-line
        await deleteRoleType(row)
            .then(() => {
                // eslint-disable-next-line
                setRoleTypes(roleTypes.filter((role) => role._id !== row._id));
            })
            .catch((err) => {
                console.log(err.message);
            });
    };

    const handleEditClick = async (row) => {
        handleEdit(row);
    };

    useEffect(() => {
        const getRoles = async () => {
            /* eslint-disable-next-line */
            const result = await getRoleTypesByOrg(user.organization);
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
