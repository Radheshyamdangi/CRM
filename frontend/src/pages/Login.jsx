import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Force clear fields when component mounts
    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role); 
            localStorage.setItem('userName', res.data.user.name);
            
            navigate('/'); 
            window.location.reload(); 
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>Connect CRM</h2>
                
                <form onSubmit={handleLogin} autoComplete="off">
                    <div style={inputGroup}>
                        <label style={labelStyle}>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            required 
                            value={email} // Controlled input
                            autoComplete="new-password" // Disables browser autofill
                            style={inputStyle} 
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            required 
                            value={password} // Controlled input
                            autoComplete="new-password"
                            style={inputStyle} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>Login to Dashboard</button>
                </form>

                <p style={footerTextStyle}>
                    Don't have an account? <Link to="/signup" style={linkStyle}>Create one now</Link>
                </p>
            </div>
        </div>
    );
};

// --- Professional Styles ---
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'Inter, sans-serif' };
const cardStyle = { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' };
const titleStyle = { textAlign: 'center', marginBottom: '30px', color: '#e74c3c', fontSize: '28px', fontWeight: 'bold' };
const inputGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' };
const inputStyle = { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: '1px solid #ddd', 
    fontSize: '15px', 
    boxSizing: 'border-box', 
    outline: 'none', 
    color: '#000000', // Typing text color set to BLACK
    backgroundColor: '#fff'
};
const buttonStyle = { width: '100%', padding: '14px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' };
const footerTextStyle = { textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' };
const linkStyle = { color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' };

export default Login;