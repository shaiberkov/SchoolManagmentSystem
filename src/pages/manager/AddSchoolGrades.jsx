import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";

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
        <div style={{ padding: '1rem', maxWidth: '400px' }}>
                <div>
                    <label>רשום רשימת שכבות מופרדים ב ,</label>
                    <input
                        type="text"
                        value={grades}
                        onChange={(e) => setGrades(e.target.value)}
                        required
                    />
                </div>
                <button onClick={handleSubmit} >הוסף שכבות</button>

            {message && <p>{message}</p>}
        </div>
    );
}

export default AddSchoolGrades;
