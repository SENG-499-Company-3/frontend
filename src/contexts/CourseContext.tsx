import { PropsWithChildren, createContext, useState } from "react"
import { ICourse, INewCourse } from "../hooks/api/useCoursesApi"
import { useApi } from "./ApiContext"

const defaultCourses: ICourse[] = [
    {
        _id: 1,
        Subj: 'CSC ',
        Num: '111',
        Title: 'Course name',
    },
    {
        _id: 2,
        Subj: 'CSC ',
        Num: '115',
        Title: 'Course name',
    },
    {
        _id: 3,
        Subj: 'CSC ',
        Num: '226',
        Title: 'Course name',
    },
    {
        _id: 4,
        Subj: 'CSC ',
        Num: '225',
        Title: 'Course name',
    },
    {
        _id: 5,
        Subj: 'CSC ',
        Num: '230',
        Title: 'Course name',
    },
    {
        _id: 6,
        Subj: 'CSC ',
        Num: '320',
        Title: 'Course name',
    },
    {
        _id: 7,
        Subj: 'CSC ',
        Num: '370',
        Title: 'Course name',
    },
    {
        _id: 8,
        Subj: 'CSC ',
        Num: '360',
        Title: 'Course name',
    },
    {
        _id: 9,
        Subj: 'MATH',
        Num: '101',
        Title: 'Course name',
    },
    {
        _id: 10,
        Subj: 'MATH',
        Num: '110',
        Title: 'Course name',
    },
    {
        _id: 11,
        Subj: 'MATH',
        Num: '122',
        Title: 'Course name',
    },
    {
        _id: 12,
        Subj: 'SENG',
        Num: '265',
        Title: 'Course name',
    },
    {
        _id: 13,   
        Subj: 'SENG',
        Num: '310',
        Title: 'Course name',
    },
    {
        _id: 14,
        Subj: 'SENG',
        Num: '275',
        Title: 'Course name',
    },
    {
        _id: 15,
        Subj: 'SENG',
        Num: '350',
        Title: 'Course name',
    },
    {
        _id: 16,
        Subj: 'SENG',
        Num: '360',
        Title: 'Course name',
    },
    {
        _id: 17,   
        Subj: 'ENGR',
        Num: '110',
        Title: 'Course name',
    }
]

interface ICourseContext {
    courses: () => ICourse[]
    addCourse: (newCourse: INewCourse) => Promise<void>
    deleteCourse: (course: ICourse) => Promise<void>
    fetchCourses: () => Promise<void>
}

export const CourseContext = createContext<ICourseContext>({
    courses: () => null,
    addCourse: () => Promise.reject(),
    deleteCourse: () => Promise.reject(),
    fetchCourses: () => Promise.reject()
});

export const CourseContextProvider = (props: PropsWithChildren) => {
    const [courses, setCourses] = useState<ICourse[]>([]);
    const api = useApi();

    const courseContext: ICourseContext = {
        courses: () => courses,
        addCourse: (newCourse: INewCourse) => {
            return api.courses.createCourse(newCourse)
                .then((course: ICourse) => {
                    setCourses([...courses, course])
                });
        },
        deleteCourse: (deletedCourse: ICourse) => {
            return api.courses.deleteCourse(deletedCourse._id)
                .then(() => {
                    setCourses(courses.filter((course) => course._id !== deletedCourse._id))
                })
        },
        fetchCourses: () => {
            return api.courses.listCourses()
                .then((courses) => {
                    setCourses(courses)
                })
                .catch(() => {
                    console.error("Failed to fetch courses.")
                    setCourses(defaultCourses)
                })
                .finally(() => {
                    //
                })
        }   
    }

    return (
        <CourseContext.Provider value={courseContext}>
            {props.children}
        </CourseContext.Provider>
    )
}
