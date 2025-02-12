// routes/booking.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const User = require('../models/User');


router.get('/', async (req, res) => {
  const { place } = req.query;  // Accept place as query parameter

  try {
    let caregivers = [];

    if (place) {
      // Filter caregivers by place if provided
      caregivers = await User.find({ place: { $regex: place, $options: 'i' } });
    } else {
      // If no filter is provided, return all caregivers
      caregivers = await User.find();
    }

    res.status(200).json(caregivers);
  } catch (error) {
    console.error('Error fetching caregivers:', error);
    res.status(500).json({ message: 'Error occurred while fetching caregivers.' });
  }
});


// POST route to book a caregiver
router.post('/bookCaregiver', async (req, res) => {
  const { caregiverId, date, time, userId } = req.body;

  console.log('Received request for booking:', req.body);  // Log incoming data

  // Validate the input
  if (!caregiverId || !date || !time || !userId) {
    console.log('Missing required fields');
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the caregiver (user) exists
    const caregiver = await User.findById(caregiverId);  // Fetch user (caregiver) from User model
    if (!caregiver) {
      console.log('Caregiver not found');
      return res.status(404).json({ message: 'Caregiver not found' });
    }

    // Create a new booking
    const newBooking = new Booking({
      caregiverId,
      userId,  // Correct userId passed
      date: new Date(date),
      time,
    });

    // Save the booking
    await newBooking.save();
    console.log('Booking successful');
    res.status(200).json({ message: 'Caregiver booked successfully!' });
  } catch (error) {
    console.error('Error occurred during booking:', error);
    res.status(500).json({ message: 'Error occurred while booking caregiver.' });
  }
});


router.get('/bookings', async (req, res) => {
  const { caregiverId } = req.query; // Get caregiverId from query parameter

  if (!caregiverId) {
    return res.status(400).json({ message: 'caregiverId is required' });
  }

  try {
    // Fetch bookings where the caregiverId matches the logged-in caregiver's ID
    const bookings = await Booking.find({ caregiverId });

    // Send back the filtered bookings
    return res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

router.get('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user details by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back the user details
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error fetching user details' });
  }
});

router.put('/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;
  const { status } = req.body;  // Status should be 'confirmed' or 'rejected'

  if (!status || !['confirmed', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId, 
      { status },
      { new: true }  // Return the updated document
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(updatedBooking); // Return the updated booking
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch bookings by userId (family member)
router.get('/viewbookings', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'UserId is required' });
  }

  try {
    // Find bookings for the specific user (family member)
    const bookings = await Booking.find({ userId })
      .populate('caregiverId') // Populate caregiver info
      .exec();

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    // Return the filtered bookings (split by status on frontend)
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/manage', async (req, res) => {
  try {
    const { userId } = req.query; // Retrieve userId from query parameters

    // Fetch bookings for the userId
    const bookings = await Booking.find({ userId });

    // If no bookings are found for the user
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }

    // Fetch caregiver details for each booking (caregiverId refers to a userId)
    const caregiverIds = bookings.map(booking => booking.caregiverId);

    // Fetch caregiver details (username and contactNumber) by caregiverId
    const caregivers = await User.find({ '_id': { $in: caregiverIds } });

    // Create a map of caregiverId to username and contactNumber
    const caregiverMap = caregivers.reduce((acc, caregiver) => {
      acc[caregiver._id.toString()] = {
        username: caregiver.username,
        contactNumber: caregiver.contactNumber, // Include contactNumber here
      };
      return acc;
    }, {});

    

    // Prepare the response with the bookings and caregiver details
    const bookingsWithCaregivers = bookings.map(booking => ({
      ...booking.toObject(),
      caregiverUsername: caregiverMap[booking.caregiverId.toString()]?.username,
      caregiverContactNumber: caregiverMap[booking.caregiverId.toString()]?.contactNumber, // Add contactNumber
    }));

    // Return the bookings with caregiver usernames and contact numbers
    res.json(bookingsWithCaregivers);
  } catch (error) {
    console.error('Error fetching bookings or caregiver details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
