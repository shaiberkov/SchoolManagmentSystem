import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import { UserContext } from "../../context/UserContext.jsx";
import {FiLayers} from "react-icons/fi";

function RemoveSchoolGrades() {
    const [gradesList, setGradesList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchGrades = async () => {
            if (user?.userId) {
                try {

                    const gradesResponse = await axios.get(
                        `http://localhost:8080/Learning-App/School-Manager/grades?schoolCode=${user.schoolCode}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
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

    const handleRemove = async () => {
        if (!selectedGrade) {
            setMessage("אנא בחר שכבה להסרה");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/remove-school-grades?schoolCode=${user.schoolCode}`,
                [selectedGrade],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMessage("השכבה הוסרה בהצלחה");
                setGradesList(gradesList.filter(g => g !== selectedGrade));
                setSelectedGrade('');
            } else {
                setMessage(response.data.errorCode || "שגיאה בהסרה");
            }
        } catch (error) {
            console.error("Error removing grade", error);
            setMessage("אירעה שגיאה בהסרת שכבה");
        }
    };

    // return (
    //     <div style={{ padding: '1rem', maxWidth: '400px' }}>
    //         <div>
    //             <label>בחר שכבה להסרה:</label>
    //             <select
    //                 value={selectedGrade}
    //                 onChange={(e) => setSelectedGrade(e.target.value)}
    //             >
    //                 <option value="">-- בחר שכבה --</option>
    //                 {gradesList.map((grade, index) => (
    //                     <option key={index} value={grade}>
    //                         {grade}
    //                     </option>
    //                 ))}
    //             </select>
    //         </div>
    //         <button onClick={handleRemove}>הסר שכבה</button>
    //
    //         {message && <p>{message}</p>}
    //     </div>
    return (
        <div
            className="w-full max-w-full sm:max-w-sm mb-8 mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right"
            dir="rtl"
        >
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
                הסר שכבה
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiLayers className="text-green-500 transition-colors duration-300 hover:text-red-600 hover:scale-110" />
                בחר שכבה להסרה:
            </label>

            <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            >
                <option value="">-- בחר שכבה --</option>
                {gradesList.map((grade, index) => (
                    <option key={index} value={grade}>
                        {grade}
                    </option>
                ))}
            </select>

            <button
                onClick={handleRemove}
                className="w-full bg-green-400 hover:bg-green-500 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiLayers className="text-white transition-transform duration-300 hover:scale-110" />
                הסר שכבה
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
    );


}

export default RemoveSchoolGrades;
