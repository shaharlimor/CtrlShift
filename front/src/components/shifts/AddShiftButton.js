import { useState, Fragment } from 'react';
import { Dialog, Button, Tooltip, Typography } from '@mui/material';
import AddShiftFrom from './AddShiftFrom';
import AddCircleOutlineTwoToneIcon from '@mui/icons-material/AddCircleOutlineTwoTone';

const Shifts = ({ getAfterGenerate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose = (ans) => {
        setIsModalOpen(ans);
        getAfterGenerate();
    };
    return (
        <>
            <Tooltip placement="top" title={<Typography fontSize="1.2em">Add new shift to the board</Typography>}>
                <Button
                    variant="contained"
                    sx={{ width: '100' }}
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
        </>
    );
};

export default Shifts;
