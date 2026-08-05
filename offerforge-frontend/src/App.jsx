import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Resume from "./pages/Resume";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import AI from "./pages/AI";

import MainLayout from "./layouts/MainLayout";

export default function App() {

    return (

        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route element={<MainLayout />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/resume" element={<Resume />} />

                <Route path="/jobs" element={<Jobs />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/ai" element={<AI />} />

            </Route>

        </Routes>

    );

}