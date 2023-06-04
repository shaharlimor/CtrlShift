import { useEffect, useState } from 'react';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button, Grid, Select, MenuItem, Tooltip, Typography } from '@mui/material';

import { ShiftBoardMonthsDoesntExist, CreateMonthShiftBoard } from '../../utils/ShiftBoard';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-hot-toast';

/* eslint-disable */
const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [monthsWithoutBoard, setMonthsWithoutBoard] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const { user } = useAuth();

    async function fetchMonthsWithoutBoard() {
        const data = await ShiftBoardMonthsDoesntExist();
        setMonthsWithoutBoard(data);
    }

    async function handleSelect(event) {
        try {
            await CreateMonthShiftBoard(user.organization, event.target.value.month, event.target.value.year);
            toast.success('Successfully create month !');
        } catch (error) {
            toast.error('Failed to create month.');
        }

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
                <Tooltip placement="top" title={<Typography fontSize="1.2em">Add all the permanent shifts to a new month</Typography>}>
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
                </Tooltip>
            )}
        </Grid>
    );
};

export default AddShiftBoardMonthButton;
