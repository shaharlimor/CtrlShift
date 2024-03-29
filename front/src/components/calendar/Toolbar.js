import PropTypes from 'prop-types';
import { useEffect, useState, useCallback, Fragment } from 'react';

import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery, Select, MenuItem } from '@mui/material';

import { format } from 'date-fns';

import { IconChevronLeft, IconChevronRight, IconLayoutGrid, IconTemplate, IconLayoutList } from '@tabler/icons';
import AddShiftBoardMonthButton from './AddShiftBoardMonthButton';
import AddShiftButton from '../shifts/AddShiftButton';

const viewOptions = [
    {
        label: 'Month',
        value: 'dayGridMonth',
        icon: IconLayoutGrid
    },
    {
        label: 'Week',
        value: 'timeGridWeek',
        icon: IconTemplate
    },
    {
        label: 'Day',
        value: 'timeGridDay',
        icon: IconLayoutList
    }
];

const Toolbar = ({
    date,
    view,
    onClickNext,
    onClickPrev,
    onChangeView,
    calendarType,
    onMyShiftChange,
    filterMode,
    getAfterGenerate,
    handleCreateNewMonth,
    ...others
}) => {
    const matchSm = useMediaQuery((theme) => theme.breakpoints.down('md'));
    const [newViewOption, setNewViewOption] = useState(viewOptions);

    useEffect(() => {
        let newOption = viewOptions;
        if (matchSm) {
            newOption = viewOptions.filter((options) => options.value !== 'dayGridMonth' && options.value !== 'timeGridWeek');
        }
        setNewViewOption(newOption);
    }, [matchSm]);

    return (
        <Grid alignItems="center" container justifyContent="space-between" {...others} sx={{ pb: 3 }}>
            {calendarType !== 0 ? (
                <Grid item>
                    {calendarType === 1 ? (
                        <Stack direction="row" alignItems="center" spacing={4}>
                            <AddShiftButton getAfterGenerate={getAfterGenerate} />

                            <AddShiftBoardMonthButton calendarType={calendarType} handleCreateNewMonth={handleCreateNewMonth} />
                        </Stack>
                    ) : (
                        <Button
                            variant="contained"
                            sx={{ width: '100%' }}
                            size="large"
                            color="secondary"
                            startIcon={calendarType === 1 && <AddCircleOutlineTwoToneIcon />}
                            onClick={onMyShiftChange}
                        >
                            {filterMode ? 'All Shifts' : 'My shifts'}
                        </Button>
                    )}
                </Grid>
            ) : (
                ''
            )}

            <Grid item>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <IconButton onClick={onClickPrev} size="large">
                        <IconChevronLeft />
                    </IconButton>
                    <Typography variant="h3" color="textPrimary">
                        {view === 'timeGridDay' ? format(date, 'PP') : format(date, 'MMMM yyyy')}
                    </Typography>
                    <IconButton onClick={onClickNext} size="large">
                        <IconChevronRight />
                    </IconButton>
                </Stack>
            </Grid>
            <Grid item>
                <ButtonGroup variant="outlined">
                    {newViewOption.map((opt) => {
                        const Icon = opt.icon;
                        return (
                            <Tooltip title={opt.label} key={opt.value}>
                                <Button
                                    disableElevation
                                    variant={opt.value === view ? 'contained' : 'outlined'}
                                    onClick={() => onChangeView(opt.value)}
                                >
                                    <Icon stroke="2" size="20px" />
                                </Button>
                            </Tooltip>
                        );
                    })}
                </ButtonGroup>
            </Grid>
        </Grid>
    );
};
Toolbar.propTypes = {
    date: PropTypes.object,
    view: PropTypes.string,
    onClickNext: PropTypes.func,
    onClickPrev: PropTypes.func,
    onChangeView: PropTypes.func,
    calendarType: PropTypes.number,
    onMyShiftChange: PropTypes.func,
    filterMode: PropTypes.bool,
    getAfterGenerate: PropTypes.func,
    handleCreateNewMonth: PropTypes.func
};

export default Toolbar;
