import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { Trash2, UserPlus, Search, Mail, Phone, ShieldCheck, X } from 'lucide-react';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // New Employee State
    const [newEmp, setNewEmp] = useState({ 
        name: '', email: '', password: '', phone: '', position: '', role: 'employee' 
    });

    const currentUserRole = localStorage.getItem('role');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await API.get('/employees/all');
            setEmployees(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching employees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    // 1. ADD EMPLOYEE FUNCTION
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            await API.post('/employees/add', newEmp);
            alert("Employee added successfully!");
            setShowModal(false); // Modal close karein
            setNewEmp({ name: '', email: '', password: '', phone: '', position: '', role: 'employee' }); // Reset form
            fetchEmployees(); // List refresh karein
        } catch (err) {
            alert(err.response?.data?.message || "Error adding employee");
        }
    };

    // 2. SEARCH & DELETE LOGIC (Existing)
    const filteredEmployees = employees.filter(emp => 
        emp?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await API.delete(`/employees/delete/${id}`);
                fetchEmployees();
            } catch (err) { alert("Permission Denied"); }
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <div style={headerStyle}>
                <h2>Employee Directory</h2>
                {currentUserRole === 'admin' && (
                    <button onClick={() => setShowModal(true)} style={addBtnStyle}>
                        <UserPlus size={18} /> Add Employee
                    </button>
                )}
            </div>

            <div style={searchBarContainer}>
                <Search size={20} color="#94a3b8" />
                <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    style={searchInputStyle} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Grid Display */}
            <div style={gridStyle}>
                {loading ? <p>Loading...</p> : filteredEmployees.map((emp) => (
                    <div key={emp._id} style={cardStyle}>
                        <div style={cardHeader}>
                            <div style={avatarStyle}>{emp?.name ? emp.name.charAt(0).toUpperCase() : '?'}</div>
                            {currentUserRole === 'admin' && (
                                <Trash2 size={18} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => handleDelete(emp._id)} />
                            )}
                        </div>
                        <h4 style={{ margin: '15px 0 5px 0' }}>{emp?.name || "Unknown Name"}</h4>
                        <p style={{ color: '#6366f1', fontSize: '14px', marginBottom: '15px' }}>{emp?.position || 'No Position'}</p>
                        <div style={infoRow}><Mail size={14} /> {emp?.email || 'No Email'}</div>
                        <div style={roleBadge(emp?.role || 'employee')}>
                            <ShieldCheck size={14} /> {(emp?.role || 'employee').toUpperCase()}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ADD EMPLOYEE MODAL --- */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={modalHeader}>
                            <h3>New Employee</h3>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setShowModal(false)} />
                        </div>
                        <form onSubmit={handleAddEmployee} style={formStyle} autoComplete="off">
                            <input type="text" placeholder="Full Name" required style={modalInput} value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
                            <input type="email" placeholder="Email" required style={modalInput} value={newEmp.email} autoComplete="new-password" onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                            <input type="password" placeholder="Password" required style={modalInput} value={newEmp.password} autoComplete="new-password" onChange={e => setNewEmp({...newEmp, password: e.target.value})} />
                            <input type="text" placeholder="Position (e.g. Sales)" style={modalInput} value={newEmp.position} onChange={e => setNewEmp({...newEmp, position: e.target.value})} />
                            <select style={modalInput} value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})}>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button type="submit" style={saveBtnStyle}>Register Employee</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Styles (CSS-in-JS) ---
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(239, 234, 234, 0.96)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: 'white', padding: '30px', borderRadius: '15px', width: '380px', boxShadow: '0 10px 25px rgb(251, 246, 246)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const modalInput = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', color: '#131212' };
const saveBtnStyle = { padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

const searchBarContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#0a0a0adb', padding: '12px 20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #e2e8f0' };
const searchInputStyle = { border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '15px', color: '#efe6e6f2', backgroundColor: 'transparent' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' };
const addBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' };
const cardStyle = { background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgb(252, 252, 252)', border: '1px solid #f1f5f9' };
const cardHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const avatarStyle = { width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#1d39f0', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' };
const infoRow = { display: 'flex', alignItems: 'center', gap: '10px', color: '#1d64bbab', fontSize: '13px', marginBottom: '8px' ,fontWeight: '500'};
const roleBadge = (role) => ({ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', marginTop: '10px', backgroundColor: role === 'admin' ? '#fef2f2' : '#f0fdf4', color: role === 'admin' ? '#ef4444' : '#16a34a' });

export default EmployeeList;