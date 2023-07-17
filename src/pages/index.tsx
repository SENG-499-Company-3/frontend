import React from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import PageContent from '../components/layout/PageContent'
import { courseScheduleData } from '../components/common/sampleData/courseSchedule'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const termOptions = [
    {
        title: 'Summer 2023',
        value: [202305],
    },
    {
        title: 'Fall 2023',
        value: [202309],
    },
    {
        title: 'Spring 2024',
        value: [202401],
    },
    {
        title: 'All',
        value: [202305, 202309, 202401],
    }, 
]

const HomePage = () => {
    const [term, setTerm] = React.useState(termOptions[3].title);
    const [courses, setCourses] = React.useState(courseScheduleData);
    
    const handleTermChange = (event) => {
        const selectedTerm = event.target.value;
        const selectedTermValue = termOptions.find((option) => option.title === selectedTerm).value;
      
        setTerm(selectedTerm);
      
        if (selectedTermValue.length > 1) { // 'All' is selected
          setCourses(courseScheduleData);
        } else {
          setCourses(courseScheduleData.filter((item) => item.Term === selectedTermValue[0]));
        }
      };


    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Schedule Dashboard</Typography>
                        <Typography>View and edit course schedules by term.</Typography>
                    </Box>
                    <PageHeaderActions>
                        <Box>
                            <FormControl>
                                <InputLabel id='term-select-label'>Term</InputLabel>
                                <Select
                                    label='Term'
                                    value={term}
                                    labelId='term-select-label'
                                    variant="outlined"
                                    onChange={handleTermChange}
                                    sx={{ minWidth: 150 }}
                                    size='small'
                                >
                                    {termOptions.map((term, index) => (
                                        <MenuItem value={term.title} key={index}>
                                        {term.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button variant='outlined' startIcon={<PublicIcon />}>Validate and Publish</Button>
                        <Button disabled variant='outlined' startIcon={<SchoolIcon />} endIcon={<ExpandMoreIcon />}>Course Options</Button>
                        <Button variant='outlined' startIcon={<CalendarMonthIcon />} endIcon={<ExpandMoreIcon />}>Schedule Options</Button>
                    </PageHeaderActions>
                </Box>
                <Alert
                    severity='info'
                    variant='outlined'
                    sx={{ mt: 2 }}
                    action={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button variant='contained' disabled startIcon={<SaveIcon />}>Save Changes</Button>
                            <Button variant='contained' disabled startIcon={<DeleteIcon />}>Discard Changes</Button>
                        </Box>
                    }
                >
                    <AlertTitle>You have unsaved changes</AlertTitle>
                    <Typography component='span'>Hello world</Typography>
                </Alert>
            </PageHeader>
            <ScheduleList courses={courses}/>
        </AppPage>
    )
}

export default HomePage
