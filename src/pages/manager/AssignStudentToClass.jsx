import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import Select from "react-select";
import {FiBook, FiCheckCircle, FiUser} from "react-icons/fi";

function AssignStudentToClass() {
    const cookies = new Cookies();
    const token = cookies.get('token');
    const [classesNames, setClassesNames] = useState([]);
    const [message, setMessage] = useState("");
    const [className, setClassName] = useState("");
    const [studentId, setStudentId] = useState("");

    const {user} = useContext(UserContext);

    useEffect(() => {
        const fetch = async () => {
            if (user?.userId) {
                try {
                    const classRes = await axios.get(
                        `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-code?schoolCode=${user.schoolCode}`,
                        {headers: {Authorization: `Bearer ${token}`}}
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
        // <div style={{ padding: "20px", maxWidth: "400px", direction: "rtl" }}>
        //     <h2>שיבוץ תלמיד לכיתה</h2>
        //
        //     <label>ת"ז תלמיד:</label>
        //     <input
        //         type="text"
        //         value={studentId}
        //         onChange={(e) => setStudentId(e.target.value)}
        //         placeholder="הכנס תז"
        //         style={{ width: "100%", marginBottom: "15px" }}
        //     />
        //
        //     <div style={{ marginBottom: "15px" }}>
        //         <label>בחר כיתה:</label>
        //         <Select
        //             options={classOptions}
        //             onChange={(selected) => setClassName(selected?.value || "")}
        //             value={classOptions.find((opt) => opt.value === className)}
        //             placeholder="בחר כיתה..."
        //             isClearable
        //             isSearchable
        //         />
        //     </div>
        //
        //     <button onClick={assignStudent} style={{ width: "100%", padding: "10px", marginTop: "10px" }}>
        //         שיבוץ תלמיד
        //     </button>
        //
        //     <div style={{ marginTop: "15px", color: "red" }}>{message}</div>
        // </div>

        <div
            className="w-full max-w-sm mb-8 mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8 animate-fade-in text-right"
            dir="rtl"
        >
            <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
                שיבוץ תלמיד לכיתה
            </h2>

            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <FiUser className="text-green-500"/>
                ת"ז תלמיד:
            </label>
            <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="הכנס תז"
                className="w-full px-4 py-2 mb-4 border-2 border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FiBook className="text-green-500"/>
                    בחר כיתה:
                </label>
                <Select
                    options={classOptions}
                    onChange={(selected) => setClassName(selected?.value || "")}
                    value={classOptions.find((opt) => opt.value === className)}
                    placeholder="בחר כיתה..."
                    isClearable
                    isSearchable
                    className="text-right z-50"
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={{
                        control: (base) => ({
                            ...base,
                            borderRadius: "0.5rem",
                            borderColor: "#A7F3D0",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                            direction: "rtl",
                            zIndex: 50,
                        }),
                        menu: (base) => ({
                            ...base,
                            zIndex: 9999,
                            direction: "rtl",
                        }),
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                        }),
                        input: (base) => ({
                            ...base,
                            direction: "rtl",
                        }),
                        placeholder: (base) => ({
                            ...base,
                            textAlign: "right",
                        }),
                    }}
                />
            </div>

            <button
                onClick={assignStudent}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <FiCheckCircle className="text-white"/>
                שיבוץ תלמיד
            </button>

            {message && (
                <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                    {message}
                </div>
            )}
        </div>
        )

}

export default AssignStudentToClass;
