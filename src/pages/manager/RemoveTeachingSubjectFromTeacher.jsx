import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

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
                `http://localhost:8080/Learning-App/School-Manager/get-teacher-teaching-subjects?teacherId=${teacherId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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
                `http://localhost:8080/Learning-App/School-Manager/remove-teaching-subject-from-teacher?teacherId=${teacherId}&subjectToRemove=${selectedSubject}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
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
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <h3>הסר מקצוע הוראה ממורה</h3>

            <div>
                <label>מזהה מורה:</label>
                <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="לדוג': abc12345"
                />
                <button onClick={fetchSubjects} style={{ marginTop: '0.5rem' }}>
                    הבא מקצועות הוראה
                </button>
            </div>

            {subjectsFetched && subjects.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    <label>בחר מקצוע להסרה:</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">בחר מיקצוע</option>
                        {subjects.map((subject, index) => (
                            <option key={index} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <button onClick={handleRemove} style={{ marginTop: '0.5rem' }}>
                        הסר מקצוע
                    </button>
                </div>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default RemoveTeachingSubjectFromTeacher;
