import { PropsWithChildren, createContext, useState } from 'react'
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
    generateSchedule: () => Promise<void>
}

export const ScheduleContext = createContext<IScheduleContext>({
    currentSchedule: () => null,
    _setCurrentSchedule: () => {},
    generateSchedule: () => Promise.reject()
});

export const ScheduleContextProvider = (props: PropsWithChildren) => {
    const [currentSchedule, setCurrentSchedule] = useState<Schedule>(null);
    const api = useApi();

    const scheduleContext: IScheduleContext = {
        currentSchedule: () => currentSchedule,
        generateSchedule: () => api.schedule.generate()
            .then((schedule: Schedule) => {
                setCurrentSchedule(schedule);
            }),
        _setCurrentSchedule: setCurrentSchedule,
    }

    return (
        <ScheduleContext.Provider value={scheduleContext}>
            {props.children}
        </ScheduleContext.Provider>
    )
}


