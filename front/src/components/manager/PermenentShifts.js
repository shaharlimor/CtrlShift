import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
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
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

// project imports
import MainCard from '../cards/MainCard';
import SubCard from '../cards/SubCard';

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

    const handleDeleteClick = () => {
        console.log('Delete row:', row);
        // TODO: Implement delete
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
                <TableCell sx={{ pr: 3 }}>
                    <IconButton color="primary" size="large" onClick={handleDeleteClick}>
                        <DeleteIcon sx={{ fontSize: '1.3rem' }} />
                    </IconButton>
                    <IconButton color="secondary" size="large" onClick={handleEditClick}>
                        <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                    </IconButton>
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
                                            {row.roles?.map((rolesRow) => (
                                                <Typography>
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

const rows = [
    createData('Day - evening', '7pm', '8am', 'SUNDAY', [
        ['chef', 1],
        ['waiter', 2]
    ])
];

export default function PermanentShift() {
    const newRow = [];
    rows.forEach((element) => {
        newRow.push({
            ...element,
            history: null
        });
    });
    return (
        <MainCard content={false} title="Permanent Shift">
            {/* table */}
            <TableContainer>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ pl: 3 }} />
                            <TableCell>Name</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Days</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* <IconButton
                variant="contained"
                sx={{ width: '15%' }}
                // onClick={}
                size="large"
                color="primary"
            >
                <AddCircleOutlineTwoToneIcon />
            </IconButton> */}
        </MainCard>
    );
}
