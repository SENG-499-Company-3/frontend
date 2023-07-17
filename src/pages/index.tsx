import React from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Alert, AlertTitle, Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const HomePage = () => {


    return (
        <AppPage>
            <PageHeader>
                <Box display='flex'>
                    <Box flex='1'>
                        <Typography mb={1} variant='h4'>Schedule Dashboard</Typography>
                        <Typography>View and edit course schedules by term.</Typography>
                    </Box>
                    <PageHeaderActions>
                        <FormControl>
                            <InputLabel id='term-select-label'>Term</InputLabel>
                            <Select
                                label='Term'
                                value='FALL2023'
                                labelId='term-select-label'
                                variant="outlined"
                                size='small'
                            >
                                <MenuItem value='FALL2023'>Fall 2023</MenuItem>
                            </Select>
                        </FormControl>
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
            <ScheduleList />
        </AppPage>
    )
}

export default HomePage
