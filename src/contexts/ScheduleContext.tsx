import { useApi } from './ApiContext'
import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { WORKING_SCHEDULE } from '../hooks/api/useScheduleApi';
import { Course } from '../types/course';

import { courseScheduleData } from '../components/common/sampleData/courseSchedule'
import { ICourse } from '../hooks/api/useCoursesApi';
import { ITerm } from '../hooks/api/useTermsApi';

export type ScheduleStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'VALID_UNPUBLISHED'
    | 'VALID_PUBLISHED'
    | 'INVALID';

export type Schedule = null | {
    data: {
        course: {coursename: string, courseYear: number, courseNumber: number, capacity: number, index: number},
        prof: {name: string, load: number, index: number, coursePreference: any},
        room: {location: string, capacity: number},
        timeslot: {day: string[], length: number, startTime: number, index: number},   
    }[] 
    status: ScheduleStatus,
};

interface IScheduleContext {
    //The latest validated and saved schedule
    currentSchedule: () => Schedule[]
    _setCurrentSchedule: (schedule: Schedule[]) => void
    
    //Schedule functions
    fetchSchedule: () => Promise<void>
    generateSchedule: (selectedCourses: ICourse[], term: ITerm) => Promise<void>
    validateSchedule: () => Promise<void>
    displaySchedule: () =>  Course[] 
}

export const ScheduleContext = createContext<IScheduleContext>({
    currentSchedule: () => null,
    _setCurrentSchedule: () => {},

    fetchSchedule: () => Promise.reject(),
    generateSchedule: (selectedCourses: ICourse[], term: ITerm) => Promise.reject(),
    validateSchedule: () => Promise.reject(),
    displaySchedule: () => [],
});

export const ScheduleContextProvider = (props: PropsWithChildren) => {
    const [currentSchedule, setCurrentSchedule] = useState<Schedule[]>(null);
    
    const api = useApi();
    
    const scheduleContext: IScheduleContext = {
        currentSchedule: () => currentSchedule,
        _setCurrentSchedule: setCurrentSchedule,
     

        fetchSchedule: () => api.schedule.getSchedule()
            .then(async (schedule: any) => {
                await setCurrentSchedule(schedule);
            })
            .catch(() => {
                console.error("Failed to fetch schedule.");
            })
            .finally(() => {
                //
            }),

        generateSchedule: (selectedCourses: ICourse[], term: ITerm) => api.schedule.generateSchedule(selectedCourses, term)
            .then((schedule: Schedule[]) => {
                console.log('schedule', schedule);
                setCurrentSchedule({
                    data: schedule,
                    status: "VALID_UNPUBLISHED"
                });
                console.log('currentSchedule', currentSchedule);
            })
            .catch(() => {
                console.error("Failed to generate schedule.");
            })
            .finally(() => {
                //
            }),

        validateSchedule: () => api.schedule.validateSchedule(currentSchedule)
            .then(() => {
                //
            }),

        displaySchedule: () => {

            const courses: Course[] = [];

            if(!currentSchedule || !currentSchedule.length) return courses;

            for (const cur of currentSchedule) {
                for (const data of cur.data) {
                    const courseObject: Course = {
                        Term: 1,
                        Subj: data.course.coursename.split(' ')[0],
                        Num: Number(data.course.coursename.split(' ')[1]),
                        Section: String(data.course.index),
                        Title: data.course.coursename,
                        Instructor: data.prof.name,
                        ProfessorID: String(data.prof.index),
                        Bldg: data.room.location,
                        Room: data.room.location,
                        Begin: data.timeslot.startTime,
                        End: data.timeslot.startTime + data.timeslot.length,
                        Days: String(data.timeslot.day),
                        StartDate: String(data.timeslot),
                        EndDate: String(data.timeslot),
                        Cap: data.course.capacity,
                    }
                    courses.push(courseObject);
                }

            }
            return courses;
        }
    }


    return (
        <ScheduleContext.Provider value={scheduleContext}>
            {props.children}
        </ScheduleContext.Provider>
    )
}


