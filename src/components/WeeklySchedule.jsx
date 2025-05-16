import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {UserContext} from "../context/UserContext.jsx";

function WeeklySchedule({ type, classRoomName }) {
    const [lessonsByDay, setLessonsByDay] = useState([]);
    const cookies = new Cookies();
    const token=cookies.get('token')
    const {user}=useContext(UserContext)

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
    };

    const timeSlots = [
        "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
    ];

    function calculateRowSpan(startTime, endTime) {
        const toMinutes = (t) => {
            const [h, m] = t.split(":").map(Number);
            return h * 60 + m;
        };
        const diff = toMinutes(endTime) - toMinutes(startTime);
        return diff / 30;
    }

    const coveredSlots = {};
    const tableStyle = { width: "100%", borderCollapse: "collapse", textAlign: "center", direction: "rtl" };
    const thStyle = { border: "2px solid #ccc", padding: "8px", backgroundColor: "#f4f4f4" };
    const tdStyle = { border: "2px solid #ccc", padding: "8px" };
    const rowSpanCellStyle = { backgroundColor: "#e0f7fa", fontWeight: "bold" };
        //todo אם מערכת שעות ריקה אז להציג מערכת שעות ריקה
    return (
        <div>
            <table style={tableStyle}>
                <thead>
                <tr>
                    <th style={thStyle}>שעה</th>
                    {Object.keys(daysInHebrew).map((dayKey) => (
                        <th key={dayKey} style={thStyle}>{daysInHebrew[dayKey]}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {timeSlots.map((slot) => (
                    <tr key={slot}>
                        <td style={tdStyle}>{slot}</td>
                        {Object.keys(daysInHebrew).map((dayKey) => {
                            if (coveredSlots[`${dayKey}_${slot}`]) return null;

                            const lesson = lessonsByDay[dayKey]?.find(
                                (l) => l.startTime === slot
                            );

                            if (lesson) {
                                const rowSpan = calculateRowSpan(lesson.startTime, lesson.endTime);
                                const startIdx = timeSlots.indexOf(slot);

                                for (let i = 1; i < rowSpan; i++) {
                                    coveredSlots[`${dayKey}_${timeSlots[startIdx + i]}`] = true;
                                }

                                return (
                                    <td
                                        key={dayKey + slot}
                                        rowSpan={rowSpan}
                                        style={{ ...tdStyle, ...rowSpanCellStyle }}
                                    >
                                        <div>{lesson.subject}</div>
                                        {type === 'teacher' &&
                                            <div>כיתה {lesson.classRoomName}</div>

                                        }
                                        {type === 'class' &&
                                            <div>
                                                <div>מורה {lesson.teacherName}</div>
                                                {/*<div>כיתה {lesson.classRoomName}</div>*/}
                                            </div>

                                        }
                                        {type === 'student' &&
                                            <div>{lesson.teacherName}</div>
                                        }
                                    </td>
                                );
                            } else {
                                return <td key={dayKey + slot} style={tdStyle}></td>;
                            }
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default WeeklySchedule;
