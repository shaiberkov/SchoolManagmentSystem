import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {FaCheckCircle, FaIdCard} from "react-icons/fa";


function RemoveSchoolManager() {
    const [schoolManagerId, setSchoolManagerId] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const cookies = new Cookies();
    const token = cookies.get('token');

    const removeSchoolManagerFromSchool = async () => {
        setErrorCode("");
        if (!schoolManagerId) {
            setErrorCode("נא לרשום תז של מנהל בית ספר");
            return;
        }

        try {

            const response = await axios.post(
                `http://localhost:8080/Learning-App/System-Admin/remove-school-manager-from-school?userId=${schoolManagerId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.errorCode) {
                setErrorCode(response.data.errorCode);
                setSchoolManagerId("")
            } else {
                setErrorCode("אין תגובה מהשרת");
            }
        } catch (error) {
            setErrorCode("שגיאה בעת שליחת הבקשה");
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-lg space-y-5" dir="rtl">
            <h2 className="text-2xl font-bold text-center text-green-600 flex items-center justify-center gap-2">
                הסרת מנהל מבית ספר
            </h2>

            <div>
                <div
                    className="flex items-center gap-2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-green-400">
                    <FaIdCard className="text-gray-400"/>
                    <input
                        type="text"
                        value={schoolManagerId}
                        onChange={(e) => setSchoolManagerId(e.target.value)}
                        placeholder="תז של מנהל"
                        className="w-full bg-transparent outline-none"
                    />
                </div>
            </div>

            <button
                onClick={removeSchoolManagerFromSchool}
                disabled={schoolManagerId.length === 0}
                className={`w-full text-white font-bold py-2 rounded-xl transition duration-300 shadow-md ${
                    schoolManagerId.length === 0
                        ? 'bg-green-200'
                        : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 hover:shadow-lg'
                }`}
            >
                הסר מנהל
            </button>


            {errorCode && (
                <p className="text-center text-green-700 font-semibold flex items-center justify-center gap-2">
                    <FaCheckCircle/>
                    {errorCode}
                </p>
            )}
        </div>
    );
}

export default RemoveSchoolManager;
