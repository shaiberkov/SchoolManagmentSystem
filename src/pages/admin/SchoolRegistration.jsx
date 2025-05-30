import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaUser, FaSchool, FaKey } from "react-icons/fa";

import Cookies from "universal-cookie";
import {
    ADD_NEW_SCHOOL_TO_SYSTEM,
    ASSIGN_SCHOOL_MANAGER, ASSIGN_SCHOOL_MANAGER_TO_SCHOOL, AUTH_HEADER,
    SYSTEM_ADMIN_BASE_PATH
} from "../../constants/pages.constants.js";
import {BEARER_PREFIX} from "../../constants/shared.constant.js"; // Universal Cookies

function SchoolRegistration() {
    const [userId, setUserId] = useState("");
    const [schoolCode, setSchoolCode] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [userIdError, setUserIdError] = useState("");
    const [schoolCodeError, setSchoolCodeError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const cookies = new Cookies();

    const assignSchoolManager = async () => {
        setUserIdError("");
        setSchoolCodeError("");
        setMessage("");

        if (!userId || !schoolCode || !schoolName) {
            setMessage("אנא מלא את כל השדות");
            return;
        }

        try {
            const token = cookies.get("token");

            const assignResponse = await axios.post(
                `${SYSTEM_ADMIN_BASE_PATH}${ASSIGN_SCHOOL_MANAGER}`,
                new URLSearchParams({ userId }),
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                    },
                }
            );

            if (!assignResponse.data.success) {
                setUserIdError(assignResponse.data.errorCode || "שגיאה במינוי המנהל");
                return;
            }

            const addSchoolResponse = await axios.post(

                `${SYSTEM_ADMIN_BASE_PATH}${ ADD_NEW_SCHOOL_TO_SYSTEM}`,
                new URLSearchParams({ schoolName, schoolCode }),
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`

                    },
                }
            );

            if (addSchoolResponse.data.success) {
                setMessage("בית הספר נוסף והמנהל מונה בהצלחה!");

                const connectResponse = await axios.post(

                    `${SYSTEM_ADMIN_BASE_PATH}${ASSIGN_SCHOOL_MANAGER_TO_SCHOOL}`,
                    new URLSearchParams({ userId, schoolCode }),
                    {
                        headers: {
                            [AUTH_HEADER]: `${BEARER_PREFIX}${token}`

                        },
                    }
                );

                if (connectResponse.data.success) {
                    setMessage(connectResponse.data.errorCode);

                } else {
                    setMessage(connectResponse.data.errorCode || "שגיאה בשיוך המנהל לבית הספר");
                }
            } else {
                setSchoolCodeError(addSchoolResponse.data.errorCode || "שגיאה בהוספת בית הספר");
            }

        } catch (err) {
        }
    };


    return (
        <div
            className="max-w-md mx-auto mt-10 mb-8 p-6 bg-white rounded-3xl shadow-lg space-y-5"
            dir="rtl"
        >
            <h2 className="text-2xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
                מינוי מנהל והוספת בית ספר
            </h2>

            <div>
                <div
                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaUser
                        className="text-gray-400 transition-transform duration-300 hover:scale-[1.2] hover:text-blue-400"/>
                    <input
                        type="text"
                        placeholder="מזהה משתמש"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
                {userIdError && (
                    <p className="text-red-500 text-sm mt-1">{userIdError}</p>
                )}
            </div>

            <div>
                <div
                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaSchool
                        className="text-gray-400 transition-transform duration-300 hover:scale-[1.2] hover:text-blue-400"/>
                    <input
                        type="text"
                        placeholder="שם בית הספר"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
            </div>

            <div>
                <div
                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaKey
                        className="text-gray-400 transition-transform duration-300 hover:scale-[1.2] hover:text-blue-400"/>
                    <input
                        type="text"
                        placeholder="קוד בית הספר"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
                {schoolCodeError && (
                    <p className="text-red-500 text-sm mt-1">{schoolCodeError}</p>
                )}
            </div>

            <button
                onClick={assignSchoolManager}
                className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white font-bold py-2 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
            >
                הוסף
            </button>

            {message && (
                <p className="text-center text-green-600 font-semibold flex items-center justify-center gap-2">
                    {message}
                </p>
            )}
        </div>
    );

}

export default SchoolRegistration;
