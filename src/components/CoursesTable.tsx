import { useEffect, useState } from 'react'
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

interface ICoursesTableProps {
    showNewCourseDialog: boolean;
    onCloseNewCourseDialog: () => void;
    DataGridProps?: Partial<DataGridProps>
}

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

const CoursesTable = (props: ICoursesTableProps) => {
    const handleDeleteCourse = (course: ICourse) => {
        api.courses.deleteCourse(course.courseId).then(() => {
            // courseContext.deleteCourse(course);
        })
    }

    const columns: GridColDef[] = [
        { field: 'courseCodeWithNumber', headerName: 'Course Code', flex: 1  },
        { field: 'courseName', headerName: 'Course Name', flex: 1 },
        {
            field: 'Actions',
            headerName: '',
            flex: 0,
            renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleDeleteCourse(params.row)}>
                        <DeleteIcon />
                    </IconButton>
                )
                
            }
        }
    ];

    const api = useApi();
    const [courses, setCourses] = useState<ICourse[]>(defaultCourses);
    const [loading, setLoading] = useState<boolean>(false);
    const [newCourseName, setNewCourseName] = useState<string>('');
    const [newCourseCode, setNewCourseCode] = useState<string>('');
    const [newCourseNumber, setNewCourseNumber] = useState<string>('');
    const [deletingCourse, setdeletingCourse] = useState<ICourse | null>(null);

    const confirmingDelete = Boolean(deletingCourse);

    const courseRows = courses.map((course: ICourse) => ({
        id: course.courseId,
        courseName: course.courseName,
        courseCodeWithNumber: makeCourseName(course)
    }));

    useEffect(() => {
        // setLoading(true);
        api.courses.listCourses()
            .then((courses: ICourse[]) => {
                setCourses(courses);
            })
            .catch(() => {
                console.error("Failed to fetch courses.")
            })
            .finally(() => {
                setLoading(false);
            })
    }, []);

    const handleCreateCourse = () => {
        //
    }

    const handleCancelCreateCourse = () => {
        props.onCloseNewCourseDialog()
        setNewCourseCode('');
        setNewCourseName('');
        setNewCourseNumber('');
    }

    const NewCourseDialog = () => {
        return (
            <Dialog open={props.showNewCourseDialog}>
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
        loading ? (
            <LoadingSpinner />
        ) : (        
            <>
                <NewCourseDialog />
                <DeleteCourseDialog />
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
