const express = require('express');
const Caregiver = require('../models/User');
const router = express.Router();

// Get caregiver by ID
router.get('/caregiver/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json(caregiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update caregiver profile
router.put('/caregiver/:id', async (req, res) => {
  try {
    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedCaregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json(updatedCaregiver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete caregiver profile
router.delete('/caregiver/:id', async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json({ message: 'Caregiver deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
