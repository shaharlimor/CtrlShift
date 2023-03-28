import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListItem } from '@mui/material';

// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import EventBusyIcon from '@mui/icons-material/EventBusy';

const EmpoyeesList = ({ employess }) => {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
        setOpen(!open);
    };

    const emloyeesList = [...new Set(employess)].map((emp) => (
        <ListItem sx={{ pl: 4 }} key={emp.id}>
            <ListItemText primary={emp.id} />
        </ListItem>
    ));

    return (
        <List component="nav" aria-labelledby="nested-list-subheader">
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <EventBusyIcon sx={{ fontSize: '1.6rem' }} />
                </ListItemIcon>
                <ListItemText primary="Also unavailable that day" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {open && employess && (
                    <List component="div" disablePadding>
                        {emloyeesList}
                    </List>
                )}
            </Collapse>
        </List>
    );
};

EmpoyeesList.propTypes = {
    employess: PropTypes.array
};

export default EmpoyeesList;
