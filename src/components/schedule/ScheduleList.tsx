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

/* Map incoming schedule's terms and professors into array for dropdowns. CONFIRM this functions with incoming data */
const termList = courseScheduleData.map((course: Course) => course.Term).filter((value, index, self) => self.indexOf(value) === index);
const professorList = courseScheduleData.map((course: Course) => course.Instructor).filter((value, index, self) => self.indexOf(value) === index);

const daysTimeSlots = [
    'MR 08:30 09:50', //A
    'MR 10:00 11:20', //B
    'MR 11:30 12:50', //C
    'MR 13:00 14:20', //D
    'MWR 14:30 15:20', //E
    'MWR 15:30 16:20', //F
    'MW 16:30 17:50', //G
    'TWF 08:30 09:20', //H
    'TWF 09:30 10:20', //I
    'TWF 10:30 11:20', //J
    'TWF 11:30 12:20', //K
    'TWF 12:30 13:20', //L
    'TWF 13:30 14:20', //M
    'TF 14:30 16:30', //N
    'TR 16:30 17:50', //O
];

/* Getter and Setter for column Block, to use the singular column to update the days, start, and end
   Note that days/times currently cannot be manually entered. This could be updated by adding blocks VWXYZ (MTWRF) and enable edit on start/end
   Column block can be overwritten by string */
function getDaysTime(params: GridValueGetterParams) {
    const inString = `${params.row.days || ''} ${params.row.start || ''} ${params.row.end || ''}`;
    for (let i = 0; i < 15; i++) {
        if (inString === daysTimeSlots[i]) {
            return daysTimeSlots[i];
        }
    }
    return inString;
}
function setDaysTime(params: GridValueSetterParams) {
    const [days, start, end] = params.value!.toString().split(' ');
    return { ...params.row, days, start, end };
}

/* Parser for course, section, and location to force caps entry */
function parseToCaps(value: any) {
    return String(value).toUpperCase();
}

const ScheduleList = () => {
    const [rows, setRows] = useState(initialRows);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const numRows = rows.length;

    /* Add rows function for use with the added button */
    const handleAddRow = (newIndex: number) => {
        setRows((prevRows) => [...prevRows, createRow(newIndex)]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [newIndex]: { mode: GridRowModes.Edit, fieldToFocus: 'term' },
        }));
    };

    /* Functions from the CRUD table in the documentation */
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
            <Button size="small" startIcon={<AddIcon />} onClick={() => handleAddRow(numRows)}>
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