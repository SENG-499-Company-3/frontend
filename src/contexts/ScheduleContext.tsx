import { PropsWithChildren, createContext, useState, useEffect } from 'react';
import { Course } from '../types/course';
import useApi from '../hooks/useApi'

export type ScheduleStatus =
    | 'UNDEFINED'
    | 'PENDING'
    | 'VALID_UNPUBLISHED'
    | 'VALID_PUBLISHED'
    | 'INVALID'

export type Schedule = null | (Record<string, any> & {
    status: ScheduleStatus
})

interface IScheduleContext {
    currentSchedule: () => Schedule
    _setCurrentSchedule: (schedule: Schedule) => void
    workingSchedule: () => Schedule
    _setWorkingSchedule: (schedule: Schedule) => void
    displaySchedule: () => Course[]
    _setDisplaySchedule: (schedule: Schedule) => void
    generateSchedule: () => Promise<void>
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
        currentSchedule: () => currentSchedule,
        workingSchedule: () => workingSchedule,
        displaySchedule: () => displaySchedule,

        generateSchedule: () => api.schedule.generate()
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            }),
        _setCurrentSchedule: setCurrentSchedule,
        _setWorkingSchedule: setWorkingSchedule,
        _setDisplaySchedule: setDisplaySchedule
    }


    useEffect(() => {
        if (localStorage.getItem(USER_TOKEN)) {
            setUserToken(localStorage.getItem(USER_TOKEN))
        }
    }, []);




    return (
        <ScheduleContext.Provider value={scheduleContext}>
            {props.children}
        </ScheduleContext.Provider>
    )
}


