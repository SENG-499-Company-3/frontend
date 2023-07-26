import React, { useContext, useState } from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Alert, AlertColor, AlertProps, AlertTitle, Box, Button, Collapse, Container, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import { courseScheduleData } from '../components/common/sampleData/courseSchedule'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { LoadingButton } from '@mui/lab'
import PageContent from '../components/layout/PageContent'
import { ScheduleContext, ScheduleStatus } from '../contexts/ScheduleContext'
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import { TermsContext } from '../contexts/TermsContext'
import { getMonthStringFromNumber } from '../utils/helper'
import { ITerm } from '../hooks/api/useTermsApi'

const HomePage = () => {
    const [generating, setGenerating] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const [publishing, setPulbishing] = useState<boolean>(false);
    const scheduleContext = useContext(ScheduleContext);
    const termsContext = useContext(TermsContext);
    const terms = termsContext.terms();

    const scheduleStatus = scheduleContext.currentSchedule()?.status || 'UNDEFINED';
    const [currentTerm, setCurrentTerm] = React.useState<ITerm | null>(terms[0] || null);
    const [courses, setCourses] = React.useState(courseScheduleData);

    let scheduleStatusTitle = ''; 
    let scheduleStatusText = 'Text'
    let alertBackground = '#e8f4fd'
    let alertSeverity: AlertColor = 'info'
    
    const handleTermChange = (event) => {
        const selectedTermId = event.target.value;
        const selectedTerm = terms.find((term) => term.id === selectedTermId)
        setCurrentTerm(selectedTerm);
      
        /**
         * @TODO
        if (selectedTermValue.length > 1) { // 'All' is selected
            setCourses(courseScheduleData);
        } else {
            setCourses(courseScheduleData.filter((item) => item.Term === selectedTermValue[0]));
        }
        */
      };
    

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

    const handleSetScheduleStatus = (status: ScheduleStatus) => {
        scheduleContext._setCurrentSchedule({ status })
    }

    const _handleGenerate = () => {
        setGenerating(true);
        setTimeout(() => {
            setGenerating(false);
            handleSetScheduleStatus('VALID_PUBLISHED');
        }, 2000)
    }

    const handleGenerate = () => {
        setGenerating(true);
        scheduleContext.generateSchedule().finally(() => setGenerating(false))
    }

    const handleChangeSchedule = () => {
        handleSetScheduleStatus('PENDING');
    }

    const handleDiscard = () => {
        if (confirm('Discard changes?')) {
            handleSetScheduleStatus('VALID_PUBLISHED');
        }
    }

    const handleValidate = () => {
        setValidating(true);
        setTimeout(() => {
            setValidating(false);
            if (Math.random() > 0.5) {
                handleSetScheduleStatus('INVALID');
            } else {
                handleSetScheduleStatus('VALID_UNPUBLISHED')
            }
        }, 4000)
    }

    const handlePublish = () => {
        setPulbishing(true);
        setTimeout(() => {
            setPulbishing(false);
            handleSetScheduleStatus('VALID_PUBLISHED');
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
                        <Box>
                            <FormControl>
                                <InputLabel id='term-select-label'>Term</InputLabel>
                                <Select
                                    label='Term'
                                    value={currentTerm?.id}
                                    labelId='term-select-label'
                                    variant="outlined"
                                    onChange={handleTermChange}
                                    sx={{ minWidth: 150 }}
                                    size='small'
                                >
                                    {terms.map((term) => (
                                        <MenuItem value={term.id} key={term.id}>
                                            {getMonthStringFromNumber(term.month)} {term.year}
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
                                onClick={() => _handleGenerate()}
                            >
                                Generate Schedule
                            </LoadingButton>
                        </Paper>
                    </Container>
                </PageContent>
            ) : (
                <ScheduleList courses={courses} onChange={() => handleChangeSchedule()} />
            )}
        </AppPage>
    )
}

export default HomePage
