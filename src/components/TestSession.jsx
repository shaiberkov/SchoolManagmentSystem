import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from "universal-cookie";
import {UserContext} from "../context/UserContext.jsx";
import {FiBookOpen, FiSend} from "react-icons/fi";

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

        <div
            className="w-full max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-8 text-right animate-fade-in mb-8"
            dir="rtl">


            {type === "teacherTest" && testData && (
                <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 bg-green-100 rounded-xl py-3 px-4 shadow-inner mb-4">
                        <FiBookOpen className="text-green-600 text-2xl transition-transform duration-300 hover:rotate-45 hover:scale-125 hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.6)] hover:brightness-125" />
                        <h2 className="text-2xl font-bold text-green-700">פרטי המבחן</h2>
                    </div>

                    {/* מסגרת עם הפרטים */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md px-5 py-4 space-y-3 text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📘 מקצוע:</span>
                            <span>{testData.questions[0]?.subject || "לא צוין"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📚 נושא:</span>
                            <span>{testData.questions[0]?.topic || "לא צוין"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🔢 מספר שאלות:</span>
                            <span>{questions.length}</span>
                        </div>
                    </div>
                </div>
            )}


            {type === "practiceTest" && (
                <div className="mb-6">
                    {/* כותרת עם רקע ירוק ואייקון עם אנימציית ריחוף */}
                    <div className="flex items-center justify-center gap-3 bg-green-100 rounded-xl py-3 px-4 shadow-inner mb-4">
                        <FiBookOpen className="text-green-600 text-2xl transition-transform duration-300 hover:rotate-45 hover:scale-125 hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.6)] hover:brightness-125" />
                        <h2 className="text-2xl font-bold text-green-700">מבחן תרגול</h2>
                    </div>

                    {/* פרטי המבחן במסגרת רכה */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md px-5 py-4 space-y-3 text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📘 מקצוע:</span>
                            <span>{selectedSubject || "לא נבחר"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📚 נושא:</span>
                            <span>{selectedTopic || "לא נבחר"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🎯 רמה:</span>
                            <span>{selectedDifficulty || "לא נבחר"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🔢 מספר שאלות:</span>
                            <span>{selectedQuestionCount || 0}</span>
                        </div>
                    </div>
                </div>
            )}


            {!testResults && (
                <>
                    <div className="mb-6">
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                                style={{width: `${progress}%`}}
                            ></div>
                        </div>
                        <p className="text-sm mt-1 text-gray-600 text-center">{Math.round(progress)}%</p>
                    </div>

                    <div className="mb-6 text-sm text-gray-800 flex items-center gap-2 justify-center">
                        <strong>⏰ זמן נותר:</strong> {formatTime(timeLeft)}
                    </div>
                </>
            )}

            {testResults ? (
                <div className="text-sm text-gray-800 bg-white rounded-3xl p-5 shadow-md space-y-6" dir="ltr">
                    {/* כותרת ראשית */}
                    <h3 className="text-lg font-bold text-center text-green-700 border-b pb-2">📊 תוצאות המבחן</h3>

                    {/* מידע כללי על הציון */}
                    <div className="flex flex-col gap-1 items-end sm:items-center sm:text-center">
                        <p className="text-base font-medium text-gray-700">
                            🧠 ציון: <span className="font-bold text-green-600">{testResults.score}</span>
                        </p>
                        <p className="text-base font-medium text-gray-700">
                            🎯 תשובות נכונות:{" "}
                            <span className="text-green-600 font-semibold">
                    {testResults.correctAnswers} מתוך {questions.length}
                            </span>
                        </p>
                    </div>

                    {/* אזור 2 עמודות – נכונות / שגויות */}
                    <div className="flex flex-col  md:flex-row md:gap-6 md:justify-between ">
                    {/*<div className="flex flex-col items-center justify-center md:flex-row md:gap-6 md:justify-between">*/}

                    {/* עמודת שאלות נכונות */}
                        <div className="flex-1">
                            <h4 className="text-md font-semibold text-green-600 mb-2 flex items-center gap-1">
                                ✅ שאלות נכונות:
                            </h4>
                            <ul className="list-disc pr-5 space-y-1 text-green-700 text-right">
                                {testResults.correctAnswerList.map((q, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <span className="animate-bounce text-green-400">😊</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* עמודת שאלות שגויות */}
                        <div className="flex-1 mt-6 md:mt-0">
                            <h4 className="text-md font-semibold text-red-600 mb-2 flex items-center gap-1">
                                ❌ שאלות לא נכונות:
                            </h4>
                            <ul className="list-disc pr-5 space-y-1 text-red-700 text-right">
                                {testResults.incorrectAnswerList.map((q, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <span className="animate-pulse text-red-400">😞</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

            ) : (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitTest();
                    }}
                    className="space-y-6"
                >

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {questions.map((question, index) => (
                            <div key={index} className="mb-4" dir="ltr">
                                <label className="block font-semibold mb-1 text-left">
                                    {index + 1}. {question.questionText}
                                </label>
                                <input
                                    type="text"
                                    value={userAnswers[question.id] || ''}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>


                    <button
                        type="submit"
                        disabled={!questions.every(q => userAnswers[q.id])}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-300 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <FiSend className="transition-transform duration-300 hover:rotate-45 hover:scale-125"/>
                        הגש מבחן
                    </button>
                </form>
            )}
        </div>
    );
};

export default TestSession;
