import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {UserContext} from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import {FaEnvelopeOpenText, FaPaperPlane} from "react-icons/fa";

function SendMessage() {
    const { user } = useContext(UserContext);

    const [recipientType, setRecipientType] = useState('');
    const [recipientValue, setRecipientValue] = useState('');
    const [availableRecipientTypes, setAvailableRecipientTypes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchRecipientTypes = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/Learning-App/Message/recipient-types?userId=${user.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                if(res.data.success){
                    setAvailableRecipientTypes(res.data.data);
                }else {
                    setMessage(res.data.errorCode)
                }

            } catch (err) {
                console.error('Failed to fetch recipient types', err);
            }
        };

        if (user) fetchRecipientTypes();
    }, [user]);

    const handleSubmit = async () => {

        try {
            const res = await axios.post(`http://localhost:8080/Learning-App/Message/send-message?senderId=${user.userId}&recipientType=${recipientType}&recipientValue=${recipientValue}&title=${title}&content=${content}`
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                    console.log(res)
            setMessage(res.data.errorCode);
        } catch (err) {
            setMessage('שגיאה בשליחת ההודעה');
            console.error(err);
        }
    };

    // return (
    //     <div>
    //         <h2>שליחת הודעה</h2>
    //             <div>
    //                 <label>סוג נמענים:</label>
    //                 <select
    //                     value={recipientType}
    //                     onChange={(e) => setRecipientType(e.target.value)}
    //                 >
    //                     <option key="default" value="">בחר נמען</option>
    //                     {availableRecipientTypes.map((type) => (
    //                         <option key={type} value={type}>{type}</option>
    //                     ))}
    //                 </select>
    //             </div>
    //
    //             {/*<div>*/}
    //             {/*    <label>ערך יעד (כיתה, שכבה וכו'):</label>*/}
    //             {/*    <input*/}
    //             {/*        type="text"*/}
    //             {/*        value={recipientValue}*/}
    //             {/*        onChange={(e) => setRecipientValue(e.target.value)}*/}
    //             {/*        placeholder="למשל: ט1, ח'"*/}
    //             {/*    />*/}
    //             {/*</div>*/}
    //
    //             <div>
    //                 <label>כותרת:</label>
    //                 <input
    //                     type="text"
    //                     value={title}
    //                     onChange={(e) => setTitle(e.target.value)}
    //                 />
    //             </div>
    //
    //             <div>
    //                 <label>תוכן ההודעה:</label>
    //                 <textarea
    //                     value={content}
    //                     onChange={(e) => setContent(e.target.value)}
    //                 />
    //             </div>
    //
    //             <button onClick={handleSubmit}>שלח הודעה</button>
    //
    //             {message && <p>{message}</p>}
    //
    //     </div>
    // );

    return (
        <div className="max-w-md mx-auto mb-8 mt-10 p-6 bg-white rounded-3xl shadow-lg space-y-6" dir="rtl">
            <h2 className="text-2xl font-bold text-center text-blue-600 flex items-center justify-center gap-2">
                <FaEnvelopeOpenText />
                שליחת הודעה
            </h2>

            {/* סוג נמענים */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">סוג נמענים:</label>
                <select
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option key="default" value="">בחר נמען</option>
                    {availableRecipientTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* כותרת */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">כותרת:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="כתוב כותרת"
                />
            </div>

            {/* תוכן ההודעה */}
            <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-700">תוכן ההודעה:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-none"
                    placeholder="כתוב את ההודעה כאן..."
                />
            </div>

            {/* כפתור שליחה */}
            <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold py-2 rounded-xl shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg transition duration-300 flex items-center justify-center gap-2"
            >
                <FaPaperPlane />
                שלח הודעה
            </button>

            {/* הודעת הצלחה או שגיאה */}
            {message && (
                <p className="text-center text-blue-600 font-semibold">{message}</p>
            )}
        </div>
    );
}
export default SendMessage
