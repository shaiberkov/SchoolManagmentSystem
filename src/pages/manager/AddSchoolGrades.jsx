import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";
import {FiList} from "react-icons/fi";

function AddSchoolGrades() {
    const [grades, setGrades] = useState('');
    const [message, setMessage] = useState('');
    const {user}=useContext(UserContext)
    const cookies = new Cookies();
    const token = cookies.get('token');



    const handleSubmit = async () => {
        if (!grades){
            setMessage("נא לירשום שכבות להוספה")
            return
        }

        const gradesList = grades.split(',').map(g => g.trim());

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/add-school-grades?schoolCode=${user.schoolCode}`,
                gradesList,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.data.success){
                setMessage(response.data.errorCode)
                setGrades("")
            }else {
                setMessage(response.data.errorCode)
                setGrades("")
            }


        } catch (error) {
            setMessage("אירעה שגיאה")


        }
    };

    return (
        <div
            className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right mb-8"
            dir="rtl"
        >
            <h2 className="text-xl sm:text-2xl font-bold text-black-600 mb-6 text-center">
                הוסף שכבות
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiList className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-120"/>
                רשום רשימת שכבות מופרדות בפסיקים:
            </label>
            <input
                type="text"
                value={grades}
                onChange={(e) => setGrades(e.target.value)}
                placeholder="למשל: א, ב, ג"
                required
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiList className="text-white transition-transform duration-300 hover:scale-120"/>
                הוסף שכבות
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );
}

export default AddSchoolGrades;
