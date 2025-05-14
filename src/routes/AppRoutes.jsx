import {BrowserRouter, Routes, Route, useLocation, Link} from 'react-router-dom';
import Register from "../features/auth/Register.jsx";
import Login from "../features/auth/Login.jsx";
import TwoFactorAuthForm from "../features/auth/TwoFactorAuthForm.jsx";
import {UserContext, UserProvider} from "../context/UserContext.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import SideBar from "../components/SideBar.jsx";
import PublicOnlyRoutesLayout from "../components/PublicOnlyRoutesLayout.jsx";
import ResetPassword from "../features/auth/ResetPassword.jsx";
import SchoolRegistration from "../pages/admin/SchoolRegistration.jsx";
import RemoveSchoolManager from "../pages/admin/RemoveSchoolManager.jsx";
import {useContext} from "react";
import SystemAdminDashboard from "../pages/admin/SystemAdminDashboard.jsx";
import AssignTeacher from "../pages/manager/AssignTeacher.jsx";
import SchoolManagerDashboard from "../pages/manager/SchoolManagerDashboard.jsx";
import AddSchoolGrades from "../pages/manager/AddSchoolGrades.jsx";
import RemoveSchoolGrades from "../pages/manager/RemoveSchoolGrades.jsx";
import RemoveTeacherFromSchool from "../pages/manager/RemoveTeacherFromSchool.jsx";
import AddClassesToGrade from "../pages/manager/AddClassesToGrade.jsx";
import AddAdditionalClassToGrade from "../pages/manager/AddAdditionalClassToGrade.jsx";
import AddTeachingSubjectToTeacher from "../pages/manager/AddTeachingSubjectToTeacher.jsx";
import RemoveTeachingSubjectFromTeacher from "../pages/manager/RemoveTeachingSubjectFromTeacher.jsx";
import SendMessage from "../components/messages/SendMessage.jsx";
import CreateLesson from "../pages/manager/CreateLesson.jsx";
import AsignTeacherToClassRoom from "../pages/manager/AsignTeacherToClassRooms.jsx";
import AsignTeacherToClassRooms from "../pages/manager/AsignTeacherToClassRooms.jsx";
import TeacherWeeklySchedule from "../pages/teacher/TeacherWeeklySchedule.jsx";
import AssignStudentToClass from "../pages/manager/AssignStudentToClass.jsx";
import StudentWeeklySchedule from "../pages/student/StudentWeeklySchedule.jsx";
import ClassScheduleViewerForManager from "../pages/manager/ClassScheduleViewerForManager.jsx";
import QuestionPracticeSelector from "../components/QuestionPracticeSelector.jsx";
import QuestionPractice from "../pages/student/QuestionPractice.jsx";
import TestConfigurator from "../components/TestConfigurator.jsx";
import TestPractice from "../pages/student/TestPractice.jsx";
import TestsTable from "../pages/student/TestsTable.jsx";
export default function AppRoutes() {
    // const cookies = new Cookies();
    // const token = cookies.get('token');
    const {user}=useContext(UserContext)
    return (

        <>
                     <SideBar/>
                      <Routes>
                     <Route element={<PublicOnlyRoutesLayout/>}>
                         <Route path="/login" element={<Login/>} />
                         <Route path="/register" element={<Register/>} />
                         <Route path="/two-factor-auth" element={<TwoFactorAuthForm/>} />
                         <Route path="/reset-password" element={<ResetPassword/>}/>
                     </Route>

                     {user?.role==='SYSTEM_ADMIN' &&(
                         <>
                             <Route path="/system-admin-dashboard" element={<SystemAdminDashboard/>} />
                             <Route path="/school-registration" element={<SchoolRegistration/>} />
                             <Route path="/remove-manager-from-school" element={<RemoveSchoolManager/>} />
                             <Route path="/send-message" element={<SendMessage/>} />
                         </>
                     )}
                     {user?.role==='SCHOOLMANAGER' &&(
                         <>
                             <Route path="/school-mananger-dashboard" element={<SchoolManagerDashboard/>} />
                             <Route path="/assign-teacher" element={<AssignTeacher/>} />
                             <Route path="/remove-teacher" element={<RemoveTeacherFromSchool/>} />
                             <Route path="/add-school-grades" element={<AddSchoolGrades/>} />
                             <Route path="/remove-school-grades" element={<RemoveSchoolGrades/>} />
                             <Route path="/add-classes-to-grade" element={<AddClassesToGrade/>} />
                             <Route path="/add-additional-class-to-grade" element={<AddAdditionalClassToGrade/>} />
                             <Route path="/add-teaching-subject-to-teacher" element={<AddTeachingSubjectToTeacher/>} />
                             <Route path="/remove-teaching-subject-to-teacher" element={<RemoveTeachingSubjectFromTeacher/>} />
                             <Route path="/send-message" element={<SendMessage/>} />
                             <Route path="/assign-lesson-to-teacher" element={<CreateLesson/>} />
                             <Route path="/assign-teacher-to-class" element={<AsignTeacherToClassRooms/>} />
                             <Route path="/assign-student-to-class" element={<AssignStudentToClass/>} />
                             <Route path="/classes-weekly-schedule" element={<ClassScheduleViewerForManager/>} />


                         </>
                     )}
                     {user?.role==='TEACHER' &&(
                         <>
                             <Route path="/teacher-weekly-schedule" element={<TeacherWeeklySchedule/>} />
                             <Route path="/test-configurator" element={<TestConfigurator type="teacher"/>}/>


                         </>
                     )}
                     {user?.role==='STUDENT' &&(
                         <>
                             <Route path="/student-weekly-schedule" element={<StudentWeeklySchedule/>}/>
                             <Route path="/question-practice-selector" element={<QuestionPracticeSelector/>}/>
                             <Route path="/test-configurator" element={<TestConfigurator type="student"/>}/>
                             <Route path="/teacher-tests" element={<TestsTable/>}/>


                             <Route path="/exercises/:subjectName/:topicName/:exerciseName" element={<QuestionPractice/>}/>
                             <Route path="/test/:selectedSubject/:selectedTopic/:selectedDifficulty/:selectedQuestionCount/:selectedTimeMinutes" element={<TestPractice type="practiceTest" />} />
                             <Route path="/test/:TeacherTestId/:timeLimitMinutes" element={<TestPractice type="teacherTest" />} />

                         </>
                     )}


                          {/*<Route path="/unauthorized" element={<UnauthorizedPage />} />*/}
                 </Routes>
        </>

    );
    }