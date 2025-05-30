//
//
// import { useContext, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
// import Cookies from "universal-cookie";
//
// function SideBar() {
//     const { user, setUser } = useContext(UserContext);
//     const [open, setOpen] = useState(false);
//     const [openSubmenus, setOpenSubmenus] = useState({});
//
//     const navigate = useNavigate();
//     const cookies = new Cookies();
//     const toggleSubmenu = (label) => {
//         setOpenSubmenus((prev) => ({
//             ...prev,
//             [label]: !prev[label],
//         }));
//     };
//
//     const handleLogout = () => {
//         cookies.remove("token");
//         setUser(null);
//         navigate("/login");
//     };
//
//     useEffect(() => {
//         const sidebar = document.getElementById("sidebar");
//         const navbar = document.getElementById("navbar");
//         if (sidebar && navbar) {
//             sidebar.style.top = `${navbar.clientHeight - 1}px`;
//         }
//     }, []);
//
//     const getLinks = () => {
//         if (!user) return [];
//         if (user.role === "SCHOOLMANAGER") {
//             return [
//                 { to: "school-mananger-dashboard", label: "מסך בית" },
//
//
//                 {
//                     label: "מורים",
//                     children: [
//                         { to: "assign-teacher", label: "הוספת מורה" },
//                         { to: "remove-teacher", label: "הסרת מורה" },
//                         { to: "add-teaching-subject-to-teacher", label: "הוספת מקצוע למורה" },
//                         { to: "remove-teaching-subject-to-teacher", label: "הסרת מקצוע ממורה" },
//                         { to: "assign-teacher-to-class", label: "שיבוץ מורה לכיתות" },
//                         { to: "assign-lesson-to-teacher", label: "שיבוץ מורה לשיעור" },
//                     ],
//                 },
//
//
//                 {
//                     label: "תלמידים",
//                     children: [
//                         { to: "assign-student-to-class", label: "שיבוץ תלמיד לכיתה" },
//
//                     ],
//                 },
//
//                 {
//                     label: "שכבות",
//                     children: [
//                         { to: "add-school-grades", label: "הוספת שכבות לבית ספר" },
//                         { to: "remove-school-grades", label: "הסרת שכבות לבית ספר" },
//                         { to: "add-classes-to-grade", label: "הוספת כיתות לשכבה" },
//                         { to: "add-additional-class-to-grade", label: "הוספת כיתה נוספת לשכבה" },
//
//
//                     ],
//                 },
//
//
//                 {
//                     label: "כיתות",
//                     children: [
//                         { to: "classes-weekly-schedule", label: "מערכת שעות לפי כיתה" },
//
//                     ],
//                 },
//
//                 {
//                     label: "הודעות",
//                     children: [
//                         { to: "send-message", label: "שליחת הודעה" },
//                     ],
//                 },
//             ];
//         }
//
//
//         return {
//             SYSTEM_ADMIN: [
//                 { to: "system-admin-dashboard", label: "דף בית" },
//                 { to: "school-registration", label: "רישום בית ספר" },
//                 { to: "remove-manager-from-school", label: "הסרת מנהל בית ספר" },
//                 { to: "send-message", label: "שליחת הודעה" },
//             ],
//             TEACHER: [
//                 { to: "teacher-dashboard", label: "מסך בית" },
//                 { to: "teacher-weekly-schedule", label: "מערכת שעות" },
//                 { to: "test-configurator", label: "יצירת מבחן לתלמידים" },
//             ],
//             STUDENT: [
//                 { to: "student-dashboard", label: "מסך בית" },
//                 { to: "student-weekly-schedule", label: "מערכת שעות" },
//                 { to: "question-practice-selector", label: "תרגול שאלות" },
//                 { to: "test-configurator", label: "תרגול מבחנים" },
//                 { to: "teacher-tests", label: "מבחנים" },
//             ],
//         }[user.role] || [];
//     };
//
//     return (
//         <>
//             <nav
//                 id="navbar"
//                 className="fixed top-0 left-0 z-50 w-full flex flex-row justify-end bg-teal-600 px-4 sm:justify-between shadow-md bg-opacity-100"
//             >
//                 <ul className="breadcrumb flex-row items-center py-4 text-lg text-white sm:flex">
//                     <li className="inline">
//                         <a href="#"></a>
//                     </li>
//                     <li className="inline">
//                         <span></span>
//                     </li>
//                 </ul>
//
//                 <button
//                     type="button"
//                     onClick={() => setOpen(!open)}
//                     className="py-4 text-2xl text-white hover:text-gray-200"
//                 >
//                     {open ? (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                     ) : (
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//                         </svg>
//                     )}
//                 </button>
//             </nav>
//
//             {user && (
//                 <nav
//                     id="sidebar"
//                     className={`fixed top-0 right-0 z-60 flex h-screen w-3/4 transform flex-col overflow-y-auto bg-teal-700
//  pt-6 pb-8 transition-transform duration-300 sm:max-w-xs lg:w-80 ${
//                         open ? "translate-x-0" : "translate-x-full rtl:translate-x-full"
//                     }`}
//                 >
//                     <div className="flex justify-end px-4">
//                         <button
//                             type="button"
//                             onClick={() => setOpen(false)}
//                             className="text-white hover:text-gray-300"
//                             aria-label="סגור סיידבר"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
//                                  stroke="currentColor" strokeWidth="1.5">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
//                             </svg>
//                         </button>
//                     </div>
//
//                     <ul className="mb-8 text-sm font-medium text-white" dir="rtl">
//                         {getLinks().map((item) => {
//                             if (item.children) {
//                                 return (
//                                     <li key={item.label}>
//                                         <button
//                                             onClick={() => toggleSubmenu(item.label)}
//                                             className="flex w-full items-center justify-between rounded py-3 pl-3 pr-4 hover:bg-gray-600"
//                                         >
//                                             {item.label}
//                                             <span>{openSubmenus[item.label] ? "▲" : "▼"}</span>
//                                         </button>
//                                         {openSubmenus[item.label] && (
//                                             <ul className="mr-4 mt-1 space-y-1 border-r border-gray-500 pr-2 text-sm">
//                                                 {item.children.map((child) => (
//                                                     <li key={child.to}>
//                                                         <Link
//                                                             to={child.to}
//                                                             className="block rounded py-2 pr-4 hover:bg-gray-600"
//                                                             onClick={() => setOpen(false)}
//                                                         >
//                                                             {child.label}
//                                                         </Link>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </li>
//                                 );
//                             } else {
//                                 return (
//                                     <li key={item.to}>
//                                         <Link
//                                             to={item.to}
//                                             className="flex items-center rounded py-3 pl-3 pr-4 hover:bg-gray-600"
//                                             onClick={() => setOpen(false)}
//                                         >
//                                             {item.label}
//                                         </Link>
//                                     </li>
//                                 );
//                             }
//                         })}
//
//                         <li>
//                             <button
//                                 onClick={handleLogout}
//                                 className="w-full text-left py-3 pl-3 pr-4 text-red-300 hover:bg-gray-600"
//                             >
//                                 התנתק
//                             </button>
//                         </li>
//                     </ul>
//
//                 </nav>
//             )}
//         </>
//     );
// }
//
// export default SideBar;
//
//
//
//





