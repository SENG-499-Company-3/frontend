import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { WORKING_SCHEDULE } from '../hooks/api/useScheduleApi';
import useApi from '../hooks/useApi';

export type ScheduleStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'VALID_UNPUBLISHED'
    | 'VALID_PUBLISHED'
    | 'INVALID';

export type Schedule = null | {
    scheduledCourses: Course[],
    status: ScheduleStatus
};

interface IScheduleContext {
    //The latest validated and saved schedule
    currentSchedule: () => Schedule
    _setCurrentSchedule: (schedule: Schedule) => void

    //The schedule with any changes made by the logged in user
    workingSchedule: () => Schedule
    _setWorkingSchedule: (schedule: Schedule) => void

    //The currently visible schedule - ie, the filtered schedule WITH any edits
    displaySchedule: () => Course[]
    _setDisplaySchedule: (currentAssignment: Course[]) => void

    //Schedule functions
    fetchSchedule: () => Promise<void>
    generateSchedule: () => Promise<void>
    validateSchedule: () => Promise<void>
    //TBD
    //saveSchedule: () => Promise<void>
    //publishSchedule: () => Promise<void> 
}

export const ScheduleContext = createContext<IScheduleContext>({
    currentSchedule: () => null,
    _setCurrentSchedule: () => { },
    workingSchedule: () => null,
    _setWorkingSchedule: () => { },
    displaySchedule: () => null,
    _setDisplaySchedule: () => { },

    fetchSchedule: () => Promise.reject(),
    generateSchedule: () => Promise.reject(),
    validateSchedule: () => Promise.reject(),
    //saveSchedule: () => Promise.reject(),
    //publishSchedule: () => Promise.reject()
});

export const ScheduleContextProvider = (props: PropsWithChildren) => {
    const [currentSchedule, setCurrentSchedule] = useState<Schedule>(null);
    const [workingSchedule, setWorkingSchedule] = useState(currentSchedule);
    const [displaySchedule, setDisplaySchedule] = useState(workingSchedule.scheduledCourses);
    const api = useApi();

    const scheduleContext: IScheduleContext = {
        currentSchedule: () => currentSchedule,
        workingSchedule: () => workingSchedule,
        displaySchedule: () => displaySchedule,

        _setCurrentSchedule: setCurrentSchedule,
        _setWorkingSchedule: setWorkingSchedule,
        _setDisplaySchedule: setDisplaySchedule,

        fetchSchedule: () => api.schedule.getSchedule()
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            })
            .catch(() => {
                console.error("Failed to fetch schedule.");
                setCurrentSchedule(null);
            })
            .finally(() => {
                //
            }),

        generateSchedule: () => api.schedule.generateSchedule(null)
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            })
            .catch(() => {
                console.error("Failed to generate schedule.");
            })
            .finally(() => {
                //
            }),

        validateSchedule: () => api.schedule.validateSchedule(workingSchedule)
            .then(() => {
                //
            }),
    }


    useEffect(() => {
        if (localStorage.getItem(WORKING_SCHEDULE)) {
            setWorkingSchedule(localStorage.getItem(WORKING_SCHEDULE))
        }
    }, []);

    useEffect(() => {
        if (workingSchedule) {
            localStorage.setItem(WORKING_SCHEDULE, workingSchedule)
        }
    }, [workingSchedule]);


    return (
        <ScheduleContext.Provider value={scheduleContext}>
            {props.children}
        </ScheduleContext.Provider>
    )
}


