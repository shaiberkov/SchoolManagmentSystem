
import { API_BASE_URL, BASE_API } from "./base.constants.js";

export const PagesConstants = {
    ActiveUser: {
        CONNECTED_USERS_BASE_PATH: `${API_BASE_URL}${BASE_API}/Active-User`,
        CONNECT_USER: '/connect-user',
        DISCONNECT_USER: '/disconnect-user',
    },

    ChatGpt: {
        CHAT_BASE_PATH: `${API_BASE_URL}${BASE_API}/Chat`,
        WITH_MEMORY: '/get-response-from-chatGpt-with-memory',
        SINGLE_RESPONSE: '/get-single-response-from-chatGpt',
        CLEAR_CONVERSATION: '/clear-conversation',
    },

    Lesson: {
        LESSON_BASE_PATH: `${API_BASE_URL}${BASE_API}/lesson`,
        TEACHER_LESSONS: '/teacher/lessons',
    },

    Message: {
        MESSAGE_BASE_PATH: `${API_BASE_URL}${BASE_API}/message`,
        RECIPIENT_TYPES: '/recipient-types',
        SEND_MESSAGE: '/send-message',
        GET_ALL_RECEIVED_MESSAGES: '/get-all-recived-messages',
    },

    Notification: {
        NOTIFICATION_BASE_PATH: `${API_BASE_URL}${BASE_API}/notifications`,
        CONNECT: '/connect',
    },

    Question: {
        QUESTION_BASE_PATH: `${API_BASE_URL}${BASE_API}/question`,
        GENERATE_QUESTION: '/generate-question',
        SUBMIT_ANSWER: '/submit-answer',
    },

    Schedule: {
        SCHEDULE_BASE_PATH: `${API_BASE_URL}${BASE_API}/schedule`,
    },

    SchoolManager: {
        SCHOOL_MANAGER_BASE_PATH: `${API_BASE_URL}${BASE_API}/school-manager`,
        GET_TEACHER_DTO: '/get-teacher-dto',
        GET_ALL_CLASSES_BY_SCHOOL_CODE: '/get-all-classes-name-by-school-code',
        GET_SCHOOL_CODE: '/get-school-code',
        GET_SCHEDULE_FOR_CLASSROOM: '/get-schedule-for-classroom',
        ASSIGN_USER_AS_SCHOOL_TEACHER: '/assign-user-as-school-teacher',
        REMOVE_TEACHER_FROM_SCHOOL: '/remove-teacher-from-school',
        ADD_SCHOOL_GRADES: '/add-school-grades',
        REMOVE_SCHOOL_GRADES: '/remove-school-grades',
        ADD_CLASSES_TO_GRADE: '/add-classes-to-grade',
        ADD_ADDITIONAL_CLASS_TO_GRADE: '/add-additional-class-to-grade',
        ASSIGN_TEACHER_TO_CLASSES: '/assign-teacher-to-classes',
        REMOVE_TEACHER_FROM_CLASS: '/remove-teacher-from-class',
        GET_CLASS_NAMES_BY_SCHOOL_AND_GRADE: '/get-class-names-by-school-and-grade',
        GET_GRADES: '/grades',
        ADD_LESSON_TO_TEACHER: '/add-lesson-to-teacher',
        ADD_TEACHING_SUBJECT_TO_TEACHER: '/add-teaching-subject-to-teacher',
        REMOVE_TEACHING_SUBJECT_FROM_TEACHER: '/remove-teaching-subject-from-teacher',
        ASSIGN_STUDENT_TO_CLASS: '/assign-student-to-class',
        CHANGE_STUDENT_CLASS: '/change-student-class',
        GET_ALL_TEACHERS: '/get-all-teachers',
        GET_ALL_STUDENTS: '/get-all-students',
        GET_TEACHER_TEACHING_SUBJECTS: '/get-teacher-teaching-subjects',
        GET_SCHOOL: '/get-school',
    },

    Session: {
        SESSION_BASE_PATH: `${API_BASE_URL}${BASE_API}/validate-token`,
        VALIDATE_TOKEN: '/validate-token',
        AUTH_HEADER: 'Authorization',
    },

    UserStatistic: {
        USER_STATISTIC_BASE_PATH: `${API_BASE_URL}${BASE_API}/User-Statistic`,
        GET_USER_STATISTIC: '/get-user-statistic',
    },

    Student: {
        STUDENT_BASE_PATH: `${API_BASE_URL}${BASE_API}/student`,
        GET_STUDENT_SCHEDULE: '/get-student-schedule',
        GENERATE_QUESTION: '/generate-question',
        SUBMIT_ANSWER: '/submit-answer',
        GENERATE_PRACTICE_TEST: '/generate-practice-test',
        CHECK_PRACTICE_TEST: '/check-practice-test',
        START_TEST: '/start-test',
        GET_STUDENT_TESTS_STATUS: '/get-student-tests-status',
    },

    SystemAdmin: {
        SYSTEM_ADMIN_BASE_PATH: `${API_BASE_URL}${BASE_API}/system-admin`,
        ASSIGN_SCHOOL_MANAGER: '/assign-school-manager',
        ADD_NEW_SCHOOL_TO_SYSTEM: '/add-new-school-to-system',
        ASSIGN_SCHOOL_MANAGER_TO_SCHOOL: '/assign-school-manager-to-school',
        REMOVE_SCHOOL_MANAGER_FROM_SCHOOL: '/remove-school-manager-from-school',
        GET_ALL_SCHOOLS: '/get-all-schools',
    },


    Teacher: {
        TEACHER_BASE_PATH: `${API_BASE_URL}${BASE_API}/teacher`,
        SCHEDULE_FOR_TEACHER: '/schedule-for-teacher',
        GENERATE_TEST_FOR_STUDENTS: '/generate-test-for-students',
        CHECK_TEACHER_TEST: '/check-teacher-test',
    },

    Test: {
        TEST_BASE_PATH: `${API_BASE_URL}${BASE_API}/test`,
        GET_TEST: '/get-test',
    },

    UpcomingEvents: {
        UPCOMING_EVENTS_BASE_PATH: `${API_BASE_URL}${BASE_API}/upcoming-events`,
        GET_UPCOMING_EVENTS: '/get-upcoming-events',
    },

    User: {
        USER_BASE_PATH: `${API_BASE_URL}${BASE_API}/user`,
        ADD_USER: '/add-user',
        LOGIN: '/login',
        SEND_OTP: '/send-otp',
        VERIFY_OTP: '/verify-otp',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        GET_USER_PHONE: '/user/phone',
    },
};

