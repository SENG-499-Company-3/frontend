import { AxiosInstance, AxiosResponse } from 'axios'

export interface ICourse {
    _id?: number
    Subj: string;
    Num: string;
    Title: string;
    CourseYear?: number,
    Cap?: number,
    Enrolled?: number
}

export type INewCourse = Omit<ICourse, '_id'>

const useCoursesApi = (axios: AxiosInstance) => {
    const listCourses = async (): Promise<ICourse[]> => {
        const { data } = await axios.get('/courses/list');

        return data;
    }

    const createCourse = async (course: INewCourse): Promise<void> => {
        console.log('course', course);
        const { data } = await axios.post('/courses/create', course);
        console.log('data', data);

        return data;
    }

    const deleteCourse = async (courseId: number): Promise<void> => {
        const { data } = await axios.delete(`/courses/${courseId}`);

        return data;
    }

    return {
        listCourses,
        createCourse,
        deleteCourse
    }
}

export default useCoursesApi;
