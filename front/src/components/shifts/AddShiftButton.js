import { Fragment, useState } from 'react';
import { Dialog, Button, Tooltip } from '@mui/material';
import AddShiftFrom from './AddShiftFrom';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

const Shifts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose = (ans) => {
        setIsModalOpen(ans);
    };

    return (
        <fragment>
            <Tooltip placement="top" title="Add new shift to the board">
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
            </Tooltip>
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
        </fragment>
    );
};

export default Shifts;
