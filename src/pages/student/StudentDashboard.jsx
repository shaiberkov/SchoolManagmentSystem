import {useContext} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";
import WeeklySchedule from "../../components/WeeklySchedule.jsx";
import {getGreeting} from "../../Utils/Greeting.jsx";
import EventForm from "../../components/EventForm.jsx";

function  StudentDashboard(){

    const { user } = useContext(UserContext);


    return(
        <>
            <div>
                <h1>{getGreeting()}, {user?.username}</h1>
                <WeeklySchedule type="student" singleDayMode={true}/>
            </div>
            {user && <MessageList userId={user.userId} />}
            {user && <EventForm />}
        </>

    )
}
export default StudentDashboard