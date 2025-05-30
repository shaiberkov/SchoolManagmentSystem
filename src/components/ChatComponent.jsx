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
        <div ref={chatRef} className="flex flex-col h-full bg-white  border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                            message.sender === "user"
                                ? "bg-blue-100 self-end text-right ml-auto"
                                : "bg-gray-100 self-start text-left mr-auto"
                        }`}
                    >
                        <strong className="block text-xs text-gray-500 mb-1">{message.sender === "user" ? "אתה" : "מרצה AI"}:</strong>
                        {message.content}
                    </div>
                ))}
                {isLoading && (
                    <div className="text-sm text-gray-500 animate-pulse">מרצה AI מקליד...</div>
                )}
                <div ref={messagesEndRef}></div>
            </div>

            <div className="p-3 border-t border-gray-300 bg-gray-50 flex items-center"
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="כתוב הודעה..."
                    className="flex-1 px-3  py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    dir="rtl"
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
                >
                    שלח
                </button>
            </div>
        </div>
    );

};

export default ChatComponent;