/* ActiveUser */
export const {
    CONNECTED_USERS_BASE_PATH,
    CONNECT_USER,
    DISCONNECT_USER,
} = PagesConstants.ActiveUser;

/* ChatGpt */
export const {
    CHAT_BASE_PATH,
    WITH_MEMORY,
    SINGLE_RESPONSE,
    CLEAR_CONVERSATION,
} = PagesConstants.ChatGpt;


/* Lesson */
export const {
    LESSON_BASE_PATH,
    TEACHER_LESSONS,
} = PagesConstants.Lesson;

/* Message */
export const {
    MESSAGE_BASE_PATH,
    RECIPIENT_TYPES,
    SEND_MESSAGE,
    GET_ALL_RECEIVED_MESSAGES,
} = PagesConstants.Message;

/* Notification */
export const {
    NOTIFICATION_BASE_PATH,
    CONNECT,
} = PagesConstants.Notification;

/* Question */
export const {
    QUESTION_BASE_PATH,
    GENERATE_QUESTION,
    SUBMIT_ANSWER,
} = PagesConstants.Question;

/* Schedule */
export const { SCHEDULE_BASE_PATH } = PagesConstants.Schedule;

/* SchoolManager */
export const {
    SCHOOL_MANAGER_BASE_PATH,
    GET_TEACHER_DTO,
    GET_ALL_CLASSES_BY_SCHOOL_CODE,
    GET_SCHOOL_CODE,
    GET_SCHEDULE_FOR_CLASSROOM,
    ASSIGN_USER_AS_SCHOOL_TEACHER,
    REMOVE_TEACHER_FROM_SCHOOL,
    ADD_SCHOOL_GRADES,
    REMOVE_SCHOOL_GRADES,
    ADD_CLASSES_TO_GRADE,
    ADD_ADDITIONAL_CLASS_TO_GRADE,
    ASSIGN_TEACHER_TO_CLASSES,
    REMOVE_TEACHER_FROM_CLASS,
    GET_CLASS_NAMES_BY_SCHOOL_AND_GRADE,
    GET_GRADES,
    ADD_LESSON_TO_TEACHER,
    ADD_TEACHING_SUBJECT_TO_TEACHER,
    REMOVE_TEACHING_SUBJECT_FROM_TEACHER,
    ASSIGN_STUDENT_TO_CLASS,
    CHANGE_STUDENT_CLASS,
    GET_ALL_TEACHERS,
    GET_ALL_STUDENTS,
    GET_TEACHER_TEACHING_SUBJECTS,
    GET_SCHOOL,
} = PagesConstants.SchoolManager;

