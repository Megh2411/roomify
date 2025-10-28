import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Keep this import
import connectDB from './config/db.js';

// Import your routes
import userRoutes from './routes/userRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import receptionRoutes from './routes/receptionRoutes.js';
import housekeepingRoutes from './routes/housekeepingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load .env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- SETUP MIDDLEWARE ---

// ** UPDATED CORS CONFIGURATION **
// Define allowed origins for CORS
const allowedOrigins = [
    'http://localhost:5173', 
    'https://roomify-blush.vercel.app' 
];

const corsOptions = {
  origin: function (origin, callback) {
    // --- ADD THIS LINE FOR DEBUGGING ---
    console.log('Request Origin:', origin); 
    // ------------------------------------

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      console.log('CORS Check Passed for Origin:', origin || 'N/A');
      callback(null, true);
    } else {
      console.error('CORS Check FAILED for Origin:', origin); // Log failure
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
};

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// --- Mount Routes ---
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reception', receptionRoutes);
app.use('/api/housekeeping', housekeepingRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- Simple Root Route ---
app.get('/', (req, res) => {
  res.send('Roomify API is running...');
});

// --- Server Listener ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));