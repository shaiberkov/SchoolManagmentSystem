import React, { useEffect, useState } from 'react';
import { FaPhone, FaKey } from 'react-icons/fa';
import Cookies from "universal-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TwoFactorAuthForm() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const userId = location.state?.userId;
    const navigate = useNavigate();
    const cookies = new Cookies();

    useEffect(() => {
        const fetchPhoneNumber = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/Learning-App/User/user/phone?userId=${userId}`);
                if (response.data.phoneNumber) {
                    setPhoneNumber(response.data.phoneNumber);
                }
            } catch (error) {
                console.error('Error fetching phone number:', error);
                setError('שגיאה בשליפת מספר הטלפון');
            }
        };
        if (userId) {
            fetchPhoneNumber();
        }
    }, [userId]);

    useEffect(() => {
        const sendOtp = async () => {
            if (phoneNumber) { // רק אם יש מספר טלפון, שלח OTP
                try {
                    const params = new URLSearchParams({ userId, phoneNumber });
                    const response = await axios.post(`http://localhost:8080/Learning-App/User/send-otp?${params.toString()}`);

                    if (!response.data.success) {
                        setError(response.data.errorCode || 'שגיאה בשליחת קוד אימות');
                    }
                } catch (error) {
                    console.error('Error sending OTP:', error);
                    setError('שגיאה בשליחת קוד אימות');
                }
            }
        };
        sendOtp();
    }, [phoneNumber]);

    const handleCodeChange = (event) => {
        setVerificationCode(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('');

        const params = new URLSearchParams({
            userId: userId,
            otp: verificationCode,
        });

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/User/verify-otp?${params.toString()}`
            );
            if (response.data.success) {
                console.log("Response:", response.data.token);
                cookies.set("token", response.data.token, { path: "/" });
                //TODO לסדר את הסשן בשרת
                //  await axios.post(`http://localhost:8080/users/connect-user?userName=${userName}`)

                //todo עובד אבל ליבדוק את העיניין
                 navigate("/login")
            } else {
                setError('הקוד שהוזן לא נכון. נסה שוב.');
            }
        } catch (error) {
            console.error('Error during OTP verification:', error);
            setError('שגיאה באימות הקוד. נסה שוב מאוחר יותר');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>הכנס את קוד האימות</h2>
                <div>
                    <FaKey />
                    <input
                        type="text"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={handleCodeChange}
                        placeholder="הכנס קוד אימות"
                        required
                    />
                </div>

                {/* הודעת שגיאה */}
                {error && <p>{error}</p>}

                <button type="submit">
                    אמת קוד
                </button>

                <p>
                    הקוד תקף ל-2 דקות בלבד. הקוד נשלח למספר טלפון:
                    {phoneNumber.slice(-3)}******{phoneNumber.slice(0, 3)}
                </p>
            </form>
        </div>
    );
}

export default TwoFactorAuthForm;
