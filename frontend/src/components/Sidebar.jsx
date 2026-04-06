import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Leads', path: '/leads', icon: <UserPlus size={20} /> },
        { name: 'Employee', path: '/employees', icon: <Users size={20} /> },
    ];

    return (
        <div style={{ width: '250px', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #eee', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '40px', fontWeight: 'bold', fontSize: '20px', color: '#e74c3c' }}>
                Connect CRM
            </div>
            <nav style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px',
                            textDecoration: 'none',
                            color: isActive ? '#e74c3c' : '#555',
                            backgroundColor: isActive ? '#fff5f4' : 'transparent',
                            borderRadius: '8px',
                            marginBottom: '5px',
                            fontWeight: isActive ? '600' : '400'
                        })}
                    >
                        {item.icon} {item.name}
                    </NavLink>
                ))}
            </nav>
            <div style={{ padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', color: '#555' }}>
                <LogOut size={20} /> Logout
            </div>
        </div>
    );
};

export default Sidebar;