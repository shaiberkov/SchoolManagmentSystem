import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaUser, FaSchool, FaKey, FaCheckCircle } from "react-icons/fa";

import Cookies from "universal-cookie"; // Universal Cookies

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
                `http://localhost:8080/Learning-App/System-Admin/assign-school-manager`,
                new URLSearchParams({ userId }),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (!assignResponse.data.success) {
                setUserIdError(assignResponse.data.errorCode || "שגיאה במינוי המנהל");
                return;
            }

            const addSchoolResponse = await axios.post(
                `http://localhost:8080/Learning-App/System-Admin/add-new-school-to-system`,
                new URLSearchParams({ schoolName, schoolCode }),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            if (addSchoolResponse.data.success) {
                setMessage("בית הספר נוסף והמנהל מונה בהצלחה!");

                const connectResponse = await axios.post(
                    `http://localhost:8080/Learning-App/System-Admin/assign-school-manager-to-school`,
                    new URLSearchParams({ userId, schoolCode }),
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/x-www-form-urlencoded",
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
        <div className="max-w-md mx-auto mt-10 mb-8 p-6 bg-white rounded-3xl shadow-lg space-y-5" dir="rtl">
            <h2 className="text-2xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
                מינוי מנהל והוספת בית ספר
            </h2>

            {/* מזהה משתמש */}
            <div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaUser className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="מזהה משתמש"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
                {userIdError && <p className="text-red-500 text-sm mt-1">{userIdError}</p>}
            </div>

            {/* שם בית הספר */}
            <div>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaSchool className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="שם בית הספר"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
            </div>

            {/* קוד בית ספר */}
            <div>
                <div className="flex items-center gap-2  bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaKey className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="קוד בית הספר"
                        value={schoolCode}
                        onChange={(e) => setSchoolCode(e.target.value)}
                        className="w-full bg-transparent outline-none"
                    />
                </div>
                {schoolCodeError && <p className="text-red-500 text-sm mt-1">{schoolCodeError}</p>}
            </div>

            {/* כפתור */}
            <button
                onClick={assignSchoolManager}
                className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white font-bold py-2 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
            >
                הוסף
            </button>

            {/* הודעה כללית */}
            {message && (
                <p className="text-center text-green-600 font-semibold flex items-center justify-center gap-2">
                    {message}
                </p>
            )}
        </div>
    );

    // return (
    //     <div className="max-w-md mx-auto mt-10 mb-8 p-6 bg-white rounded-3xl shadow-lg space-y-5" dir="rtl">
    //         <h2 className="text-2xl font-bold text-center text-green-600">מינוי מנהל והוספת בית ספר</h2>
    //
    //         {/* מזהה משתמש */}
    //         <div>
    //             <input
    //                 type="text"
    //                 placeholder="מזהה משתמש"
    //                 value={userId}
    //                 onChange={(e) => setUserId(e.target.value)}
    //                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
    //             />
    //             {userIdError && <p className="text-red-500 text-sm mt-1">{userIdError}</p>}
    //         </div>
    //
    //         {/* שם בית ספר */}
    //         <div>
    //             <input
    //                 type="text"
    //                 placeholder="שם בית הספר"
    //                 value={schoolName}
    //                 onChange={(e) => setSchoolName(e.target.value)}
    //                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
    //             />
    //         </div>
    //
    //         {/* קוד בית ספר */}
    //         <div>
    //             <input
    //                 type="text"
    //                 placeholder="קוד בית הספר"
    //                 value={schoolCode}
    //                 onChange={(e) => setSchoolCode(e.target.value)}
    //                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
    //             />
    //             {schoolCodeError && <p className="text-red-500 text-sm mt-1">{schoolCodeError}</p>}
    //         </div>
    //
    //         {/* כפתור */}
    //         <button
    //             onClick={assignSchoolManager}
    //             className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white font-bold py-2 rounded-xl transition duration-300 shadow-md hover:shadow-lg"
    //         >
    //             הוסף
    //         </button>
    //
    //         {/* הודעה כללית */}
    //         {message && <p className="text-center text-green-600 font-semibold">{message}</p>}
    //     </div>
    // );

    // return (
    //     <div style={{ maxWidth: "400px", margin: "0 auto", direction: "rtl" }}>
    //         <h2>מינוי מנהל והוספת בית ספר</h2>
    //         <input
    //             type="text"
    //             placeholder="מזהה משתמש"
    //             value={userId}
    //             onChange={(e) => setUserId(e.target.value)}
    //         />
    //         {userIdError && <p style={{ color: "red" }}>{userIdError}</p>}
    //         <input
    //             type="text"
    //             placeholder="שם בית הספר"
    //             value={schoolName}
    //             onChange={(e) => setSchoolName(e.target.value)}
    //         />
    //         <input
    //             type="text"
    //             placeholder="קוד בית הספר"
    //             value={schoolCode}
    //             onChange={(e) => setSchoolCode(e.target.value)}
    //         />
    //         {schoolCodeError && <p style={{ color: "red" }}>{schoolCodeError}</p>}
    //         <button onClick={assignSchoolManager}>הוסף</button>
    //         {message && <p>{message}</p>}
    //     </div>
    // );
}

export default SchoolRegistration;
