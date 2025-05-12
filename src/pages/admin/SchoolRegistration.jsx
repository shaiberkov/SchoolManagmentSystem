import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
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
            const token = cookies.get("token"); // קריאת הטוקן מתוך הקוקיה

            // שלב 1 - מינוי מנהל
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

            // שלב 2 - הוספת בית ספר
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

                // שלב 3 - חיבור מנהל לבית ספר
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
            // if (err.response) {
            //     if (err.response.status === 401) {
            //         setMessage("התחברות לא מצליחה. נא להתחבר מחדש.");
            //         cookies.remove("token");
            //         navigate("/login");
            //     } else if (err.response.status === 403) {
            //         setMessage("אין לך הרשאה לבצע את הפעולה הזו.");
            //     } else {
            //         setMessage(err.response?.data?.errorCode);
            //     }
            // } else {
            //     setMessage("שגיאה בשרת. נסה שוב מאוחר יותר.");
            // }
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", direction: "rtl" }}>
            <h2>מינוי מנהל והוספת בית ספר</h2>
            <input
                type="text"
                placeholder="מזהה משתמש"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            {userIdError && <p style={{ color: "red" }}>{userIdError}</p>}
            <input
                type="text"
                placeholder="שם בית הספר"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
            />
            <input
                type="text"
                placeholder="קוד בית הספר"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
            />
            {schoolCodeError && <p style={{ color: "red" }}>{schoolCodeError}</p>}
            <button onClick={assignSchoolManager}>הוסף</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default SchoolRegistration;
