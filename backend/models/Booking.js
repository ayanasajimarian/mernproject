const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  caregiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected'],  // Status options: pending, confirmed, rejected
    default: 'pending' 
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
