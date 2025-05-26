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
import React, {useContext} from "react";
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
import TestSession from "../components/TestSession.jsx";
import TestsTable from "../pages/student/TestsTable.jsx";
import TeacherDashboard from "../pages/teacher/TeacherDashboard.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import TermsOfService from "../pages/footer/TermsOfService.jsx";
import PrivacyPolicy from "../pages/footer/PrivacyPolicy.jsx";
import Faq from "../pages/footer/Faq.jsx";
import About from "../pages/footer/About.jsx";
import Footer from "../components/Footer.jsx";
export default function AppRoutes() {

    const {user}=useContext(UserContext)


    return (
        <div className="flex flex-col min-h-screen  text-gray-800">


                <SideBar />


            <main className="flex-1 overflow-y-auto px-4 md:px-8 pt-6">
                <Routes>
                    <Route element={<PublicOnlyRoutesLayout />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/two-factor-auth" element={<TwoFactorAuthForm />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                    </Route>

                    {user?.role === 'SYSTEM_ADMIN' && (
                        <>
                            <Route path="/system-admin-dashboard" element={<SystemAdminDashboard />} />
                            <Route path="/school-registration" element={<SchoolRegistration />} />
                            <Route path="/remove-manager-from-school" element={<RemoveSchoolManager />} />
                            <Route path="/send-message" element={<SendMessage />} />
                        </>
                    )}

                    {user?.role === 'SCHOOLMANAGER' && (
                        <>
                            <Route path="/school-mananger-dashboard" element={<SchoolManagerDashboard />} />
                            <Route path="/assign-teacher" element={<AssignTeacher />} />
                            <Route path="/remove-teacher" element={<RemoveTeacherFromSchool />} />
                            <Route path="/add-school-grades" element={<AddSchoolGrades />} />
                            <Route path="/remove-school-grades" element={<RemoveSchoolGrades />} />
                            <Route path="/add-classes-to-grade" element={<AddClassesToGrade />} />
                            <Route path="/add-additional-class-to-grade" element={<AddAdditionalClassToGrade />} />
                            <Route path="/add-teaching-subject-to-teacher" element={<AddTeachingSubjectToTeacher />} />
                            <Route path="/remove-teaching-subject-to-teacher" element={<RemoveTeachingSubjectFromTeacher />} />
                            <Route path="/send-message" element={<SendMessage />} />
                            <Route path="/assign-lesson-to-teacher" element={<CreateLesson />} />
                            <Route path="/assign-teacher-to-class" element={<AsignTeacherToClassRooms />} />
                            <Route path="/assign-student-to-class" element={<AssignStudentToClass />} />
                            <Route path="/classes-weekly-schedule" element={<ClassScheduleViewerForManager />} />
                        </>
                    )}

                    {user?.role === 'TEACHER' && (
                        <>
                            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                            <Route path="/teacher-weekly-schedule" element={<TeacherWeeklySchedule />} />
                            <Route path="/test-configurator" element={<TestConfigurator type="teacher" />} />
                        </>
                    )}

                    {user?.role === 'STUDENT' && (
                        <>
                            <Route path="/student-dashboard" element={<StudentDashboard />} />
                            <Route path="/student-weekly-schedule" element={<StudentWeeklySchedule />} />
                            <Route path="/question-practice-selector" element={<QuestionPracticeSelector />} />
                            <Route path="/test-configurator" element={<TestConfigurator type="student" />} />
                            <Route path="/teacher-tests" element={<TestsTable />} />
                            <Route path="/exercises/:subjectName/:topicName/:exerciseName" element={<QuestionPractice />} />
                            <Route path="/test/:selectedSubject/:selectedTopic/:selectedDifficulty/:selectedQuestionCount/:selectedTimeMinutes" element={<TestSession type="practiceTest" />} />
                            <Route path="/test/:TeacherTestId/:timeLimitMinutes" element={<TestSession type="teacherTest" />} />
                        </>
                    )}

                    <Route path="/about" element={<About />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}
