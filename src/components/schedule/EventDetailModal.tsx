import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';

const EventDetailModal = ({ isOpen, onClose, event }) => {
    
    const formatDate = (date) => {
        return date.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      };
    
    const formatTime = (date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const startTime = formatTime(event.start.toDate());
    const endTime = formatTime(event.end.toDate());

    const eventDuration = `${startTime} - ${endTime}`;


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
                    width: '420px',
                    borderRadius: '8px',
            }}
            >
                <Stack gap={2}>
                    <Typography variant="h5" sx={{ marginBottom: 2 }}>{event.body}</Typography>
                    <Typography 
                        variant="subtitle1" 
                        bgcolor={event.backgroundColor}
                        style={{ 
                            display: "inline-block", 
                            width: "fit-content", 
                            padding: '3px 10px',
                            borderRadius: "8px", 
                            }}>
                            {event.title}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <AccessTimeIcon />
                        <Typography variant="subtitle1">
                            {`${formatDate(event.start.toDate())}, ${eventDuration}`}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <RoomIcon />
                        <Typography variant="subtitle1">{event.location}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <PersonIcon />
                        <Typography variant="subtitle1">{event.attendees}</Typography>
                    </Stack>
                </Stack>
            </Box>
        </div>
    </Modal>
  );
};

export default EventDetailModal;