/* Session */
export const {
    SESSION_BASE_PATH,
    VALIDATE_TOKEN,
    AUTH_HEADER,
} = PagesConstants.Session;

/* UserStatistic */
export const {
    USER_STATISTIC_BASE_PATH,
    GET_USER_STATISTIC,
} = PagesConstants.UserStatistic;

/* Student */
export const {
    STUDENT_BASE_PATH,
    GET_STUDENT_SCHEDULE,

    GENERATE_PRACTICE_TEST,
    CHECK_PRACTICE_TEST,
    START_TEST,
    GET_STUDENT_TESTS_STATUS,
} = PagesConstants.Student;

/* SystemAdmin */
export const {
    SYSTEM_ADMIN_BASE_PATH,
    ASSIGN_SCHOOL_MANAGER,
    ADD_NEW_SCHOOL_TO_SYSTEM,
    ASSIGN_SCHOOL_MANAGER_TO_SCHOOL,
    REMOVE_SCHOOL_MANAGER_FROM_SCHOOL,
    GET_ALL_SCHOOLS,
} = PagesConstants.SystemAdmin;

/* Teacher */
export const {
    TEACHER_BASE_PATH,
    SCHEDULE_FOR_TEACHER,
    GENERATE_TEST_FOR_STUDENTS,
    CHECK_TEACHER_TEST,
} = PagesConstants.Teacher;

/* Test */
export const {
    TEST_BASE_PATH,
    GET_TEST,
} = PagesConstants.Test;

/* UpcomingEvents */
export const {
    UPCOMING_EVENTS_BASE_PATH,
    GET_UPCOMING_EVENTS,
} = PagesConstants.UpcomingEvents;

export const {
    USER_BASE_PATH,
    ADD_USER,
    LOGIN,
    SEND_OTP,
    VERIFY_OTP,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
    GET_USER_PHONE
} = PagesConstants.User;


const QueryParams = {
    USER_ID: 'userId=',
    SCHOOL_CODE: 'schoolCode=',
     GRADE_NAME: 'gradeName=',
    CLASS_NAME:  'className=',
    OTP: 'otp=',
    NEW_PASSWORD: 'newPassword=',
    ROLE: 'role=',
    SENDER_ID: 'senderId=',
    RECIPIENT_TYPE: 'recipientType=',
    RECIPIENT_VALUE: 'recipientValue=',
    TITLE: 'title=',
    CONTENT: 'content=',
    CLASSES_COUNT:'classesCount=',
    TEACHER_ID: 'teacherId=',
    STUDENT_ID: 'studentId=',
    SUBJECT_TO_REMOVE: 'subjectToRemove=',
    SCHOOL_MANAGER_ID: 'schoolManagerId=',
    SUBJECT: 'subject=',
    TOPIC: 'topic=',
    SUB_TOPIC: 'subTopic=',
    MESSAGE: 'message=',
    TEST_ID: 'testId=',
    TEST_START_TIME: 'testStartTime=',
    DIFFICULTY: 'difficulty=',
    QUESTION_COUNT: 'questionCount=',
    TIME_LIMIT_MINUTES: 'timeLimitMinutes=',
    CLASS_ROOM_NAME: 'classRoomName=',


};

export const {
    USER_ID,
    SCHOOL_CODE,
    GRADE_NAME,
    CLASS_NAME,
    OTP,
    NEW_PASSWORD,
    ROLE,
    SENDER_ID,
    RECIPIENT_TYPE,
    RECIPIENT_VALUE,
    TITLE,
    CONTENT,
    CLASSES_COUNT,
    TEACHER_ID,
    STUDENT_ID,
    SUBJECT_TO_REMOVE,
    SCHOOL_MANAGER_ID,
    SUBJECT,
    TOPIC,
    SUB_TOPIC,
    MESSAGE,
    TEST_ID,
    TEST_START_TIME,
    DIFFICULTY,
    QUESTION_COUNT,
    TIME_LIMIT_MINUTES,
    CLASS_ROOM_NAME


}=QueryParams;


const QueryDelimiters = {
    QUESTION: '?',
    AND: '&',

};
export const {
    QUESTION,
    AND,
}=QueryDelimiters;

