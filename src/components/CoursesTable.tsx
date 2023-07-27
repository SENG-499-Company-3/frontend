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

import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { ICourse } from '../hooks/api/useCoursesApi';
import { makeCourseName } from '../utils/helper';
import { CourseContext } from '../contexts/CourseContext';
import { LoadingButton } from '@mui/lab';

interface ICoursesTableProps {
    showNewCourseDialog: boolean;
    onCloseNewCourseDialog: () => void;
    DataGridProps?: Partial<DataGridProps>
}

/*
export const defaultCourses: ICourse[] = [
    {
        courseId: 1,
        courseCode: 'CSC',
        courseNumber: '111',
        courseName: 'Course name',
    },
    {
        courseId: 2,
        courseCode: 'CSC',
        courseNumber: '115',
        courseName: 'Course name',
    },
    {
        courseId: 3,
        courseCode: 'CSC',
        courseNumber: '226',
        courseName: 'Course name',
    },
    {
        courseId: 4,
        courseCode: 'CSC',
        courseNumber: '225',
        courseName: 'Course name',
    },
    {
        courseId: 5,
        courseCode: 'CSC',
        courseNumber: '230',
        courseName: 'Course name',
    },
    {
        courseId: 6,
        courseCode: 'CSC',
        courseNumber: '320',
        courseName: 'Course name',
    },
    {
        courseId: 7,
        courseCode: 'CSC',
        courseNumber: '370',
        courseName: 'Course name',
    },
    {
        courseId: 8,
        courseCode: 'CSC',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 9,
        courseCode: 'MATH',
        courseNumber: '101',
        courseName: 'Course name',
    },
    {
        courseId: 10,
        courseCode: 'MATH',
        courseNumber: '110',
        courseName: 'Course name',
    },
    {
        courseId: 11,
        courseCode: 'MATH',
        courseNumber: '122',
        courseName: 'Course name',
    },
    {
        courseId: 12,
        courseCode: 'SENG',
        courseNumber: '265',
        courseName: 'Course name',
    },
    {
        courseId: 13,   
        courseCode: 'SENG',
        courseNumber: '310',
        courseName: 'Course name',
    },
    {
        courseId: 14,
        courseCode: 'SENG',
        courseNumber: '275',
        courseName: 'Course name',
    },
    {
        courseId: 15,
        courseCode: 'SENG',
        courseNumber: '350',
        courseName: 'Course name',
    },
    {
        courseId: 16,
        courseCode: 'SENG',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 17,   
        courseCode: 'ENGR',
        courseNumber: '110',
        courseName: 'Course name',
    }
]
*/

interface INewCourseDialogProps {
    open: boolean;
    onClose: () => void
}

const NewCourseDialog = (props: INewCourseDialogProps) => {
    const [creating, setCreating] = useState<boolean>(false);
    const [courseName, setCourseName] = useState<string>('');
    const [courseCode, setCourseCode] = useState<string>('');
    const [courseNumber, setCourseNumber] = useState<string>('');
    const courseContext = useContext(CourseContext);

    const handleCreateCourse = () => {
        setCreating(true)
        courseContext.addCourse({ courseCode, courseName, courseNumber })
            .then(() => {
                props.onClose()
            })
            .finally(() => {
                setCreating(false)
            })
    }

    const handleClose = () => {
        props.onClose();
    }

    const handleFetchCourses = (): Promise<void> => {
        return courseContext.fetchCourses()
    }

    useEffect(() => {
        handleFetchCourses();
    }, [])

    return (
        <Dialog open={props.open}>
            <DialogTitle>Create a Course</DialogTitle>
            <DialogContent>
                <DialogContentText>Enter the course name, code and number</DialogContentText>
                <Box mt={2}>
                    <TextField
                        label="Course Title" 
                        fullWidth
                        onChange={(event) => setCourseName(event.target.value)}
                        value={courseName}

                    />
                    <Box display='flex' gap={1} mt={2}>
                        <TextField 
                            label="Course Code" 
                            onChange={(event) => setCourseCode(event.target.value)}
                            value={courseCode}
                        />
                        <TextField 
                            label="Course Number"
                            onChange={(event) => setCourseNumber(event.target.value)}
                            value={courseNumber}
                        />
                    </Box>
                </Box>
                
                
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={creating} onClick={() => handleClose()}>Cancel</LoadingButton>
                <LoadingButton loading={creating} onClick={() => handleCreateCourse()}>Create</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}


interface IDeleteCourseDialogProps {
    deletingCourse: ICourse;
    open: boolean;
    onClose: () => void
}

const DeleteCourseDialog = (props: IDeleteCourseDialogProps) => {
    const [deleting, setDeleting] = useState<boolean>(false);
    const courseContext = useContext(CourseContext);

    const handleDeleteCourse = () => {
        setDeleting(true);
        courseContext.deleteCourse(props.deletingCourse)
            .then(() => {
                props.onClose();
            })
            .finally(() => {
                setDeleting(false);
            })
    }
    return (
        <Dialog open={props.open}>
            <DialogTitle>Delete Course</DialogTitle>
            <DialogContent>
                {props.deletingCourse && (
                    <DialogContentText>Are you sure you want to delete <strong>{props.deletingCourse.courseName}</strong>?</DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <LoadingButton loading={deleting} color='error' onClick={() => handleDeleteCourse()}>Delete</LoadingButton>
                <LoadingButton loading={deleting} onClick={() => props.onClose()}>Cancel</LoadingButton>
            </DialogActions>
        </Dialog>
    )
}


const CoursesTable = (props: ICoursesTableProps) => {
    const api = useApi();
    const [loading, setLoading] = useState<boolean>(false);
    const [deletingCourse, setdeletingCourse] = useState<ICourse | null>(null);

    const courseContext = useContext(CourseContext);
    const courses = courseContext.courses();

    const columns: GridColDef[] = [
        { field: 'courseCodeWithNumber', headerName: 'Course Code', flex: 1  },
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
        {
            field: 'Actions',
            headerName: '',
            flex: 0,
            renderCell: (params) => {
                return (
                    <IconButton onClick={() => setdeletingCourse(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                )
                
            }
        }
    ];

    const courseRows = courses.map((course: ICourse) => ({
        id: course.courseId,
        courseName: course.courseName,
        courseCodeWithNumber: makeCourseName(course)
    }));

    return (
        loading ? (
            <LoadingSpinner />
        ) : (        
            <>
                <NewCourseDialog
                    open={props.showNewCourseDialog}
                    onClose={props.onCloseNewCourseDialog}
                />
                <DeleteCourseDialog
                    open={Boolean(deletingCourse)}
                    deletingCourse={deletingCourse}
                    onClose={() => setdeletingCourse(null)}
                />
                <DataGrid
                    rows={courseRows}
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
                    disableRowSelectionOnClick
                    {...props.DataGridProps}
                />
            </>
        )
    );
};

export default CoursesTable
