import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthPages } from "./features/auth/AuthPage";
import { TaskPages } from "./features/task/TaskPage";

function App() {
    const { token } = useSelector(state => state.auth);

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <TaskPages /> : <Navigate to="/auth" />} />
                <Route path="/auth" element={<AuthPages />} />
            </Routes>
        </Router>
    );
}

export default App;
