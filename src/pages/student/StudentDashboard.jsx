import {useContext} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";
import WeeklySchedule from "../../components/WeeklySchedule.jsx";
import {getGreeting} from "../../Utils/Greeting.jsx";

function  StudentDashboard(){

    const { user } = useContext(UserContext);




    // function getGreeting() {
    //     const hour = new Date().getHours();
    //     if (hour < 12) return "בוקר טוב";
    //     if (hour < 17) return "צהריים טובים";
    //     return "ערב טוב";
    // }
    return(
        <>
            <div>
                <h1>{getGreeting()}, {user?.username}</h1>
                <WeeklySchedule type="student" singleDayMode={true}/>
            </div>
            {user && <MessageList userId={user.userId} />}
        </>

    )
}
export default StudentDashboard