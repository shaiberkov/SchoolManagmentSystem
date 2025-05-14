import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function TestsTable() {
    const [testsData, setTestsData] = useState([]);
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get("token");
    const navigate=useNavigate();


    const startTest = async (TeacherTestId,timeLimitMinutes) => {
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
                alert(response.data.errorCode);
                navigate(`/test/${TeacherTestId}/${timeLimitMinutes}`);
            } else {
                alert(response.data.errorCode);
            }
        } catch (error) {
            console.error("Failed to start test", error);
            alert("אירעה שגיאה בעת התחלת המבחן");
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
                        const dateA = new Date(a.startTime.split("/").reverse().join("-"));
                        const dateB = new Date(b.startTime.split("/").reverse().join("-"));
                        return dateB - dateA;
                    });
                    setTestsData(sorted);
                } catch (err) {
                    console.error("Error fetching tests data", err);
                }
            }
        };

        fetchTests();
    }, [user?.userId]);

    return (
        <div>
            <h2>המבחנים שלי</h2>
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
                {testsData.map((test) => (

                    <tr key={test.testId}>
                        <td>
                            {test.score !== -1 ? (
                                <span>{test.score}</span>
                            ) : (
                                <button onClick={() => {
                                    startTest(test.testId,test.timeLimitMinutes)
                                }}>
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
        </div>
    );
}

export default TestsTable;
