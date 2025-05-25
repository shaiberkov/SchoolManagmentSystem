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
        // <div>
        //     <form onSubmit={handleSubmit}>
        //         <h2>הכנס את קוד האימות</h2>
        //         <div>
        //             <FaKey />
        //             <input
        //                 type="text"
        //                 name="verificationCode"
        //                 value={verificationCode}
        //                 onChange={handleCodeChange}
        //                 placeholder="הכנס קוד אימות"
        //                 required
        //             />
        //         </div>
        //
        //         {/* הודעת שגיאה */}
        //         {error && <p>{error}</p>}
        //
        //         <button type="submit">
        //             אמת קוד
        //         </button>
        //
        //         <p>
        //             הקוד תקף ל-2 דקות בלבד. הקוד נשלח למספר טלפון:
        //             {phoneNumber.slice(-3)}******{phoneNumber.slice(0, 3)}
        //         </p>
        //     </form>
        // </div>

        <div className="flex justify-center px-4 py-10 pt-12 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-green p-8 rounded-4xl shadow-xl w-full max-w-md space-y-4 transition duration-300"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                    הכנס את קוד האימות
                </h2>

                {/* קוד אימות */}
                <div className="relative">
                    <FaKey
                        className="absolute top-3 left-3 text-yellow-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="text"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={handleCodeChange}
                        placeholder="הכנס קוד אימות"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                    />
                    {/*{error && <p className="text-red-500 text-sm mt-1">{error}</p>}*/}
                    {error && (
                        <p className="text-red-500 text-sm mt-1 text-center flex items-center justify-center gap-1">
                             {error}
                        </p>
                    )}

                </div>

                <button
                    type="submit"
                    className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out disabled:opacity-50 overflow-hidden"
                >
                    אמת קוד
                </button>
                <p className="text-sm text-gray-600 text-center mt-2">
                    הקוד תקף ל-2 דקות בלבד. הקוד נשלח למספר טלפון
                    <br/>
                    {phoneNumber.slice(0, 3)}
                    ******
                    {phoneNumber.slice(-3)}
                </p>
            </form>
        </div>
    );
}

export default TwoFactorAuthForm;
