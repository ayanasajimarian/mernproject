import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './caregiversearchandbook.css'; // Import CSS for styles

const CaregiverSearchAndBook = () => {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [placeFilter, setPlaceFilter] = useState('');
  const [filteredCaregivers, setFilteredCaregivers] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [ampm, setAmpm] = useState('AM');

  // Fetch caregivers from the backend
  const fetchCaregivers = async () => {
    try {
      let query = '';
      if (placeFilter.trim()) {
        query = `?place=${encodeURIComponent(placeFilter.trim())}`;
      }
      const response = await fetch(`http://localhost:5000/api/${query}`);
      const data = await response.json();
      setCaregivers(data);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
    }
  };

  // Handle search action
  const handleSearch = () => {
    if (placeFilter.trim() === '') {
      setIsSearched(false);
      setFilteredCaregivers([]);
    } else {
      setIsSearched(true);
      fetchCaregivers();
    }
  };

  // Filter caregivers after fetching
  useEffect(() => {
    if (isSearched) {
      const filtered = caregivers.filter(
        (caregiver) =>
          caregiver.place.toLowerCase() === placeFilter.toLowerCase()
      );
      setFilteredCaregivers(filtered);
    }
  }, [caregivers, placeFilter, isSearched]);

  // Format time to 12-hour format with AM/PM
  const formatTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    let period = ampm; // Get the selected AM/PM
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
  };

  // Handle caregiver booking
  const handleBooking = async () => {
    try {
      const formattedTime = formatTimeTo12Hour(bookingTime);
      const userId = localStorage.getItem('user');

      if (!userId) {
        setBookingStatus('User not logged in.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/bookCaregiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caregiverId: selectedCaregiver._id,
          date: bookingDate,
          time: formattedTime,
          userId: userId,
        }),
      });

      if (response.ok) {
        setBookingStatus(`Caregiver booked successfully at ${formattedTime}`);
        setSelectedCaregiver(null);
        setBookingDate('');
        setBookingTime('');
      } else {
        setBookingStatus('Failed to book caregiver. Please try again.');
      }
    } catch (error) {
      setBookingStatus('Error occurred while booking caregiver.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container">
      {/* Navigation Bar */}
      <div className="navbar">
        <h1 className="navbarHeading">Search and Book Caregivers</h1>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>

      {/* Filters Section */}
      <div className="filters">
        <label>Place:</label>
        <input
          className="input"
          type="text"
          value={placeFilter}
          onChange={(e) => {
            setPlaceFilter(e.target.value);
            if (e.target.value.trim() === '') {
              setIsSearched(false);
              setFilteredCaregivers([]);
            }
          }}
          placeholder="Enter Place"
        />
        <button className="button" onClick={handleSearch}>
          Search
        </button>
      </div>

      {bookingStatus && <p className="bookingStatus">{bookingStatus}</p>}

      {/* Caregivers List */}
      <div className="caregiversList">
        <h2>Available Caregivers</h2>
        {!isSearched && <p>Search caregivers by entering a filter.</p>}
        {isSearched && filteredCaregivers.length === 0 ? (
          <p>No caregivers found based on your filters.</p>
        ) : (
          filteredCaregivers.map((caregiver) => (
            <div key={caregiver._id} className="caregiverCard">
              <h3 className="caregiverName">{caregiver.username}</h3>
              <p className="caregiverInfo"><strong>Place:</strong> {caregiver.place}</p>
              <p className="caregiverInfo"><strong>Experience:</strong> {caregiver.experience}</p>
              <p className="caregiverInfo"><strong>Skills:</strong> {caregiver.skills}</p>
              <button
                className="caregiverButton"
                onClick={() => setSelectedCaregiver(caregiver)}
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {selectedCaregiver && (
        <div className="formContainer">
          <h3>Book {selectedCaregiver.name}</h3>
          <label>Date:</label>
          <input
            className="formInput"
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
          <label>Time:</label>
          <div className="timePickerContainer">
            <input
              className="formInput"
              type="time"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
            />
            <select
              className="ampmSelect"
              value={ampm}
              onChange={(e) => setAmpm(e.target.value)}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button className="button" onClick={handleBooking}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default CaregiverSearchAndBook;
