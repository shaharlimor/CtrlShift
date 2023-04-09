import { lazy, useState, useEffect } from 'react';
import Loadable from 'components/Loadable';
import value from 'assets/scss/_themes-vars.module.scss';
import { Dialog, Button } from '@mui/material';
import { getMonthlyShifts } from 'utils/api';
import useAuth from 'hooks/useAuth';
import AddShiftFrom from './AddShiftFrom';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

const Shifts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

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
