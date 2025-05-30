import React, {useState} from 'react';
import {FaUser, FaEnvelope, FaLock, FaKey, FaPhone} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import {ADD_USER, LOGIN, QUESTION, USER_BASE_PATH} from "../../constants/pages.constants.js";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        userId: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        userId: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        let formErrors = {...errors};

        if (name === 'username') {
            if (value !== '' && !/^[a-zA-Zא-ת\s]+$/.test(value)) {
                formErrors.username = 'השם חייב להיות מורכב מאותיות בלבד, ללא מספרים';
            } else if (errors.username === 'Username Taken') {
                formErrors.username = '';
            } else {
                formErrors.username = '';
            }
        }

        if (name === 'userId') {
            const id = value.trim();
            const isValidIsraeliID = (id) => {
                // if (!/^\d{5,9}$/.test(id)) return false;
                // let fullId = id.padStart(9, '0');
                // let sum = 0;
                // for (let i = 0; i < 9; i++) {
                //     let num = Number(fullId[i]) * ((i % 2) + 1);
                //     if (num > 9) num -= 9;
                //     sum += num;
                // }
                // return sum % 10 === 0;
                return true
            };

            if (id !== '' && !isValidIsraeliID(id)) {
                formErrors.userId = 'תעודת זהות לא תקינה';

            } else {
                formErrors.userId = '';
            }
        }


        if (name === 'email') {
            if (value !== '' && !/\S+@\S+\.\S+/.test(value)) {
                formErrors.email = 'האימייל לא תקין, יש לוודא שהוא כולל @';
            } else if (errors.email === 'אימייל זה תפוס' || errors.email === 'אימייל לא תקין') {
                formErrors.email = '';
            } else {
                formErrors.email = '';
            }
        }

        if (name === 'password') {
            if (value !== '' && !/(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(value)) {
                formErrors.password = 'הסיסמא חייבת לכלול לפחות אות גדולה וקטנה, ו-6 תווים לפחות';
            } else {
                formErrors.password = '';
            }
        }

        if (name === 'confirmPassword') {
            if (value !== '' && value !== formData.password) {
                formErrors.confirmPassword = 'הסיסמאות לא תואמות';
            } else if (errors.confirmPassword === 'סיסמאות לא זהות') {
                formErrors.confirmPassword = '';
            } else {
                formErrors.confirmPassword = '';
            }
        }

        if (name === 'phone') {
            if (value !== '' && !/^\d{10}$/.test(value)) {
                formErrors.phone = 'מספר הטלפון חייב לכלול 10 ספרות בלבד';
            } else if (errors.phone === 'טלפון זה תפוס') {
                formErrors.phone = '';
            } else {
                formErrors.phone = '';
            }
        }

        setErrors(formErrors);
    };

    const validateForm = () => {
        return Object.values(errors).every(error => error === '') &&
            Object.values(formData).every(value => value !== '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const {username, userId, password, confirmPassword, email, phone} = formData;
            const params = new URLSearchParams({
                username: username,
                userId: userId,
                password: password,
                confirmPassword: confirmPassword,
                email: email,
                phone: phone,
            });

            const response = await axios.post(
                `${USER_BASE_PATH}${ADD_USER}${QUESTION}${params.toString()}`

            );
            console.log("Response:", response.data);
            if (response.data.success) {
                navigate('/login');
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    userId: response.data.idTaken || '',
                    email: response.data.emailTaken || '',
                    phone: response.data.phoneTaken || '',
                    password: response.data.passwordDontMatch || '',
                    confirmPassword: response.data.passwordDontMatch || '',
                }));

            }

        } catch (error) {
            console.error("Error during the request:", error);
            alert('אירעה שגיאה במהלך שליחת הבקשה.');
        }
    };

    const hasEmptyFields = () => {
        return Object.values(formData).some(value => value.trim() === '');
    };

    return (

        <div className="flex justify-center mt-15 px-4 py-10 pt-12 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-green p-8 rounded-4xl shadow-xl w-full max-w-md space-y-4 transition duration-300"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
                    הרשמה
                </h2>

                {/* שם משתמש */}
                <div className="relative">
                    <FaUser
                        className="absolute top-3 left-3 text-blue-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="שם מלא"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    />
                    {errors.username && formData.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                {/* ת"ז */}
                <div className="relative">
                    <FaUser
                        className="absolute top-3 left-3 text-purple-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="תז"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
                    />
                    {errors.userId && formData.userId && (
                        <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
                    )}
                </div>

                {/* אימייל */}
                <div className="relative">
                    <FaEnvelope
                        className="absolute top-3 left-3 text-orange-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="אימייל"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                    />
                    {errors.email && formData.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                {/* טלפון */}
                <div className="relative">
                    <FaPhone
                        className="absolute top-3 left-3 text-green-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="מספר טלפון"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
                    />
                    {errors.phone && formData.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* סיסמה */}
                <div className="relative">
                    <FaLock
                        className="absolute top-3 left-3 text-red-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="סיסמא"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                    />
                    {errors.password && formData.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                {/* אימות סיסמה */}
                <div className="relative">
                    <FaKey
                        className="absolute top-3 left-3 text-cyan-500 drop-shadow-md hover:scale-120 transition duration-200"/>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="אימות סיסמא"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
                    />
                    {errors.confirmPassword && formData.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.confirmPassword}
                        </p>
                    )}
                </div>


                <button
                    type="submit"
                    disabled={hasEmptyFields()}
                    className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out disabled:opacity-50 overflow-hidden"
                >
                        <span
                            className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                    <span className="z-10 relative">הרשם</span>
                </button>

                <p className="text-center text-sm text-gray-700 mt-6">
                    <a
                        href="/login"
                        className="inline-block text-green-500 font-semibold relative group transition duration-300"
                    >

                        <span
                            className="absolute left-0 bottom-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"/>

                        <span
                            className="relative z-10 group-hover:text-green-800 flex items-center justify-center gap-1">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                 😀
                         </span>
                            התחבר כאן
                            </span>
                    </a>{" "}?
                    אם כבר יש לך חשבון
                </p>


            </form>
        </div>

    );
}

export default Register;
