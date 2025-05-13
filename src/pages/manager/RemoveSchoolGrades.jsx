import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import { UserContext } from "../../context/UserContext.jsx";

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

    return (
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <div>
                <label>בחר שכבה להסרה:</label>
                <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                >
                    <option value="">-- בחר שכבה --</option>
                    {gradesList.map((grade, index) => (
                        <option key={index} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleRemove}>הסר שכבה</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default RemoveSchoolGrades;
