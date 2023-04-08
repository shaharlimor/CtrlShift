import { lazy, useState, useEffect } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import { Dialog, Button } from '@mui/material';
import { getMonthlyShifts } from 'utils/api';
import useAuth from 'hooks/useAuth';
import AddShiftFrom from './AddShiftFrom';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

const Shifts = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const { user } = useAuth();

    // TODO: get shift by month (only if open to insert)
    useEffect(() => {
        const getShifts = async () => {
            /* eslint-disable-next-line */
            const result = await getMonthlyShifts('bla');
            let parsedData = [];
            result.data.map((item) =>
                parsedData.push({
                    // eslint-disable-next-line
                    id: item._id,
                    color: value.secondary200,
                    description: item.name,
                    start: new Date(item.startTime.toString()),
                    end: new Date(item.endTime.toString()),
                    title: item.name
                })
            );
            setEvents(parsedData);
            console.log(result.data);
            parsedData = [];
        };
        getShifts();
    }, []);

    const handleClose = (ans) => {
        setIsModalOpen(ans);
    };

    return (
        <div>
            <Button
                variant="contained"
                sx={{ width: '100%' }}
                size="large"
                color="secondary"
                startIcon={<AddCircleOutlineTwoToneIcon />}
                onClick={(event) => {
                    handleClose(true);
                }}
            >
                Add shift
            </Button>
            <Dialog
                maxWidth="sm"
                fullWidth
                onClose={(event) => handleClose(false)}
                open={isModalOpen}
                sx={{ '& .MuiDialog-paper': { p: 0 } }}
            >
                {isModalOpen && (
                    <AddShiftFrom
                        onCancel={(event) => {
                            handleClose(false);
                        }}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default Shifts;
