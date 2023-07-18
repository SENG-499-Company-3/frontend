import { AxiosInstance, AxiosResponse } from 'axios'

export interface IClassroom {
    _id: string;
    buildingName: string;
    roomNumber: number;
    capacity: number;
}

const useClassroomApi = (axios: AxiosInstance) => {


    const getClassroomById = async (id: string): Promise<IClassroom> => {
        const { data } = await axios.get(`/classroom/${id}`);

        return data;
    }

    const listClassrooms = async (): Promise<IClassroom[]> => {
        const { data } = await axios.get('/classroom/list');

        return data;
    }

    return {
        listClassrooms,
        getClassroomById
    }
}

export default useClassroomApi;
