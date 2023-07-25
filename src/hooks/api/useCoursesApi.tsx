import { AxiosInstance, AxiosResponse } from 'axios'

export interface ICourse {
    courseId: number
    courseCode: string;
    courseNumber: string;
    courseName: string;
}

const useCoursesApi = (axios: AxiosInstance) => {
    const listCourses = async (): Promise<ICourse[]> => {
        const { data } = await axios.get('/courses/list');

        return data;
    }

    const createCourse = async (course: Exclude<ICourse, 'courseId'>): Promise<ICourse> => {
        const { data } = await axios.post('/courses', course);

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