import React, { useContext, useEffect, useState } from "react";
import {Link, Route, useNavigate} from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Cookies from "universal-cookie";
import Login from "../features/auth/Login.jsx";
import Register from "../features/auth/Register.jsx";

function SideBar() {
    const { user, setUser } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState({});

    const navigate = useNavigate();
    const cookies = new Cookies();
    const token = cookies.get('token');

    const toggleSubmenu = (label) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const handleLogout = () => {
        cookies.remove("token");
        setUser(null);
        navigate("/login");
    };

    useEffect(() => {
        const sidebar = document.getElementById("sidebar");
        const navbar = document.getElementById("navbar");
        if (sidebar && navbar) {
            sidebar.style.top = `${navbar.clientHeight - 1}px`;
        }
    }, []);

    const getLinks = () => {
        if (!user) return [];
        if (user.role === "SCHOOLMANAGER") {
            return [
                { to: "school-mananger-dashboard", label: "מסך בית" },


                {
                    label: "מורים",
                    children: [
                        { to: "assign-teacher", label: "הוספת מורה" },
                        { to: "remove-teacher", label: "הסרת מורה" },
                        { to: "add-teaching-subject-to-teacher", label: "הוספת מקצוע למורה" },
                        { to: "remove-teaching-subject-to-teacher", label: "הסרת מקצוע ממורה" },
                        { to: "assign-teacher-to-class", label: "שיבוץ מורה לכיתות" },
                        { to: "assign-lesson-to-teacher", label: "שיבוץ מורה לשיעור" },
                    ],
                },


                {
                    label: "תלמידים",
                    children: [
                        { to: "assign-student-to-class", label: "שיבוץ תלמיד לכיתה" },

                    ],
                },

                {
                    label: "שכבות",
                    children: [
                        { to: "add-school-grades", label: "הוספת שכבות לבית ספר" },
                        { to: "remove-school-grades", label: "הסרת שכבות לבית ספר" },
                        { to: "add-classes-to-grade", label: "הוספת כיתות לשכבה" },
                        { to: "add-additional-class-to-grade", label: "הוספת כיתה נוספת לשכבה" },


                    ],
                },

                {
                    label: "כיתות",
                    children: [
                        { to: "classes-weekly-schedule", label: "מערכת שעות לפי כיתה" },

                    ],
                },

                {
                    label: "הודעות",
                    children: [
                        { to: "send-message", label: "שליחת הודעה" },
                    ],
                },
            ];
        }


        return {
            SYSTEM_ADMIN: [
                { to: "system-admin-dashboard", label: "דף בית" },
                { to: "school-registration", label: "רישום בית ספר" },
                { to: "remove-manager-from-school", label: "הסרת מנהל בית ספר" },
                { to: "send-message", label: "שליחת הודעה" },
            ],
            TEACHER: [
                { to: "teacher-dashboard", label: "מסך בית" },
                { to: "teacher-weekly-schedule", label: "מערכת שעות" },
                { to: "test-configurator", label: "יצירת מבחן לתלמידים" },
            ],
            STUDENT: [
                { to: "student-dashboard", label: "מסך בית" },
                { to: "student-weekly-schedule", label: "מערכת שעות" },
                { to: "question-practice-selector", label: "תרגול שאלות" },
                { to: "test-configurator", label: "תרגול מבחנים" },
                { to: "teacher-tests", label: "מבחנים" },
            ],
        }[user.role] || [];
    };

    return (
        <>

            <nav
                id="navbar"
                className="fixed top-0 left-0 z-50 w-full flex flex-row justify-end bg-teal-600 px-4 sm:justify-between shadow-md bg-opacity-100"
            >
                <ul className="breadcrumb flex-row items-center py-4 text-lg text-white sm:flex">
                    <li className="inline">
                        <a href="#"></a>
                    </li>
                    <li className="inline">
                        <span></span>
                    </li>
                </ul>

                {!token && (
                    <div className="flex justify-center py-2 gap-4 ">
                        <button className="px-6 py-2 bg-blue-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-blue-700 transition duration-300"
                                onClick={ ()=>navigate("/register" )}
                        >
                            הרשמה
                        </button>
                        <button className="px-6 py-2 bg-green-600 text-white text-lg font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition duration-300"
                                onClick={()=>navigate("/login")}
                        >
                            התחברות
                        </button>
                    </div>
                )}


                {user&& (
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="py-4 text-2xl text-white hover:text-gray-200"
                    >
                        {open ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                            </svg>
                        )}
                    </button>
                )}

            </nav>

            {user && (
                <nav
                    id="sidebar"
                    className={`fixed top-0 right-0 z-60 flex h-screen w-3/4 transform flex-col overflow-y-auto bg-teal-700
                                    pt-6 pb-8 transition-transform duration-300 sm:max-w-xs lg:w-80 ${
                        open ? "translate-x-0" : "translate-x-full rtl:translate-x-full"
                    }`}
                >
                    <div className="flex justify-end px-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-300"
                            aria-label="סגור סיידבר"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <ul className="mb-8 text-sm font-medium text-white" dir="rtl">
                        {getLinks().map((item) => {
                            if (item.children) {
                                return (
                                    <li key={item.label}>
                                        <button
                                            onClick={() => toggleSubmenu(item.label)}
                                            className="flex w-full items-center justify-between rounded py-3 pl-3 pr-4 hover:bg-gray-600"
                                        >
                                            {item.label}
                                            <span>{openSubmenus[item.label] ? "▲" : "▼"}</span>
                                        </button>
                                        {openSubmenus[item.label] && (
                                            <ul className="mr-4 mt-1 space-y-1 border-r border-gray-500 pr-2 text-sm">
                                                {item.children.map((child) => (
                                                    <li key={child.to}>
                                                        <Link
                                                            to={child.to}
                                                            className="block rounded py-2 pr-4 hover:bg-gray-600"
                                                            onClick={() => setOpen(false)}
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={item.to}>
                                        <Link
                                            to={item.to}
                                            className="flex items-center rounded py-3 pl-3 pr-4 hover:bg-gray-600"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            }
                        })}

                        <li>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left py-3 pl-3 pr-4 text-red-300 hover:bg-gray-600"
                            >
                                התנתק
                            </button>
                        </li>
                    </ul>

                </nav>
            )}
        </>
    );
}

export default SideBar;




