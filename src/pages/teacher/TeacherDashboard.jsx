import {useContext} from "react";
import {UserContext} from "../../context/UserContext.jsx";
import MessageList from "../../components/messages/MessageList.jsx";
import WeeklySchedule from "../../components/WeeklySchedule.jsx";
import {getGreeting} from "../../Utils/Greeting.jsx";

function  TeacherDashboard(){

      const { user } = useContext(UserContext);





      return(
          <>
              <div>
                  <h1>{getGreeting()}, {user?.username}</h1>
                  <WeeklySchedule type="teacher" singleDayMode={true}/>

              </div>
              {user && <MessageList userId={user.userId}/>}
          </>

    )
  }
  export default TeacherDashboard