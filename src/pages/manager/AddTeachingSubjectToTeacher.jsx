import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {FiBookOpen, FiUserCheck} from "react-icons/fi";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    ADD_TEACHING_SUBJECT_TO_TEACHER,
    AUTH_HEADER, QUESTION,
    SCHOOL_MANAGER_BASE_PATH, TEACHER_ID
} from "../../constants/pages.constants.js";

function AddTeachingSubjectToTeacher() {
    const [teacherId, setTeacherId] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('מתמטיקה');
    const cookies = new Cookies();
    const token = cookies.get('token');

    //TODO לקבל את זה מהשרת
    const subjects = [
        "מתמטיקה"
    ];
    const handleSubmit = async () => {
        if (!teacherId.trim()) {
            setMessage("יש להזין מזהה מורה");
            return;
        }
        if (!subject.trim()) {
            setMessage("יש לבחור מקצוע");
            return;
        }

        try {
            const response = await axios.post(
            `${SCHOOL_MANAGER_BASE_PATH}${ADD_TEACHING_SUBJECT_TO_TEACHER}${QUESTION}${TEACHER_ID}${teacherId}`,
                [subject],
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
            } else {
                setMessage(response.data.errorCode || "פעולה נכשלה");
            }

        } catch (error) {
            console.error("Error adding subject", error);
            setMessage("אירעה שגיאה בעת ביצוע הפעולה");
        }
    };

    return (
        <div
            className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-20 animate-fade-in text-right mb-8"
            dir="rtl"
        >
            <h2 className="text-xl sm:text-2xl font-bold text-black-600 mb-6 text-center">
                הוסף מקצוע הוראה למורה
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiUserCheck
                    className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-120"/>
                מזהה מורה:
            </label>
            <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="תז..."
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiBookOpen
                    className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-120"/>
                בחר מקצוע:
            </label>
            <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            >
                <option value="">בחר מקצוע</option>
                {subjects.map((s, index) => (
                    <option key={index} value={s}>
                        {s}
                    </option>
                ))}
            </select>

            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiBookOpen className="text-white transition-transform duration-300 hover:scale-120"/>
                הוסף מקצוע
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );
}

export default AddTeachingSubjectToTeacher;
