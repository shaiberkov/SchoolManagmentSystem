



import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useNotificationContext} from "../../context/NotificationContext.jsx";

function TestsTable() {
    const [testsData, setTestsData] = useState([]);
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get("token");
    const navigate = useNavigate();
    const {tests}=useNotificationContext();

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const parseDateTime = (str) => {
        const [datePart, timePart] = str.split(" ");
        const [day, month, year] = datePart.split("/");
        const dateTimeString = `${year}-${month}-${day}T${timePart || "00:00"}`;
        return new Date(dateTimeString);
    };

    const startTest = async (TeacherTestId, timeLimitMinutes) => {
        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/Student/start-test?userId=${user.userId}&testId=${TeacherTestId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setModalMessage(response.data.errorCode);
                setPendingNavigation({ testId: TeacherTestId, timeLimit: timeLimitMinutes });
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
        <div>
            <h2>המבחנים שלי</h2>

            {combinedTests.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>ציון / פעולה</th>
                        <th>משך המבחן (דקות)</th>
                        <th>תאריך</th>
                        <th>תת נושא</th>
                        <th>נושא</th>
                    </tr>
                    </thead>
                    <tbody>
                    {combinedTests.map((test) => (
                        <tr key={test.testId}>
                            <td>
                                {test.score !== -1 ? (
                                    <span>{test.score}</span>
                                ) : (
                                    <button onClick={() => startTest(test.testId, test.timeLimitMinutes)}>
                                        התחל מבחן
                                    </button>
                                )}
                            </td>
                            <td>{test.timeLimitMinutes}</td>
                            <td>{test.startTime}</td>
                            <td>{test.topic}</td>
                            <td>{test.subject}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ marginTop: "20px", fontWeight: "bold" }}>אין מבחנים זמינים כעת</p>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div style={{ background: "white", padding: "20px", borderRadius: "4px", minWidth: "300px" }}>
                        <p>{modalMessage}</p>
                        <div style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            {pendingNavigation ? (
                                <>
                                    <button
                                        onClick={() =>
                                            navigate(`/test/${pendingNavigation.testId}/${pendingNavigation.timeLimit}`)
                                        }
                                    >
                                        המשך
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setPendingNavigation(null);
                                        }}
                                    >
                                        חזור
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setShowModal(false)}>סגור</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default TestsTable;
