import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery, Select, MenuItem } from '@mui/material';
import { ShiftBoardMonthsDoesntExist, CreateMonthShiftBoard } from '../../utils/ShiftBoard';

/* eslint-disable */
const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [boards, setBoards] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');

    function handleSelect(event) {
        CreateMonthShiftBoard(event.target.value.month, event.target.value.year);
        console.log(event.target.value);
        setSelectedMonth(false);
    }

    let monthsWithoutBoard = [];

    useEffect(() => {
        monthsWithoutBoard = ShiftBoardMonthsDoesntExist();
    }, []);

    return (
        <>
            {calendarType === 1 ? (
                <Grid item>
                    {selectedMonth && (
                        <Select sx={{ mt: 1, width: '100%' }} size="medium" value={selectedYear} onChange={handleSelect}>
                            {monthsWithoutBoard?.map((month) => (
                                <MenuItem key={'${month.month} - ${month.year}'} value={month}>
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
