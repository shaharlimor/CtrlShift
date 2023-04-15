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
import AddIcon from '@mui/icons-material/Add';
import useAuth from 'hooks/useAuth';

// project imports
import MainCard from '../../../cards/MainCard';
import SubCard from '../../../cards/SubCard';
import { deletePermentShift, getPermanentShifts } from '../../../../services/permenentShiftServices';

// assets
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// table data
function createData(name, startTime, endTime, days, roles) {
    return {
        name,
        startTime,
        endTime,
        days,
        roles: roles.map((role) => ({
            roleType: role[0],
            amount: role[1]
        }))
    };
}

function Row({ row }) {
    const handleEditClick = () => {
        console.log('Edit row:', row);
        // TODO: Implement edit
    };

    const handleDeleteClick = async () => {
        console.log('Delete row:', row);
        // eslint-disable-next-line
        await deletePermentShift(row._id);
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
                <TableCell>{row.startTime}</TableCell>
                <TableCell>{row.endTime}</TableCell>
                <TableCell>{row.days}</TableCell>
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
                                        title="roles"
                                        content={false}
                                    >
                                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mr: 2, ml: 2 }}>
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
    row: PropTypes.object
};

export default function PermenentShiftTableMode() {
    const [shifts, setShifts] = useState([]);
    const theme = useTheme();
    const { user } = useAuth();

    // const newRow = [];
    // rows.forEach((element) => {
    //     newRow.push({
    //         ...element,
    //         history: null
    //     });
    // });

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
            console.log(result.data);
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
                        <Row key={row.name} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
