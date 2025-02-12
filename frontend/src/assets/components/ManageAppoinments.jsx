import React, { useEffect, useState } from 'react';

const ManageAppointments = () => {
    const [bookedPeople, setBookedPeople] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookedPeople();
    }, []);

    // Retrieve the userId from localStorage
    const userId = localStorage.getItem('user');

    // Function to fetch booking details from the backend
    const fetchBookedPeople = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/manage?userId=${userId}`);
            const bookings = await response.json();

            if (bookings && bookings.length > 0) {
                setBookedPeople(bookings);
            } else {
                setBookedPeople([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f5f5f5',
                minHeight: '100vh',
            }}
        >
            <h1
                style={{
                    textAlign: 'center',
                    color: '#004d7a',
                    marginBottom: '20px',
                    fontSize: '2rem',
                    fontWeight: '600',
                }}
            >
                Booked People
            </h1>
            {loading ? (
                <p
                    style={{
                        textAlign: 'center',
                        color: '#999',
                        fontSize: '1.2rem',
                        fontStyle: 'italic',
                    }}
                >
                    Loading...
                </p>
            ) : (
                <ul
                    style={{
                        listStyleType: 'none',
                        paddingLeft: '0',
                        margin: '0 auto',
                        maxWidth: '600px',
                    }}
                >
                    {bookedPeople.length > 0 ? (
                        bookedPeople.map((booking, index) => (
                            <li
                                key={index}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    marginBottom: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1.02)')
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.transform = 'scale(1)')
                                }
                            >
                                <p
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        margin: '0 0 10px 0',
                                    }}
                                >
                                    Name: {booking.caregiverUsername}
                                </p>
                                <p
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#333',
                                        margin: '0 0 10px 0',
                                    }}
                                >
                                    Contact: {booking.caregiverContactNumber}
                                </p>
                                <p
                                    style={{
                                        fontSize: '16px',
                                        color: booking.status === 'confirmed' ? 'green' : 'red',
                                        margin: '0',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Status: {booking.status}
                                </p>
                            </li>
                        ))
                    ) : (
                        <p
                            style={{
                                textAlign: 'center',
                                color: '#777',
                                fontSize: '1.2rem',
                                fontStyle: 'italic',
                            }}
                        >
                            No bookings found.
                        </p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default ManageAppointments;
