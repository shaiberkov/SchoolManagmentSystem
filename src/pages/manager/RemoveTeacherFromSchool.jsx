import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {FiTrash2} from "react-icons/fi";
import {
    AND,
    ASSIGN_USER_AS_SCHOOL_TEACHER,
    AUTH_HEADER,
    QUESTION, REMOVE_TEACHER_FROM_SCHOOL, SCHOOL_CODE,
    SCHOOL_MANAGER_BASE_PATH, USER_ID
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";

function RemoveTeacherFromSchool() {
    const [teacherId, setTeacherId] = useState('');
    const [message, setMessage] = useState('');
    const cookies = new Cookies();
    const token = cookies.get('token');

    const handleRemove = async () => {
        if (!teacherId) {
            setMessage('אנא הזן מזהה מורה');
            return;
        }

        try {
            const response = await axios.post(
                `${SCHOOL_MANAGER_BASE_PATH}${REMOVE_TEACHER_FROM_SCHOOL}${QUESTION}${USER_ID}${teacherId}`,
                {},
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
                setTeacherId('');
            } else {
                setMessage(response.data.errorCode || 'לא ניתן להסיר את המורה');
            }
        } catch (error) {
            console.error('שגיאה בהסרת מורה', error);
            setMessage('אירעה שגיאה');
        }
    };



    return (
        <div
            className="w-full max-w-sm mb-8 mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right"
            dir="rtl"
        >
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
                הסרת מורה
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiTrash2
                    className="text-green-500 transition-transform duration-300 hover:scale-110 hover:text-red-600"/>
                הכנס מזהה מורה להסרה:
            </label>

            <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="Teacher ID"
                required
                className="w-full px-4 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />

            <button
                onClick={handleRemove}
                className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiTrash2 className="text-white transition-transform duration-300 hover:scale-110 hover:text-red-300"/>
                הסר מורה
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );

}

export default RemoveTeacherFromSchool;
