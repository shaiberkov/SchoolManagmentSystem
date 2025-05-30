import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import ChatComponent from "../../components/ChatComponent.jsx";
import Cookies from "universal-cookie";
import {
    AND,
    AUTH_HEADER, CHAT_BASE_PATH, GENERATE_QUESTION, MESSAGE, QUESTION,
    STUDENT_BASE_PATH, SUB_TOPIC, SUBJECT, SUBMIT_ANSWER, TEACHER_ID, TOPIC, USER_ID, WITH_MEMORY
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";

function QuestionPractice(){


    const { subjectName, topicName, exerciseName } = useParams();
    const { user } = useContext(UserContext);
    const [exercise, setExercise] = useState({});
    const [answer, setAnswer] = useState("");
    const [responseMessage, setResponseMessage] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [newMessages, setNewMessages] = useState(0);
    const [isDrawing, setIsDrawing] = useState(false);
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const cookies = new Cookies();
    const token=cookies.get('token')
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.lineJoin = "round";
    }, []);

    const handleMouseDown = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        setIsDrawing(true);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000";
        ctx.lineJoin = "round";
        ctx.beginPath();
    };

    const handleSaveDrawing = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL("image/png");
        console.log("תמונה שנשמרה:", image);
    };


    const fetchData = async () => {
        console.log(user.name,"ביקשתי שאלה")
         setMessages([]);

        const response = await axios.get(
            `${STUDENT_BASE_PATH}${GENERATE_QUESTION}${QUESTION}${USER_ID}${user.userId}${AND}${SUBJECT}${subjectName}${AND}${TOPIC}${topicName}${AND}${SUB_TOPIC}${exerciseName}`,
            {
                headers: {
                    [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                }
            });
        if (response.data) {
            setExercise(response.data.data);
        }
    };

    useEffect(() => {
        if(user?.userId){
            fetchData();
        }
    }, [subjectName, topicName,user.userId]);

    const submitAnswer = async () => {
        try {
            const { id, subTopic} = exercise;
            const params = new URLSearchParams({
                userId: user.userId,
                id: id,
                subTopic: subTopic,
                answer: answer
            });

            const response = await axios.post(
                `${STUDENT_BASE_PATH}${SUBMIT_ANSWER}${QUESTION}${params.toString()}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );
            setResponseMessage(response.data.data.message);
            setIsCorrect(response.data.data.correct);
            fetchData();
            setAnswer("");
            return response.data.data;
        } catch (error) {
            console.error("שגיאה בשליחת התשובה:", error);
        }
    };


    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        setNewMessages(0);
    };

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "user", content: userMessage },
        ]);
        setUserMessage("");
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${CHAT_BASE_PATH}${WITH_MEMORY}${QUESTION}${USER_ID}${user.userId}${AND}${MESSAGE}${userMessage}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    }
                }
            );

            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "chatgpt", content: response.data },
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                sender: "chatgpt",
                content: "Failed to get response from ChatGPT.",
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-8 font-sans  mt-20">
            <section className="exercise-page text-center max-w-xl mx-auto space-y-6 animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                    תרגיל: {exerciseName}
                </h2>

                {exercise && (
                    <>
                        <h4 className="text-base sm:text-lg font-medium text-slate-700">
                            {exercise.questionText}
                        </h4>

                        <input
                            type="text"
                            placeholder="תשובה"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            onClick={submitAnswer}
                            disabled={!answer}
                            className="mt-3 px-6 py-2 rounded-lg font-semibold text-white
                       bg-gradient-to-r from-blue-500 to-green-500 shadow
                       hover:from-blue-600 hover:to-green-600 transition-colors
                       disabled:opacity-50"
                        >
                            שלח תשובה
                        </button>
                    </>
                )}

                {responseMessage && (
                    <p
                        className={`text-sm sm:text-base font-semibold ${
                            isCorrect ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {responseMessage}
                    </p>
                )}

                <div className="flex flex-col items-center gap-3">
                    <canvas
                        ref={canvasRef}
                        width={500}
                        height={300}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => setIsDrawing(false)}
                        className="w-full sm:w-[500px] h-52 sm:h-[300px]
                     border-2 border-gray-400 rounded-lg shadow-md bg-white"
                    />
                    <button
                        onClick={handleClearCanvas}
                        className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
                    >
                        נקה
                    </button>
                </div>
            </section>

            <button
                onClick={toggleChat}
                className="fixed bottom-4 left-4 flex items-center gap-2
                 px-5 py-2 rounded-full text-white font-semibold shadow-lg
                 bg-gradient-to-r from-blue-600 to-green-500
                 hover:from-blue-700 hover:to-green-600 transition
                 animate-bounce"
            >
                📢 צ'אט
        {/*        {newMessages > 0 && (*/}
        {/*            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs">*/}
        {/*  {newMessages}*/}
        {/*</span>*/}
        {/*        )}*/}
            </button>


            {isChatOpen && (
                <div
                    className="fixed bottom-24 left-4 w-96 max-w-[95vw] h-[50vh] sm:h-[450px] flex flex-col
        bg-white border border-gray-300 rounded-xl shadow-2xl z-50
        animate-[slide-up_0.5s_ease-out]"
                >


                    <header className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-blue-100 to-green-100
    border-b rounded-t-xl shadow-sm">

                        <div className="flex items-center gap-2 rtl:space-x-reverse">
                            <span className="text-xl">📚</span>
                            <span className="font-semibold text-base text-slate-700 tracking-wide">
            צ'אט עם מורה
        </span>
                        </div>

                        <button
                            onClick={toggleChat}
                            className="text-slate-500 hover:text-red-500 transition-colors text-xl font-bold"
                            title="סגור"
                        >
                            ✖️
                        </button>
                    </header>


                    {/* גוף הצ'אט – גלילה פנימית */}
                    <main className="flex-1 overflow-y-auto  rounded-b-xl">
                        <ChatComponent
                            messages={messages}
                            userMessage={userMessage}
                            setUserMessage={setUserMessage}
                            sendMessage={sendMessage}
                            isLoading={isLoading}
                            setIsOpen={setIsChatOpen}
                        />
                    </main>
                </div>
            )}

        </div>
    );

}
export default QuestionPractice;