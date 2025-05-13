import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";

function AssignTeacher() {
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const {user}=useContext(UserContext)

    const cookies = new Cookies();
    const token = cookies.get('token');






    const assignUserAsTeacher = async () => {

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/assign-user-as-school-teacher?userId=${userId}&schoolCode=${user.schoolCode}`,
                {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.data.success) {
                setMessage(response.data.errorCode);
            }else {
                setMessage(response.data.errorCode);
                setUserId("")
            }

        } catch (error) {
            console.error('Request failed:', error);
            setMessage('שגיאה בבקשת ההפיכה למורה');
        }
    };





    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2> </h2>
                <input placeholder="תעודת זהות" value={userId} onChange={(e) => setUserId(e.target.value)} required />
                <button onClick={assignUserAsTeacher}>שייך מורה</button>
            {message && <p style={{ marginTop: '15px', color: message.includes('שגיאה') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
}

export default AssignTeacher;
