import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from "./routes/AppRoutes.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import {BrowserRouter} from "react-router-dom";
import {NotificationProvider} from "./context/NotificationContext.jsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <UserProvider>
                    <NotificationProvider>
                        <AppRoutes/>
                    </NotificationProvider>
                </UserProvider>
            </BrowserRouter>

        </>


    )
}

export default App
