
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import Cookies from "universal-cookie";
import MessageList from "../../components/messages/MessageList.jsx";
import {getGreeting} from "../../Utils/Greeting.jsx";
import {FaClipboardList, FaPlusCircle, FaSchool} from "react-icons/fa";
import EventForm from "../../components/EventForm.jsx";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    AUTH_HEADER,
    GET_ALL_SCHOOLS,
    SYSTEM_ADMIN_BASE_PATH
} from "../../constants/pages.constants.js";



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
                `${SYSTEM_ADMIN_BASE_PATH}${GET_ALL_SCHOOLS}`,
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
            console.error("שגיאה בשליפת בתי ספר:", error);
            setMessageFromServer("אירעה שגיאה בחיבור לשרת");
        }
    };

    useEffect(() => {
       if (user) getSchoolData();
    }, [user?.userId]);



    const handleRegisterSchool = () => {
        navigate("/school-registration");
    };

    return (
        <div className="min-h-screen p-4 sm:p-8" dir="rtl">
            <header className="max-w-6xl mx-auto mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
                    {getGreeting()}, {user.username}
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-green-600 mt-2">
                    לוח ניהול מערכת
                </h2>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-10">
                    <section className="grid gap-6 sm:grid-cols-2">
                        <div className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-4">
                            <FaSchool className="text-4xl text-green-500" />
                            <div>
                                <p className="text-sm text-gray-500">מספר בתי ספר רשומים</p>
                                {schoolData.length>0&& (
                                    <p className="text-3xl font-extrabold text-slate-800">{schoolData.length}</p>
                                )}

                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-lime-400 to-green-500 rounded-3xl shadow-md p-6 flex flex-col justify-between text-white">
                            <div className="flex items-center gap-3">
                                <FaPlusCircle className="text-4xl" />
                                <p className="text-lg font-semibold">רישום בית ספר חדש</p>
                            </div>
                            <button
                                onClick={handleRegisterSchool}
                                className="mt-6 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-xl transition"
                            >
                                ➕ הוסף בית ספר
                            </button>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FaClipboardList className="text-xl text-slate-600" />
                            <h3 className="text-xl font-bold text-slate-700">רשימת בתי ספר</h3>
                        </div>

                        {schoolData.length > 0 ? (
                            <ul className="space-y-3">
                                {schoolData.map((school, idx) => (
                                    <li
                                        key={idx}
                                        className="bg-white flex justify-between items-center p-4 rounded-xl shadow-sm hover:shadow-lg transition"
                                    >
                                        <span className="font-semibold text-slate-800">{school.schoolName}</span>
                                        <span className="text-sm text-gray-600">({school.schoolCode})</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">{messageFromServer}</p>
                        )}
                    </section>
                </div>


                {user && (
                    <div className="lg:col-span-1 mt-[-40px]">
                        <MessageList userId={user.userId} />
                    </div>
                )}
                {user && <EventForm />}
            </div>
        </div>
    );

}
