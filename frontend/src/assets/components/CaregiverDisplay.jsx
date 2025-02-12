import React, { useEffect, useState } from 'react';

const CaregiverDisplay = () => {
  const [caregiverData, setCaregiverData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaregiver, setEditedCaregiver] = useState(null);
  const storedId = localStorage.getItem('user'); // Assuming the caregiver's ID is stored in localStorage

  // Fetch caregiver data based on stored caregiver ID
  useEffect(() => {
    if (storedId) {
      fetch(`http://localhost:5000/api/caregiver/${storedId}`)
        .then((response) => response.json())
        .then((data) => {
          setCaregiverData([data]); // Assuming the response returns a single caregiver
        })
        .catch((error) => console.error('Error fetching caregiver:', error));
    }
  }, [storedId]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this caregiver data?')) {
      fetch(`http://localhost:5000/api/caregiver/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(() => {
          alert('Caregiver data deleted successfully');
          localStorage.removeItem('caregiverId'); // Removing caregiver ID from localStorage
          setCaregiverData([]); // Clear caregiver data from state
          window.location.href = '/'; // Redirect to home page after deletion
        })
        .catch((error) => console.error('Error deleting caregiver:', error));
    }
  };

  const handleEdit = (caregiver) => {
    setIsEditing(true);
    setEditedCaregiver(caregiver);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:5000/api/caregiver/${editedCaregiver._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedCaregiver),
    })
      .then((response) => response.json())
      .then(() => {
        alert('Caregiver data updated successfully');
        setIsEditing(false);
        setEditedCaregiver(null);
        setCaregiverData(caregiverData.map((caregiver) =>
          caregiver._id === editedCaregiver._id ? editedCaregiver : caregiver
        ));
      })
      .catch((error) => console.error('Error updating caregiver:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCaregiver((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div style={{
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px', 
      backgroundColor: '#fff', 
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '20px' }}>Your Caregiver Profile</h2>
      {caregiverData.length > 0 ? (
        caregiverData.map((caregiver) => (
          <div key={caregiver._id} style={{
            backgroundColor: '#f9f9f9', 
            padding: '15px', 
            marginBottom: '15px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Name:</strong> {caregiver.username}</p>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Email:</strong> {caregiver.email}</p>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Experience:</strong> {caregiver.experience}</p>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Skills:</strong> {caregiver.skills}</p>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Place:</strong> {caregiver.place}</p>
            <p style={{ fontSize: '1.1rem', margin: '10px 0' }}><strong>Contact:</strong> {caregiver.contactNumber}</p>

            <button onClick={() => handleEdit(caregiver)} style={{
              backgroundColor: '#4CAF50', 
              color: '#fff', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginRight: '10px',
            }}>
              Update
            </button>
            <button onClick={() => handleDelete(caregiver._id)} style={{
              backgroundColor: '#f44336', 
              color: '#fff', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
            }}>
              Delete
            </button>
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>No caregiver data found for the logged-in caregiver.</p>
      )}

      {isEditing && editedCaregiver && (
        <div style={{
          backgroundColor: '#f9f9f9', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
          marginTop: '20px',
        }}>
          <h3 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '20px' }}>Edit Caregiver Profile</h3>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Name:
            <input
              type="text"
              name="name"
              value={editedCaregiver.username}
              onChange={handleChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                fontSize: '1rem',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Experience:
            <input
              type="number"
              name="experience"
              value={editedCaregiver.experience}
              onChange={handleChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                fontSize: '1rem',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Skills:
            <input
              type="text"
              name="skills"
              value={editedCaregiver.skills}
              onChange={handleChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                fontSize: '1rem',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Place:
            <input
              type="text"
              name="place"
              value={editedCaregiver.place}
              onChange={handleChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                fontSize: '1rem',
              }}
            />
          </label>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Contact:
            <input
              type="text"
              name="contactNumber"
              value={editedCaregiver.contactNumber}
              onChange={handleChange}
              style={{
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '1px solid #ccc', 
                fontSize: '1rem',
              }}
            />
          </label>
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleUpdate} style={{
              backgroundColor: '#4CAF50', 
              color: '#fff', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              marginRight: '10px',
            }}>
              Update Profile
            </button>
            <button onClick={() => setIsEditing(false)} style={{
              backgroundColor: '#f44336', 
              color: '#fff', 
              padding: '10px 20px', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaregiverDisplay;
