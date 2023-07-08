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
import Typography from "@mui/material/Typography";
import { courseBlocks } from "../common/sampleData/courseSchedule"
import { convertToTime, termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";



const EditEventModal = ({ isOpen, onClose, onSave, course, courseBgColor }) => {
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

  const handleBlockChange = (event) => {
    const selectedBlock = event.target.value.split(" ");
    const days = selectedBlock[0];
    const begin = parseInt(selectedBlock[1].replace(":", ""));
    const end = parseInt(selectedBlock[2].replace(":", ""));

    const updatedCourse = { ...editableEvent, Days: days, Begin: begin, End: end};
    setEditableEvent(updatedCourse);
  }

  const handleLocationChange = (event) => {
    const bldg = event.target.value.split(" ")[0];
    const room = event.target.value.split(" ")[1];
    const updatedCourse = { ...editableEvent, Bldg: bldg, Room: room };
    setEditableEvent(updatedCourse);
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
        <Stack gap={3}>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography 
              variant="subtitle1" 
              bgcolor={courseBgColor}
              style={{ 
                  display: "inline-block", 
                  width: "fit-content", 
                  padding: '3px 10px',
                  borderRadius: "8px", 
                  }}>
                  {`${course.Subj} ${course.Num} ${course.Section}`}
            </Typography>
            <Typography variant="subtitle1">
                  {termOptions.find(option => option.value === course.Term).title}
            </Typography>
          </Stack>
          <FormControl>
          <InputLabel id="select-block-label">Block</InputLabel>
            <Select 
              labelId="select-block-label"
              value={courseBlock} 
              onChange={(event) => handleBlockChange(event)}
              label="Block" 
            >
              {courseBlocks.map((block, index) => (
                <MenuItem key={index} value={block}>{block}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
