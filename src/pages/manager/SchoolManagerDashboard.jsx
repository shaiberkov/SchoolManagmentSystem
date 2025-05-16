
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import {getGreeting} from "../../Utils/Greeting.jsx";

function SchoolManagerDashboard() {
    const [schoolData,setSchoolData]=useState({})
    const [messageFromServer, setMessageFromServer] = useState("");
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');



    useEffect(() => {
        const fetchSchoolData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/Learning-App/School-Manager/get-school?schoolManagerId=${user.userId}`,
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
                console.error("שגיאה:", error);
                setMessageFromServer("שגיאה בחיבור לשרת");
            }
        };

       if(user) fetchSchoolData();
    }, [user?.userId]);


    return (
        <>
            <h1>{getGreeting()}, {user?.username}</h1>
            <h2>לוח ניהול בית הספר</h2>

            {schoolData ? (
                <div>
                    <p>🏫 שם בית הספר: {schoolData.schoolName}</p>
                    <p>קוד: {schoolData.schoolCode}</p>

                    <p>
                        מספר מורים:{" "}
                        {schoolData.teacherCount && schoolData.teacherCount > 0
                            ? schoolData.teacherCount
                            : "אין כרגע מורים רשומים"}
                    </p>

                    <p>
                        מספר תלמידים:{" "}
                        {schoolData.studentCount && schoolData.studentCount > 0
                            ? schoolData.studentCount
                            : "אין כרגע תלמידים רשומים"}
                    </p>
                </div>

            ) : (
                <p style={{color: "gray"}}>{messageFromServer}</p>
            )}

            {user && <MessageList userId={user.userId}/>}
        </>
    );
}

export default SchoolManagerDashboard;
