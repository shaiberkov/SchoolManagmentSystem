

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotificationContext } from "../../context/NotificationContext.jsx";
import {
    FaPlay,
    FaCheckCircle,
    FaClock,
    FaLayerGroup,
    FaBookOpen,
    FaClipboardList, FaExclamationCircle, FaTimesCircle, FaRegCalendarAlt, FaChartBar
} from "react-icons/fa";

function TestsTable() {
    const [testsData, setTestsData] = useState([]);
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get("token");
    const navigate = useNavigate();
    const { tests } = useNotificationContext();

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const parseDateTime = (str) => {
        const [datePart, timePart] = str.split(" ");
        const [day, month, year] = datePart.split("/");
        const dateTimeString = `${year}-${month}-${day}T${timePart || "00:00"}`;
        return new Date(dateTimeString);
    };

    const startTest = async (teacherTestId, timeLimitMinutes, startTimeStr) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/Student/start-test?userId=${user.userId}&testId=${teacherTestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setModalMessage(response.data.errorCode);
                setPendingNavigation({
                    testId: teacherTestId,
                    timeLimit: timeLimitMinutes,
                    startTime: startTimeStr,
                });
                setShowModal(true);
            } else {
                setModalMessage(response.data.errorCode);
                setPendingNavigation(null);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Failed to start test", error);
            setModalMessage("אירעה שגיאה בעת התחלת המבחן");
            setPendingNavigation(null);
            setShowModal(true);
        }
    };

    useEffect(() => {
        const fetchTests = async () => {
            if (user?.userId) {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/Learning-App/Student/get-student-tests-status?studentId=${user.userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const sorted = response.data.sort((a, b) => {
                        return parseDateTime(b.startTime) - parseDateTime(a.startTime);
                    });
                    setTestsData(sorted);
                } catch (err) {
                    console.error("Error fetching tests data", err);
                }
            }
        };

        fetchTests();
    }, [user?.userId]);

    const combinedTests = [...tests, ...testsData];

    return (


        <div className="max-w-4xl mx-auto p-4 bg-white rounded-3xl shadow-md space-y-6 mb-8" dir="rtl">
             כותרת עם גרדיאנט
            <div className="bg-gradient-to-r from-green-400 via-lime-400 to-emerald-500 text-white py-4 px-6 rounded-t-3xl shadow-md">
                <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <FaClipboardList className="text-white animate-pulse transform transition-transform duration-300 hover:scale-125 hover:rotate-6" />
                    רשימת המבחנים שלך
                </h2>
            </div>

            {combinedTests.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-right border-collapse">
                        <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="p-3 text-center align-middle">
                                ציון / פעולה
                                <FaChartBar
                                    className="inline text-indigo-500 mr-2 transform transition-transform duration-300 hover:scale-125 hover:text-indigo-700 hover:rotate-6"
                                />
                            </th>
                            <th className="p-3 text-center align-middle">
                                משך המבחן
                                <FaClock
                                    className="inline text-indigo-500 mr-2 transform transition-transform duration-300 hover:scale-125 hover:text-indigo-700 hover:rotate-8"/>
                            </th>
                            <th className="p-3 text-center align-middle">
                                תאריך
                                <FaRegCalendarAlt
                                    className="inline text-indigo-500 mr-2 transform transition-transform duration-300 hover:scale-125 hover:text-indigo-700 hover:rotate-6"
                                />
                            </th>
                            <th className="p-3 text-center align-middle">
                                תת נושא
                                <FaLayerGroup
                                    className="inline text-purple-500 mr-2 transform transition-transform duration-300 hover:scale-125 hover:text-purple-700 hover:rotate-6"/>
                            </th>
                            <th className="p-3 text-center align-middle">
                                נושא
                                <FaBookOpen
                                    className="inline text-blue-500 mr-2 transform transition-transform duration-300 hover:scale-125 hover:text-blue-700 hover:rotate-6"/>
                            </th>
                        </tr>
                        </thead>


                        <tbody>
                        {combinedTests.map((test) => (
                            <tr key={test.testId} className="hover:bg-gray-50 border-b">
                                <td className="p-3 text-center">
                                    {test.score !== -1 ? (
                                        <span
                                            className="text-black font-semibold flex items-center justify-center gap-1">
            {test.score >= 60 ? (
                <FaCheckCircle
                    className="text-green-500 transition-transform duration-300 hover:scale-125 hover:rotate-6"/>
            ) : (
                <FaTimesCircle
                    className="text-red-500 transition-transform duration-300 hover:scale-125 hover:rotate-6"/>
            )}
                                            {test.score}
          </span>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                startTest(
                                                    test.testId,
                                                    test.timeLimitMinutes,
                                                    test.startTime
                                                )
                                            }
                                            className="bg-green-500 text-white px-4 py-1 rounded-xl shadow hover:bg-green-700 transition duration-300 flex items-center justify-center gap-1 mx-auto"
                                        >
                                            <FaPlay
                                                className="transition-transform duration-300 hover:scale-125 hover:rotate-6"/>
                                            התחל
                                        </button>
                                    )}
                                </td>
                                <td className="p-3 text-center">{test.timeLimitMinutes}</td>
                                <td className="p-3 text-center">{test.startTime}</td>
                                <td className="p-3 text-center">{test.topic}</td>
                                <td className="p-3 text-center">{test.subject}</td>
                            </tr>
                        ))}
                        </tbody>

                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-600 font-semibold mt-4">
                    אין מבחנים זמינים כעת
                </p>
            )}

            {/* Modal */}
            {showModal && (


                <div
                    className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div
                        className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md space-y-4 text-right animate-scaleIn"
                        dir="rtl"
                    >
                        <div className="flex items-center gap-2 text-green-600 text-xl font-bold">
                            <FaExclamationCircle
                                className="text-green-500 text-2xl transition-transform duration-300 hover:rotate-12 hover:scale-125"/>
                            הודעה
                        </div>

                        <p className="text-gray-800 leading-relaxed">{modalMessage}</p>

                        <div className="flex justify-end gap-2 pt-2">
                            {pendingNavigation ? (
                                <>
                                    <button
                                        onClick={() => {
                                            const now = new Date();
                                            const start = parseDateTime(pendingNavigation.startTime);
                                            const diff = Math.max(0, Math.floor((now - start) / 60000));
                                            const updatedLimit = pendingNavigation.timeLimit - diff;
                                            navigate(`/test/${pendingNavigation.testId}/${updatedLimit}`);
                                        }}
                                        className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition duration-300"
                                    >
                                        המשך
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setPendingNavigation(null);
                                        }}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition duration-300"
                                    >
                                        חזור
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-400 transition duration-300"
                                >
                                    סגור
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
}

export default TestsTable;
