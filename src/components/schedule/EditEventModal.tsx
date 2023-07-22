import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { convertToTime, courseBlocks, termOptions } from "../../utils/helper";
import { Divider } from "@mui/material";
import useApi from "../../hooks/useApi";
import { IUser } from "../../hooks/api/useUserApi";
import { IClassroom } from "../../hooks/api/useClassroomApi";

const mockInstructors = ["Michael Zastre", "John Smith", "Jane Doe", "Bob", "Jabbari, Hosna"];
const mockLocations = ["ECS 123", "ECS 115", "ELW 220", "CLE 225", "HSD A240"];

const EditEventModal = ({ isOpen, onClose, onSave, course, courseBgColor }) => {
  const [editableEvent, setEditableEvent] = useState(course);
  const [instructors, setInstructors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const api = useApi();
  
  useEffect(() => {
    setEditableEvent(course);
  }, [course]);

  useEffect(() => {
    api.user.listUsers()
        .then((users: IUser[]) => {
            setInstructors(users.map((user) => ({
                name: user.name,
                id: user.id,
            })));
        })
        .catch(() => {
            console.error("Failed to fetch professors.")
        })
  }, [])

  useEffect(() => {
    api.classroom.listClassrooms()
        .then((classrooms: IClassroom[]) => {
          setClassrooms(classrooms.map((classroom) => classroom.buildingName + ' ' + classroom.roomNumber));
        })
        .catch(() => {
            console.error("Failed to fetch classrooms.")
        })
  }, [])

  console.log(classrooms)

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

  const handleLocationChange = (event, value) => {
    const bldg = value.split(" ")[0];
    const room = value.split(" ")[1];
    const updatedCourse = { ...editableEvent, Bldg: bldg, Room: room };
    setEditableEvent(updatedCourse);
  };

  const handleProfessorChange = (event, value) => {
    if (!value) {
      // When the value is null or undefined, clear the instructor details.
      const updatedCourse = { ...editableEvent, Instructor: "", ProfessorID: "" };
      setEditableEvent(updatedCourse);
    } else {
      const updatedCourse = { ...editableEvent, Instructor: value.name, ProfessorID: value.id };
      setEditableEvent(updatedCourse);
    }
  };

  const handleCapacityChange = (event) => {
    const updatedCourse = { ...editableEvent, Cap: event.target.value};
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
          <Typography variant="h5">{course.Title}</Typography>
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
          <Stack spacing={2}>
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
            <Autocomplete
              disablePortal
              id="autocomplete-location"
              options={mockLocations}
              value={`${editableEvent.Bldg} ${editableEvent.Room}`}
              onChange={handleLocationChange}
              renderInput={(params) => <TextField {...params} label="Location" />}
            />
            <Autocomplete
              disablePortal
              id="autocomplete-instructor"
              options={instructors}
              value={editableEvent.Instructor ? { name: editableEvent.Instructor, id: editableEvent.ProfessorID } : null}
              getOptionLabel={(instructors) => instructors.name}
              onChange={handleProfessorChange}
              renderInput={(params) => <TextField {...params} label="Instructor" />}
            />
            <TextField 
              id="outlined-capacity" 
              label="Capacity" 
              type="number"
              InputProps={{
                inputProps: { min: 0 }
              }}
              defaultValue={`${editableEvent.Cap}`}
              onChange={(event) => handleCapacityChange(event)}
            />
          </Stack>
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
