import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery, Select, MenuItem } from '@mui/material';

/* eslint-disable */
const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [boards, setBoards] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');

    function handleSelect(event) {
        //TODO: Create selected month in db
        console.log(event.target.value);
        setSelectedMonth(false);
    }

    function getMonthsWithoutBoard() {
        // const now = new Date();
        // const nextYear = now.getFullYear() + 1;
        // const months = [];
        // for (let year = now.getFullYear(); year <= nextYear; year + 1) {
        //     for (let month = 0; month < 12; month + 1) {
        //         const monthNum = month + 1;
        //         const hasBoard = boards.find((b) => b.month === monthNum && b.year === year);
        //         if (!hasBoard) {
        //             months.push({ month, year });
        //         }
        //     }
        // }
        // return months.slice(0, 12); // Return up to 12 months from now

        return [{ month: 3, year: 2023 }];
    }

    const monthsWithoutBoard = getMonthsWithoutBoard();

    const handleAddNewMonth = useCallback(() => {
        // Add your logic for adding a new month here
        setSelectedMonth('');
        setButtonLabel('Add new month board');
    }, []);

    useEffect(() => {
        async function fetchBoards() {
            // const response = await fetch('/boards');
            // const data = await response.json();
            // const newBoards = data.map((b) => ({ month: parseInt(b.month), year: parseInt(b.year) }));
            const newBoards = [{ month: 3, year: 2023 }];
            setBoards(newBoards);
        }
        fetchBoards();
    }, []);

    return (
        <>
            {calendarType === 1 ? (
                <Grid item>
                    {selectedMonth && (
                        <Select sx={{ mt: 1, width: '100%' }} size="medium" value={selectedYear} onChange={handleSelect}>
                            {monthsWithoutBoard.map((month) => (
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
