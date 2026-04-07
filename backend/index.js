require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// 1. CORS Setup - Sabse upar rakhein
app.use(cors({
  origin: [
    "https://crm-dg74fv1k9-radheshyamdangis-projects.vercel.app", 
    "http://localhost:5173"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"]
}));

// CRITICAL FIX: Express 5.x wildcard crash solution
// app.options('*') ya app.options('/:path*') ki jagah ye use karein:
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 2. Middleware
app.use(express.json());

// Database Connection
connectDB();

// 3. Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));