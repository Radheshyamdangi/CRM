import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar'; // Navbar ko import kiya
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
            {/* 1. Left Sidebar (Fixed) */}
            <Sidebar />

            {/* 2. Right Side Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                {/* Top Navbar (Search & Profile) */}
                <Navbar />

                {/* Main Dynamic Content (Dashboard, Leads, Employees) */}
                <main style={{ padding: '25px', overflowY: 'auto' }}>
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default Layout;