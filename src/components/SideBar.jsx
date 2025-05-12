import {Outlet, Link, useNavigate} from "react-router-dom";
import {UserContext} from "../context/UserContext.jsx";
import {useContext} from "react";
import Cookies from "universal-cookie";
import RemoveTeachingSubjectFromTeacher from "../pages/manager/RemoveTeachingSubjectFromTeacher.jsx";

function SideBar() {
    const { user,setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const cookies = new Cookies();

    const handleLogout = () => {
        cookies.remove('token')
        setUser(null)
        navigate('/login')
    };

    return (
        <div style={{display: 'flex'}}>
            {user&&(
                <>
                    {user.role==='SYSTEM_ADMIN'&& (
                        <nav style={{width: '200px'}}>
                            <ul>
                                <li><Link to="system-admin-dashboard">דף בית</Link></li>

                                <li><Link to="school-registration">רישום בית ספר</Link></li>

                                <li><Link to="remove-manager-from-school">הסרת מנהל בית מספר</Link></li>
                                <li><Link to="send-message">שליחת הודעה</Link></li>
                                <li>
                                    <button onClick={handleLogout}>התנתק</button>
                                </li>

                            </ul>
                        </nav>
                    )}
                    {user.role === 'SCHOOLMANAGER' && (
                        <nav style={{width: '200px'}}>
                            <ul>
                                <li><Link to="school-mananger-dashboard">מסך בית</Link></li>
                                <li><Link to="assign-teacher">הוספת מורה</Link></li>
                                <li><Link to="remove-teacher">הסרת מורה</Link></li>
                                <li><Link to="add-school-grades">הוספת שכבות לבית ספר</Link></li>
                                <li><Link to="remove-school-grades">הסרת שכבות לבית ספר</Link></li>
                                <li><Link to="add-classes-to-grade">הוספת כיתות לשכבה</Link></li>
                                <li><Link to="add-additional-class-to-grade">הוספת כיתה נוספת לשכבה</Link></li>
                                <li><Link to="add-teaching-subject-to-teacher">הוספת מיקצוע למורה</Link></li>
                                <li><Link to="remove-teaching-subject-to-teacher">הסרת מיקצוע ממורה</Link></li>
                                <li><Link to="send-message">שליחת הודעה</Link></li>
                                <li><Link to="asign-lesson-to-teacher"> שיבוץ מורה לשיעור</Link></li>
                                <li><Link to="asign-teacher-to-classs"> שיבוץ מורה לכיתות</Link></li>


                                <li>
                                    <button onClick={handleLogout}>התנתק</button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </>
            )}

        </div>
    );
}

export default SideBar;