import React, { useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridRowModel, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridActionsCellItem, GridRowModesModel, GridValueGetterParams, GridValueSetterParams } from '@mui/x-data-grid';
import { courseScheduleData } from '../common/sampleData/courseSchedule'
import WeekdayTable  from './WeekdayTable'
import { Course } from '../../types/course'
import { convertToTime, courseBlocks } from '../../utils/helper';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Button, Paper } from '@mui/material';
import AddEventModal from "./AddEventModal";
import EditEventModal from "./EditEventModal";
import DeleteConfirmModal from './DeleteConfirmModal';

const initialRows: GridRowsProp = courseScheduleData.map((course: Course, index: number ) => ({
  id: index,
  term: course.Term,
  course: course.Subj + ' ' + course.Num,
  section: course.Section,
  title: course.Title,
  scheduleType: course.SchedType,
  instructor: course.Instructor,
  location: course.Bldg + ' ' + course.Room,
  start: convertToTime(course.Begin),
  end: convertToTime(course.End),
  days: course.Days,
  capacity: course.Cap,
}));

const createRow = (id: number) => {
    return { id, days: '', isNew: true }; //Update with defaults if desired. Days must be empty string
};

const parseCourse = (course: Course) => {
    return {
        id: course.id,
        term: course.Term,
        course: course.Subj + ' ' + course.Num,
        section: course.Section,
        title: course.Title,
        scheduleType: course.SchedType,
        instructor: course.Instructor,
        location: course.Bldg + ' ' + course.Room,
        start: convertToTime(course.Begin),
        end: convertToTime(course.End),
        days: course.Days,
        capacity: course.Cap,
    };
};

const addRow = (course: Course, id: number) => {
    return {
        id,
        term: course.Term,
        course: course.Subj + ' ' + course.Num,
        section: course.Section,
        title: course.Title,
        scheduleType: course.SchedType,
        instructor: course.Instructor,
        location: course.Bldg + ' ' + course.Room,
        start: convertToTime(course.Begin),
        end: convertToTime(course.End),
        days: course.Days,
        //capacity: course.Cap,
        isNew: true
    };
};

/* Map incoming schedule's terms and professors into array for dropdowns. CONFIRM this functions with incoming data */
const termList = courseScheduleData.map((course: Course) => course.Term).filter((value, index, self) => self.indexOf(value) === index);
const professorList = courseScheduleData.map((course: Course) => course.Instructor).filter((value, index, self) => self.indexOf(value) === index);

/* Parser for course, section, and location to force caps entry */
function parseToCaps(value: any) {
    return String(value).toUpperCase();
}

const ScheduleList = () => {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    /* PROBLEM: when rows start getting deleted, this is going to get super wonky */
    const numRows = rows.length;
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentRowID, setCurrentRowID] = useState<GridRowId>(null);

    /* Add row functions */
    const handleAddCourse = () => {
        setIsAddCourseOpen(true);
    };

    const onAddCourseModalClose = () => {
        setIsAddCourseOpen(false);
    };

    const onAddCourse = (newCourse: Course) => {
        setRows((prevRows) => [...prevRows, addRow(newCourse, numRows)]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [numRows]: { mode: GridRowModes.Edit, fieldToFocus: 'actions' },
        }));
    };
    
    /* Edit row functions */
    const handleEditClick = (id: GridRowId) => () => {
        setIsEditModalOpen(true);
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const onEditModalSave = (updatedCourse: Course) => {
        setCourse(updatedCourse);
        onCourseUpdate(updatedCourse);
    };

    const onEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    /* Save row functions */
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    /* Delete row functions */
    const handleDeleteClick = (id: GridRowId) => () => {
        setIsDeleteModalOpen(true);
        setCurrentRowID(id);
    };

    const onDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirmation = () => {
        onDeleteModalClose();
        setRows(rows.filter((row) => row.id !== currentRowID));
        setCurrentRowID(null);
    };

    /* Cancel click functions */
    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow!.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow: GridRowModel) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    /* Columns moved to be internal due to Actions requiring the above functions */
    const columns: GridColDef[] = [
        { field: 'term', headerName: 'Term', width: 100, editable: true, type:'singleSelect', valueOptions:termList },
        { field: 'course', headerName: 'Course', width: 150, editable: true, valueParser: parseToCaps },
        { field: 'section', headerName: 'Section', width: 100, editable: true, valueParser: parseToCaps },
        { field: 'instructor', headerName: 'Instructor', width: 150, editable: true, type: 'singleSelect', valueOptions:professorList },
        { field: 'capacity', headerName: 'Capacity', type: 'number', width: 100, editable: true },
        { field: 'location', headerName: 'Location', width: 150, editable: true, valueParser: parseToCaps },
        {
            field: 'days',
            headerName: 'Days',
            width: 200,
            renderCell: (params) => <WeekdayTable days={params.value.split('')} />,
        },
        { field: 'start', headerName: 'Start', width: 100 },
        { field: 'end', headerName: 'End', width: 100 },
        /*{
            field: 'daysTime', headerName: 'Block', width: 100, editable: true,
            type: 'singleSelect',
            valueOptions: daysTimeSlots,
            valueGetter: getDaysTime,
            valueSetter: setDaysTime,
        },*/
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Paper sx={{ p: 2 }}>
            <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddCourse()}>
                Add Course
            </Button>
            <DataGrid
                rows={rows} 
                columns={columns}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                processRowUpdate={processRowUpdate}
                onRowEditStop={handleRowEditStop}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'course', sort: 'asc' }],
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    },
                }}
            />
            <AddEventModal
                isOpen={isAddCourseOpen}
                onClose={onAddCourseModalClose}
                onCreate={onAddCourse}
            />
            {/*<EditEventModal
                isOpen={isEditModalOpen}
                onClose={onEditModalClose}
                onSave={onEditModalSave}
                course={rows}
                courseBgColor={null}
            />*/}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                onConfirm={handleDeleteConfirmation}
            />
        </Paper>
    )
}

export default ScheduleList