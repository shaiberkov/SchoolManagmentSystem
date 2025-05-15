import {useContext} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";

function  StudentDashboard(){

    const { user } = useContext(UserContext);





    return(
        <>
            <div>
                מסך בית של מורה
            </div>
            {user && <MessageList userId={user.userId} />}
        </>

    )
}
export default StudentDashboard