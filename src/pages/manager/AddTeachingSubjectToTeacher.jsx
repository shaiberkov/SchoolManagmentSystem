import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../../context/UserContext.jsx';

function AddTeachingSubjectToTeacher() {
    const [teacherId, setTeacherId] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('מתמטיקה'); // Currently hardcoded
    const cookies = new Cookies();
    const token = cookies.get('token');
    const subjects = [
        "מתמטיקה"
    ];
    const handleSubmit = async () => {
        if (!teacherId.trim()) {
            setMessage("יש להזין מזהה מורה");
            return;
        }
        if (!subject.trim()) {
            setMessage("יש לבחור מקצוע");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/add-teaching-subject-to-teacher?teacherId=${teacherId}`,
                [subject],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
            } else {
                setMessage(response.data.errorCode || "פעולה נכשלה");
            }

        } catch (error) {
            console.error("Error adding subject", error);
            setMessage("אירעה שגיאה בעת ביצוע הפעולה");
        }
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <h3>הוסף מקצוע הוראה למורה</h3>

            <div>
                <label>מזהה מורה:</label>
                <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="לדוג': abc12345"
                />
            </div>

            <div>
                <label>בחר מקצוע:</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">בחר מיקצוע</option>
                    {subjects.map((s, index) => (
                        <option key={index} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleSubmit}>הוסף מקצוע</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default AddTeachingSubjectToTeacher;
