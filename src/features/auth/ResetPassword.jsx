import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        const { name, value } = event.target;
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
                `http://localhost:8080/Learning-App/User/forgot-password?userId=${formData.userId}`
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
                `http://localhost:8080/Learning-App/User/reset-password?userId=${formData.userId}&otp=${formData.otp}&newPassword=${formData.newPassword}`
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
        <div>
            <h2>איפוס סיסמה</h2>
            {step === 1 ? (
                <>
                    <div>
                        <input
                            name="userId"
                            type="text"
                            placeholder="תז"
                            value={formData.userId}
                            onChange={setData}
                        />
                        {errors.userId && <p>{errors.userId}</p>}
                    </div>
                    <button onClick={requestOtp} disabled={formData.userId === ""}>שלח קוד לאיפוס סיסמא</button>
                </>
            ) : (
                <>
                    <div>
                        <input
                            name="otp"
                            type="text"
                            placeholder="קוד אימות"
                            value={formData.otp}
                            onChange={setData}
                        />
                        {errors.otp && <p>{errors.otp}</p>}
                    </div>
                    <div>
                        <input
                            name="newPassword"
                            type="password"
                            placeholder="סיסמה חדשה"
                            value={formData.newPassword}
                            onChange={setData}
                        />
                        {errors.password && <p>{errors.password}</p>}
                    </div>
                    <button
                        onClick={resetPassword}
                        disabled={isButtonDisabled}
                    >
                        אפס סיסמה
                    </button>
                </>
            )}
        </div>
    );
}

export default ResetPassword;
