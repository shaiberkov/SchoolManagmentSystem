// import { useContext, useEffect, useState } from "react";
// import Cookies from "universal-cookie";
// import { UserContext } from "../../context/UserContext.jsx";
// import { getManagerSchoolCode } from "../../Api/getManagerSchoolCode.js";
// import axios from "axios";
//
// function AssignTeacherToClassRooms() {
//     const [classesName, setClassesName] = useState([]);
//     const [schoolCode, setSchoolCode] = useState('');
//     const [teacherId, setTeacherId] = useState('');
//     const [selectedClasses, setSelectedClasses] = useState([]);
//     const [message, setMessage] = useState('');
//     const { user } = useContext(UserContext);
//     const cookies = new Cookies();
//     const token = cookies.get('token');
//
//     useEffect(() => {
//         const fetchSchoolCodeAndClasses = async () => {
//             if (user?.userId) {
//                 try {
//                     const code = await getManagerSchoolCode(user.userId, token);
//                     setSchoolCode(code);
//
//                     const response = await axios.get(
//                         `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-name?schoolCode=${code}`,
//                         {
//                             headers: { Authorization: `Bearer ${token}` }
//                         }
//                     );
//
//                     if (response.data.success) {
//                         setClassesName(response.data.data); // בהנחה שזה מערך של שמות כיתות
//                     } else {
//                         setMessage("לא ניתן לטעון כיתות.");
//                     }
//                 } catch (error) {
//                     console.error("Error fetching data:", error);
//                     setMessage("שגיאה בעת טעינת נתונים.");
//                 }
//             }
//         };
//
//         fetchSchoolCodeAndClasses();
//     }, [user?.userId]);
//
//     const handleAssign = async () => {
//
//         if (!teacherId || !selectedClass) {
//             setMessage("נא למלא את כל השדות");
//             return;
//         }
//
//         try {
//             const response = await axios.post(
//                 `http://localhost:8080/Learning-App/School-Manager/assign-teacher?schoolCode=${code}&teacherId=${teacherId}`,
//                 [],
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//
//             if (response.data.success) {
//                 setMessage("המורה שובץ בהצלחה!");
//                 setTeacherId("");
//                 setSelectedClass("");
//             } else {
//                 setMessage("שיבוץ נכשל: " + response.data.errorCode);
//             }
//         } catch (error) {
//             console.error("Assign error:", error);
//             setMessage("שגיאה בעת ניסיון השיבוץ.");
//         }
//     };
//
//     return (
//         <div>
//             <h2>שיבוץ מורה לכיתה</h2>
//             <form onSubmit={handleAssign}>
//                 <label>מספר מזהה של מורה:</label>
//                 <input
//                     type="text"
//                     value={teacherId}
//                     onChange={(e) => setTeacherId(e.target.value)}
//                     required
//                 />
//
//                 <label>בחר כיתה:</label>
//                 <select
//                     value={selectedClass}
//                     onChange={(e) => setSelectedClass(e.target.value)}
//                     required
//                 >
//                     <option value="">-- בחר כיתה --</option>
//                     {classesName.map((className, index) => (
//                         <option key={index} value={className}>
//                             {className}
//                         </option>
//                     ))}
//                 </select>
//
//                 <button onClick={handleAssign}>שבץ מורה</button>
//             </form>
//
//             {message && <p>{message}</p>}
//         </div>
//     );
// }
//
// export default AssignTeacherToClassRooms;

import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { UserContext } from "../../context/UserContext.jsx";
import { getManagerSchoolCode } from "../../Api/getManagerSchoolCode.js";
import axios from "axios";
import Select from "react-select";

function AssignTeacherToClassRooms() {
    const [classesName, setClassesName] = useState([]);
    const [schoolCode, setSchoolCode] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(UserContext);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchSchoolCodeAndClasses = async () => {
            if (user?.userId) {
                try {
                    const code = await getManagerSchoolCode(user.userId, token);
                    setSchoolCode(code);

                    const response = await axios.get(
                        `http://localhost:8080/Learning-App/School-Manager/get-all-classes-name-by-school-name?schoolCode=${code}`,
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

        fetchSchoolCodeAndClasses();
    }, [user?.userId]);

    const handleAssign = async () => {

        if (!teacherId || selectedClasses.length === 0) {
            setMessage("נא למלא את כל השדות");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/Learning-App/School-Manager/assign-teacher-to-classes?schoolCode=${schoolCode}&teacherId=${teacherId}`,
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
