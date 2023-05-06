import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography, styled } from '@mui/material';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import PeopleIcon from '@mui/icons-material/People';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';

// tabs panel
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    {
        label: 'Constraints',
        icon: <DescriptionTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Assign',
        icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    }
];

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

const ShiftTabs = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChange}
                variant="scrollable"
                sx={{
                    mb: 1,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.25,
                        color: theme.palette.grey[600],
                        // display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& a.Mui-selected': {
                        color: theme.palette.primary.main
                    },
                    '& .MuiTabs-indicator': {
                        bottom: 2
                    },
                    '& a > svg': {
                        marginBottom: '0px !important',
                        mr: 1.25
                    }
                }}
            >
                {tabsOption.map((tab, index) => (
                    <Tab key={index} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                ))}
            </Tabs>
            <TabPanel value={value} index={0}>
                <Typography>Constraints</Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography>Assigns</Typography>
            </TabPanel>
        </>
    );
};

export default ShiftTabs;
