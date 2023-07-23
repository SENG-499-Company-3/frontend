import { AxiosInstance, AxiosResponse } from 'axios'
import { Schedule } from '../../contexts/ScheduleContext';

const useScheduleApi = (axios: AxiosInstance) => {
    const generate = async (): Promise<Schedule> => {
        const { data } = await axios.get(`/schedule/generate`);

        return data;
    }

    return {
        generate
    }
}

export default useScheduleApi;
