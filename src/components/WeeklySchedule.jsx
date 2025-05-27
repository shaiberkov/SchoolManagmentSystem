
import React, { useContext, useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from "../context/UserContext.jsx";
import clsx from "clsx";
function WeeklySchedule({ type, classRoomName, singleDayMode = false }) {
    const [lessonsByDay, setLessonsByDay] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get('token');
    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!user?.userId) return;

            try {
                let url = '';
                if (type === 'teacher') {
                    url = `http://localhost:8080/Learning-App/Teacher/schedule-for-teacher?teacherId=${user.userId}`;
                } else if (type === 'class') {
                    url = `http://localhost:8080/Learning-App/School-Manager/get-schedule-for-classRoom?schoolCode=${user.schoolCode}&classRoomName=${classRoomName}`;
                } else if (type === 'student') {
                    url = `http://localhost:8080/Learning-App/Student/get-student-schedule?schoolCode=${user.schoolCode}&studentId=${user.userId}`;
                }

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.data.success) {
                    setLessonsByDay(response.data.data);
                } else {
                    setLessonsByDay([]);
                    console.warn("בעיה בהבאת נתונים:", response.data);
                }
            } catch (error) {
                console.error("שגיאה בקריאת מערכת השעות:", error);
            }
        };

        fetchSchedule();
    }, [user?.userId, type, classRoomName, token]);

    const daysInHebrew = {
        SUNDAY: 'ראשון',
        MONDAY: 'שני',
        TUESDAY: 'שלישי',
        WEDNESDAY: 'רביעי',
        THURSDAY: 'חמישי',
        FRIDAY: 'שישי',
        SATURDAY: 'שבת'
    };

    const getTodayKey = () => {
        const dayNumber = new Date().getDay();
        const dayMap = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
        return dayMap[dayNumber];
    };

    const displayedDays = useMemo(() => {
        return singleDayMode ? [getTodayKey()] : Object.keys(daysInHebrew);
    }, [singleDayMode]);

    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    const calculateRowSpan = (startTime, endTime) => {
        const toMinutes = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };
        const diff = toMinutes(endTime) - toMinutes(startTime);
        return diff / 30;
    };

    const tableStyle =
        "min-w-[200px] max-w-[800px] w-full border-collapse text-center text-sm sm:text-base";
    const thStyle =
        "border-2 border-gray-300 p-2 sm:p-3 bg-blue-300 font-bold text-gray-800";

    const tdStyle =
        "border-2 border-gray-300 p-2 sm:p-3 bg-white";
    const rowSpanCellStyle =
        "bg-blue-50 font-semibold text-blue-800";
    // const tableStyle = clsx(
    //     "border-collapse text-center text-sm sm:text-base w-full",
    //     singleDayMode ? "min-w-[300px] max-w-[500px]" : "min-w-[600px] max-w-[800px]"
    // );
    //
    // const thStyle = clsx(
    //     "border-2 border-gray-300 font-bold text-gray-800",
    //     singleDayMode ? "p-2 text-xs sm:text-sm" : "p-2 sm:p-3 bg-blue-300"
    // );
    //
    // const tdStyle = clsx(
    //     "border-2 border-gray-300 bg-white",
    //     singleDayMode ? "p-1 sm:p-2 text-sm" : "p-2 sm:p-3"
    // );
    //
    // const rowSpanCellStyle = "bg-blue-50 font-semibold text-blue-800";
    const scheduleTable = useMemo(() => {
        const coveredSlots = {};

        return (
            <div
                className="relative overflow-x-auto rounded-xl shadow-lg border border-gray-300 mx-2 max-w-3xl ">

                <div className=" h-full w-12 pointer-events-none bg-gradient-to-l "></div>
                <table className={tableStyle} dir="rtl">
                    <thead>
                    <tr>
                        <th
                            className={`${thStyle} sticky right-0 z-30 bg-yellow-300 text-gray-900`}
                        >
                            שעה
                        </th>
                        {displayedDays.map((dayKey) => (
                            <th key={dayKey} className={thStyle}>
                                {daysInHebrew[dayKey]}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {timeSlots.map((slot) => (
                        <tr
                            key={slot}
                            className="hover:bg-blue-50 hover:shadow-sm transition-all duration-300 rounded-md"
                        >
                            <td
                                className=" border-2 border-gray-300 p-2 sm:p-3 bg-yellow-100 font-semibold text-gray-800 sticky right-0 z-20 shadow-md"
                            >
                                {slot}
                            </td>
                            {displayedDays.map((dayKey) => {
                                if (coveredSlots[`${dayKey}_${slot}`]) return null;

                                const lesson = lessonsByDay[dayKey]?.find(
                                    (l) => l.startTime === slot
                                );

                                if (lesson) {
                                    const rowSpan = calculateRowSpan(
                                        lesson.startTime,
                                        lesson.endTime
                                    );
                                    const startIdx = timeSlots.indexOf(slot);

                                    for (let i = 1; i < rowSpan; i++) {
                                        coveredSlots[`${dayKey}_${timeSlots[startIdx + i]}`] = true;
                                    }

                                    return (
                                        <td
                                            key={dayKey + slot}
                                            rowSpan={rowSpan}
                                            className={`${tdStyle} ${rowSpanCellStyle} align-middle`}
                                        >
                                            <div className="text-base font-bold">
                                                {lesson.subject}
                                            </div>
                                            {type === "teacher" && (
                                                <div className="text-sm text-gray-600">
                                                    כיתה {lesson.classRoomName}
                                                </div>
                                            )}
                                            {type === "class" && (
                                                <div className="text-sm text-gray-600">
                                                    מורה {lesson.teacherName}
                                                </div>
                                            )}
                                            {type === "student" && (
                                                <div className="text-sm text-gray-600">
                                                    {lesson.teacherName}
                                                </div>
                                            )}
                                        </td>
                                    );
                                } else {
                                    return (
                                        <td key={dayKey + slot} className={tdStyle}></td>
                                    );
                                }
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }, [lessonsByDay, displayedDays, classRoomName, type]);

    return (

        <div className="px-3 py-4 sm:p-4 md:p-6">
            {singleDayMode && (
                <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-800 flex items-center justify-center gap-2 flex-wrap text-balance">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 transition-transform duration-300 hover:scale-110 hover:rotate-[35deg]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10m-12 4h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <span className="whitespace-nowrap">
        מערכת השעות ליום {daysInHebrew[displayedDays[0]]}
      </span>
                </h2>
            )}

            <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto overflow-x-auto">
                <div className="w-full table-fixed">{scheduleTable}</div>
            </div>
        </div>

    );

}

export default WeeklySchedule;
