import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography } from '@mui/material';

// assets
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import ConstraintsTab from './ConstraintsTab';
import { getUsersWithConstraintsInShift } from 'utils/api';

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
        icon: <PeopleIcon sx={{ fontSize: '1.3rem' }} />
    },
    {
        label: 'Shift Placement',
        icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    }
];

/* eslint-disable*/
const ShiftTabs = ({ event }) => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [employees, setEmployees] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const getEmp = async () => {
            const result = await getUsersWithConstraintsInShift(event.id);
            let parsedData = [];
            parsedData = result.data.map((item) => ({
                // eslint-disable-next-line
                id: item._id,
                firstName: item.firstName,
                lastName: item.lastName
            }));

            setEmployees(parsedData);
            parsedData = [];
        };
        getEmp();
    }, [event]);

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
                        display: 'flex',
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
                <ConstraintsTab employees={employees} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Typography>shift placement</Typography>
            </TabPanel>
        </>
    );
};
ShiftTabs.propTypes = {
    event: PropTypes.object
};
export default ShiftTabs;
