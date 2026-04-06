const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name:String,
    companyName: String,
    email: { type: String, required: true, unique: true },
    phone: String,
    position: String,
    numLeads: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);