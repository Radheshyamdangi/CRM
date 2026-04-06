const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    companyName: String,
    email: String,
    phone: String,
    status: { type: String, default: "Pending" }, // Contacted, Pending, etc.
    source: String, // Facebook, LinkedIn, etc.
    
    // YEH HAI MAIN PART: Connecting to Employee
    assignedEmployee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee'  // Yeh 'Employee' model ka naam hai
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);