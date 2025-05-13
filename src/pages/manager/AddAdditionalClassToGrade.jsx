import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../../context/UserContext.jsx';

function AddAdditionalClassToGrade() {
    const [schoolCode, setSchoolCode] = useState('');
    const [gradesList, setGradesList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [className, setClassName] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchSchoolCodeAndGrades = async () => {
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

        fetchSchoolCodeAndGrades();
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
                `http://localhost:8080/Learning-App/School-Manager/add-additional-class-to-grade?schoolCode=${user.schoolCode}&gradeName=${selectedGrade}&className=${className}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <h3>הוסף כיתה לשכבה</h3>

            <div>
                <label>בחר שכבה:</label>
                <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                >
                    <option value="">בחר שכבה</option>
                    {gradesList.map((grade, index) => (
                        <option key={index} value={grade}>
                            {grade}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>שם כיתה:</label>
                <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="למשל: א1"
                />
            </div>

            <button onClick={handleSubmit}>הוסף כיתה</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddAdditionalClassToGrade;
