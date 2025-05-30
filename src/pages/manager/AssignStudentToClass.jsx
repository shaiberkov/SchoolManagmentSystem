import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../context/UserContext.jsx";
import Cookies from "universal-cookie";
import Select from "react-select";
import {FiBook, FiCheckCircle, FiUser} from "react-icons/fi";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    AND, ASSIGN_STUDENT_TO_CLASS,
    ASSIGN_TEACHER_TO_CLASSES,
    AUTH_HEADER, CLASS_NAME, GET_ALL_CLASSES_BY_SCHOOL_CODE,
    QUESTION, SCHOOL_CODE,
    SCHOOL_MANAGER_BASE_PATH, STUDENT_ID, TEACHER_ID
} from "../../constants/pages.constants.js";

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
                        `${SCHOOL_MANAGER_BASE_PATH}${GET_ALL_CLASSES_BY_SCHOOL_CODE}${QUESTION}${SCHOOL_CODE}${user.schoolCode}`,
                        {
                            headers: {
                                [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
                        }
                        }
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
                `${SCHOOL_MANAGER_BASE_PATH}${ASSIGN_STUDENT_TO_CLASS}${QUESTION}${SCHOOL_CODE}${user.schoolCode}${AND}${STUDENT_ID}${studentId}${AND}${CLASS_NAME}${className}`,
                {
                    headers: {
                        [AUTH_HEADER]: `${BEARER_PREFIX}${token}`
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
