import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userId: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { userId, password } = formData;
        const params = new URLSearchParams({
            userId: userId,
            password: password,
        });

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/User/login?${params.toString()}`
            );
            console.log("Response:", response.data);
            if (response.data.success) {
                navigate('/two-factor-auth', { state: { userId: formData.userId } });
            } else {
                setError(response.data.errorCode);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const hasEmptyFields = () => {
        return Object.values(formData).some(value => value.trim() === '');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>התחברות</h2>

                <div>
                    <FaUser />
                    <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="תעודת זהות"
                        required
                    />
                </div>

                <div>
                    <FaLock />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="סיסמא"
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit" disabled={hasEmptyFields()}>התחבר</button>
                <p>
                    אין לך חשבון? <a href="/register">הרשם כאן</a>
                </p>
                <p>
                    שכחת סיסמא? <a href="/reset-password">לחץ כאן לשחזור</a>
                </p>
            </form>
        </div>
    );
}

export default Login;
