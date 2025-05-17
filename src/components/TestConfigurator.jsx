import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import DateTime from 'react-datetime';
import dayjs from 'dayjs';
import axios from "axios";
import {UserContext} from "../context/UserContext.jsx";
import Cookies from "universal-cookie";

const TestConfigurator = ({type}) => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const subjects = ['מתמטיקה'];
    const topics = {
        'מתמטיקה': ['מספרים שלמים'],
    };
    const difficulties = ['קל', 'בינוני', 'קשה'];
    const questionCounts = Array.from({ length: 100 }, (_, i) => i + 1);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedQuestionCount, setSelectedQuestionCount] = useState('');
    const [selectedTimeMinutes, setSelectedTimeMinutes] = useState(30);
    const [startTime, setStartTime] = useState('');
    const [studentsIdsInput, setStudentsIdsInput] = useState('');
    const [message, setMessage] = useState('');


    const navigateToTest = () => {
        navigate(`/test/${selectedSubject}/${selectedTopic}/${selectedDifficulty}/${selectedQuestionCount}/${selectedTimeMinutes}`);
    };


    const handleSubmit = async () => {
        const formattedStartTime = dayjs(startTime).format('DD/MM/YYYY HH:mm');

        const usersIds = studentsIdsInput
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);


        const url = `http://localhost:8080/Learning-App/Teacher/generate-test-for-students?teacherId=${user.userId}&testStartTime=${formattedStartTime}&subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}&questionCount=${selectedQuestionCount}&timeLimitMinutes=${selectedTimeMinutes}`;

        try {
            const response = await axios.post(url, usersIds, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(response.data.success){
                setMessage(response.data.errorCode)
            }else {
                setMessage(response.data.errorCode)
            }

        } catch (error) {
            console.error('שגיאה ביצירת מבחן:', error);
        }
    };


    return (
        <div>
            <h2>יצירת מבחן</h2>

            <div>
                <label>בחר מקצוע:</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">-- בחר --</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {selectedSubject && (
                <div>
                    <label>בחר נושא:</label>
                    <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {topics[selectedSubject].map((topic) => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedTopic && (
                <div>
                    <label>בחר רמת קושי:</label>
                    <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {difficulties.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedDifficulty && (
                <div>
                    <label>בחר מספר שאלות:</label>
                    <select value={selectedQuestionCount} onChange={(e) => setSelectedQuestionCount(parseInt(e.target.value))}>
                        {questionCounts.map((count) => (
                            <option key={count} value={count}>{count}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedQuestionCount && (
                <input
                    type="number"
                    min="1"
                    value={selectedTimeMinutes || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = value ? parseInt(value, 10) : "";
                        setSelectedTimeMinutes(parsedValue);
                    }}
                />

            )}
            {type==="teacher"&&selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0&& (
                <div>
                    <h2>בחר תאריך ושעה למבחן</h2>
                    <DateTime
                        value={startTime}
                        onChange={(value) => setStartTime(value)}
                        inputProps={{placeholder: 'בחר תאריך ושעה'}}
                    />
                </div>

            )}


            {selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && startTime &&type==="teacher" && (

                <div>
                    <label>הכנס ת"ז של תלמידים (מופרדים בפסיקים):</label>
                    <textarea
                        rows={4}
                        value={studentsIdsInput}
                        onChange={(e) => setStudentsIdsInput(e.target.value)}
                        placeholder="123456789,987654321,..."
                    />
                </div>
            )}
            {selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && startTime &&type==="teacher" && (

                <div>
                    <button onClick={handleSubmit}>צור מבחן</button>
                </div>
            )}

            {selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && type === "student" && (
                <div>
                    <button onClick={navigateToTest}>צור מבחן</button>
                </div>
            )}
            {message}
        </div>
    );
};

export default TestConfigurator;
