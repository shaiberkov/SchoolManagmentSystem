// components/MessageList.jsx
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {useNotificationContext} from "../../context/NotificationContext.jsx";
import {
    AUTH_HEADER,
    GET_ALL_RECEIVED_MESSAGES, MESSAGE_BASE_PATH, QUESTION,
    SESSION_BASE_PATH, USER_ID,
    VALIDATE_TOKEN
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";

function MessageList({ userId }) {
    const [messagesList, setMessagesList] = useState([]);
    const {messages} = useNotificationContext();
    const cookies = new Cookies();
    const token = cookies.get("token");

    useEffect(() => {
        const getReceivedMessages = async () => {
            try {
                const response = await axios.get(
                    `${MESSAGE_BASE_PATH}${GET_ALL_RECEIVED_MESSAGES}${QUESTION}${USER_ID}${userId}`,

                {
                        headers: {
                            [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                        },
                    }
                );
                const sortedMessages = response.data.data.sort(
                    (a, b) => new Date(b.sentAt) - new Date(a.sentAt)
                );
                setMessagesList(sortedMessages);
            } catch (error) {
                console.error("Failed to fetch received messages:", error);
            }
        };

        if (userId) {
            getReceivedMessages();
        }
    }, [userId]);
    const combinedMessages = [...messages, ...messagesList];

    return (
        <div className="flex justify-center px-4 pt-22 animate-fade-in">
            <div
                className="bg-white rounded-4xl shadow-xl w-full max-w-md overflow-hidden transition-all duration-300 flex flex-col h-[350px]"
                dir="rtl"
            >
                {/* כותרת ירוקה */}
                <div className="bg-green-400 p-4 rounded-t-4xl text-center">
                    <h2 className="text-2xl font-bold text-white">הודעות</h2>
                </div>

                {combinedMessages.length > 0 ? (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pr-1 scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-100 scroll-container">
                        <ul className="space-y-4 mr-3">
                            {combinedMessages.map((message, index) => (
                                <li
                                    key={index}
                                    className="bg-gradient-to-r from-green-100 to-green-50 p-4 rounded-xl shadow-sm hover:shadow-lg transition duration-300 transform hover:scale-[1.01]"
                                >
                                    <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                                        <span>{new Date(message.sentAt).toLocaleString()}</span>
                                        <span className="font-semibold text-green-700">{message.senderName}</span>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">{message.title}</p>
                                    <p className="text-gray-700 mt-1 leading-relaxed break-words">{message.content}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <p className="text-center text-gray-500">אין הודעות להציג.</p>
                    </div>
                )}
            </div>
        </div>
    );

}

export default MessageList;
