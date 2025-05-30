import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from "./routes/AppRoutes.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import {BrowserRouter} from "react-router-dom";
import {NotificationProvider} from "./context/NotificationContext.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {


        return (
            <>
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-100 to-green-100" />

                <BrowserRouter>
                    <UserProvider>
                        <NotificationProvider>
                            <ScrollToTop />
                                <AppRoutes />
                        </NotificationProvider>
                    </UserProvider>
                </BrowserRouter>
            </>)


}

export default App
