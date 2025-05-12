import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../../context/UserContext.jsx';

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
                `http://localhost:8080/Learning-App/School-Manager/remove-teacher-from-school?userId=${teacherId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
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
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
            <div>
                <label>הכנס מזהה מורה להסרה:</label>
                <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    placeholder="Teacher ID"
                    required
                />
            </div>
            <button onClick={handleRemove}>הסר מורה</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RemoveTeacherFromSchool;
