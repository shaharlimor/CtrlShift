import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Grid, IconButton, Stack, Tooltip, Typography, useMediaQuery } from '@mui/material';

import { format } from 'date-fns';

import { IconChevronLeft, IconChevronRight, IconLayoutGrid, IconTemplate, IconLayoutList } from '@tabler/icons';

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

const Toolbar = ({ date, view, onClickNext, onClickPrev, onChangeView, ...others }) => {
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
            <Grid item>
                <Stack direction="row" alignItems="center" spacing={3}>
                    <IconButton onClick={onClickPrev} size="large">
                        <IconChevronLeft />
                    </IconButton>
                    <Typography variant="h3" color="textPrimary">
                        {format(date, 'MMMM yyyy')}
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
    onChangeView: PropTypes.func
};

export default Toolbar;
