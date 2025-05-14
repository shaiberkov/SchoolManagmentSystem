import {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import {useParams} from "react-router-dom";
import axios from "axios";
import ChatComponent from "../../components/ChatComponent.jsx";

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

        const response = await axios.get(`http://localhost:8080/Learning-App/Student/generate-question?userId=${user.userId}&subject=${subjectName}&topic=${topicName}&subTopic=${exerciseName}`);
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
                `http://localhost:8080/Learning-App/Student/submit-answer?${params.toString()}`
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
                `http://localhost:8080/Learning-App/Chat/get-response-from-chatGpt-with-memory?userId=${user.userId}&message=${userMessage}`
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
        <div style={{ padding: '20px' }}>
            <div className="exercise-page" style={{ textAlign: 'center' }}>
                <h2>תרגיל: {exerciseName}</h2>

                {exercise && (
                    <>
                        <h4>{exercise.questionText}</h4>
                        <input
                            type="text"
                            placeholder="תשובה"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={submitAnswer} disabled={!answer}>
                                שלח תשובה
                            </button>
                        </div>
                    </>
                )}

                {responseMessage && (
                    <p style={{ marginTop: '15px', color: isCorrect ? 'green' : 'red' }}>
                        {responseMessage}
                    </p>
                )}

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <canvas
                        ref={canvasRef}
                        width="500"
                        height="300"
                        style={{ border: '1px solid black' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={() => setIsDrawing(false)}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={handleClearCanvas}>נקה</button>
                    </div>
                </div>
            </div>

            <div style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
                <button onClick={toggleChat}>
                    צ'אט
                </button>
            </div>

            {isChatOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '90px',
                    left: '20px',
                    width: '400px',
                    height: '450px',
                    backgroundColor: 'white',
                    overflow: 'hidden'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>📚</span>
                            <span>צ'אט עם מורה</span>
                        </div>
                        <button onClick={toggleChat}>✖️</button>
                    </div>

                    <div style={{ flex: 1 }}>
                        <ChatComponent
                            messages={messages}
                            userMessage={userMessage}
                            setUserMessage={setUserMessage}
                            sendMessage={sendMessage}
                            isLoading={isLoading}
                            setIsOpen={setIsChatOpen}
                        />
                    </div>
                </div>
            )}

            {/*<div style={{ position: 'fixed', top: '80px', right: '30px', zIndex: 1000 }}>*/}
            {/*    <div style={{*/}
            {/*        padding: '10px',*/}
            {/*        backgroundColor: '#f0f0f0',*/}
            {/*        border: '1px solid #ccc',*/}
            {/*        borderRadius: '8px'*/}
            {/*    }}>*/}
            {/*        <p>נתקלת בקושי בשאלה? דבר עם מורה!</p>*/}
            {/*        <button onClick={openChat}>*/}
            {/*            <BsChatDots /> דבר עם המורה הפרטי שלך*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>

    )

}
export default QuestionPractice;