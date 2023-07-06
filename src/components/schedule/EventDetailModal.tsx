import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Button from "@mui/material/Button";
import { useState } from "react";
import EditEventModal from "./EditEventModal";
import { termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";


const EventDetailModal = ({ isOpen, onClose, calendarEvent, course, userType }) => {
    const useDisclosure = () => {
        const [isEditOpen, setIsEditOpen] = useState(false);

        const onEditOpen = () => {
            setIsEditOpen(true);
        };

        const onEditClose = () => {
            setIsEditOpen(false);
        };

        return { isEditOpen, onEditOpen, onEditClose };
    };
    
    const {
        isEditOpen: isEditModalOpen,
        onEditOpen: onEditModalOpen,
        onEditClose: onEditModalClose,
    } = useDisclosure();

    
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

    const startTime = formatTime(calendarEvent.start.toDate());
    const endTime = formatTime(calendarEvent.end.toDate());

    const eventDuration = `${startTime} - ${endTime}`;

    const isUserAdmin = userType === 'admin' ? true : false;


  return (
    <Box>
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
                    <Stack direction="column" gap={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6">Course Details</Typography>
                            {
                            isUserAdmin && <Button onClick={onEditModalOpen}>
                                <EditIcon sx={{ color: 'text.primary' }} />
                            </Button>
                            }                                
                        </Stack>
                        <Divider sx={{ marginLeft: '0px' }} variant="middle" />
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>{calendarEvent.body}</Typography>
                        <Stack direction="row" spacing={3} alignItems="center" >
                        <Typography 
                            variant="subtitle1" 
                            bgcolor={calendarEvent.backgroundColor}
                            style={{ 
                                display: "inline-block", 
                                width: "fit-content", 
                                padding: '3px 10px',
                                borderRadius: "8px", 
                                }}>
                                {calendarEvent.title}
                        </Typography>
                        {/* <Typography variant="subtitle1">
                                {termOptions.find(option => option.value === course.Term).title}
                            </Typography> */}
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <DateRangeIcon />
                            <Typography variant="subtitle1">
                                {termOptions.find(option => option.value === course.Term).title}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <AccessTimeIcon />
                            <Typography variant="subtitle1">
                                {`${course.Days} ${eventDuration}`}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <RoomIcon />
                            <Typography variant="subtitle1">{calendarEvent.location}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <PersonIcon />
                            <Typography variant="subtitle1">{calendarEvent.attendees}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </div>
        </Modal>
    </Box>
  );
};

export default EventDetailModal;