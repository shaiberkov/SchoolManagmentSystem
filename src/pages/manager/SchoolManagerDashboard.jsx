
import {useContext, useEffect, useState} from "react";
import { UserContext } from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import {getGreeting} from "../../Utils/Greeting.jsx";
import EventForm from "../../components/EventForm.jsx";
import {
    AUTH_HEADER, GET_SCHOOL,
    QUESTION,
    SCHOOL_MANAGER_BASE_PATH, SCHOOL_MANAGER_ID, TEACHER_ID
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";

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
                    `${SCHOOL_MANAGER_BASE_PATH}${GET_SCHOOL}${QUESTION}${SCHOOL_MANAGER_ID}${user.userId}`,
                    {
                        headers: {
                            [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
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
        <div className="min-h-screen mt-20 p-4 sm:p-8" dir="rtl">
            <header className="max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    {getGreeting()}, {user?.username}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-green-600 mt-2">
                    לוח ניהול בית הספר
                </h2>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* עמודה 1 - פרטי בית הספר (בצד ימין) */}
                <div className="space-y-4">
                    {schoolData ? (
                        <div className="bg-white rounded-3xl shadow-md p-6 space-y-4">
                            <p className="text-lg text-slate-800 font-semibold">
                                🏫 שם בית הספר: <span className="font-normal">{schoolData.schoolName}</span>
                            </p>
                            <p className="text-slate-600">קוד: {schoolData.schoolCode}</p>

                            <p className="text-slate-700">
                                מספר מורים:{" "}
                                {schoolData.teacherCount && schoolData.teacherCount > 0
                                    ? <span className="font-bold">{schoolData.teacherCount}</span>
                                    : <span className="text-gray-500">אין כרגע מורים רשומים</span>}
                            </p>

                            <p className="text-slate-700">
                                מספר תלמידים:{" "}
                                {schoolData.studentCount && schoolData.studentCount > 0
                                    ? <span className="font-bold">{schoolData.studentCount}</span>
                                    : <span className="text-gray-500">אין כרגע תלמידים רשומים</span>}
                            </p>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">{messageFromServer}</p>
                    )}
                </div>

                {/* עמודה 2 - אירועים קרובים */}
                {user && (
                    <div>
                        <EventForm/>
                    </div>
                )}

                {/* עמודה 3 - הודעות */}
                {user && (
                    <div>
                        <MessageList userId={user.userId}/>
                    </div>
                )}
            </div>
        </div>

    );


}

export default SchoolManagerDashboard;
