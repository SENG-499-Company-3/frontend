import React from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import PageContent from '../components/layout/PageContent'
import { courseScheduleData } from '../components/common/sampleData/courseSchedule'

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
                        <Typography mb={1} variant='h4'>Admin Dashboard</Typography>
                        <Typography>View current course schedules.</Typography>
                    </Box>
                    <PageHeaderActions>
                        <FormControl>
                            <InputLabel id='term-select-label'>Term</InputLabel>
                            <Select
                                label='Term'
                                value={term}
                                labelId='term-select-label'
                                variant="outlined"
                                onChange={handleTermChange}
                                sx={{ minWidth: 150 }}
                            >
                                {termOptions.map((term, index) => (
                                    <MenuItem value={term.title} key={index}>
                                    {term.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </PageHeaderActions>
                </Box>
            </PageHeader>
            <ScheduleList courses={courses}/>
        </AppPage>
    )
}

export default HomePage
