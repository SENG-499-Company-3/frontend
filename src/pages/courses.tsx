import { useContext, useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import ProfessorTable from '../components/professors/ProfessorTable'
import AppPage from '../components/layout/AppPage'
import PageHeader from '../components/layout/PageHeader'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import PageHeaderActions from '../components/layout/PageHeaderActions'
import PageContent from '../components/layout/PageContent'
import useApi from '../hooks/useApi';
import DeleteIcon from '@mui/icons-material/Delete';

import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { ICourse } from '../hooks/api/useCoursesApi';
import { CourseContext } from '../contexts/CourseContext';

interface ICoursesTableProps {
    courses: ICourse[]
    handleDeleteCourse: (course: ICourse) => void
}

const CoursesTable = (props: ICoursesTableProps) => {
    const columns: GridColDef[] = [
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
        { field: 'courseCodeWithNumber', headerName: 'Course Code', flex: 1  },
        {
            field: 'Actions',
            headerName: '',
            flex: 0,
            renderCell: (params) => {
                return (
                    <IconButton onClick={() => props.handleDeleteCourse(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                )
                
            }
        }
    ];

    const courses = props.courses.map((course: ICourse) => ({
        id: course.courseId,
        courseName: course.courseName,
        courseCodeWithNumber: `${course.courseCode} ${course.courseNumber}`
    }));

    return (
        <Paper sx={{ p: 2 }}>
            <DataGrid
                rows={courses}
                columns={columns}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'status', sort: 'asc' }],
                    },
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                sx={{ border: 0 }}
            />
        </Paper>
    )
};

const CoursesPage = () => {
    const api = useApi();
    const courseContext = useContext(CourseContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [newCourseName, setNewCourseName] = useState<string>('');
    const [newCourseCode, setNewCourseCode] = useState<string>('');
    const [newCourseNumber, setNewCourseNumber] = useState<string>('');
    const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
    const [deletingCourse, setdeletingCourse] = useState<ICourse | null>(null);

    const confirmingDelete = Boolean(deletingCourse);

    useEffect(() => {
        // setLoading(true);
        courseContext.fetchCourses();

    }, []);

    const handleCreateCourse = () => {
        const newCourse: Omit<ICourse, 'courseId'> = {
            courseCode: newCourseCode,
            courseNumber: newCourseNumber,
            courseName: newCourseName,
        }

        api.courses.createCourse(newCourse).then((newCourse) => {
            courseContext.addCourse(newCourse);
            setShowCreateDialog(false);
            setNewCourseCode('');
            setNewCourseName('');
            setNewCourseNumber('');
        })
    }

    const handleDeleteCourse = (course: ICourse) => {
        api.courses.deleteCourse(course.courseId).then(() => {
            courseContext.deleteCourse(course);
        })
    }

    const handleCancelCreateCourse = () => {
        setShowCreateDialog(false);
        setNewCourseCode('');
        setNewCourseName('');
        setNewCourseNumber('');
    }

    const NewCourseDialog = () => {
        return (
            <Dialog open={showCreateDialog}>
                <DialogTitle>Create a Course</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Course Title" 

                    />
                    
                    <TextField 
                        label="Course Code" 
                        // onChange={(event) => handleCourseCodeChange(event)}
                    
                        />
                        <TextField 
                        label="Course Number"
                        // onChange={(event) => handleSectionChange(event)}
                    
                        />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCreateCourse()}>Create</Button>
                    <Button onClick={() => handleCancelCreateCourse()}>Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    const DeleteCourseDialog = () => {
        return (
            <Dialog open={confirmingDelete}>
                <DialogTitle>Delete Course</DialogTitle>
                <DialogContent>
                    {deletingCourse && (
                        <DialogContentText>Are you sure you want to delete <strong>{deletingCourse.courseName}</strong>?</DialogContentText>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={() => handleDeleteCourse(deletingCourse)}>Delete</Button>
                    <Button onClick={() => setdeletingCourse(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        )
    }

    return (
        <>
            <NewCourseDialog />
            <DeleteCourseDialog />
            <AppPage>
                <PageHeader>
                    <Box display='flex'>
                        <Box flex='1'>
                            <Typography mb={1} variant='h4'>Courses</Typography>
                        </Box>
                        <PageHeaderActions>
                            <Button onClick={() => setShowCreateDialog(true)} startIcon={<AddIcon />} variant='contained'>Add Course</Button>
                        </PageHeaderActions>
                    </Box>
                </PageHeader>
                <PageContent>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <CoursesTable courses={courseContext.courses()} handleDeleteCourse={(courseId) => setdeletingCourse(courseId)}/>
                    )}
                </PageContent>
            </AppPage>
        </>
    )
}

export default CoursesPage
