import React from 'react'
import { courseScheduleData } from '../components/common/sampleData/courseSchedule'
import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import("../components/schedule/CourseCalendar"), {
      ssr: false,
    });

const CalendarPage = () => {
    return (
        <Calendar view="week" courses={courseScheduleData} /> // TODO: replace mock data
    )
}

export default CalendarPage
