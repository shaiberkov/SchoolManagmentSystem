import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {FiBookOpen, FiSearch, FiTrash2} from "react-icons/fi";
import {
    AND,
    AUTH_HEADER, GET_TEACHER_TEACHING_SUBJECTS,
    QUESTION,
    REMOVE_TEACHER_FROM_SCHOOL, REMOVE_TEACHING_SUBJECT_FROM_TEACHER,
    SCHOOL_MANAGER_BASE_PATH, SUBJECT_TO_REMOVE, TEACHER_ID, USER_ID
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";

function RemoveTeachingSubjectFromTeacher() {
    const [teacherId, setTeacherId] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [message, setMessage] = useState('');
    const [subjectsFetched, setSubjectsFetched] = useState(false);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const fetchSubjects = async () => {
        if (!teacherId.trim()) {
            setMessage("יש להזין מזהה מורה");
            return;
        }

        try {
            const response = await axios.get(
                `${SCHOOL_MANAGER_BASE_PATH}${GET_TEACHER_TEACHING_SUBJECTS}${QUESTION}${TEACHER_ID}${teacherId}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            if (response.data.success){
                if (Array.isArray(response.data.data)) {
                    setSubjects(response.data.data);
                    setSelectedSubject('');
                    setMessage('');
                    setSubjectsFetched(true);
                } else {
                    setSubjects([]);
                    setSubjectsFetched(false);
                    setTeacherId('');
                }

            }else {
                setMessage(response.data.errorCode)
                setTeacherId('');
            }


        } catch (error) {
            console.error("Error fetching subjects:", error);
            setMessage("שגיאה בקבלת מקצועות ההוראה");
        }
    };

    const handleRemove = async () => {
        if (!selectedSubject) {
            setMessage("יש לבחור מקצוע להסרה");
            return;
        }

        try {
            const response = await axios.post(
                `${SCHOOL_MANAGER_BASE_PATH}${REMOVE_TEACHING_SUBJECT_FROM_TEACHER}${QUESTION}${TEACHER_ID}${teacherId}${AND}${SUBJECT_TO_REMOVE}${selectedSubject}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );


            if (response.data.success) {
                setSubjects(subjects.filter(subject => subject !== selectedSubject));
                setSelectedSubject('');
                setMessage(response.data.errorCode);
            } else {
                setMessage(response.data.errorCode || "הסרת המקצוע נכשלה");
            }

        } catch (error) {
            console.error("Error removing subject:", error);
            setMessage("שגיאה בהסרת המקצוע");
        }
    };

    return (

            <div
                className="w-full max-w-sm mx-auto mb-8 p-6 bg-white rounded-2xl shadow-xl mt-8 text-right animate-fade-in"
                dir="rtl"
            >
                <h3 className="text-2xl font-bold text-green-600 mb-6 text-center">
                    הסר מקצוע הוראה ממורה
                </h3>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <FiSearch className="text-green-500 transition-transform duration-300 hover:scale-110 hover:text-blue-400" />
                        מזהה מורה:
                    </label>
                    <input
                        type="text"
                        value={teacherId}
                        onChange={(e) => setTeacherId(e.target.value)}
                        placeholder="לדוג': abc12345"
                        className="w-full px-4 py-2 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                    />
                    <button
                        onClick={fetchSubjects}
                        className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                        <FiSearch className="text-white transition-transform duration-300 hover:scale-110 hover:text-blue-200" />
                        הבא מקצועות הוראה
                    </button>
                </div>

                {subjectsFetched && subjects.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiBookOpen className="text-green-500 transition-transform duration-300 hover:scale-110 hover:text-blue-400" />
                            בחר מקצוע להסרה:
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300 mb-2"
                        >
                            <option value="">בחר מקצוע</option>
                            {subjects.map((subject, index) => (
                                <option key={index} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleRemove}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <FiTrash2 className="text-white transition-transform duration-300 hover:scale-120 hover:text-red-200" />
                            הסר מקצוע
                        </button>
                    </div>
                )}

                {message && (
                    <p className="mt-4 text-sm text-center text-blue-600 animate-pulse">
                        {message}
                    </p>
                )}
            </div>
        );

}

export default RemoveTeachingSubjectFromTeacher;
