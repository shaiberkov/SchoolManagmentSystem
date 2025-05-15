import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../context/UserContext.jsx";

const TestSession = ({type}) => {
    const { user } = useContext(UserContext);
    const { selectedSubject, selectedTopic, selectedDifficulty, selectedQuestionCount,selectedTimeMinutes } = useParams();
    const { TeacherTestId,timeLimitMinutes } = useParams();

    const [testData, setTestData] = useState({});
    const [error, setError] = useState(null);
    const [testId, setTestId] = useState("");
    const [userAnswers, setUserAnswers] = useState({});
    const [testResults, setTestResults] = useState(null);
    const [progress, setProgress] = useState(0);

    const [timeLeft, setTimeLeft] = useState(() => {
        let minutes = 0;

        if (type === "practiceTest") {
            minutes = parseInt(selectedTimeMinutes);
        } else if (type === "teacherTest") {
            minutes = parseInt(timeLimitMinutes);
        }
        return isNaN(minutes) ? 0 : minutes * 60;
    });

    const cookies = new Cookies();
    const token=cookies.get('token')

    useEffect(() => {
        if (testResults || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (!testResults) submitTest();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, testResults]);

    useEffect(() => {
        if (user?.userId&&type==="practiceTest") {
            const fetchTestData = async () => {
                try {
                    const response = await axios.post(`http://localhost:8080/Learning-App/Student/generate-practice-test?userId=${user.userId}&subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}&questionCount=${selectedQuestionCount}&timeLimitMinutes=${selectedTimeMinutes}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    setTestData(response.data.data);
                    setTestId(response.data.data.id);
                } catch (err) {
                    setError(err);
                }
            };

            fetchTestData();
        }
    }, [selectedSubject, selectedTopic, selectedDifficulty, selectedQuestionCount, user.userId]);

    useEffect(() => {
        if (user?.userId&&type==="teacherTest") {
            const fetchTestData = async () => {
                console.log(TeacherTestId)
                try {
                    const response = await axios.get(`http://localhost:8080/Learning-App/Test/get-test?testId=${TeacherTestId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    setTestData(response.data);
                } catch (err) {
                    console.warn(err);
                }
            };

            fetchTestData();
        }
    }, [user.userId]);

    const submitTest = async () => {
        try {
            let url="";
            if(type==="practiceTest"){
              url= `http://localhost:8080/Learning-App/Student/check-practice-test?userId=${user.userId}&testId=${testId}`

            }else if(type==="teacherTest"){
                url=`http://localhost:8080/Learning-App/Teacher/check-teacher-test?userId=${user.userId}&testId=${TeacherTestId}`
            }

            const response = await axios.post(
                url
                ,
                userAnswers,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response) {
                setTestResults(response.data.data);
            }
        } catch (err) {
            console.error(err)
            setError(err);
            alert('שגיאה בהגשת המבחן.');
        }
    };

    const handleAnswerChange = (questionId, answer) => {
        const updatedAnswers = { ...userAnswers, [questionId]: answer };
        setUserAnswers(updatedAnswers);
        const answeredCount = Object.values(updatedAnswers).filter(v => v).length;
        setProgress((answeredCount / testData.questions.length) * 100);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

    if (!testData || !testData.questions) return <div>טוען...</div>;

    const questions = testData.questions;

    return (
        <div style={{padding: '20px'}}>

            {type==="teacherTest"&&testData &&(
                <div>
                    <h2>מבחן</h2>
                    <p>מקצוע: {testData.questions[0]?.subject}</p>
                    <p>נושא: {testData.questions[0]?.topic}</p>
                    <p>מספר שאלות: {questions.length}</p>
                </div>
            )}


            {type==="practiceTest"&&(
                <div>
                    <h2>מבחן</h2>
                    <p>מקצוע: {selectedSubject}</p>
                    <p>נושא: {selectedTopic}</p>
                    <p>רמה: {selectedDifficulty}</p>
                    <p>מספר שאלות: {selectedQuestionCount}</p>
                </div>
            )}


            {!testResults && (
                <>
                    <div style={{margin: '20px 0'}}>
                        <div style={{height: '20px', backgroundColor: '#ddd', borderRadius: '10px'}}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: 'green',
                                borderRadius: '10px',
                                transition: 'width 0.3s'
                            }}></div>
                        </div>
                        <p>{Math.round(progress)}%</p>
                    </div>
                    <div>
                        <strong>זמן נותר:</strong> {formatTime(timeLeft)}
                    </div>
                </>
            )}

            {testResults ? (
                <div>
                    <h3>תוצאות המבחן:</h3>
                    <p>ציון: {testResults.score}</p>
                    <p>תשובות נכונות: {testResults.correctAnswers} מתוך {questions.length}</p>

                    <h4>שאלות נכונות:</h4>
                    <ul>
                        {testResults.correctAnswerList.map((q, i) => <li key={i} style={{color: 'green'}}>{q}</li>)}
                    </ul>

                    <h4>שאלות לא נכונות:</h4>
                    <ul>
                        {testResults.incorrectAnswerList.map((q, i) => <li key={i} style={{color: 'red'}}>{q}</li>)}
                    </ul>
                </div>
            ) : (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    submitTest();
                }}>
                    {questions.map((question, index) => (
                        <div key={index} style={{marginBottom: '20px'}}>
                            <label><strong>{index + 1}. {question.questionText}</strong></label><br/>
                            <input
                                type="text"
                                value={userAnswers[question.id] || ''}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                style={{width: '100%', padding: '8px'}}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={!questions.every(q => userAnswers[q.id])}>
                        הגש מבחן
                    </button>
                </form>
            )}
        </div>
    );
};

export default TestSession;
