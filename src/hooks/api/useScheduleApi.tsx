import { AxiosInstance, AxiosResponse } from 'axios'
import { Schedule } from '../../contexts/ScheduleContext';

export const WORKING_SCHEDULE =  '';

interface IGenerateScheduleRequest {
    scheduledCourseIds: number[];
    termId: number;
}

const useScheduleApi = (axios: AxiosInstance) => {
    const getSchedule = async (): Promise<Schedule> => {
        const { data } = await axios.get(`/schedule/list`);

        return data;
    }

    const generateSchedule = async (request: IGenerateScheduleRequest): Promise<Schedule> => {
        const { data } = await axios.post(`/schedule/create`, request);

        return data;
    }

    const validateSchedule = async (request: Schedule): Promise<void> => {
        const { data } = await axios.post(`/schedule/validate`, request);

        return data;
    }

    return {
        getSchedule,
        generateSchedule,
        validateSchedule
    }
}

export default useScheduleApi;
