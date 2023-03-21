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

// project imports
import MainCard from '../cards/MainCard';
import SubCard from '../cards/SubCard';
// import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
// import { header } from './TableBasic';

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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.name} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
