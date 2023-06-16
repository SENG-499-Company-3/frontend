import React from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { courseScheduleData } from '../common/sampleData/courseSchedule'
import WeekdayTable  from './WeekdayTable'
import { Course } from '../common/types'
import { format, parse } from 'date-fns'

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
        <div style={{ height: '100%', width: '100%' }}>
            <DataGrid 
              rows={rows} 
              columns={columns}
              initialState={{
                sorting: {
                  sortModel: [{ field: 'course', sort: 'asc' }],
                },
              }}
              slots={{ toolbar: GridToolbar }}
            />
        </div>
    )
}

export default ScheduleList


// convert time from hhmm to hh:mm
function convertToTime(time: number): string {
  var timeString = time.toString();

  const formatString = timeString.length === 3 ? 'Hmm' : 'HHmm';

  const parsedTime = parse(timeString, formatString, new Date());
  const formattedTime = format(parsedTime, 'HH:mm');

  return formattedTime;
}