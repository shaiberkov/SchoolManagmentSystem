// components/MessageList.jsx
import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";

function MessageList({ userId }) {
    const [messagesList, setMessagesList] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get("token");

    useEffect(() => {
        const getReceivedMessages = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/Learning-App/Message/get-all-recived-messages?userId=${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
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

            const eventSource = new EventSource(
                `http://localhost:8080/Learning-App/notifications/connect?userId=${userId}`
            );

            eventSource.onmessage = (event) => {
                try {
                    const newMessage = JSON.parse(event.data);
                    setMessagesList(prevMessages => [newMessage, ...prevMessages]);
                } catch (err) {
                    console.error("Failed to parse SSE message:", err);
                }
            };

            eventSource.onerror = (err) => {
                console.error("SSE connection error:", err);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        }
    }, [userId]);

    return (
        <div>
            <h2>הודעות</h2>
            {messagesList.length > 0 ? (
                <ul>
                    {messagesList.map((message, index) => (
                        <li key={index}>
                            <p>{new Date(message.sentAt).toLocaleString()} {message.senderName}</p>
                            <p><strong>{message.title}</strong></p>
                            <p>{message.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>אין הודעות להציג.</p>
            )}
        </div>
    );
}

export default MessageList;
