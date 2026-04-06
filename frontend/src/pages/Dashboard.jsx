import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { Users, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const [counts, setCounts] = useState({ leads: 0, employees: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStats = async () => {
            try {
                setLoading(true);
                // Dono calls ko parallelly run karne ke liye Promise.all best hai
                const [lRes, eRes] = await Promise.all([
                    API.get('/leads/all'),
                    API.get('/employees/all')
                ]);

                setCounts({ 
                    leads: lRes.data.length, 
                    employees: eRes.data.length 
                });
                setError(null);
            } catch (err) {
                console.error("Dashboard Error:", err);
                if (err.response?.status === 401) {
                    // Agar 401 unauthorized error hai, toh login pe bhejo
                    localStorage.clear();
                    window.location.href = "/login";
                } else {
                    setError("Failed to fetch dashboard data.");
                }
            } finally {
                setLoading(false);
            }
        };
        getStats();
    }, []);

    if (loading) return <div style={centerStyle}>Loading Stats...</div>;

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', color: '#333', fontWeight: '700' }}>CRM Overview</h2>
                <p style={{ color: '#666' }}>Welcome back! Here's what's happening today.</p>
            </div>

            {error && (
                <div style={errorStyle}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
                
                {/* Leads Card */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={cardTitle}>Total Leads</h3>
                            <p style={cardValue}>{counts.leads}</p>
                        </div>
                        <div style={{ ...iconCircle, backgroundColor: '#fff5f4' }}>
                            <TrendingUp color="#e74c3c" size={28} />
                        </div>
                    </div>
                    <div style={cardFooter}>+ 12% from last month</div>
                </div>

                {/* Employees Card */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={cardTitle}>Total Employees</h3>
                            <p style={cardValue}>{counts.employees}</p>
                        </div>
                        <div style={{ ...iconCircle, backgroundColor: '#eef2ff' }}>
                            <Users color="#4f46e5" size={28} />
                        </div>
                    </div>
                    <div style={cardFooter}>Active Team Members</div>
                </div>

            </div>
        </div>
    );
};

// --- Modern Styles ---
const cardStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #f0f0f0',
    transition: 'transform 0.3s ease'
};

const cardTitle = { fontSize: '16px', color: '#666', marginBottom: '10px', fontWeight: '500' };
const cardValue = { fontSize: '32px', fontWeight: '800', color: '#1a1a1a', margin: 0 };
const iconCircle = { padding: '15px', borderRadius: '12px' };
const cardFooter = { marginTop: '20px', fontSize: '13px', color: '#27ae60', fontWeight: '600' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '18px', color: '#666' };
const errorStyle = { backgroundColor: '#fff5f5', color: '#c53030', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' };

export default Dashboard;