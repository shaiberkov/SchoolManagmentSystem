import {createContext, useContext, useEffect, useRef, useState} from "react";
import { UserContext } from "./UserContext";
import {API_BASE_URL, BASE_API} from "../constants/base.constants.js";
import {CONNECT, NOTIFICATION_BASE_PATH, QUESTION, USER_ID} from "../constants/pages.constants.js";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [tests, setTests] = useState([]);
    const { user } = useContext(UserContext);


    useEffect(() => {
        if (!user?.userId) return;

        const eventSource = new EventSource(
            `${NOTIFICATION_BASE_PATH}${CONNECT}${QUESTION}${USER_ID}${user.userId}`
        );

        eventSource.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data)
                if (data.type === "SYSTEM_MESSAGE") {
                    setMessages(prevMessages => [data.payload.message, ...prevMessages]);
                } else if (data.type === "NEW_TEST") {
                    if (user.role === "STUDENT") {
                        setTests(prevTests => [data.payload.userTestStatusDTO, ...prevTests]);
                    } else {
                        console.warn("User not authorized to receive test notifications");
                    }
                }
            } catch (err) {
                console.error("Failed to parse SSE notification:", err);
            }
        });

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [user?.userId]);

    return (
        <NotificationContext.Provider value={{ messages, tests }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    return useContext(NotificationContext);
}
