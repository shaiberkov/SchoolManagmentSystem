import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DateTime from 'react-datetime';
import dayjs from 'dayjs';
import axios from "axios";
import {UserContext} from "../context/UserContext.jsx";
import Cookies from "universal-cookie";
import {
    FaBook,
    FaClipboardList,
    FaLayerGroup,
    FaSortAmountDown,
    FaClock,
    FaCalendarAlt,
    FaUserGraduate,
    FaPlay
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { he } from "date-fns/locale";
import "../Styles/datePicker.css";


const TestConfigurator = ({type}) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const subjects = ['מתמטיקה'];
    const topics = {
        'מתמטיקה': ['מספרים שלמים'],
    };
    const difficulties = ['קל', 'בינוני', 'קשה'];
    const questionCounts = Array.from({ length: 100 }, (_, i) => i + 1);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedQuestionCount, setSelectedQuestionCount] = useState('');
    const [selectedTimeMinutes, setSelectedTimeMinutes] = useState(30);
    const [startTime, setStartTime] = useState('');
    const [studentsIdsInput, setStudentsIdsInput] = useState('');
    const [message, setMessage] = useState('');


    const navigateToTest = () => {
        navigate(`/test/${selectedSubject}/${selectedTopic}/${selectedDifficulty}/${selectedQuestionCount}/${selectedTimeMinutes}`);
    };


    const handleSubmit = async () => {
        const formattedStartTime = dayjs(startTime).format('DD/MM/YYYY HH:mm');

        const usersIds = studentsIdsInput
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);


        const url = `http://localhost:8080/Learning-App/Teacher/generate-test-for-students?teacherId=${user.userId}&testStartTime=${formattedStartTime}&subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}&questionCount=${selectedQuestionCount}&timeLimitMinutes=${selectedTimeMinutes}`;

        try {
            const response = await axios.post(url, usersIds, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.data.success){
                setMessage(response.data.errorCode)
            }else {
                setMessage(response.data.errorCode)
            }

        } catch (error) {
            console.error('שגיאה ביצירת מבחן:', error);
        }
    };


    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded-3xl shadow-md space-y-6 mb-8" dir="rtl">
            <h2 className="text-2xl font-bold text-center text-green-700 flex items-center justify-center gap-2">
        <span className="group">
            <FaClipboardList
                className="text-green-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-green-700"/>
        </span>
                יצירת מבחן
            </h2>

            {/* בחירת מקצוע */}
            <div className="space-y-1">
                <label className="font-semibold flex items-center gap-2 text-gray-700">
            <span className="group">
                <FaBook
                    className="text-blue-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-blue-700"/>
            </span>
                    בחר מקצוע:
                </label>
                <select className="w-full p-2 rounded-xl border" value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">-- בחר --</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {/* נושא */}
            {selectedSubject && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaLayerGroup
                        className="text-purple-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-purple-700"/>
                </span>
                        בחר נושא:
                    </label>
                    <select className="w-full p-2 rounded-xl border" value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {topics[selectedSubject].map((topic) => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* רמת קושי */}
            {selectedTopic && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaSortAmountDown
                        className="text-yellow-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-yellow-700"/>
                </span>
                        בחר רמת קושי:
                    </label>
                    <select className="w-full p-2 rounded-xl border" value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {difficulties.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* מספר שאלות */}
            {selectedDifficulty && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaClipboardList
                        className="text-orange-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-orange-700"/>
                </span>
                        בחר מספר שאלות:
                    </label>
                    <select className="w-full p-2 rounded-xl border" value={selectedQuestionCount}
                            onChange={(e) => setSelectedQuestionCount(parseInt(e.target.value))}>
                        {questionCounts.map((count) => (
                            <option key={count} value={count}>{count}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* זמן למבחן */}
            {selectedQuestionCount && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaClock
                        className="text-indigo-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-indigo-700"/>
                </span>
                        זמן בדקות:
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="w-full p-2 rounded-xl border"
                        value={selectedTimeMinutes || ""}
                        onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = value ? parseInt(value, 10) : "";
                            setSelectedTimeMinutes(parsedValue);
                        }}
                    />
                </div>
            )}

            {/* תאריך ושעה - רק מורה */}
            {type === "teacher" && selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaCalendarAlt
                        className="text-teal-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-teal-700"/>
                </span>
                        בחר תאריך ושעה למבחן:
                    </label>
                    <DatePicker
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="Pp"
                        locale={he}
                        placeholderText="בחר תאריך ושעה"
                        className="w-full p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"

                    />
                </div>
            )}

            {/* ת"ז תלמידים */}
            {selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && startTime && type === "teacher" && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                <span className="group">
                    <FaUserGraduate
                        className="text-pink-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-[35deg] group-hover:text-pink-700"/>
                </span>
                        הכנס ת"ז של תלמידים (מופרדים בפסיקים):
                    </label>
                    <textarea
                        rows={4}
                        className="w-full p-2 rounded-xl border resize-none"
                        value={studentsIdsInput}
                        onChange={(e) => setStudentsIdsInput(e.target.value)}
                        placeholder="123456789,987654321,..."

                    />
                </div>
            )}

            {/* כפתור שליחה */}
            {(type === "teacher" && selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && startTime) ||
            (type === "student" && selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0) ? (
                <div className=" mt-4 flex justify-center">
                    <button
                        onClick={type === "teacher" ? handleSubmit : navigateToTest}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 flex items-center gap-2"

                    >
                        <FaPlay
                            className="transition-transform transition-colors duration-300 hover:scale-110 hover:rotate-[25deg]"
                        />
                        צור מבחן
                    </button>
                </div>
            ) : null}


            {message && (
                <div className="text-center text-sm text-blue-600 animate-pulse">
                    {message}
                </div>
            )}
        </div>

    );
};

export default TestConfigurator;
