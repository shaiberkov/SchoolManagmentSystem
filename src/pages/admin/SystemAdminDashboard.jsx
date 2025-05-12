import {useContext} from "react";
import {UserContext} from "../../context/UserContext.jsx";


export default function SystemAdminDashboard() {
const {user}=useContext(UserContext)









    return(
        <div>
            <div>
                <h1>ברוך הבא, {user.username}</h1>

            </div>

        </div>

    )

}