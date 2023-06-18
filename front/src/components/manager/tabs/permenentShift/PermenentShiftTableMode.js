import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Collapse,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Tooltip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useAuth from 'hooks/useAuth';

// project imports
import SubCard from '../../../cards/SubCard';
import { deletePermanentShift, getPermanentShifts } from '../../../../utils/permenentShift';

// assets
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({ row, handleEdit, handleDelete }) {
    const handleEditClick = () => {
        handleEdit(row);
    };

    const handleDeleteClick = async () => {
        // eslint-disable-next-line
        await deletePermanentShift(row)
            .then(() => {
                handleDelete(row);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell sx={{ pl: 3 }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>
                    {new Date(row.startTime).toLocaleTimeString('en-US', {
                        timeStyle: 'short'
                    })}
                </TableCell>
                <TableCell>
                    {' '}
                    {new Date(row.endTime).toLocaleTimeString('en-US', {
                        timeStyle: 'short'
                    })}
                </TableCell>
                <TableCell>
                    {row.days.map((day) => (
                        <span key={day}>{day} </span>
                    ))}
                </TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                    <Stack direction="row" justifyContent="center" alignItems="center">
                        <Tooltip placement="top" title="Delete">
                            <IconButton color="inherit" size="medium" onClick={handleDeleteClick}>
                                <DeleteOutlineOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip placement="top" title="Edit" onClick={handleEditClick}>
                            <IconButton color="primary" size="medium">
                                <EditOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {open && (
                            <Box sx={{ margin: 1 }}>
                                <TableContainer>
                                    <SubCard
                                        sx={{ bgcolor: theme.palette.mode === 'dark' ? 'dark.800' : 'grey.50', mb: 2 }}
                                        title="Roles"
                                        content={false}
                                    >
                                        <Stack direction="column" spacing={2} alignItems="flex-start" sx={{ mr: 2, ml: 2 }}>
                                            {row.roles?.map((rolesRow, index) => (
                                                <Typography key={index}>
                                                    {rolesRow.roleType} - {rolesRow.amount}
                                                </Typography>
                                            ))}
                                        </Stack>
                                    </SubCard>
                                </TableContainer>
                            </Box>
                        )}
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.object,
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func
};

export default function PermenentShiftTableMode(props) {
    const { handleEditShift } = props;
    const [shifts, setShifts] = useState([]);
    const theme = useTheme();
    const { user } = useAuth();

    const handleEdit = (shift) => {
        handleEditShift(shift);
    };

    const handleDelete = (row) => {
        // eslint-disable-next-line
        setShifts(shifts.filter((shift) => shift.id !== row.id));
    };

    useEffect(() => {
        const getShifts = async () => {
            /* eslint-disable-next-line */
            const result = await getPermanentShifts(user.organization);
            let parsedData = [];
            result.data.map((item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    startTime: item.startTime,
                    endTime: item.endTime,
                    days: item.days,
                    name: item.name,
                    roles: item.roles
                })
            );
            setShifts(parsedData);
            parsedData = [];
        };
        getShifts();
    }, []);

    return (
        <TableContainer>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ pl: 3 }} />
                        <TableCell>Name</TableCell>
                        <TableCell>Start Time</TableCell>
                        <TableCell>End Time</TableCell>
                        <TableCell>Days</TableCell>
                        <TableCell sx={{ pl: 6 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shifts.map((row) => (
                        /* eslint-disable-next-line */
                        <Row key={row.name} row={row} handleEdit={handleEdit} handleDelete={handleDelete} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
