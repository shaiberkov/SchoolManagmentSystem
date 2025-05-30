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

                            `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-code?schoolCode=${user.schoolCode}`,
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
        <div style={{padding: "20px", maxWidth: "400px", direction: "rtl"}}>
            <h2>צפייה במערכת שעות לפי כיתה</h2>

            <label>בחר כיתה:</label>
            <Select
                options={classOptions}
                onChange={(selected) => setSelectedClassName(selected?.value || "")}
                value={classOptions.find((opt) => opt.value === selectedClassName)}
                placeholder="בחר כיתה..."
                isClearable
                isSearchable
                style={{marginBottom: "15px"}}
            />

            {message && <div>{message}</div>}

            {selectedClassName && (
                <WeeklySchedule type="class" classRoomName={selectedClassName}/>
            )}
        </div>
    );
}

export default ClassScheduleViewerForManager;
