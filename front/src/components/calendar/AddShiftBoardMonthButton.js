import { useEffect, useState, useRef } from 'react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button, Grid, Select, MenuItem, Tooltip, Typography } from '@mui/material';
import { ShiftBoardMonthsDoesntExist, CreateMonthShiftBoard } from '../../utils/ShiftBoard';
import useAuth from 'hooks/useAuth';
import { toast } from 'react-hot-toast';

const AddShiftBoardMonthButton = ({ calendarType }) => {
    const [monthsWithoutBoard, setMonthsWithoutBoard] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(false);
    const [selectedYear, setSelectedYear] = useState('');
    const selectRef = useRef(null);

    const { user } = useAuth();

    async function fetchMonthsWithoutBoard() {
        const data = await ShiftBoardMonthsDoesntExist();
        setMonthsWithoutBoard(data);
    }

    const handleSelect = async (event) => {
        try {
            console.log(event);
            await CreateMonthShiftBoard(user.organization, event.target.value.month, event.target.value.year);
            toast.success('Successfully create month!');
        } catch (error) {
            toast.error('Failed to create month.');
        }

        setSelectedMonth(false);
    };

    const handleClickOutside = (event) => {
        if (selectRef.current && !selectRef.current.contains(event.target) && !event.target.classList.contains('MuiButton-label')) {
            setSelectedMonth(false);
        }
    };

    useEffect(() => {
        fetchMonthsWithoutBoard();
    }, []);

    const handleGenerateClick = () => {
        setSelectedMonth(true);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectMouseDown = (event) => {
        event.stopPropagation();
    };

    const handleSelectChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handleSelectClick = (event) => {
        event.stopPropagation();
    };

    return (
        <Grid item className="add-shift-board-month-button">
            {selectedMonth ? (
                <Select
                    sx={{ mt: 1, minWidth: '130px' }}
                    size="medium"
                    value={selectedYear}
                    onChange={handleSelect}
                    onMouseDown={handleSelectMouseDown}
                    MenuProps={{ disablePortal: true }}
                    ref={selectRef}
                    renderValue={(selected) => (selected ? `${selected.month} - ${selected.year}` : 'Select a month')}
                >
                    {monthsWithoutBoard?.map((month, index) => (
                        <MenuItem key={`${month.month}-${month.year}-${index}`} value={month}>
                            {`${month.month} - ${month.year}`}
                        </MenuItem>
                    ))}
                </Select>
            ) : (
                <Tooltip placement="top" title={<Typography fontSize="1.2em">Add all the permanent shifts to a new month</Typography>}>
                    <Button
                        sx={{ width: '100%' }}
                        startIcon={<LockOpenIcon />}
                        size="large"
                        onClick={handleGenerateClick}
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
