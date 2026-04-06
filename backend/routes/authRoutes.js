const express = require('express');
const router = express.Router();
// Check karein ki file ka naam aur path exact yahi hai:
const { loginUser, registerUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;