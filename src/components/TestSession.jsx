

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserContext } from '../context/UserContext.jsx';
import { FiBookOpen, FiSend } from 'react-icons/fi';
import { FaExclamationCircle } from 'react-icons/fa';
import {BEARER_PREFIX} from "../constants/shared.constant.js";
import {
    AND,
    AUTH_HEADER, CHECK_PRACTICE_TEST, CHECK_TEACHER_TEST, DIFFICULTY, GENERATE_PRACTICE_TEST,
    GENERATE_TEST_FOR_STUDENTS, GET_TEST,
    QUESTION, QUESTION_COUNT, STUDENT_BASE_PATH, SUBJECT,
    TEACHER_BASE_PATH,
    TEST_BASE_PATH, TEST_ID, TIME_LIMIT_MINUTES, TOPIC, USER_ID
} from "../constants/pages.constants.js";

const TestSession = ({ type }) => {
    const { user } = useContext(UserContext);
    const {
        selectedSubject,
        selectedTopic,
        selectedDifficulty,
        selectedQuestionCount,
        selectedTimeMinutes,
    } = useParams();
    const { TeacherTestId, timeLimitMinutes } = useParams();

    const [testData, setTestData] = useState({});
    const [error, setError] = useState(null);
    const [testId, setTestId] = useState('');
    const [userAnswers, setUserAnswers] = useState({});
    const [testResults, setTestResults] = useState(null);
    const [progress, setProgress] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);

    const [timeLeft, setTimeLeft] = useState(() => {
        let minutes = 0;
        if (type === 'practiceTest') minutes = parseInt(selectedTimeMinutes);
        else if (type === 'teacherTest') minutes = parseInt(timeLimitMinutes);
        return isNaN(minutes) ? 0 : minutes * 60;
    });

    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        if (testResults || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
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
        if (user?.userId && type === 'practiceTest') {
            (async () => {
                try {
                    const res = await axios.post(
                        `${STUDENT_BASE_PATH}${GENERATE_PRACTICE_TEST}${QUESTION}${USER_ID}${user.userId}${AND}${SUBJECT}${selectedSubject}${AND}${TOPIC}${selectedTopic}${AND}${DIFFICULTY}${selectedDifficulty}${AND}${QUESTION_COUNT}${selectedQuestionCount}${AND}${TIME_LIMIT_MINUTES}${selectedTimeMinutes}`,
                        {}, {
                            headers: {
                                [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                        }
                        }
                    );
                    setTestData(res.data.data);
                    setTestId(res.data.data.id);
                } catch (err) {
                    setError(err);
                }
            })();
        }
    }, [
        user?.userId,
        type,
        selectedSubject,
        selectedTopic,
        selectedDifficulty,
        selectedQuestionCount,
        selectedTimeMinutes,
    ]);

    useEffect(() => {
        if (user?.userId && type === 'teacherTest') {
            (async () => {
                try {
                    const res = await axios.get(
                            `${TEST_BASE_PATH}${GET_TEST}${QUESTION}${TEST_ID}${TeacherTestId}`,
                        { headers: {
                            [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                            }
                        }
                    );
                    setTestData(res.data);
                } catch (err) {
                    console.warn(err);
                }
            })();
        }
    }, [user?.userId, type, TeacherTestId]);

    const submitTest = async () => {
        try {
            let url = '';
            if (type === 'practiceTest') {
                url =`${STUDENT_BASE_PATH}${CHECK_PRACTICE_TEST}${QUESTION}${USER_ID}${user.userId}${AND}${TEST_ID}${testId}`;
            } else if (type === 'teacherTest') {
                url =`${TEACHER_BASE_PATH}${CHECK_TEACHER_TEST}${QUESTION}${USER_ID}${user.userId}${AND}${TEST_ID}${TeacherTestId}`;
            }
            const res = await axios.post(url, userAnswers, {
                headers: {
                    [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    ,
                    'Content-Type': 'application/json',
                },
            });
            if (res) setTestResults(res.data.data);
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    const handleAnswerChange = (qid, answer) => {
        const updated = { ...userAnswers, [qid]: answer };
        setUserAnswers(updated);
        const answered = Object.values(updated).filter(Boolean).length;
        setProgress((answered / testData.questions.length) * 100);
    };

    const formatTime = (s) =>
        `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    if (!testData || !testData.questions) return <div>טוען...</div>;
    const questions = testData.questions;

    return (
        <div
            className="w-full max-w-full sm:max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-20 text-right animate-fade-in mb-8"
            dir="rtl"
        >
            {type === 'teacherTest' && (
                <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 bg-green-100 rounded-xl py-3 px-4 shadow-inner mb-4">
                        <FiBookOpen className="text-green-600 text-2xl" />
                        <h2 className="text-2xl font-bold text-green-700">פרטי המבחן</h2>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md px-5 py-4 space-y-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📘 מקצוע: </span>
                            {questions[0]?.subject || 'לא צוין'}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📚 נושא: </span>
                            {questions[0]?.topic || 'לא צוין'}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🔢 מספר שאלות: </span>
                            {questions.length}
                        </p>
                    </div>
                </div>
            )}

            {type === 'practiceTest' && (
                <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 bg-green-100 rounded-xl py-3 px-4 shadow-inner mb-4">
                        <FiBookOpen className="text-green-600 text-2xl" />
                        <h2 className="text-2xl font-bold text-green-700">מבחן תרגול</h2>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-md px-5 py-4 space-y-3">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📘 מקצוע: </span>
                            {selectedSubject || 'לא נבחר'}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">📚 נושא: </span>
                            {selectedTopic || 'לא נבחר'}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🎯 רמה: </span>
                            {selectedDifficulty || 'לא נבחר'}
                        </p>
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-green-700">🔢 מספר שאלות: </span>
                            {selectedQuestionCount || 0}
                        </p>
                    </div>
                </div>
            )}

            {!testResults && (
                <>
                    <div className="mb-6">
                        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm mt-1 text-center text-gray-600">
                            {Math.round(progress)}%
                        </p>
                    </div>
                    <div className="mb-6 text-sm flex items-center justify-center gap-2 text-gray-800">
                        <strong>⏰ זמן נותר:</strong> {formatTime(timeLeft)}
                    </div>
                </>
            )}

            {testResults ? (
                <div className="bg-white rounded-3xl p-5 shadow-md space-y-6" dir="ltr">
                    <h3 className="text-lg font-bold text-center text-green-700 border-b pb-2">
                        📊 תוצאות המבחן
                    </h3>
                    <div className="flex flex-col gap-1 items-end sm:items-center">
                        <p className="text-base text-gray-700">
                            🧠 ציון:{' '}
                            <span className="font-bold text-green-600">
                {testResults.score}
              </span>
                        </p>
                        <p className="text-base text-gray-700">
                            🎯 תשובות נכונות:{' '}
                            <span className="text-green-600 font-semibold">
                {testResults.correctAnswers} מתוך {questions.length}
              </span>
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 md:justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-1">
                                ✅ שאלות נכונות:
                            </h4>
                            <ul className="list-disc pr-5 space-y-1 text-green-700">
                                {testResults.correctAnswerList.map((q, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 hover:scale-[1.02] transition"
                                    >
                                        <span className="animate-bounce text-green-400">😊</span>
                                        <span>{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-1">
                                ❌ שאלות לא נכונות:
                            </h4>
                            <ul className="list-disc pr-5 space-y-1 text-red-700">
                                {testResults.incorrectAnswerList.map((q, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-2 hover:scale-[1.02] transition"
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
                        if (type === 'teacherTest') setShowConfirm(true);
                        else submitTest();
                    }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {questions.map((q, i) => (
                            <div key={q.id} className="mb-4" dir="ltr">
                                <label className="block font-semibold mb-1 text-left">
                                    {i + 1}. {q.questionText}
                                </label>
                                <input
                                    type="text"
                                    value={userAnswers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={!questions.every((q) => userAnswers[q.id])}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-300 text-white font-bold py-2 rounded-lg shadow-md transition hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <FiSend className="transition-transform hover:rotate-45 hover:scale-125" />
                        הגש מבחן
                    </button>
                </form>
            )}

            {showConfirm && (
                <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md space-y-4 text-right animate-scaleIn">
                        <div className="flex items-center gap-2 text-green-600 text-xl font-bold">
                            <FaExclamationCircle className="text-green-500 text-2xl transform hover:rotate-12 hover:scale-125 transition" />
                            אישור הגשה
                        </div>
                        <p className="text-gray-800">
                            האם אתה בטוח שברצונך להגיש את המבחן? לא תוכל לשנות תשובות
                            לאחר מכן.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => {
                                    setShowConfirm(false);
                                    submitTest();
                                }}
                                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                            >
                                הגש
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
                            >
                                חזור
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestSession;



