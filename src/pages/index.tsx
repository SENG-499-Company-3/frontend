import React, { useState } from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Alert, AlertColor, AlertProps, AlertTitle, Box, Button, Collapse, Container, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'

import PageHeaderActions from '../components/layout/PageHeaderActions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab'
import PageContent from '../components/layout/PageContent'

type ScheduleStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'VALID_UNPUBLISHED'
    | 'VALID_PUBLISHED'
    | 'INVALID'

const HomePage = () => {
    const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>('UNDEFINED')
    const [generating, setGenerating] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const [publishing, setPulbishing] = useState<boolean>(false);

    let scheduleStatusTitle = ''; 
    let scheduleStatusText = 'Text'
    let alertBackground = '#e8f4fd'
    let alertSeverity: AlertColor = 'info'

    switch (scheduleStatus) {
        case 'UNDEFINED':
            break;
        case 'PENDING':
            scheduleStatusTitle = 'You have unsubmitted changes';
            scheduleStatusText = 'You must validate your schedule before it can be published.'
            alertBackground = '#e8f4fd'
            alertSeverity = 'info'
            break;
        case 'VALID_UNPUBLISHED':
            scheduleStatusTitle = 'Your schedule is unpublished';
            scheduleStatusText = 'Your schedule was successfully validated and can now be published.'
            alertBackground = '#dff0d8'
            alertSeverity = 'success'
            break;
        case 'VALID_PUBLISHED': 
            scheduleStatusTitle = 'Your schedule published and validated';
            scheduleStatusText = 'Your schedule was successfully validated and published!'
            alertBackground = '#dff0d8'
            alertSeverity = 'success'
            break;
        case 'INVALID': 
            scheduleStatusTitle = 'Your schedule is invalid';
            scheduleStatusText = 'Please address errors in your schedule before revalidating.'
            alertBackground = '#f0d8d8'
            alertSeverity = 'error'
            break;


    }

    const handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            setScheduleStatus('VALID_PUBLISHED');
        }, 2000)
    }

    const handleChangeSchedule = () => {
        setScheduleStatus('PENDING');
    }

    const handleDiscard = () => {
        if (confirm('Discard changes?')) {
            setScheduleStatus('VALID_PUBLISHED');
        }
    }

    const handleValidate = () => {
        setValidating(true);
        setTimeout(() => {
            setValidating(false);
            if (Math.random() > 0.5) {
                setScheduleStatus('INVALID');
            } else {
                setScheduleStatus('VALID_UNPUBLISHED')
            }
        }, 4000)
    }

    const getCourses = (courses: Course[]) => {
        return courses;
    };

    const handlePublish = () => {
        setPulbishing(true);
        setTimeout(() => {
            setPulbishing(false);
            setScheduleStatus('VALID_PUBLISHED');
        }, 2000)
    }

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
                        <LoadingButton
                            variant='contained'
                            disabled={['UNDEFINED', 'VALID_UNPUBLISHED', 'VALID_PUBLISHED', 'INVALID'].includes(scheduleStatus)}
                            startIcon={<PublicIcon />}
                            onClick={() => handleValidate()}
                            loading={validating}
                        >Validate Schedule</LoadingButton>

                        {scheduleStatus === 'VALID_UNPUBLISHED' && (
                            <LoadingButton
                                variant='contained'
                                color='success'
                                startIcon={<PublicIcon />}
                                onClick={() => handlePublish()}
                                loading={publishing}
                            >Publish Schedule</LoadingButton>
                        )}

                        {['UNSAVED', 'PENDING', 'VALID_UNPUBLISHED', 'INVALID'].includes(scheduleStatus) && (
                            <Button
                                variant='outlined'
                                color='error'
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDiscard()}
                            >Discard Changes</Button>
                        )}
                    </PageHeaderActions>
                </Box>
                <Collapse in={scheduleStatus !== 'UNDEFINED'}>
                    <Alert
                        severity={alertSeverity}
                        variant='outlined'
                        sx={{
                            mt: 2,
                            backgroundColor: (theme) => theme.palette.mode === 'light' ? alertBackground : undefined
                        }}
                        action={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                            </Box>
                        }
                    >
                        <AlertTitle>{scheduleStatusTitle}</AlertTitle>
                        <Typography component='span'>{scheduleStatusText}</Typography>
                    </Alert>
                </Collapse>
            </PageHeader>
            {scheduleStatus === 'UNDEFINED' ? (
                <PageContent>
                    <Container maxWidth='md'>
                        <Paper sx={{ p: 8, textAlign: 'center' }}>
                            <Typography variant='h4' mb={2}>There is no existing schedule</Typography>
                            <Typography variant='body1' mb={2}>Click to generate a schedule.</Typography>
                            <LoadingButton
                                variant='contained'
                                startIcon={<PublicIcon />}
                                loading={generating}
                                onClick={() => handleGenerate()}
                            >
                                Generate Schedule
                            </LoadingButton>
                        </Paper>
                    </Container>
                </PageContent>
            ) : (
                <ScheduleList 
                    onChange={() => handleChangeSchedule()}
                    onValidate={() => getCourses(null)}
                />
            )}
        </AppPage>
    )
}

export default HomePage
