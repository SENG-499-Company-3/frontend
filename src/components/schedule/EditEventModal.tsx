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
import { courseBlocks } from "../common/sampleData/courseSchedule"
import { convertToTime, termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";



const EditEventModal = ({ isOpen, onClose, onSave, course }) => {
  const [editableEvent, setEditableEvent] = useState(course);
  
  useEffect(() => {
    setEditableEvent(course);
  }, [course]);

  const courseBlock = editableEvent.Days + ' ' + convertToTime(editableEvent.Begin) + ' ' + convertToTime(editableEvent.End);

  const handleSaveChanges = () => {
    onSave(editableEvent);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const onClickTerm = (event) => {
    const newTerm = parseInt(event.target.value);
    const startDate = termOptions.find((option) => option.value === newTerm)?.startDate;
    const endDate = termOptions.find((option) => option.value === newTerm)?.endDate;

    const updatedCourse = { ...editableEvent, Term: parseInt(event.target.value), StartDate: startDate, EndDate: endDate };
    setEditableEvent(updatedCourse);
  };

  const handleBlockChange = (event) => {
    const selectedBlock = event.target.value.split(" ");
    const days = selectedBlock[0];
    const begin = parseInt(selectedBlock[1].replace(":", ""));
    const end = parseInt(selectedBlock[2].replace(":", ""));

    const updatedCourse = { ...editableEvent, Days: days, Begin: begin, End: end};
    setEditableEvent(updatedCourse);
  }

  const handleCourseChange = (event) => {
    const subj = event.target.value.split(" ")[0];
    const num = event.target.value.split(" ")[1];

    const updatedCourse = { ...editableEvent, Subj: subj, Num: num || "" };
    setEditableEvent(updatedCourse);
  };

  const handleSectionChange = (event) => {
    const updatedCourse = { ...editableEvent, Section: event.target.value };
    setEditableEvent(updatedCourse);
  };

  const handleLocationChange = (event) => {
    const bldg = event.target.value.split(" ")[0];
    const room = event.target.value.split(" ")[1];
    const updatedCourse = { ...editableEvent, Bldg: bldg, Room: room };
    setEditableEvent(updatedCourse);
    console.log(editableEvent);
  };

  const handleProfessorChange = (event) => {
    const updatedCourse = { ...editableEvent, Instructor: event.target.value };
    setEditableEvent(updatedCourse);
  };


  return (
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
      <DialogTitle>Edit Course</DialogTitle>
      <Divider sx={{ marginLeft: '0px' }} variant="middle" />
      <DialogContent>
        <Stack gap={2}>
          <ToggleButtonGroup
              value={editableEvent.Term}
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
              defaultValue={`${editableEvent.Subj} ${editableEvent.Num.toString()}`}
              onChange={(event) => handleCourseChange(event)}
              sx={{ flex: 0.5 }}
            />
            <TextField 
              id="outlined-section" 
              label="Section" 
              defaultValue={editableEvent.Section}
              onChange={(event) => handleSectionChange(event)}
              sx={{ flex: 0.5 }}
            />
          </Stack>
          <Select value={courseBlock} onChange={(event) => handleBlockChange(event)} >
            {courseBlocks.map((block, index) => (
              <MenuItem key={index} value={block}>{block}</MenuItem>
            ))}
          </Select>
          <TextField 
              id="outlined-location" 
              label="Location" 
              defaultValue={`${editableEvent.Bldg} ${editableEvent.Room}`}
              onChange={(event) => handleLocationChange(event)}
          />
          <TextField 
            id="outlined-professor" 
            label="Professor" 
            defaultValue={`${editableEvent.Instructor}`}
            onChange={(event) => handleProfessorChange(event)}
          />
          <DialogActions>
            <Button sx={{ px: '30px' }} color="error" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveChanges}>Save</Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventModal;
