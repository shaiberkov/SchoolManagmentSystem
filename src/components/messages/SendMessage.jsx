import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {UserContext} from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";

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

    return (
        <div>
            <h2>שליחת הודעה</h2>
                <div>
                    <label>סוג נמענים:</label>
                    <select
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                    >
                        <option key="default" value="">בחר נמען</option>
                        {availableRecipientTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>ערך יעד (כיתה, שכבה וכו'):</label>
                    <input
                        type="text"
                        value={recipientValue}
                        onChange={(e) => setRecipientValue(e.target.value)}
                        placeholder="למשל: ט1, ח'"
                    />
                </div>

                <div>
                    <label>כותרת:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label>תוכן ההודעה:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <button onClick={handleSubmit}>שלח הודעה</button>

                {message && <p>{message}</p>}

        </div>
    );
}
export default SendMessage
