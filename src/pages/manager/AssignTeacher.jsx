import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";
import {FaIdCard} from "react-icons/fa";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    AND,
    ASSIGN_STUDENT_TO_CLASS, ASSIGN_USER_AS_SCHOOL_TEACHER,
    AUTH_HEADER, CLASS_NAME,
    QUESTION, SCHOOL_CODE,
    SCHOOL_MANAGER_BASE_PATH, STUDENT_ID, USER_ID
} from "../../constants/pages.constants.js";

function AssignTeacher() {
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const {user} = useContext(UserContext)

    const cookies = new Cookies();
    const token = cookies.get('token');


    const assignUserAsTeacher = async () => {

        try {
            const response = await axios.post(
                `${SCHOOL_MANAGER_BASE_PATH}${ASSIGN_USER_AS_SCHOOL_TEACHER}${QUESTION}${USER_ID}${userId}${AND}${SCHOOL_CODE}${user.schoolCode}`,
                {}, {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            if (!response.data.success) {
                setMessage(response.data.errorCode);
            } else {
                setMessage(response.data.errorCode);
                setUserId("")
            }

        } catch (error) {
            console.error('Request failed:', error);
            setMessage('שגיאה בבקשת ההפיכה למורה');
        }
    };


    return (

        <div className="flex justify-center px-4 py-10 animate-fade-in  mt-10">
            <div
                className="relative bg-white rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,200,100,0.3)] w-full max-w-sm p-6 space-y-6 transition-all duration-500 overflow-hidden border border-green-100"
                dir="rtl"

            >
                <div
                    className="absolute inset-0 bg-gradient-to-br from-green-50 via-white/30 to-green-100 opacity-40 pointer-events-none blur-2xl animate-pulse"/>

                <h2 className="relative text-3xl font-extrabold text-center text-black tracking-wide">
                    שיוך מורה לבית ספר
                </h2>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaIdCard
                        className="text-blue-500 mb-[-4px] transition-colors duration-300 hover:text-blue-600 hover:scale-110"/>
                    הכנס מזהה מורה:
                </label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="תעודת זהות"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full  pr-4 pl-4 py-2 bg-white/90 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner transition duration-200 placeholder:text-gray-400"
                    />
                </div>

                <button
                    onClick={assignUserAsTeacher}
                    className="w-full bg-gradient-to-r from-green-400 via-green-400 to-green-500 hover:via-green-500 hover:to-green-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-102"
                >
                    שייך מורה
                </button>

                {message && (
                    <p
                        className={`text-center mt-1 text-sm transition duration-300 ${
                            message.includes('שגיאה') ? 'text-red-500 animate-shake' : 'text-green-600'
                        }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}

export default AssignTeacher;
