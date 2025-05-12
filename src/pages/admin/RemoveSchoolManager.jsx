import { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

function RemoveSchoolManager() {
    const [schoolManagerId, setSchoolManagerId] = useState("");
    const [errorCode, setErrorCode] = useState("");
    const cookies = new Cookies();
    const token = cookies.get('token');

    const removeSchoolManagerFromSchool = async () => {
        setErrorCode("");
        if (!schoolManagerId) {
            setErrorCode("נא לרשום תז של מנהל בית ספר");
            return;
        }

        try {

            const response = await axios.post(
                `http://localhost:8080/Learning-App/System-Admin/remove-school-manager-from-school?userId=${schoolManagerId}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data && response.data.errorCode) {
                setErrorCode(response.data.errorCode);
                setSchoolManagerId("")
            } else {
                setErrorCode("אין תגובה מהשרת");
            }
        } catch (error) {
            setErrorCode("שגיאה בעת שליחת הבקשה");
            console.error(error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={schoolManagerId}
                onChange={(e) => setSchoolManagerId(e.target.value)}
                placeholder="תז של מנהל"
            />
            <button onClick={removeSchoolManagerFromSchool} disabled={schoolManagerId.length===0}>הסר מנהל</button>
            <p>{errorCode}</p>
        </div>
    );
}

export default RemoveSchoolManager;
