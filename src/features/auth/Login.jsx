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


//         <div>
//             <form onSubmit={handleSubmit}>
//                 <h2>התחברות</h2>
//
//                 <div>
//                     <FaUser />
//                     <input
//                         type="text"
//                         name="userId"
//                         value={formData.userId}
//                         onChange={handleChange}
//                         placeholder="תעודת זהות"
//                         required
//                     />
//                 </div>
//
//                 <div>
//                     <FaLock />
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="סיסמא"
//                         required
//                     />
//                 </div>
//
//                 {error && <p>{error}</p>}
//
//                 <button type="submit" disabled={hasEmptyFields()}>התחבר</button>
//                 <p>
//                     אין לך חשבון? <a href="/register">הרשם כאן</a>
//                 </p>
//                 <p>
//                     שכחת סיסמא? <a href="/reset-password">לחץ כאן לשחזור</a>
//                 </p>
//             </form>
//         </div>
//     );
    return (
        <div className="flex justify-center py-10 px-4 pt-12 animate-fade-in">
            <form
                onSubmit={handleSubmit}
                className="bg-green p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5 transition duration-300"
            >
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                    התחברות
                </h2>

                {/* ת״ז */}
                <div className="relative">
                    <FaUser
                        className="absolute top-3 left-3 text-blue-500 drop-shadow-md hover:scale-110 transition duration-200"/>
                    <input
                        type="text"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        placeholder="תעודת זהות"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                    />
                </div>

                {/* סיסמה */}
                <div className="relative">
                    <FaLock
                        className="absolute top-3 left-3 text-red-500 drop-shadow-md hover:scale-110 transition duration-200"/>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="סיסמא"
                        required
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                    />
                </div>

                {error && (
                    <p className="text-center text-red-500 text-sm -mt-2">{error}</p>
                )}
                <button
                    type="submit"
                    disabled={hasEmptyFields()}
                    /* בסיס הכפתור */
                    className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400
             text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600
             transition-colors duration-300 ease-in-out disabled:opacity-50 overflow-hidden group"
                >
                    {/* SHIMMER WRAPPER – keeps overflow hidden */}
                    <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
    {/* MOVING HIGHLIGHT */}
                        <span
                            className="absolute -top-1/2 -left-[140%] w-[140%] h-[200%]
                 bg-gradient-to-r from-transparent via-white/70 to-transparent
                 [mask-image:linear-gradient(120deg,transparent_45%,black_50%,transparent_55%)]
                 opacity-0 group-hover:opacity-100
                 group-hover:animate-[shine_1.8s_cubic-bezier(0.4,0,0.2,1)_both] "
                        />
  </span>

                    {/* טקסט הכפתור */}
                    <span className="relative z-10">התחבר</span>
                </button>

                {/*<button*/}
                {/*    type="submit"*/}
                {/*    disabled={hasEmptyFields()}*/}
                {/*    className="w-full relative py-2 rounded-lg bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out disabled:opacity-50 overflow-hidden"*/}
                {/*>*/}

                {/*    <span className="absolute inset-0 rounded-lg bg-white opacity-0 hover:opacity-10 transition-opacity duration-300" />*/}
                {/*    <span className="relative z-10">התחבר</span>*/}
                {/*</button>*/}

                {/* קישור להרשמה */}
                <p className="text-center text-sm text-gray-700 mt-6">
                    <a
                        href="/register"
                        className="inline-block text-green-500 font-semibold relative group transition duration-300"
                    >
                        <span
                            className="absolute left-0 bottom-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"/>
                        <span className="relative z-10 group-hover:text-green-800 flex items-center gap-1">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                😀
              </span>
              הרשם כאן
            </span>
                    </a>{" "}
                    אם עדיין אין לך חשבון
                </p>

                {/* קישור לשחזור סיסמה */}
                <p className="text-center text-sm text-gray-600 mt-2">
                    שכחת סיסמה?{" "}
                    <a
                        href="/reset-password"
                        className="text-green-500 font-medium hover:underline transition-colors duration-200"
                    >
                        לחץ כאן לשחזור
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;
