import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import EditEventModal from "./EditEventModal";
import { convertToTime, termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";
import DeleteConfirmModal from "./DeleteConfirmModal";


const EventDetailModal = ({ isOpen, onClose, onCourseUpdate, onDelete, calendarEvent, initialCourse, userType }) => {
    const [course, setCourse] = useState(initialCourse);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        setCourse(initialCourse);
    }, [initialCourse]);

    const onEditModalSave = (updatedCourse: Course) => {
        setCourse(updatedCourse);
        onCourseUpdate(updatedCourse);
    };

    const onEditModalOpen = () => {
        setIsEditModalOpen(true);
    };

    const onEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const onDeleteModalOpen = () => {
        setIsDeleteModalOpen(true);
    };

    const onDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirmation = () => {
        onDeleteModalClose();
        onDelete(course);
        onClose();
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
                                <Stack direction="row" spacing={-2}>
                                    {isUserAdmin && (
                                        <Button onClick={onEditModalOpen}>
                                            <EditIcon sx={{ color: 'text.primary' }} />
                                        </Button>
                                    )}
                                    {isUserAdmin && (
                                        <Button onClick={onDeleteModalOpen}>
                                            <DeleteIcon sx={{ color: 'text.primary' }} />
                                        </Button>
                                    )}
                                </Stack>
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
                course={course}
                courseBgColor={calendarEvent.backgroundColor}
            />
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                onConfirm={handleDeleteConfirmation}
            />
        </Box>
    );
};

export default EventDetailModal;
