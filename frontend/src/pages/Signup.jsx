import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
    const navigate = useNavigate();

    // Reset form to empty on mount
    useEffect(() => {
        setFormData({ name: '', email: '', password: '', role: 'employee' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);
            navigate('/');
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Create Account</h2>
                
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            required 
                            value={formData.name}
                            autoComplete="off"
                            style={inputStyle} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            required 
                            value={formData.email}
                            autoComplete="new-password"
                            style={inputStyle} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            required 
                            value={formData.password}
                            autoComplete="new-password"
                            style={inputStyle} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <select 
                            style={inputStyle} 
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="employee">Join as Employee</option>
                            <option value="admin">Join as Admin</option>
                        </select>
                    </div>

                    <button type="submit" style={btnStyle}>Sign Up</button>
                </form>

                <p style={footerTextStyle}>
                    Already have an account? <Link to="/login" style={linkStyle}>Login</Link>
                </p>
            </div>
        </div>
    );
};

// --- Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' };
const titleStyle = { textAlign: 'center', marginBottom: '25px', color: '#e74c3c', fontWeight: 'bold', fontSize: '24px' };
const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    boxSizing: 'border-box', 
    color: '#000000', // Black text color
    fontSize: '15px',
    outline: 'none',
    backgroundColor: '#fff'
};
const btnStyle = { width: '100%', padding: '14px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const footerTextStyle = { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' };
const linkStyle = { color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' };

export default Signup;