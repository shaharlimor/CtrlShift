import React, { Fragment } from 'react';
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
    Typography,
    Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddIcon from '@mui/icons-material/Add';

// project imports
import MainCard from '../../../cards/MainCard';
import SubCard from '../../../cards/SubCard';
import PermenentShiftTableMode from './PermenentShiftTableMode';
import AddPermenentShift from './AddPermenentShift';

export default function PermanentShift() {
    const theme = useTheme();
    const [addOpen, setAddOpen] = React.useState(false);

    const handleAddOpenClose = () => {
        setAddOpen(false);
    };
    return (
        <>
            {!addOpen ? (
                <MainCard content={false} title={!addOpen ? 'Permanent Shift' : 'Add Permenent Shift'}>
                    <Grid container direction="column" justifyContent="center" alignItems="flex-end">
                        <PermenentShiftTableMode />
                        <Grid item xs={3} sx={{ mt: 2 }}>
                            <IconButton
                                variant="contained"
                                sx={{
                                    fontSize: '35px',
                                    bgcolor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.contrastText
                                }}
                                onClick={() => {
                                    setAddOpen(true);
                                }}
                                size="large"
                            >
                                <AddIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </MainCard>
            ) : (
                <MainCard content={false} title={!addOpen ? 'Permanent Shift' : 'Add Permenent Shift'}>
                    <AddPermenentShift handleAddOpenClose={handleAddOpenClose} />
                </MainCard>
            )}
        </>
    );
}
