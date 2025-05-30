import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {UserContext} from "../context/UserContext.jsx";
import Cookies from "universal-cookie";


const ProtectedRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(UserContext);

    const cookies = new Cookies();
    const token = cookies.get('token');


    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;
