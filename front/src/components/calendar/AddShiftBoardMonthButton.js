import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery, Select, MenuItem } from '@mui/material';
import { ShiftBoardMonthsDoesntExist, CreateMonthShiftBoard } from '../../utils/ShiftBoard';
import useAuth from 'hooks/useAuth';

/* eslint-disable */
const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [monthsWithoutBoard, setMonthsWithoutBoard] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const { user } = useAuth();

    function handleSelect(event) {
        CreateMonthShiftBoard(user.organization, event.target.value.month, event.target.value.year);
        setSelectedMonth(false);
    }

    useEffect(async () => {
        setMonthsWithoutBoard(await ShiftBoardMonthsDoesntExist(user.organization));
    }, []);

    return (
        <>
            {calendarType === 1 ? (
                <Grid item>
                    {selectedMonth && (
                        <Select sx={{ mt: 1, width: '100%' }} size="medium" value={selectedYear} onChange={handleSelect}>
                            {monthsWithoutBoard?.map((month, index) => (
                                <MenuItem key={`${month.month}-${month.year}-${index}`} value={month}>
                                    {`${month.month} - ${month.year}`}
                                </MenuItem>
                            ))}
                        </Select>
                    )}

                    {!selectedMonth && (
                        <Button sx={{ mt: 1, width: '100%' }} onClick={() => setSelectedMonth(true)} variant="contained" color="secondary">
                            Add new month board
                        </Button>
                    )}
                </Grid>
            ) : (
                ''
            )}
        </>
    );
};

export default AddShiftBoardMonthButton;
