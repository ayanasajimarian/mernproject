const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['family', 'caregiver'], required: true },
  contactNumber: { type: String, required: true }, // Added contact number
  skills: { type: [String], default: [] }, // Caregiver-specific field
  experience: { type: Number, default: 0 }, // Caregiver-specific field as a number
  place: { type: String, default: "" }, // Caregiver-specific field
});

// Hash password before saving to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match password function
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
