type DayOfWeek = 
    | 'M'
    | 'T'
    | 'W'
    | 'R'
    | 'F'

/**
 * Encodes a time of day, .e.g. "00:00:00", "09:50:00", "14:00:00"
 */
type Time = string

/**
 * The role belonging to a particular user
 */
type RoleType =
    | 'ADMIN'
    | 'TEACHER'
    | 'RESEARCHER'

/**
 * A user belonging to the system
 */
interface User {
    displayName: string
    emailAddress: string
    accountType: RoleType    
}

/**
 * A discrete subject code that may belong to a course
 */
type SubjectCode = 
    | 'CSC'
    | 'SENG'
    | 'ECE'
    | 'ELEC'
    | 'ENGR'
    | 'MATH'
    | 'CHEM'
    | 'PHYS'
    | 'ECON'

/**
 * A course offered by the university.
 */
interface Course {
    /**
     * The subject code for the course, e.g. "SENG"
     */
    subjectCode: SubjectCode

    /**
     * The number belonging to the course, e.g. 101, 410, 499, 320
     */
    courseNumber: number

    /**
     * The name of the course, e.g. "Data Structures to Algorithms II"
     */
    courseName: string
}

/**
 * A term wherein courses are offered.
 */
interface Term {
    startsOn: Date
    endsOn: Date
    year: number
    season: {
        name: string // e.g. Fall
        month: string // e.g. '09
    }
}

/**
 * A discrete time slot wherein a course may be scheduled.
 */
interface TimeSlot {
    startsAt: Time
    endsAt: Time
    dayOfWeek: DayOfWeek
}

/**
 * Assigns a term, course, discrete timeslot, and location
 */
interface CourseSchedule {
    /**
     * The term that the course schedule belongs to
     */
    term: Term;

    /**
     * The particualr course that the schedule belongs to
     */
    course: Course

    /**
     * The discrete timeslot for this course schedule
     */
    timeSlot: TimeSlot

    /**
     * The location the course is being instructed in
     */
    location: Classroom

    /**
     * The first day for this class
     */
    beginsOn: Date
    
    /**
     * The last day for this class
     */
    endsOn: Date

    /**
     * The predicted enrollment numbers for this course offering
     */
    predictedEnrollment: PredictedEnrollment
}

/**
 * Encodes forecasted enrollment statistics.
 */
interface PredictedEnrollment {
    minStudents: number
    maxStudents: number
}

/**
 * A location wherein courses are instructed.
 */
interface Classroom {
    /**
     * The building the classroom is located in
     */
    building: Building

    /**
     * The room number the classroom exists in, e.g. "A123"
     */
    roomNumber: string

    /**
     * The technologies available in this classroom
     */
    technologies: Technology[]
}

/**
 * A building wherein classrooms are located
 */
interface Building {
    /**
     * The code for the building, e.g. "DTB"
     */
    buildingCode: string

    /**
     * The full name of the building, e.g. "David Turpin Building"
     */
    buildingName: string
}

/**
 * Assigns a professors particular preferences to a term
 */
interface InstructorPreference {
    /**
     * The term that this preference pertains to
     */
    term: Term;

    /**
     * The instructor that the preference belongs to
     */
    instructor: User

    /**
     * Free text describing additional details pertaining to term preferences
     */
    note: string | null;

    /**
     * The course-specific preferences pertaining to this professor's term
     */
    courses: {
        course: Course,

        /**
         * Indicates teacher's ability to teach the given course
         */
        canTeach: 'WITH EFFORT' | 'ABLE' | null;

        /**
         * Indicates teacher's aptitude to teach the given course
         */
        willingToTeach: 'WILLING' |'UNWILLING' | 'VERY WILLING' | null;

        /**
         * Indicates all of the technology the professor needs to teach the course
         */
        requiredTechnologies: Technology[]
    }
}

/**
 * Assigns min and max loads to an instructor and a particular teaching term
 */
interface InstructorLoad {
    instructor: User,
    term: Term,
    minLoad: number // Min number of courses they could teach
    maxLoad: number // Max number of courses they could teach
}

/**
 * Technology that a classroom may offer.
 */
interface Technology {
    /**
     * The name of the technology, e.g. "Chalkboard", "HDMI", "Document camera"
     */
    name: string;

    /**
     * A detailed description of the given technology
     */
    description: string;
}


const endpoints = [
    // Auth
    'POST /login', // Log into the application
    'POST /logout', // Sign out of the application
    'GET /self', // Get the user's information from the token sent with the request


    // Scheduling
    'GET /classrooms', // List all classrooms on campus
    'GET /classrooms/:classroomId/technology', // List all technologies for a given classroom
    'GET /technologies', // List all technologies possible for a classroom
    'GET /users', // List all users
    'GET /instructors', // List all instructors
    'GET /terms', // List all terms
    'GET /terms/:termId/courses', // List all courses with their schedules
    'GET /terms/:termId/courses/:courseId/schedule', // List the schedule for a particular course
    'GET /terms/:termId/classrooms', // List all classrooms for a particular term
    'GET /terms/:termId/classrooms/:classroomId/schedule', // List the schedule for a particular classroom for the given term
    'GET /terms/:termId/instructors', // List all instrucotrs for a patricular term
    'GET /terms/:termId/instructors/:insturctorId/schedule', // List the schedule for a particular instructor for the given term

    // Schedule generation
    'POST /terms/schedule', // Submit a proposed schedule
    'POST /terms/validate', // Validate a proposed schedule

    // Instructor preferences
    'GET /terms/:termId/instructors/:insturctorId/preferences', // Get teacher's prerences
    'PUT /terms/:termId/instructors/:insturctorId/preferences', // Save teacher's preferences
]
