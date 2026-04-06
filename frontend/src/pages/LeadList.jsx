import React, { useEffect, useState } from 'react';
import API from '../api/axiosInstance';
import { Search, Trash2, Edit2, Plus, X } from 'lucide-react';

const LeadList = () => {
    const [leads, setLeads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    // Naya: Editing state track karne ke liye
    const [isEditing, setIsEditing] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState(null);

    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        status: 'New'
    });

    const fetchLeads = async () => {
        try {
            const res = await API.get('/leads/all');
            setLeads(res.data);
        } catch (err) {
            console.error("Leads fetch error:", err);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    // --- Delete Function ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            try {
                await API.delete(`/leads/delete/${id}`);
                fetchLeads(); // List refresh
            } catch (err) {
                alert("Error deleting lead");
            }
        }
    };

    // --- Edit Mode Open ---
    const handleEditClick = (lead) => {
        setIsEditing(true);
        setCurrentLeadId(lead._id);
        setFormData({
            companyName: lead.companyName,
            email: lead.email,
            phone: lead.phone,
            status: lead.status
        });
        setShowModal(true);
    };

    // --- Add/Update Submit ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update Logic
                await API.put(`/leads/update/${currentLeadId}`, formData);
            } else {
                // Add Logic
                await API.post('/leads/add', formData);
            }
            closeModal();
            fetchLeads();
        } catch (err) {
            alert(isEditing ? "Error updating lead" : "Error adding lead");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentLeadId(null);
        setFormData({ companyName: '', email: '', phone: '', status: 'New' });
    };

    const filteredLeads = leads.filter((lead) => {
        const query = searchTerm.toLowerCase();
        return (
            lead.companyName?.toLowerCase().includes(query) ||
            lead.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div style={{ padding: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Lead Management</h2>
                <button 
                    onClick={() => { setIsEditing(false); setShowModal(true); }} 
                    style={addBtnStyle}
                >
                    <Plus size={18} /> New Lead
                </button>
            </div>

            <div style={searchContainer}>
                <Search size={18} color="#888" />
                <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            <div style={tableWrapper}>
                <table style={tableStyle}>
                    <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Company</th>
                            <th style={thStyle}>Email</th>
                            <th style={thStyle}>Phone</th>
                            <th style={thStyle}>Status</th>
                            <th style={thStyle}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeads.map((lead) => (
                            <tr key={lead._id} style={rowStyle}>
                                <td style={tdStyle}>{lead.companyName}</td>
                                <td style={tdStyle}>{lead.email}</td>
                                <td style={tdStyle}>{lead.phone}</td>
                                <td style={tdStyle}><span style={statusBadge(lead.status)}>{lead.status}</span></td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        {/* Pencil Icon for Update */}
                                        <Edit2 
                                            size={18} 
                                            style={{ cursor: 'pointer', color: '#4f46e5' }} 
                                            onClick={() => handleEditClick(lead)} 
                                        />
                                        {/* Bucket Icon for Delete */}
                                        <Trash2 
                                            size={18} 
                                            style={{ cursor: 'pointer', color: '#e74c3c' }} 
                                            onClick={() => handleDelete(lead._id)} 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <div style={modalHeader}>
                            <h3>{isEditing ? 'Update Lead' : 'Create New Lead'}</h3>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={closeModal} />
                        </div>
                        
                        <form onSubmit={handleSubmit} style={formStyle}>
                            <input 
                                type="text" 
                                placeholder="Company Name" 
                                required 
                                value={formData.companyName}
                                style={modalInput}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                            />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                required 
                                value={formData.email}
                                style={modalInput}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Phone Number" 
                                required 
                                value={formData.phone}
                                style={modalInput}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                            <select 
                                style={modalInput}
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                            </select>
                            <button type="submit" style={saveBtnStyle}>
                                {isEditing ? 'Update Lead' : 'Save Lead'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles and constants stay the same as your provided code
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { background: 'white', padding: '30px', borderRadius: '15px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const modalInput = { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', color: '#000' };
const saveBtnStyle = { padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const addBtnStyle = { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' };
const searchContainer = { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '10px 15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '20px', width: '100%', maxWidth: '400px' };
const searchInputStyle = { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px', color: '#000' };
const tableWrapper = { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const thStyle = { padding: '15px', borderBottom: '1px solid #eee', color: '#666', fontSize: '14px', textAlign: 'left' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #f9f9f9', fontSize: '14px', color: '#333' };
const headerRowStyle = { backgroundColor: '#fdfdfd' };
const rowStyle = { transition: '0.3s' };
const statusBadge = (status) => ({ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', backgroundColor: status === 'Qualified' ? '#dff0d8' : '#fff3cd', color: status === 'Qualified' ? '#3c763d' : '#856404' });

export default LeadList;