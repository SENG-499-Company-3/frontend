import React, { useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridRowModel, GridEventListener, GridRowEditStopReasons, GridRowId, GridRowModes, GridActionsCellItem, GridRowModesModel, GridValueGetterParams, GridValueSetterParams } from '@mui/x-data-grid';
import { courseScheduleData } from '../common/sampleData/courseSchedule'
import WeekdayTable  from './WeekdayTable'
import { Course } from '../../types/course'
import { convertToTime } from '../../utils/helper';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';

let index = 1;
const initialRows: GridRowsProp = courseScheduleData.map((course: Course) => ({
  id: index++,
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

const createRow = () => {
    const id = ++index;
    return { id, days: '', isNew: true };
};

const termList = courseScheduleData.map((course: Course) => course.Term).filter((value, index, self) => self.indexOf(value) === index);
const professorList = courseScheduleData.map((course: Course) => course.Instructor).filter((value, index, self) => self.indexOf(value) === index);

//TO DO: finish filling this out and maybe figure out if the setDateTime can map back to one of these dropdown items instead of text override
const daysTimeSlots = [
    'MR 08:30 09:50',
    'MR 10:00 11:20',
    'MR 13:00 14:20',
    'TWF 08:30 09:20',
    'TWF 09:30 10:20',
    'TWF 11:30 12:20',
];

function getDaysTime(params: GridValueGetterParams) {
    return `${params.row.days || ''} ${params.row.start || ''} ${params.row.end || ''}`
}
function setDaysTime(params: GridValueSetterParams) {
    const [days, start, end] = params.value!.toString().split(' ');
    return { ...params.row, days, start, end };
}

function parseToCaps(value: any) {
    return String(value).toUpperCase();
}

const ScheduleList = () => {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

    const handleAddRow = () => {
        setRows((prevRows) => [...prevRows, createRow()]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [index]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
        }));
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id: GridRowId) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

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
        {
            field: 'daysTime', headerName: 'Block', width: 100, editable: true,
            type: 'singleSelect',
            valueOptions: daysTimeSlots,
            valueGetter: getDaysTime,
            valueSetter: setDaysTime,
        },
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
        <div style={{ height: '97%', width: '100%', verticalAlign: 'top'}}>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddRow}>
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
        </div>
    )
}

export default ScheduleList