const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const cloudinary = require('../config/cloudinary');

// 1. GET all leads (Sorted by latest)
exports.getAllLeads = async (req, res, next) => {
    try {
        const leads = await Lead.find()
            .populate('assignedEmployee', 'name email') // Sirf zaroori fields populate karein
            .sort({ createdAt: -1 }); // Naya data upar dikhega
        res.status(200).json(leads);
    } catch (error) {
        next(error);
    }
};

// 2. GET single lead
exports.getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('assignedEmployee', 'name email');
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
};

// 3. ADD Lead (With Image & Counter Logic)
exports.addLead = async (req, res, next) => {
    try {
        let imageUrl = "";
        let imagePublicId = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "crm_leads", // Organized folder in Cloudinary
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const newLead = new Lead({ 
            ...req.body, 
            image: imageUrl,
            imagePublicId: imagePublicId // Id save karna delete ke liye zaroori hai
        });

        await newLead.save();

        // Increment Employee Lead Count logic
        if (req.body.assignedEmployee) {
            await Employee.findByIdAndUpdate(req.body.assignedEmployee, { $inc: { numLeads: 1 } });
        }

        res.status(201).json({ success: true, data: newLead });
    } catch (error) {
        next(error);
    }
};

// 4. UPDATE Lead (Smart Update)
exports.updateLead = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Purana lead check karein image update ke liye
        const oldLead = await Lead.findById(id);
        if (!oldLead) return res.status(404).json({ message: "Lead not found" });

        let updateData = { ...req.body };

        // Agar nayi file upload hui hai
        if (req.file) {
            // Purani image Cloudinary se delete karein
            if (oldLead.imagePublicId) {
                await cloudinary.uploader.destroy(oldLead.imagePublicId);
            }
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = result.secure_url;
            updateData.imagePublicId = result.public_id;
        }

        const updatedLead = await Lead.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: updatedLead });
    } catch (error) {
        next(error);
    }
};

// 5. DELETE Lead (With Image Cleanup)
exports.deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        // Cloudinary se image remove karein space bachane ke liye
        if (lead.imagePublicId) {
            await cloudinary.uploader.destroy(lead.imagePublicId);
        }

        // Employee lead count decrement karein
        if (lead.assignedEmployee) {
            await Employee.findByIdAndUpdate(lead.assignedEmployee, { $inc: { numLeads: -1 } });
        }

        await Lead.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Lead and associated data deleted" });
    } catch (error) {
        next(error);
    }
};