import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';

import ConstraintsTab from './ConstraintsTab';
import { getUsersWithConstraintsInShift, getEmployeesByOrg } from 'utils/api';
import PlacementTab from './PlacementTab';
import useAuth from 'hooks/useAuth';

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

const ShiftTabs = ({ event, onCancel }) => {
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [employeesWithConstraints, setEmployeesWithConstraints] = useState([]);
    const [allEmployess, setallEmployess] = useState([]);
    const { user } = useAuth();
    const [initalizeChecked, setInitalizeChecked] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const initalizeRoles = () => {
        const changeChecked = [];
        event.roles.forEach((role) => {
            const { roleType, employeeIds } = role;

            /* eslint-disable */
            employeeIds.map((employeeId) => {
                const newObject = employeeId + '-' + roleType;
                changeChecked.push(newObject);
            });
            /* eslint-enable */
        });
        setInitalizeChecked(changeChecked);
    };

    useEffect(() => {
        initalizeRoles();
        const getEmp = async () => {
            const result = await getUsersWithConstraintsInShift(event.id);
            let parsedData = [];
            parsedData = result.data.map((item) => ({
                // eslint-disable-next-line
                id: item._id,
                firstName: item.firstName,
                lastName: item.lastName,
                level: item.level,
                description: item.description
            }));
            setEmployeesWithConstraints(parsedData);
            parsedData = [];

            const res = await getEmployeesByOrg(user.organization);
            res.data.users.map(async (item) => {
                item.role_types.forEach((rl) => {
                    parsedData.push({
                        // eslint-disable-next-line
                        id: item._id,
                        firstName: item.firstName,
                        lastName: item.lastName,
                        role: rl
                    });
                });
            });
            setallEmployess(parsedData);
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
                <ConstraintsTab employees={employeesWithConstraints} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <PlacementTab
                    eventId={event.id}
                    roles={event.roles}
                    allEmployess={allEmployess}
                    onCancel={onCancel}
                    initCheck={initalizeChecked}
                />
            </TabPanel>
        </>
    );
};
ShiftTabs.propTypes = {
    event: PropTypes.object,
    onCancel: PropTypes.func
};
export default ShiftTabs;
