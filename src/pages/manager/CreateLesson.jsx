import {useContext, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";
import {FiBookOpen, FiCalendar, FiClock, FiPlusCircle, FiSearch, FiUserCheck} from "react-icons/fi";

function CreateLesson() {
    const [formData, setFormData] = useState({
        subject: "",
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        classRoomName: ""
    });
    const [teacherId,setTeacherId]=useState("")
    const [teacher, setTeacher] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loadingTeacher, setLoadingTeacher] = useState(false);
    const { user } = useContext(UserContext);

    const cookies = new Cookies();
    const token = cookies.get('token');

    const daysOfWeek = [
        { value: "SUNDAY", label: "ראשון" },
        { value: "MONDAY", label: "שני" },
        { value: "TUESDAY", label: "שלישי" },
        { value: "WEDNESDAY", label: "רביעי" },
        { value: "THURSDAY", label: "חמישי" },
        { value: "FRIDAY", label: "שישי" }
    ];

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 8; hour <= 15; hour++) {
            times.push(`${String(hour).padStart(2, '0')}:00`);
            if (hour < 15) {
                times.push(`${String(hour).padStart(2, '0')}:30`);
            }
        }
        return times;
    };

    const timeOptions = generateTimeOptions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    const fetchTeacher = async () => {
        if (!teacherId) {
            setErrorMessage("יש להזין תעודת זהות של מורה");
            return;
        }

        setLoadingTeacher(true);
        setErrorMessage("");
        try {
            const response = await axios.get(
                `http://localhost:8080/Learning-App/School-Manager/get-teacher-DTO?teacherId=${teacherId}&schoolCode=${user.schoolCode}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(response.data.success){
               setTeacher(response.data.data);
            }else{
                setErrorMessage(response.data.errorCode)
            }

        } catch (error) {
            console.error("Error fetching teacher:", error);
            setTeacher(null);
            setErrorMessage("שגיאה בטעינת פרטי המורה");
        } finally {
            setLoadingTeacher(false);
        }
    };

    const handleSubmit = async () => {

        const { subject, dayOfWeek, startTime, endTime, classRoomName} = formData;
        if (!subject || !dayOfWeek || !startTime || !endTime || !classRoomName ) {
            setSubmitMessage("יש למלא את כל השדות");
             return;
        }

        if (endTime <= startTime) {
            setSubmitMessage("שעת סיום חייבת להיות לאחר שעת ההתחלה");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/add-lesson-to-teacher?teacherId=${teacherId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if(response.data.success){
                setSubmitMessage(response.data.errorCode);
                // setFormData({
                //     subject: "",
                //     dayOfWeek: "",
                //     startTime: "",
                //     endTime: "",
                //     classRoomName: ""
                // });
                // setTeacher(null);


            }
            else {
                setSubmitMessage(response.data.errorCode);
            }
        } catch (error) {
            console.error("Failed to add lesson:", error);
            setSubmitMessage("אירעה שגיאה בעת ניסיון הוספת השיעור");
        }
    };

    return (

            <div
                className="w-full max-w-xs sm:max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right mb-8"
                dir="rtl"
            >
                <h2 className="text-xl sm:text-2xl font-bold text-black-600 mb-6 text-center">
                    יצירת שיעור חדש
                </h2>

                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiUserCheck className="text-green-500 transition-transform duration-200 hover:scale-110 hover:text-blue-400" />
                    תעודת זהות מורה:
                </label>
                <input
                    type="text"
                    name="teacherId"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    required
                    className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                />
                <button
                    onClick={fetchTeacher}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] mb-4 flex items-center justify-center gap-2"
                >
                    <FiSearch className="text-white transition-transform duration-200 hover:scale-110 hover:text-blue-400" />
                    בדוק מורה
                </button>

                {loadingTeacher && <p className="text-center text-sm text-gray-500 mb-2">טוען נתוני מורה...</p>}
                {errorMessage && <p className="text-center text-sm text-red-600 mb-2">{errorMessage}</p>}

                {teacher && (
                    <>
                        <p className="mb-4 text-center text-black-700 font-medium">שם המורה: {teacher.teacherName}</p>

                        {/* מקצוע */}
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiBookOpen className="text-green-500 transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            מקצוע:
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            <option value="">בחר מקצוע</option>
                            {teacher.subjects.map((subj, idx) => (
                                <option key={idx} value={subj}>{subj}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiUserCheck className="text-green-500 transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            כיתה:
                        </label>
                        <select
                            name="classRoomName"
                            value={formData.classRoomName}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            <option value="">בחר כיתה</option>
                            {teacher.classes.map((cls, idx) => (
                                <option key={idx} value={cls}>{cls}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiCalendar className="text-green-500 transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            יום בשבוע:
                        </label>
                        <select
                            name="dayOfWeek"
                            value={formData.dayOfWeek}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            <option value="">בחר יום</option>
                            {daysOfWeek.map((day) => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiClock className="text-green-500 transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            שעת התחלה:
                        </label>
                        <select
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            <option value="">בחר</option>
                            {timeOptions.map((time, i) => (
                                <option key={`start-${i}`} value={time}>{time}</option>
                            ))}
                        </select>

                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                            <FiClock className="text-green-500 transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            שעת סיום:
                        </label>
                        <select
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            <option value="">בחר</option>
                            {timeOptions.map((time, i) => (
                                <option key={`end-${i}`} value={time}>{time}</option>
                            ))}
                        </select>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <FiPlusCircle className="text-white transition-transform duration-200 hover:scale-120 hover:text-blue-400" />
                            צור שיעור
                        </button>
                    </>
                )}

                {submitMessage && (
                    <p className="mt-4 text-sm text-center text-red-600 animate-pulse">{submitMessage}</p>
                )}
            </div>
    );
}

export default CreateLesson;
