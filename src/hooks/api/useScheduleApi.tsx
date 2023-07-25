import { AxiosInstance, AxiosResponse } from 'axios'
import { Schedule } from '../../contexts/ScheduleContext';

export const WORKING_SCHEDULE =  [], { 'UNDEFINED'};

interface IGenerateScheduleRequest {
    scheduledCourseIds: number[];
    termId: number;
}

const useScheduleApi = (axios: AxiosInstance) => {
    const generateSchedule = async (request: IGenerateScheduleRequest): Promise<void> => {
        const { data } = await axios.post(`/schedule/create`, request);

        return data;
    }

    const getSchedule = async (): Promise<Schedule> => {
        const { data } = await axios.get(`/schedule`);

        return data;
    }

    return {
        getSchedule,
        generateSchedule
    }
}

export default useScheduleApi;
