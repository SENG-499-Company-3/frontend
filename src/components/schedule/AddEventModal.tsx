import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import { courseBlocks } from "../common/sampleData/courseSchedule"
import { termOptions } from "../../utils/helper";
import { Course } from "../../types/course";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";

const AddEventModal = ({ isOpen, onClose, onCreate }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [term, setTerm] = useState(null);
    const [block, setBlock] = useState("");
    const [isError, setIsError] = useState(false);

    const handleCreate = () => {
        if (!course || !term || !block) {
            setIsError(true);
            return;
        }
        onCreate(course);
        handleClose();
    };

    const handleClose = () => {
        setCourse(null);
        setTerm(null);
        setBlock("");
        onClose();
    };

    const handleCloseErrorModal = () => {
        setIsError(false);
      };

    const onClickTerm = (event) => {
        const newTerm = parseInt(event.target.value);
        const startDate = termOptions.find((option) => option.value === newTerm)?.startDate;
        const endDate = termOptions.find((option) => option.value === newTerm)?.endDate;

        const updatedCourse = { ...course, Term: parseInt(event.target.value), StartDate: startDate, EndDate: endDate };
        setCourse(updatedCourse);
        setTerm(newTerm);
    };

    const handleBlockChange = (event) => {
        const selectedBlock = event.target.value.split(" ");
        const days = selectedBlock[0];
        const begin = parseInt(selectedBlock[1].replace(":", ""));
        const end = parseInt(selectedBlock[2].replace(":", ""));

        const updatedCourse = { ...course, Days: days, Begin: begin, End: end};
        setCourse(updatedCourse);
        setBlock(selectedBlock.join(" "));
    }

    const handleCourseChange = (event) => {
        const subj = event.target.value.split(" ")[0];
        const num = event.target.value.split(" ")[1];

        const updatedCourse = { ...course, Subj: subj, Num: num || "" };
        setCourse(updatedCourse);
    };

    const handleSectionChange = (event) => {
        const updatedCourse = { ...course, Section: event.target.value };
        setCourse(updatedCourse);
    };

    const handleLocationChange = (event) => {
        const bldg = event.target.value.split(" ")[0];
        const room = event.target.value.split(" ")[1];
        const updatedCourse = { ...course, Bldg: bldg, Room: room };
        setCourse(updatedCourse);
    };

    const handleProfessorChange = (event) => {
        const updatedCourse = { ...course, Instructor: event.target.value };
        setCourse(updatedCourse);
    };


    return (
        <Box>
        <Dialog 
        open={isOpen} 
        onClose={onClose} 
        fullWidth={true} 
        sx={{
        "& .MuiDialog-container": {
            "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "490px", 
            },
        },
        }} >
        <DialogTitle>Add Course</DialogTitle>
        <Divider sx={{ marginLeft: '0px' }} variant="middle" />
        <DialogContent>
            <Stack gap={2}>
            <ToggleButtonGroup
                value={term}
                exclusive
                onChange={(event) => onClickTerm(event)}
                >
                {termOptions.map((term, index) => (
                    <ToggleButton 
                    key={index} 
                    value={term.value}
                    sx={{ flex: 1, minWidth: 0 }}
                    >
                    {term.title}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Stack direction="row" spacing={2}>
                <TextField 
                id="outlined-course" 
                label="Course" 
                onChange={(event) => handleCourseChange(event)}
                sx={{ flex: 0.5 }}
                />
                <TextField 
                id="outlined-section" 
                label="Section"
                onChange={(event) => handleSectionChange(event)}
                sx={{ flex: 0.5 }}
                />
            </Stack>
            <FormControl>
            <InputLabel id="select-block-label">Block</InputLabel>
                <Select 
                labelId="select-block-label"
                onChange={(event) => handleBlockChange(event)}
                label="Block" 
                value={block}
                >
                {courseBlocks.map((block, index) => (
                    <MenuItem key={index} value={block}>{block}</MenuItem>
                ))}
                </Select>
            </FormControl>
            <TextField 
                id="outlined-location" 
                label="Location" 
                onChange={(event) => handleLocationChange(event)}
            />
            <TextField 
                id="outlined-professor" 
                label="Professor" 
                onChange={(event) => handleProfessorChange(event)}
            />
            <DialogActions>
                <Button sx={{ px: '30px' }} color="error" onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleCreate}>Create</Button>
            </DialogActions>
            </Stack>
        </DialogContent>
        </Dialog>
        <Modal open={isError} onClose={handleCloseErrorModal}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 1,
                    width: 'fit-content',
                    borderRadius: '8px',
                }}
            >
                <Alert variant="filled" onClose={handleCloseErrorModal} severity="error">
                Please fill in all the fields.
                </Alert>
            </Box>
        </Modal>
       </Box>
    );
};

export default AddEventModal;
