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
import { useState, useEffect } from "react";
import EditEventModal from "./EditEventModal";
import { convertToTime, termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";


const EventDetailModal = ({ isOpen, onClose, onCourseUpdate, calendarEvent, initialCourse, userType }) => {
    const [course, setCourse] = useState(initialCourse);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    console.log(course);

    useEffect(() => {
        setCourse(initialCourse);
      }, [initialCourse]);

    const onEditModalSave = (updatedCourse: Course) => {
        setCourse(updatedCourse);
        onCourseUpdate(updatedCourse);
    }

    const onEditModalOpen = () => {
        setIsEditModalOpen(true);
    };

    const onEditModalClose = () => {
        setIsEditModalOpen(false);
    };
    

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
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>{course.Title}</Typography>
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
                                {`${course.Subj} ${course.Num} ${course.Section}`}
                        </Typography>
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
                                {`${course.Days} ${convertToTime(course.Begin)} - ${convertToTime(course.End)}`}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <RoomIcon />
                            <Typography variant="subtitle1">{`${course.Bldg} ${course.Room}`}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <PersonIcon />
                            <Typography variant="subtitle1">{course.Instructor}</Typography>
                        </Stack>
                    </Stack>
                </Box>
            </div>
        </Modal>
        <EditEventModal 
            isOpen={isEditModalOpen} 
            onClose={onEditModalClose}
            onSave={onEditModalSave} 
            course={course} />
    </Box>
  );
};

export default EventDetailModal;