

import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import Select from "react-select";
import {FiUserCheck, FiUsers} from "react-icons/fi";

function AssignTeacherToClassRooms() {
    const [classesName, setClassesName] = useState([]);
    const [teacherId, setTeacherId] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchClasses = async () => {
            if (user?.userId) {
                try {

                    const response = await axios.get(
                        `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-code?schoolCode=${user.schoolCode}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    if (response.data.success) {
                        console.log(response.data)
                        setClassesName(response.data.data);
                    } else {
                        setMessage(response.data.errorCode);
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setMessage("שגיאה בעת טעינת נתונים.");
                }
            }
        };

        fetchClasses();
    }, [user?.userId]);

    const handleAssign = async () => {

        if (!teacherId || selectedClasses.length === 0) {
            setMessage("נא למלא את כל השדות");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/assign-teacher-to-classes?schoolCode=${user.schoolCode}&teacherId=${teacherId}`,
                selectedClasses,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {
                setMessage(response.data.errorCode);
                setTeacherId("");
                setSelectedClasses([]);
            } else {
                setMessage(response.data.errorCode);
            }
        } catch (error) {
            console.error("Assign error:", error);
            setMessage("שגיאה בעת ניסיון השיבוץ.");
        }
    };

    const classOptions = classesName.map(name => ({ label: name, value: name }));

    return (
        <div
            className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right mb-8"
            dir="rtl"
        >
            <h2 className="text-xl sm:text-2xl font-bold text-black-600 mb-6 text-center">
                שיבוץ מורה לכיתה
            </h2>

            {/* מזהה מורה */}
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiUserCheck
                    className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-110"/>
                מזהה מורה:
            </label>
            <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                placeholder="תז..."
                className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                required
            />

            {/* בחירת כיתות */}
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiUsers className="text-green-500 transition-colors duration-300 hover:text-blue-600 hover:scale-110"/>
                בחר כיתות:
            </label>
            <div className="mb-4 z-[999]"
            >
                <Select
                    isMulti
                    options={classOptions}
                    value={classOptions.filter(option => selectedClasses.includes(option.value))}
                    onChange={(selectedOptions) =>
                        setSelectedClasses(selectedOptions.map(option => option.value))
                    }
                    placeholder="בחר כיתות..."
                    noOptionsMessage={() => "לא נמצאו כיתות מתאימות"}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    menuPortalTarget={document.body}
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderColor: "#A7F3D0",
                            boxShadow: "none",
                            direction: "rtl", // תיבת הבחירה הראשית
                            "&:hover": {
                                borderColor: "#34D399",
                            },
                        }),
                        menu: (base) => ({
                            ...base,
                            direction: "rtl", // תפריט האופציות
                            textAlign: "right",
                        }),
                        option: (base) => ({
                            ...base,
                            direction: "rtl", // כל אופציה בנפרד
                            textAlign: "right",
                        }),
                        multiValueLabel: (base) => ({
                            ...base,
                            direction: "rtl",
                        }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }}
                />

            </div>

            {/* כפתור */}
            <button
                onClick={handleAssign}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiUsers className="text-white transition-transform duration-300 hover:scale-110"/>
                שבץ מורה
            </button>

            {/* הודעה */}
            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>

    );
}

export default AssignTeacherToClassRooms;
