import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import Select from "react-select";

function AssignStudentToClass() {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const [classesNames, setClassesNames] = useState([]);
    const [message, setMessage] = useState("");
    const [className, setClassName] = useState("");
    const [studentId, setStudentId] = useState("");

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetch = async () => {
            if (user?.userId) {
                try {
                        const classRes = await axios.get(
                            `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-code?schoolCode=${user.schoolCode}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );

                        if (classRes.data.success) {
                            setClassesNames(classRes.data.data);
                        }

                } catch (err) {
                    console.error(err);
                    setMessage("שגיאה בטעינת הנתונים");
                }
            }
        };

        fetch();
    }, [user?.userId]);

        const assignStudent = async () => {
            if (!studentId) {
                setMessage("אנא תרשום את התעודת זהות של התלמיד")
                return;
            }
            if (!className) {
                setMessage("אנא בחר כיתה לשיבוץ התלמיד")
                return;
            }
                try {
                    const response = await axios.post(
                        `http://localhost:8080/Learning-App/School-Manager/assign-student-to-class?schoolCode=${user.schoolCode}&studentId=${studentId}&className=${className}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.data.success) {
                        setMessage(response.data.errorCode);
                    } else {
                        setMessage(response.data.errorCode);
                    }
                } catch (err) {
                    console.error(err);
                    setMessage("שגיאה בשיבוץ התלמיד");
                }
            }




    const classOptions = classesNames.map((cls) => ({
        label: cls,
        value: cls,
    }));






    return (
        <div style={{ padding: "20px", maxWidth: "400px", direction: "rtl" }}>
            <h2>שיבוץ תלמיד לכיתה</h2>

            <label>ת"ז תלמיד:</label>
            <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="הכנס תז"
                style={{ width: "100%", marginBottom: "15px" }}
            />

            <div style={{ marginBottom: "15px" }}>
                <label>בחר כיתה:</label>
                <Select
                    options={classOptions}
                    onChange={(selected) => setClassName(selected?.value || "")}
                    value={classOptions.find((opt) => opt.value === className)}
                    placeholder="בחר כיתה..."
                    isClearable
                    isSearchable
                />
            </div>

            <button onClick={assignStudent} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
                שיבוץ תלמיד
            </button>

            <div style={{ marginTop: "15px", color: "red" }}>{message}</div>
        </div>
    );

}

export default AssignStudentToClass;
