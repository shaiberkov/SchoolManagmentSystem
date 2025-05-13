import {useContext, useEffect, useState} from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import {UserContext} from "../../context/UserContext.jsx";

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
        <div>
            <h2>יצירת שיעור חדש</h2>

            <label>תעודת זהות מורה:</label>
            <input
                type="text"
                name="teacherId"
                value={teacherId}
                onChange={(e)=>setTeacherId(e.target.value)}
                required
            />
            <button onClick={fetchTeacher}>בדוק מורה</button>

            {loadingTeacher && <p>טוען נתוני מורה...</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {teacher && (
                <>
                    <p>שם המורה: {teacher.teacherName}</p>

                    <label>מקצוע:</label>
                    <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר מקצוע</option>
                        {teacher.subjects.map((subj, idx) => (
                            <option key={idx} value={subj}>{subj}</option>
                        ))}
                    </select>

                    <label>כיתה:</label>
                    <select
                        name="classRoomName"
                        value={formData.classRoomName}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר כיתה</option>
                        {teacher.classes.map((cls, idx) => (
                            <option key={idx} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <label>יום בשבוע:</label>
                    <select
                        name="dayOfWeek"
                        value={formData.dayOfWeek}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר יום</option>
                        {daysOfWeek.map((day) => (
                            <option key={day.value} value={day.value}>
                                {day.label}
                            </option>
                        ))}
                    </select>

                    <label>שעת התחלה:</label>
                    <select
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר</option>
                        {timeOptions.map((time, i) => (
                            <option key={`start-${i}`} value={time}>{time}</option>
                        ))}
                    </select>

                    <label>שעת סיום:</label>
                    <select
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    >
                        <option value="">בחר</option>
                        {timeOptions.map((time, i) => (
                            <option key={`end-${i}`} value={time}>{time}</option>
                        ))}
                    </select>

                    <button onClick={handleSubmit}>צור שיעור</button>
                </>
            )}

            {submitMessage && <p>{submitMessage}</p>}
        </div>
    );
}

export default CreateLesson;
