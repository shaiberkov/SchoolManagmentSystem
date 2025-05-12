import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function PublicOnlyRoutesLayout() {
    const { user } = useContext(UserContext);


    if (user?.role) {
        switch (user.role) {
            case 'SYSTEM_ADMIN':
                return <Navigate to="/system-admin-dashboard" />;
            case 'SCHOOLMANAGER':
                return <Navigate to="/school-mananger-dashboard" />;
            case 'TEACHER':
                return <Navigate to="/teacher" />;
            case 'STUDENT':
                return <Navigate to="/student" />;
            default:
                return <Navigate to="/unauthorized" />;
        }
    }


    return <Outlet />;
}
