import PropTypes from 'prop-types';
import { Fragment } from 'react';

import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import ShiftTabs from './ShiftTabs';

const ShiftSelectPopupup = ({ event, onCancel }) => {
    const theme = useTheme();

    return (
        <>
            <DialogTitle color="primary.800">
                {event.title} - {new Date(event.start).toLocaleDateString('de-DE')}
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 0, maxHeight: 300, minHeight: 300 }}>
                <ShiftTabs event={event} onCancel={onCancel} />
            </DialogContent>
            <DialogActions sx={{ pb: 2 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Button
                        type="button"
                        variant="contained"
                        sx={{
                            backgroundColor: theme.palette.grey[400],
                            '&:hover': {
                                background: theme.palette.grey[300]
                            },
                            width: '15%'
                        }}
                        onClick={() => {
                            onCancel();
                        }}
                    >
                        Cancel
                    </Button>
                </Grid>
            </DialogActions>
        </>
    );
};

ShiftSelectPopupup.propTypes = {
    event: PropTypes.object,
    onCancel: PropTypes.func
};

export default ShiftSelectPopupup;
