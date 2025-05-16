
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import Cookies from "universal-cookie";
import MessageList from "../../components/messages/MessageList.jsx";
import {getGreeting} from "../../Utils/Greeting.jsx";



export default function SystemAdminDashboard() {
    const navigate = useNavigate();
    const [schoolData,setSchoolData]=useState([])
    const [messageFromServer, setMessageFromServer] = useState("");

    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');




    const getSchoolData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/Learning-App/System-Admin/get-all-schools",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                if (response.data.data) {
                    setSchoolData(response.data.data);
                }
            } else {
                setMessageFromServer(response.data.errorCode);
            }
        } catch (error) {
            console.error("שגיאה בשליפת בתי ספר:", error);
            setMessageFromServer("אירעה שגיאה בחיבור לשרת");
        }
    };

    useEffect(() => {
       if (user) getSchoolData();
    }, [user?.userId]);

    // function getGreeting() {
    //     const hour = new Date().getHours();
    //     if (hour < 12) return "בוקר טוב";
    //     if (hour < 17) return "צהריים טובים";
    //     return "ערב טוב";
    // }



    const handleRegisterSchool = () => {
        navigate("/school-registration");
    };

    return (
        <div>
            <h1>{getGreeting()}, {user.username}</h1>
            <h2>לוח ניהול מערכת</h2>

            <div>
                <p>📚 מספר בתי ספר רשומים: {schoolData.length}</p>
                <button onClick={handleRegisterSchool}>
                    ➕ רישום בית ספר חדש
                </button>
            </div>
            <div>
                <h3>📋 רשימת בתי ספר:</h3>
                {schoolData.length > 0 ? (
                    <ul>
                        {schoolData.map((school, index) => (
                            <li key={index}>{school.schoolName} {school.schoolCode}</li>
                        ))}
                    </ul>
                ) : (
                    <p style={{color: "gray"}}>{messageFromServer}</p>
                )}
            </div>
            {user && <MessageList userId={user.userId} />}
        </div>
    );
}
