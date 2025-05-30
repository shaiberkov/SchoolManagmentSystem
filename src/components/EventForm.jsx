import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import Cookies from "universal-cookie";
import axios from "axios";
import {FaCalendarAlt} from "react-icons/fa";
import {
    AND,
    AUTH_HEADER,
    GET_UPCOMING_EVENTS,
    QUESTION, ROLE, UPCOMING_EVENTS_BASE_PATH,
    USER_ID
} from "../constants/pages.constants.js";
import {BEARER_PREFIX} from "../constants/shared.constant.js";
function EventForm() {
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user ) return;

        const fetchEvents = async () => {

            const url =`${UPCOMING_EVENTS_BASE_PATH}${GET_UPCOMING_EVENTS}${QUESTION}${ROLE}${user.role}${AND}${USER_ID}${user.userId}`
            try {
                const response = await axios.get(url, {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`,
                        Accept: "application/json",
                    },
                });
                setEvents(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "שגיאה בבקשת האירועים");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    if (loading) return <p>טוען אירועים...</p>;
    if (error) return <p>שגיאה: {error}</p>;

    return (
    <div
        className="max-w-md mx-auto  mb-8 p-4 bg-white rounded-3xl shadow-xl space-y-4"
        dir="rtl"
    >
        <div className="flex items-center justify-center gap-2 bg-green-100 py-2 px-4 rounded-xl shadow-inner">
            <FaCalendarAlt className="text-green-600 text-xl transition-transform duration-300 hover:rotate-12 hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.6)] hover:brightness-125" />
            <h2 className="text-xl font-bold text-green-800">האירועים הקרובים שלך</h2>
        </div>

        <div className="max-h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 rounded-xl">
            {events.length === 0 ? (
                <p className="text-center text-gray-500">אין אירועים קרובים</p>
            ) : (
                <ul className="space-y-3">
                    {events.map((event, index) => (
                        <li
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                        >
                            <div className="text-base font-semibold text-green-700">
                                {event.eventName}
                            </div>
                            <div className="text-sm text-gray-500">בעוד {event.eventInDays}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>

);
}

export default EventForm;
