import { AxiosInstance, AxiosResponse } from 'axios'
import { Schedule } from '../../contexts/ScheduleContext';
import { ICourse } from './useCoursesApi';
import { ITerm } from './useTermsApi';

export const WORKING_SCHEDULE =  '';


const useScheduleApi = (axios: AxiosInstance) => {
    const getSchedule = async (): Promise<Schedule> => {
        const { data } = await axios.get(`/schedule/list`);

        return data;
    }

    const generateSchedule = async (selectedCourses: ICourse[], term: ITerm): Promise<any> => {
        console.log('selectedCourses', selectedCourses);
        const { data } = await axios.post(`/schedule/generate_trigger`, { selectedCourses, term });
        console.log('data', data);

        return data.rawAssignments;
    }

    const validateSchedule = async (request: any): Promise<void> => {
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
