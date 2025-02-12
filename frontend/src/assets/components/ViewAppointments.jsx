import React, { useState, useEffect } from 'react';

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null); // Storing the logged-in user's ID
  const [loading, setLoading] = useState(true); // Adding a loading state for better UX

  useEffect(() => {
    const storedUserId = localStorage.getItem('user');
    
    // Check if there's a valid userId stored in localStorage
    if (storedUserId) {
      setUserId(storedUserId); // Set the state with the userId from localStorage
    } else {
      // Handle the case where there's no userId stored
      console.log('No user is logged in.');
      return;
    }

    // Fetch the appointment data if userId is available
    if (userId) {
      fetchAppointmentsData(userId);
    }
  }, [userId]); // Adding userId as a dependency

  const fetchAppointmentsData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings?caregiverId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        // Filter bookings where the logged-in user is the caregiver
        const filteredAppointments = data.filter((booking) => booking.caregiverId.toString() === userId);

        // Fetch details of people who booked the caregiver (using userId from the booking)
        const appointmentsWithUserDetails = await Promise.all(filteredAppointments.map(async (booking) => {
          const userResponse = await fetch(`http://localhost:5000/api/users/${booking.userId}`);
          const userData = await userResponse.json();
          return { ...booking, userDetails: userData }; // Add user details to the appointment
        }));

        setAppointments(appointmentsWithUserDetails); // Set the filtered appointments with user details
      } else {
        console.log(data.message || 'Error fetching data');
      }
    } catch (error) {
      console.error('Error fetching bookings data:', error);
    } finally {
      setLoading(false); // Stop loading when the data has been fetched
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT', // Use PUT to update existing data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Send the new status
      });
      const data = await response.json();

      if (response.ok) {
        // Update the status of the appointment locally in the state
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === bookingId ? { ...appointment, status: newStatus } : appointment
          )
        );
      } else {
        console.log(data.message || 'Error updating booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="appointments-container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Your Appointments</h1>
      
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#333' }}>Loading...</p> // Show loading state while fetching
      ) : appointments.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>No appointments found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {appointments.map((booking) => (
            <li key={booking._id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', marginBottom: '15px', boxShadow: '0 2px 3px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0', color: '#333' }}>Booked by: {booking.userDetails.username}</h3> {/* Show the name of the person who booked */}
              <p style={{ margin: '5px 0' }}>Email: {booking.userDetails.email}</p>
              <p style={{ margin: '5px 0' }}>Phone No :{booking.userDetails.contactNumber}</p> {/* Show the email of the person who booked */}
              <p style={{ margin: '5px 0' }}>Date: {new Date(booking.date).toLocaleDateString()}</p>
              <p style={{ margin: '5px 0' }}>Time: {booking.time}</p>
              <p style={{ margin: '5px 0' }}>Status: {booking.status}</p>

              {booking.status === 'pending' && (
                <div>
                  <button 
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')} 
                    style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '1rem', cursor: 'pointer', marginRight: '10px', borderRadius: '5px' }}
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(booking._id, 'rejected')} 
                    style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 15px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '1rem', cursor: 'pointer', borderRadius: '5px' }}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewAppointments;
