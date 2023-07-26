// @TODO

import { ICourse } from "../hooks/api/useCoursesApi"

interface ICourseContext {
    courses: () => ICourse[]
    addCourse: (newCourse: ICourse) => void
    deleteCourse: (course: ICourse) => void
    fetchCourses: () => Promise<void>
}

const [courses, setCourses] = useState<ICourse[]>([]);

const deleteCourse = (deletedCourse: ICourse) => {
    setCourses(courses.filter((course) => course.courseId !== deletedCourse.courseId))
}
