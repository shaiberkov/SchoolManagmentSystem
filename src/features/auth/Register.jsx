
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaKey, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        userId:'',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        userId:'',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        let formErrors = { ...errors };

        if (name === 'username') {
            if (value !== '' && !/^[a-zA-Zא-ת]+$/.test(value)) {
                formErrors.username = 'השם חייב להיות מורכב מאותיות בלבד, ללא מספרים';
            }
            else if (errors.username === 'Username Taken') {
                formErrors.username = '';
            }
            else {
                formErrors.username = '';
            }
        }

        if (name === 'userId') {
            const id = value.trim();
            const isValidIsraeliID = (id) => {
                if (!/^\d{5,9}$/.test(id)) return false;
                let fullId = id.padStart(9, '0');
                let sum = 0;
                for (let i = 0; i < 9; i++) {
                    let num = Number(fullId[i]) * ((i % 2) + 1);
                    if (num > 9) num -= 9;
                    sum += num;
                }
                return sum % 10 === 0;
            };

            if (id !== '' && !isValidIsraeliID(id)) {
                formErrors.userId = 'תעודת זהות לא תקינה';
            // } else if (errors.userId === 'User ID Taken') {
            //     formErrors.userId = '';
            } else {
                formErrors.userId = '';
            }
        }


        if (name === 'email') {
            if (value !== '' && !/\S+@\S+\.\S+/.test(value)) {
                formErrors.email = 'האימייל לא תקין, יש לוודא שהוא כולל @';
            }
            else if (errors.email === 'אימייל זה תפוס'||errors.email === 'אימייל לא תקין') {
                formErrors.email = '';
            }
            else {
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
            }
            else if (errors.confirmPassword === 'סיסמאות לא זהות') {
                formErrors.confirmPassword = '';
            }
            else {
                formErrors.confirmPassword = '';
            }
        }

        if (name === 'phone') {
            if (value !== '' && !/^\d{10}$/.test(value)) {
                formErrors.phone = 'מספר הטלפון חייב לכלול 10 ספרות בלבד';
            }
            else if (errors.phone === 'טלפון זה תפוס') {
                formErrors.phone = '';
            }
            else {
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
            const { username, userId,password, confirmPassword, email, phone } = formData;
            const params = new URLSearchParams({
                username: username,
                userId: userId,
                password: password,
                confirmPassword: confirmPassword,
                email: email,
                phone: phone,
            });

            const response = await axios.post(
                `http://localhost:8080/Learning-App/User/add-user/?${params.toString()}`
            );
            console.log("Response:", response.data);
            if (response.data.success) {
                alert('נרשמת בהצלחה!');
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
        <div>
            <form onSubmit={handleSubmit}>
                <h2>הרשמה</h2>
                <div>
                    <FaUser/>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="שם מלא"
                        required
                    />
                    {errors.username && formData.username && <p>{errors.username}</p>}
                </div>
                <div>
                    <FaUser/>
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="תז"
                        required
                    />
                    {errors.userId && formData.userId && <p>{errors.userId}</p>}
                </div>
                <div>
                    <FaEnvelope/>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="אימייל"
                        required
                    />
                    {errors.email && formData.email && <p>{errors.email}</p>}
                </div>
                <div>
                    <FaPhone/>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="מספר טלפון"
                        required
                    />
                    {errors.phone && formData.phone && <p>{errors.phone}</p>}
                </div>
                <div>
                    <FaLock/>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="סיסמא"
                        required
                    />
                    {errors.password && formData.password && <p>{errors.password}</p>}
                </div>
                <div>
                    <FaKey/>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="אימות סיסמא"
                        required
                    />
                    {errors.confirmPassword && formData.confirmPassword && <p>{errors.confirmPassword}</p>}
                </div>
                <button type="submit" disabled={hasEmptyFields()}>
                    הרשם
                </button>
                <p>
                    יש לך חשבון? <a href="/login">התחבר כאן</a>
                </p>
            </form>
        </div>
    );
}

export default Register;
