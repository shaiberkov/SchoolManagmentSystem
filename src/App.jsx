import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from "./routes/AppRoutes.jsx";
import {UserProvider} from "./context/UserContext.jsx";
import {BrowserRouter} from "react-router-dom";

function App() {

    return (
        <>
            <BrowserRouter>
                <UserProvider>
                    <AppRoutes/>
                </UserProvider>
            </BrowserRouter>

        </>


    )
}

export default App
