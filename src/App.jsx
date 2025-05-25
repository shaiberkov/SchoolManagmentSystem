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

    // return (
        //
        // <>
        //
        //     <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-100 to-green-100"/>
        //
        //     <BrowserRouter>
        //         <UserProvider>
        //             <NotificationProvider>
        //                 <AppRoutes/>
        //
        //             </NotificationProvider>
        //         </UserProvider>
        //     </BrowserRouter>
        // </>
        //




        return (
            <>
                {/* רקע קבוע שתמיד נמצא מתחת לכל התוכן */}
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-100 to-green-100" />

                <BrowserRouter>
                    <UserProvider>
                        <NotificationProvider>
                            <ScrollToTop />
                            {/* עטוף את כל התוכן בקונטיינר שמאפשר גובה מינימלי ושוליים */}
                            <div className="min-h-screen flex flex-col">
                                <AppRoutes />
                                {/*<Footer />*/}
                            </div>
                        </NotificationProvider>
                    </UserProvider>
                </BrowserRouter>
            </>)


}

export default App
