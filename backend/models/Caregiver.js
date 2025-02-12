const mongoose = require("mongoose");

// Define Caregiver Schema
const caregiverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: String },
  experience: { type: Number },
 
  contactNumber: { type: String, required: true },
  place: { type: String },
});

// Export Caregiver Model
module.exports = mongoose.model("Caregiver", caregiverSchema);
