import React, { useContext, useState, useEffect } from 'react'
import ScheduleList from '../components/schedule/ScheduleList'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Alert, AlertColor, Divider, AlertTitle, Box, Button, Collapse, Container, FormControl, InputLabel, MenuItem, Paper, Select, Typography, Menu } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import { LoadingButton } from '@mui/lab'
import PageContent from '../components/layout/PageContent'
import { Schedule, ScheduleContext, ScheduleStatus } from '../contexts/ScheduleContext'
import DeleteIcon from '@mui/icons-material/Delete';
import { TermsContext } from '../contexts/TermsContext'
import { getMonthStringFromNumber, pluralize } from '../utils/helper'
import { ITerm } from '../hooks/api/useTermsApi'
import { GridRowSelectionModel } from '@mui/x-data-grid'
import CoursesTable from '../components/CoursesTable'
import { CourseContext } from '../contexts/CourseContext'

const HomePage = () => {
    const [generating, setGenerating] = useState<boolean>(false);
    const [validating, setValidating] = useState<boolean>(false);
    const [publishing, setPulbishing] = useState<boolean>(false);
    const [showNewCourseDialog, setShowNewCourseDialog] = useState<boolean>(false);
    const [courseMenuAnchorEl, setCourseMenuAnchorEl] = useState(null);
    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const scheduleContext = useContext(ScheduleContext);
    const termsContext = useContext(TermsContext);
    const terms = termsContext.terms();

    const scheduleStatus = scheduleContext.currentSchedule()?.status || 'UNDEFINED';
    const [currentTerm, setCurrentTerm] = React.useState<ITerm | null>(terms[0] || null);

    const courseContext = useContext(CourseContext);
    const courses = courseContext.courses();

    useEffect(() => {
        scheduleContext.fetchSchedule();
    }, []);

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
    
    useEffect(() => {
        setCurrentTerm(terms[0])
    }, [terms])

    /*
    useEffect(() => {

    }, [courseRows])
    */

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

    const handleSetScheduleStatus = (newStatus: ScheduleStatus) => {
        console.log('newStatus', newStatus);
        // const updatedSchedule = { ...scheduleContext.workingSchedule(), status: newStatus };
        // scheduleContext._setWorkingSchedule(updatedSchedule);
    }

    const handleGenerate = () => {
        setGenerating(true);

        const selected = courses.filter((course) => rowSelectionModel.includes(course._id));
        console.log('selected', selected);
        const term = currentTerm;
        console.log('term', term);

        scheduleContext.generateSchedule(selected, term).finally(() => setGenerating(false))
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

    const displayedSchedule = scheduleContext.displaySchedule();
    console.log({ displayedSchedule })

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
                                    labelId='term-select-label'
                                    variant="outlined"
                                    value={currentTerm?.id || -1}
                                    onChange={handleTermChange}
                                    sx={{ minWidth: 150 }}
                                    size='small'
                                    disabled={terms.length === 0}
                                >
                                    {terms.length === 0 && (
                                        <MenuItem value={-1}>
                                        
                                        </MenuItem>
                                    )}
                                    {terms.map((term) => (
                                        <MenuItem value={term.id} key={term.id}>
                                            {getMonthStringFromNumber(term.month)} {term.year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
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
                        <Paper sx={{ px: 8, pt: 6, pb: 1, textAlign: 'center' }}>
                            <Typography variant='h4' mb={2}>There is no existing schedule</Typography>
                            <Typography variant='body1' mb={2}>Select courses to schedule below, then click to generate a schedule.</Typography>
                            <Menu anchorEl={courseMenuAnchorEl} open={Boolean(courseMenuAnchorEl)} onClose={() => setCourseMenuAnchorEl(null)}>
                                <MenuItem
                                    onClick={() => {
                                        setShowNewCourseDialog(true);
                                        setCourseMenuAnchorEl(null)
                                    }}
                                >Create Course</MenuItem>
                            </Menu>
                            <Box display='flex' gap={1} justifyContent='center'>
                                <Button variant='outlined' startIcon={<SchoolIcon />} endIcon={<ExpandMoreIcon />} onClick={(event) => setCourseMenuAnchorEl(event.currentTarget)}>
                                    Course Options
                                </Button>
                                <LoadingButton
                                    variant='contained'
                                    startIcon={<PublicIcon />}
                                    loading={generating}
                                    onClick={() => handleGenerate()}
                                    disabled={rowSelectionModel.length <= 0}
                                >
                                    Generate Schedule
                                </LoadingButton>
                            </Box>
                            <Box sx={{ textAlign: 'left', my: 3 }}>
                                <Typography>
                                    <strong>
                                        {`Scheduling ${rowSelectionModel.length} ${pluralize(rowSelectionModel.length, 'courses')}`}
                                    </strong>
                                </Typography>
                                <Divider sx={{ pt: 1 }} />
                                <CoursesTable
                                    showNewCourseDialog={showNewCourseDialog}
                                    onCloseNewCourseDialog={() => setShowNewCourseDialog(false)}
                                    DataGridProps={{
                                        checkboxSelection: true,
                                        sx: {
                                            height: 500,
                                            border: 0
                                        },
                                        rowSelectionModel,
                                        onRowSelectionModelChange: setRowSelectionModel
                                    }}
                                />
                            </Box>
                        </Paper>
                    </Container>
                </PageContent>
            ) : (
                <>
                    {displayedSchedule && (

                        <ScheduleList 
                            courses={displayedSchedule} 
                            onChange={() => {}} // handleChangeSchedule}
                        />
                    )}
                </>
                )}
        </AppPage>
    )
}

export default HomePage
