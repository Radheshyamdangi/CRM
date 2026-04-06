const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees, deleteEmployee } = require('../controllers/employeeController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// 1. Add Employee (Admin Only) - Make sure 'protect' and 'adminOnly' are working
router.post('/add', protect, adminOnly, addEmployee);

// 2. Get All
router.get('/all', protect, getEmployees);

// 3. Delete (Admin Only)
router.delete('/delete/:id', protect, adminOnly, deleteEmployee);

module.exports = router;