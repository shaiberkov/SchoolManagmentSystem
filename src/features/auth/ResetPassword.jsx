import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {FaKey, FaLock, FaUser} from "react-icons/fa";
import {
    AND,
    FORGOT_PASSWORD,
    LOGIN, NEW_PASSWORD, OTP,
    QUESTION,
    RESET_PASSWORD,
    USER_BASE_PATH,
    USER_ID
} from "../../constants/pages.constants.js";

function ResetPassword() {
    const [formData, setFormData] = useState({
        userId: "",
        otp: "",
        newPassword: "",
    });

    const [errors, setErrors] = useState({
        userId: "",
        otp: "",
        password: "",
    });

    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const validatePassword = (value) => {
        if (value !== '' && !/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value)) {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: "הסיסמא חייבת לכלול לפחות אות גדולה וקטנה, ו-6 תווים לפחות"
            }));
        } else {
            setErrors(prevErrors => ({
                ...prevErrors,
                password: ""
            }));
        }
    };

    const setData = (event) => {
        const {name, value} = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "newPassword") {
            validatePassword(value);
        }
    };

    const requestOtp = async () => {
        try {
            const response = await axios.post(
                // `http://localhost:8080/Learning-App/User/forgot-password?userId=${formData.userId}`
                `${USER_BASE_PATH}${FORGOT_PASSWORD}${QUESTION}${USER_ID}${formData.userId}`

            );
            if (response.data.success) setStep(2);
            else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    userId: response.data.userIdError || ''
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const resetPassword = async () => {
        try {
            const response = await axios.post(
                // `http://localhost:8080/Learning-App/User/reset-password?userId=${formData.userId}&otp=${formData.otp}&newPassword=${formData.newPassword}`
                `${USER_BASE_PATH}${RESET_PASSWORD}${QUESTION}${USER_ID}${formData.userId}${AND}${OTP}${formData.otp}${AND}"newPasswor${NEW_PASSWORD}="${formData.newPassword}`

            );

            if (response.data.success) {
                navigate('/login');
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    otp: response.data.otpError || '',
                    password: response.data.passwordError || ''
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const isButtonDisabled = errors.password || !formData.newPassword || !formData.otp || !formData.userId;
    return (
        <div className="flex justify-center  px-4 pt-12 animate-fade-in">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-green p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 transition duration-300"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    איפוס סיסמה
                </h2>

                {step === 1 ? (
                    <>
                        {/* ת״ז */}
                        <div className="relative">
                            <FaUser
                                className="absolute top-3 left-3 text-blue-500 drop-shadow-md hover:scale-110 transition duration-200"/>
                            <input
                                name="userId"
                                type="text"
                                placeholder="תעודת זהות"
                                value={formData.userId}
                                onChange={setData}
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                            />
                            {errors.userId && (
                                <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
                            )}
                        </div>

                        <button
                            onClick={requestOtp}
                            disabled={formData.userId === ""}
                            className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out disabled:opacity-50 overflow-hidden"
                        >
                            <span
                                className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"/>
                            <span className="relative z-10">שלח קוד לאיפוס סיסמה</span>
                        </button>
                    </>
                ) : (
                    <>
                        {/* קוד אימות */}
                        <div className="relative">
                            <FaKey
                                className="absolute top-3 left-3 text-yellow-500 drop-shadow-md hover:scale-110 transition duration-200"/>
                            <input
                                name="otp"
                                type="text"
                                placeholder="קוד אימות"
                                value={formData.otp}
                                onChange={setData}
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
                            />
                            {errors.otp && (
                                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                            )}
                        </div>

                        {/* סיסמה חדשה */}
                        <div className="relative">
                            <FaLock
                                className="absolute top-3 left-3 text-red-500 drop-shadow-md hover:scale-110 transition duration-200"/>
                            <input
                                name="newPassword"
                                type="password"
                                placeholder="סיסמה חדשה"
                                value={formData.newPassword}
                                onChange={setData}
                                required
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            onClick={resetPassword}
                            disabled={isButtonDisabled}
                            className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out disabled:opacity-50 overflow-hidden"
                        >
                            <span
                                className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"/>
                            <span className="relative z-10">אפס סיסמה</span>
                        </button>
                    </>
                )}
            </form>
        </div>
    );
}
export default ResetPassword;
