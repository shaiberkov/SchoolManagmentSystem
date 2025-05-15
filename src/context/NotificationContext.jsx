// NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext"; // ← נניח שזה מחזיר את user עם שדה role

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [tests, setTests] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user?.userId) return;

        const eventSource = new EventSource(
            `http://localhost:8080/Learning-App/notifications/connect?userId=${user.userId}`
        );

        eventSource.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data)
                if (data.type === "SYSTEM_MESSAGE") {
                    setMessages(prevMessages => [data.payload, ...prevMessages]);
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
    }, [user?.userId, user?.role]);

    return (
        <NotificationContext.Provider value={{ messages, tests }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    return useContext(NotificationContext);
}
