import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const careServices = [
  { name: 'Wound Care', image: 'https://i.pinimg.com/736x/97/ab/99/97ab994fe406363658e575a2fffaa866.jpg' },
  { name: 'Physical Therapy', image: 'https://i.pinimg.com/236x/43/ea/66/43ea663bf5cb462dca0d8b9427f6baba.jpg' },
  { name: 'Daily Assistance', image: 'https://i.pinimg.com/236x/ad/ba/f2/adbaf286543db8af88181f60867bb759.jpg' },
  { name: 'Medication Management', image: 'https://i.pinimg.com/236x/79/4b/84/794b84a46fb138acb8587edf614720d2.jpg' },
  { name: 'Personal Hygiene', image: 'https://i.pinimg.com/736x/db/92/d5/db92d5baaaf4d554e984c039419a8a88.jpg' },
];

const Home = () => {
  return (
    <div className="home-page">
      <header className="header">
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>
      <div className="content">
        <h1>Welcome to Elderly Caregiver Finder</h1>
        <p>
          Find the best caregivers for your loved ones. We connect you with experienced professionals
          who are passionate about elderly care.
        </p>
      </div>
      <div className="care-services">
        <h2>Our Care Services</h2>
        <div className="care-grid">
          {careServices.map((service, index) => (
            <div className="care-card" key={index}>
              <img src={service.image} alt={service.name} className="care-image" />
              <h3>{service.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
