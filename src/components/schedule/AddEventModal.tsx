import React, { useState } from "react";
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
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import { courseBlocks } from "../common/sampleData/courseSchedule"
import { termOptions } from "../../utils/helper";
import Autocomplete from "@mui/material/Autocomplete";


const mockInstructors = ["Michael Zastre", "John Smith", "Jane Doe", "Bob"];
const mockLocations = ["ECS 123", "ECS 115", "ELW 220", "CLE 225"];


const AddEventModal = ({ isOpen, onClose, onCreate }) => {
    const [term, setTerm] = useState(null);
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [section, setSection] = useState("");
    const [block, setBlock] = useState("");
    const [location, setLocation] = useState("");
    const [professor, setProfessor] = useState("");
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const onClickTerm = (event) => {
        setTerm(parseInt(event.target.value));
    };

    const handleBlockChange = (event) => {
        setBlock(event.target.value);
    }

    const handleCourseNameChange = (event) => {
        setCourseName(event.target.value);
    };

    const handleCourseCodeChange = (event) => {
        setCourseCode(event.target.value);
    };

    const handleSectionChange = (event) => {
        setSection(event.target.value);
    };

    const handleLocationChange = (event, value) => {
        setLocation(value);
    };

    const handleProfessorChange = (event, value) => {
        setProfessor(value);
    };

    const handleCreate = () => {
        // check if all fields are entered
        if (!courseName.trim() || !courseCode.trim() || !section.trim() || !term || !block || !location || !professor) {
            setErrorMessage("Please fill out all fields.");
            setIsError(true);
            return;
        }

        // check if course is a valid input
        const code = getSubjNum(courseCode);
        let subj = "";
        let num = null;
        if (!code) {
            setErrorMessage("Please enter a valid Course Code. Example: CSC 101 or CSC101");
            setIsError(true);
            return;
        }
        else {
            subj = code.subj;
            num = parseInt(code.num);
        }

        // get course info
        const newTerm = parseInt(term);
        const startDate = termOptions.find((option) => option.value === newTerm)?.startDate;
        const endDate = termOptions.find((option) => option.value === newTerm)?.endDate;

        const bldg = location.split(" ")[0];
        const room = location.split(" ")[1];

        const days = block.split(" ")[0];
        const begin = parseInt(block.split(" ")[1].replace(":", ""));
        const end = parseInt(block.split(" ")[2].replace(":", ""));

        const newCourse = ({
            id: subj + num.toString() + section,
            Term: term, 
            Subj: subj, 
            Num: num, 
            Section: section, 
            Days: days, 
            Begin: begin, 
            End: end, 
            StartDate: startDate,
            EndDate: endDate,
            Bldg: bldg, 
            Room: room, 
            Instructor: professor,
            Title: courseName,
        });
        onCreate(newCourse);
        handleClose();
        clearFields();
    };

    const handleClose = () => {
        clearFields();
        onClose();
    };

    const handleCloseErrorModal = () => {
        setIsError(false);
    };

    const clearFields = () => {
        setTerm(null);
        setCourseName("");
        setCourseCode("");
        setSection("");
        setBlock("");
        setLocation("");
        setProfessor("");
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
                <TextField 
                    id="outlined-course-name" 
                    label="Course Name" 
                    onChange={(event) => handleCourseNameChange(event)}
                    sx={{ flex: 0.5 }}
                    />
                <Stack direction="row" spacing={2}>
                    <TextField 
                    id="outlined-course-code" 
                    label="Course Code" 
                    onChange={(event) => handleCourseCodeChange(event)}
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
                <Autocomplete
                    disablePortal
                    id="autocomplete-location"
                    options={mockLocations}
                    onChange={handleLocationChange}
                    renderInput={(params) => <TextField {...params} label="Location" />}
                />
                <Autocomplete
                    disablePortal
                    id="autocomplete-instructor"
                    options={mockInstructors}
                    onChange={handleProfessorChange}
                    renderInput={(params) => <TextField {...params} label="Instructor" />}
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
                        {errorMessage}
                    </Alert>
                </Box>
            </Modal>
       </Box>
    );
};

export default AddEventModal;

function getSubjNum(courseInput: string) {
    let subj = "";
    let num = "";
    const validInput = courseInput.match(/^([A-Za-z]{2,4})\s?(\d{3}[A-Za-z]?)$/);
    
    if (validInput) {
        subj = validInput[1].toUpperCase();
        num = validInput[2];
    }

    else {
        return null;
    }

    return { subj, num };
};
