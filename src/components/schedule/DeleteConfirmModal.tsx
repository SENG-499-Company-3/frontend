import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const DeleteConfirmModal = ({isOpen, onClose, onConfirm}) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
                <div>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        width: '320px',
                        borderRadius: '8px',
                    }}
                    >
                        <Stack direction="column" gap={2}>
                            <Typography variant="h6" gutterBottom>
                                Confirm Deletion
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Are you sure you want to delete this course?
                            </Typography>
                            <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </div>
            </Modal>
    );
}

export default DeleteConfirmModal;