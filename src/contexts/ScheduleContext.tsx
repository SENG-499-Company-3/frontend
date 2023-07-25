import React, { PropsWithChildren, createContext, useEffect, useState } from 'react';
import { WORKING_SCHEDULE } from '../hooks/api/useScheduleApi';
import useApi from '../hooks/useApi'

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
    _setDisplaySchedule: (schedule: Schedule) => void

    //Schedule functions
    generateSchedule: () => Promise<void>
    /* TBD if these are necessary here
    validateSchedule: () => Promise<void>
    saveSchedule: () => Promise<void>
    publishSchedule: () => Promise<void> */
}

export const ScheduleContext = createContext<IScheduleContext>({
    currentSchedule: () => null,
    _setCurrentSchedule: () => { },
    workingSchedule: () => null,
    _setWorkingSchedule: () => { },
    displaySchedule: () => null,
    _setDisplaySchedule: () => { },
    generateSchedule: () => Promise.reject()
});

export const ScheduleContextProvider = (props: PropsWithChildren) => {
    const [currentSchedule, setCurrentSchedule] = useState<Schedule>(null);
    const [workingSchedule, setWorkingSchedule] = useState(currentSchedule);
    const [displaySchedule, setDisplaySchedule] = useState<Exclude<Schedule,'status'>>(workingSchedule);
    const api = useApi();

    const scheduleContext: IScheduleContext = {
        currentSchedule: () => api.schedule.getSchedule()
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            }),
        workingSchedule: () => workingSchedule,
        displaySchedule: () => displaySchedule,

        generateSchedule: () => api.schedule.generateSchedule(null)
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            }),
        /*generateSchedule: () => api.schedule.generateSchedule(null)
            .then(() => {
                //
            }),*/
        _setCurrentSchedule: setCurrentSchedule,
        _setWorkingSchedule: setWorkingSchedule,
        _setDisplaySchedule: setDisplaySchedule
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


