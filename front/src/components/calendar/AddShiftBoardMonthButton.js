import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button, Grid, Select, MenuItem } from '@mui/material';
import { ShiftBoardMonthsDoesntExist, CreateMonthShiftBoard } from '../../utils/ShiftBoard';
import useAuth from 'hooks/useAuth';

/* eslint-disable */
const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [monthsWithoutBoard, setMonthsWithoutBoard] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const { user } = useAuth();

    async function fetchMonthsWithoutBoard() {
        const data = await ShiftBoardMonthsDoesntExist(user.organization);
        setMonthsWithoutBoard(data);
    }

    function handleSelect(event) {
        CreateMonthShiftBoard(user.organization, event.target.value.month, event.target.value.year);
        setSelectedMonth(false);
    }

    useEffect(() => {
        fetchMonthsWithoutBoard();
    }, []);

    return (
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
                <Button
                    sx={{ width: '100%' }}
                    startIcon={<LockOpenIcon />}
                    size="large"
                    onClick={() => setSelectedMonth(true)}
                    variant="contained"
                    color="secondary"
                >
                    Generate new month
                </Button>
            )}
        </Grid>
    );
};

export default AddShiftBoardMonthButton;
