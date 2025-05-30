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

            <div className="min-h-screen p-4 sm:p-6" dir="rtl">
                <header className="max-w-6xl mx-auto mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                        {getGreeting()}, {user?.username}
                    </h1>
                </header>

                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-2 sm:gap-3">
                    <div className="lg:w-1/2">
                        <div className="rounded-2xl sm:p-5 h-full">
                            <WeeklySchedule type="student" singleDayMode={true}/>
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex flex-col gap-2 sm:gap-3">
                        {user && (
                            <div className="rounded-2xl  sm:p-5">
                                <MessageList userId={user.userId}/>
                            </div>
                        )}

                        {user && (
                            <div className="rounded-2xl p-4 sm:p-5">
                                <EventForm/>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </>
    )
}

export default StudentDashboard