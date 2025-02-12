const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const caregiver =require('./routes/caregiver');
const bookingsRoutes = require("./routes/bookings");
// const appointmentRoutes = require('./routes/appointment');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/auth", authRoutes);

app.use("/api",caregiver);
app.use("/api", bookingsRoutes);
// Routes

// app.use('/api', appointmentRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
