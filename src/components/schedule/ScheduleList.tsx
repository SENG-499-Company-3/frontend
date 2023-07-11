import React from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { courseScheduleData } from '../common/sampleData/courseSchedule'
import WeekdayTable  from './WeekdayTable'
import { Course } from '../../types/course'
import { convertToTime } from '../../utils/helper';
import { Paper } from '@mui/material';

const rows: GridRowsProp = courseScheduleData.map((course: Course, index: number) => ({
  id: index + 1,
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

const columns: GridColDef[] = [
  { field: 'term', headerName: 'Term', width: 100 },
  { field: 'course', headerName: 'Course', width: 150 },
  { field: 'section', headerName: 'Section', width: 100 },
  { field: 'instructor', headerName: 'Instructor', width: 150 },
  { field: 'capacity', headerName: 'Capacity', type: 'number', width: 100 },
  { field: 'location', headerName: 'Location', width: 150 },
  {
    field: 'days',
    headerName: 'Days',
    width: 200,
    renderCell: (params) => <WeekdayTable days = {params.value.split('')} />,
  },
  { field: 'start', headerName: 'Start', width: 100 },
  { field: 'end', headerName: 'End', width: 100 }
];

const ScheduleList = () => {
    return (
        <Paper sx={{ p: 2 }}>
            <DataGrid
              sx={{ border: 0 }}
              rows={rows} 
              columns={columns}
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
        </Paper>
    )
}

export default ScheduleList