const express = require('express');
const router = express.Router();
const { 
    addLead, 
    getAllLeads, 
    getLeadById, 
    updateLead, 
    deleteLead 
} = require('../controllers/leadController'); //

const { protect, adminOnly } = require('../middleware/authMiddleware'); //
const upload = require('../middleware/multer'); //

// 1. GET All Leads - Admin aur Employee dono dekh sakte hain
router.get('/all', protect, getAllLeads);

// 2. GET Single Lead - Details page ke liye
router.get('/:id', protect, getLeadById);

// 3. POST Add Lead - Image upload ke saath (Dono kar sakte hain)
router.post('/add', protect, upload.single('image'), addLead);

// 4. PUT Update Lead - Pencil icon click karne par call hoga
// Isme bhi upload.single('image') add kiya hai taaki update ke waqt naya photo lagaya ja sake
router.put('/update/:id', protect, upload.single('image'), updateLead);

// 5. DELETE Lead - Bucket icon click karne par (Sirf Admin)
router.delete('/delete/:id', protect, adminOnly, deleteLead);

module.exports = router; //