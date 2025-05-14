import React, { useRef, useEffect } from "react";

const ChatComponent = ({ messages, userMessage, setUserMessage, sendMessage, isLoading, setIsOpen }) => {
    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsOpen]);

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && userMessage.trim()) {
            sendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [messages]);

    return (
        <div ref={chatRef}>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}:</strong> {message.content}
                    </div>
                ))}
                {isLoading && <div>מקליד AI מרצה...</div>}
                <div ref={messagesEndRef}></div>
            </div>

            <div>
                <input
                    ref={inputRef}
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="כתוב הודעה..."
                />
                <button onClick={sendMessage}>שלח</button>
            </div>
        </div>
    );
};

export default ChatComponent;
