import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import EmployeeList from './pages/EmployeeList';
import Login from './pages/Login';
import Signup from './pages/Signup'; // <--- Check karein ye import hai?

function App() {
    // Check if token exists
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

                {/* Protected Dashboard Routes */}
                <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
                    <Route index element={<Dashboard />} />
                    <Route path="leads" element={<LeadList />} />
                    <Route path="employees" element={<EmployeeList />} />
                </Route>

                {/* Catch all - Redirect to Dashboard or Login */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;