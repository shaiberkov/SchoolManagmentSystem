

import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { UserContext } from "../../context/UserContext.jsx";
import axios from "axios";
import Select from "react-select";

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
        <div>
            <h2>שיבוץ מורה לכיתה</h2>
                <label>מספר מזהה של מורה:</label>
                <input
                    type="text"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    required
                />

                <label>בחר כיתות:</label>
                <Select
                    isMulti
                    options={classOptions}
                    value={classOptions.filter(option => selectedClasses.includes(option.value))}
                    onChange={(selectedOptions) =>
                        setSelectedClasses(selectedOptions.map(option => option.value))
                    }
                    placeholder="בחר כיתות..."
                    noOptionsMessage={() => "לא נמצאו כיתות מתאימות"}
                />

                <button onClick={handleAssign}>שבץ מורה</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AssignTeacherToClassRooms;
