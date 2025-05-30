import Cookies from "universal-cookie";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import WeeklySchedule from "../../components/WeeklySchedule.jsx";
import Select from "react-select";
import {UserContext} from "../../context/UserContext.jsx";
import {BEARER_PREFIX} from "../../constants/shared.constant.js";
import {
    AUTH_HEADER, GET_ALL_CLASSES_BY_SCHOOL_CODE,
    QUESTION, SCHOOL_CODE,
    SCHOOL_MANAGER_BASE_PATH, USER_ID
} from "../../constants/pages.constants.js";

function ClassScheduleViewerForManager() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const [classesNames, setClassesNames] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedClassName, setSelectedClassName] = useState("");

    const {user}=useContext(UserContext)

    useEffect(() => {
        const fetch = async () => {
            if (user?.userId) {
                try {
                        const classRes = await axios.get(
                            `${SCHOOL_MANAGER_BASE_PATH}${GET_ALL_CLASSES_BY_SCHOOL_CODE}${QUESTION}${SCHOOL_CODE}${user.schoolCode}`,
                            { headers:
                                    {
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

    const classOptions = classesNames.map((cls) => ({
        value: cls,
        label: cls,
    }));

    return (

            <div
                className="min-h-screen w-full flex flex-col items-center mt-20 justify-start bg-gradient-to-b from-teal-50 to-teal-100 px-4 py-8 sm:py-10"
                dir="rtl"
            >
                {/* כרטיס רחב ורספונסיבי */}
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 animate-fade-in">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">
                        צפייה במערכת שעות לפי כיתה
                    </h2>

                    {/* תווית בחירת כיתה */}
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        בחר כיתה:
                    </label>

                    {/* Select לבחירת כיתה */}
                    <Select
                        options={classOptions}
                        onChange={(sel) => setSelectedClassName(sel?.value || "")}
                        value={classOptions.find((o) => o.value === selectedClassName)}
                        placeholder="בחר כיתה..."
                        isClearable
                        isSearchable
                        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                        menuPosition="fixed"
                        menuPlacement="auto"
                        classNames={{
                            control: () =>
                                "border-2 border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all",
                            menu: () => "z-60 text-right",
                        }}
                        styles={{
                            control: (base) => ({
                                ...base,
                                padding: "2px",
                                borderColor: "#A7F3D0",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                direction: "rtl",
                            }),
                            menu: (base) => ({
                                ...base,
                                textAlign: "right",
                            }),
                            menuPortal: (base) => ({ ...base, zIndex: 60 }),
                            option: (base, state) => ({
                                ...base,
                                textAlign: "right",
                                backgroundColor: state.isFocused
                                    ? "#ccfbf1"
                                    : state.isSelected
                                        ? "transparent"
                                        : undefined,
                                color: "#111827", // תמיד טקסט כהה
                                fontWeight: state.isSelected ? "bold" : "normal",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                textAlign: "right",
                                color: "#111827",
                            }),
                        }}
                    />


                    {/* הודעת שגיאה */}
                    {message && (
                        <div className="mt-4 text-sm text-red-600 text-center animate-pulse">
                            {message}
                        </div>
                    )}

                    {/* מערכת שעות */}
                    {selectedClassName && (
                        <div className="mt-10 overflow-x-auto">
                            <WeeklySchedule type="class" classRoomName={selectedClassName} />
                        </div>
                    )}
                </div>
            </div>
    );
}

export default ClassScheduleViewerForManager;
