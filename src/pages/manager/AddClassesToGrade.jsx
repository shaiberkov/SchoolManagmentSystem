import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../../context/UserContext.jsx';
import { getManagerSchoolCode } from '../../Api/getManagerSchoolCode.js';

function AddClassesToGrade() {
    const [schoolCode, setSchoolCode] = useState('');
    const [gradesList, setGradesList] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [classesCount, setClassesCount] = useState('');
    const [message, setMessage] = useState('');

    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchSchoolCodeAndGrades = async () => {
            if (user?.userId) {
                try {
                    const code = await getManagerSchoolCode(user.userId, token);
                    setSchoolCode(code);

                    const gradesResponse = await axios.get(
                        `http://localhost:8080/Learning-App/School-Manager/grades?schoolCode=${code}`,
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
        if (!classesCount) {
            setMessage("נא להזין מספר כיתות");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/add-classes-to-grade?schoolCode=${schoolCode}&gradeName=${selectedGrade}&classesCount=${classesCount}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
                setClassesCount('');
            } else {
                setMessage(response.data.errorCode || "לא ניתן להוסיף כיתות");
            }
        } catch (err) {
            console.error("Error adding classes", err);
            setMessage("אירעה שגיאה");
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <h3>הוסף כיתות לשכבה</h3>
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
                <label>מספר כיתות להוספה:</label>
                <input
                    type="number"
                    value={classesCount}
                    onChange={(e) => setClassesCount(e.target.value)}
                    min="1"
                />
            </div>

            <button onClick={handleSubmit}>הוסף כיתות</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AddClassesToGrade;
