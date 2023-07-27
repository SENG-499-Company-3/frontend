import { PropsWithChildren, createContext, useState } from "react"
import { ICourse, INewCourse } from "../hooks/api/useCoursesApi"
import useApi from "../hooks/useApi"

const defaultCourses: ICourse[] = [
    {
        courseId: 1,
        courseCode: 'CSC ',
        courseNumber: '111',
        courseName: 'Course name',
    },
    {
        courseId: 2,
        courseCode: 'CSC ',
        courseNumber: '115',
        courseName: 'Course name',
    },
    {
        courseId: 3,
        courseCode: 'CSC ',
        courseNumber: '226',
        courseName: 'Course name',
    },
    {
        courseId: 4,
        courseCode: 'CSC ',
        courseNumber: '225',
        courseName: 'Course name',
    },
    {
        courseId: 5,
        courseCode: 'CSC ',
        courseNumber: '230',
        courseName: 'Course name',
    },
    {
        courseId: 6,
        courseCode: 'CSC ',
        courseNumber: '320',
        courseName: 'Course name',
    },
    {
        courseId: 7,
        courseCode: 'CSC ',
        courseNumber: '370',
        courseName: 'Course name',
    },
    {
        courseId: 8,
        courseCode: 'CSC ',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 9,
        courseCode: 'MATH',
        courseNumber: '101',
        courseName: 'Course name',
    },
    {
        courseId: 10,
        courseCode: 'MATH',
        courseNumber: '110',
        courseName: 'Course name',
    },
    {
        courseId: 11,
        courseCode: 'MATH',
        courseNumber: '122',
        courseName: 'Course name',
    },
    {
        courseId: 12,
        courseCode: 'SENG',
        courseNumber: '265',
        courseName: 'Course name',
    },
    {
        courseId: 13,   
        courseCode: 'SENG',
        courseNumber: '310',
        courseName: 'Course name',
    },
    {
        courseId: 14,
        courseCode: 'SENG',
        courseNumber: '275',
        courseName: 'Course name',
    },
    {
        courseId: 15,
        courseCode: 'SENG',
        courseNumber: '350',
        courseName: 'Course name',
    },
    {
        courseId: 16,
        courseCode: 'SENG',
        courseNumber: '360',
        courseName: 'Course name',
    },
    {
        courseId: 17,   
        courseCode: 'ENGR',
        courseNumber: '110',
        courseName: 'Course name',
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
            return api.courses.deleteCourse(deletedCourse.courseId)
                .then(() => {
                    setCourses(courses.filter((course) => course.courseId !== deletedCourse.courseId))
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
