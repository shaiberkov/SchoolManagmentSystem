import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../../context/UserContext.jsx';
import {FiLayers, FiPlusCircle} from "react-icons/fi";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    ADD_ADDITIONAL_CLASS_TO_GRADE,
    AND, AUTH_HEADER, CLASS_NAME,
    GET_GRADES, GRADE_NAME,
    QUESTION,
    SCHOOL_CODE,
    SCHOOL_MANAGER_BASE_PATH
} from "../../constants/pages.constants.js";

function AddAdditionalClassToGrade() {
    const [gradesList, setGradesList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [className, setClassName] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchGrades = async () => {
            if (user?.userId) {
                try {

                    const gradesResponse = await axios.get(
                        `${SCHOOL_MANAGER_BASE_PATH}${GET_GRADES}${QUESTION}${SCHOOL_CODE}${user.schoolCode}`,
                        {
                            headers: {
                                [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                            }
                        }
                    );

                    if (gradesResponse.data.success && Array.isArray(gradesResponse.data.data)) {
                        setGradesList(gradesResponse.data.data);
                    }
                } catch (err) {
                    console.error("Error fetching grades or school code", err);
                    setMessage("שגיאה בטעינת השכבות");
                }
            }
        };

        fetchGrades();
    }, [user?.userId]);

    const handleSubmit = async () => {
        if (!selectedGrade) {
            setMessage("נא לבחור שכבה");
            return;
        }
        if (!className.trim()) {
            setMessage("נא להזין שם כיתה");
            return;
        }

        try {
            const response = await axios.post(
                    `${SCHOOL_MANAGER_BASE_PATH}${ADD_ADDITIONAL_CLASS_TO_GRADE}${QUESTION}${SCHOOL_CODE}${user.schoolCode}${AND}${GRADE_NAME}${selectedGrade}${AND}${CLASS_NAME}${className}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
                setClassName('');
            } else {
                setClassName('');
                setMessage(response.data.errorCode || "הוספת הכיתה נכשלה");
            }
        } catch (err) {
            console.error("Error adding class", err);
            setMessage("אירעה שגיאה בעת הוספת כיתה");
        }
    };

    return (

        <div
            className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-20 animate-fade-in text-right mb-8"
            dir="rtl"
        >
            <h2 className="text-xl sm:text-2xl font-bold text-black-600 mb-6 text-center">

                הוסף כיתה לשכבה
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiLayers
                    className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-120"/>
                בחר שכבה:
            </label>
            <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            >
                <option value="">בחר שכבה</option>
                {gradesList.map((grade, index) => (
                    <option key={index} value={grade}>
                        {grade}
                    </option>
                ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiPlusCircle
                    className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-120"/>
                שם כיתה:
            </label>
            <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="למשל: א1"
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiPlusCircle className="text-white transition-transform duration-300 hover:scale-120"/>
                הוסף כיתה
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );
}

export default AddAdditionalClassToGrade;
