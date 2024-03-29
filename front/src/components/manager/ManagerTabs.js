import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, styled } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import PeopleIcon from '@mui/icons-material/People';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

import PermanentShift from './tabs/permenentShift/PermenentShifts';
import RoleTypes from 'components/manager/tabs/roleType/roleType';
import Employees from './tabs/employees/employees';

// tab content
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 2
                    }}
                >
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

// icon tab style
const AntTabs = styled(Tabs)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : theme.palette.primary.light,
    width: '100%',
    borderRadius: '6px',
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.secondary.main
    },
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto'
}));

// style constant
const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 0,
    [theme.breakpoints.up('sm')]: {
        minWidth: 0
    },
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: theme.palette.secondary.main,
    fontFamily: [
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
    ].join(','),
    '&:hover': {
        color: theme.palette.secondary.main,
        opacity: 1
    },
    '&.Mui-selected': {
        color: theme.palette.secondary.main,
        fontWeight: theme.typography.fontWeightMedium
    },
    '&.Mui-focusVisible': {
        backgroundColor: theme.palette.secondary.main
    },
    display: 'flex',
    justifyContent: 'center'
}));

export default function ManagerTabs() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    /* eslint-disable */
    return (
        <>
            <AntTabs theme={theme} value={value} onChange={handleChange} aria-label="ant example">
                <AntTab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <MenuTwoToneIcon sx={{ fontSize: '2rem', marginRight: theme.spacing(1) }} />
                            Role Types
                        </Box>
                    }
                />
                <AntTab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WorkOutlineIcon sx={{ fontSize: '2rem', marginRight: theme.spacing(1) }} />
                            Permenent Shifts
                        </Box>
                    }
                />
                <AntTab
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ fontSize: '2rem', marginRight: theme.spacing(1) }} />
                            Employees
                        </Box>
                    }
                />
            </AntTabs>
            <TabPanel value={value} index={0}>
                <RoleTypes />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PermanentShift />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Employees />
            </TabPanel>
        </>
    );
    /* eslint-disable */
}
