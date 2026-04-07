require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json());
app.use(cors({
  // Yahan apna Vercel wala URL dalein (bina slash '/' ke end mein)
  origin: [
    "crm-n24jwu0mr-radheshyamdangis-projects.vercel.app", 
    "http://localhost:5173" // Local testing ke liye ise bhi rehne dein
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));

connectDB();

// Route Registration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));