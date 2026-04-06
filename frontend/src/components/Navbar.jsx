import React, { useState } from 'react';
import { Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
    const navigate = useNavigate();
    
    // 1. Dynamic User Name: LocalStorage se naam nikalna
    const userName = localStorage.getItem('userName') || 'Guest User';
    
    // 2. Search State: Input value track karne ke liye
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value); // Parent component (Leads/Employees) ko data bhejna
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <div style={navStyle}>
            {/* Search Bar Logic */}
            <div style={searchContainer}>
                <Search size={18} color="#888" />
                <input 
                    type="text" 
                    placeholder="Search leads or employees..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    style={searchInput}
                />
            </div>
            
            {/* Dynamic User Profile */}
            <div style={profileSection}>
                <div style={userInfo}>
                    <span style={nameStyle}>{userName}</span>
                    <div style={avatarStyle}>
                        <User size={20} color="#555" />
                    </div>
                </div>
                
                {/* Logout Button */}
                <button onClick={handleLogout} style={logoutBtn} title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
};

// --- Professional Styles ---
const navStyle = { height: '70px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 100 };
const searchContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#f4f7f6', padding: '10px 18px', borderRadius: '10px', width: '350px', transition: '0.3s' };
const searchInput = { border: 'none', marginLeft: '12px', outline: 'none', width: '100%', fontSize: '14px' };
const profileSection = { display: 'flex', alignItems: 'center', gap: '20px' };
const userInfo = { display: 'flex', alignItems: 'center', gap: '12px', borderRight: '1px solid #eee', paddingRight: '20px' };
const nameStyle = { fontWeight: '600', color: '#333', fontSize: '15px' };
const avatarStyle = { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #ddd' };
const logoutBtn = { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' };

export default Navbar;