import { AxiosInstance, AxiosResponse } from 'axios'
import { Schedule } from '../../contexts/ScheduleContext';

const useScheduleApi = (axios: AxiosInstance) => {
    const generate = async (): Promise<void> => {
        const { data } = await axios.get(`/schedule/create`);

        return data;
    }

    const listSchedules = async (): Promise<Schedule> => {
        const { data } = await axios.get(`/schedule/list`);

        return data;
    }

    return {
        generate
    }
}

export default useScheduleApi;
