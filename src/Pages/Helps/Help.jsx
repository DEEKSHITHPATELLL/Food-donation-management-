import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './Help.css';

const Help = () => {
  const form = useRef();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [ngoOptions, setNgoOptions] = useState([]);
  const [donationCount, setDonationCount] = useState(0);

  useEffect(() => {
    const ngo = JSON.parse(localStorage.getItem('selectedNgo'));
    if (ngo) {
      setSelectedNgo(ngo);
    } else {
      alert('No NGO selected! Please select an NGO first.');
    }

    const nearbyNgos = JSON.parse(localStorage.getItem('nearbyNgos')) || [];
    setNgoOptions(nearbyNgos);

    const totalDonations = localStorage.getItem('donations');
    setDonationCount(totalDonations ? parseInt(totalDonations) : 0);
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();

    if (!selectedNgo) {
      alert("No NGO selected!");
      return;
    }

    try {
      // Send the initial request email to the NGO
      await emailjs.send(
        "service_o7lpnnu", // Service ID for the NGO email
        "template_19c9idi", // Template ID for the NGO email
        {
          from_name: userName,
          from_email: userEmail,
          from_location: userLocation,
          message,
          ngo_name: selectedNgo.name,
          ngo_email: selectedNgo.email, // NGO email from the selected NGO
        },
        "-2D2mVoPT16hSjHFF"
      );

      // Send a thank-you email to the donor from the selected NGO
      await emailjs.send(
        "service_w8kyqnq", // Service ID for the thank-you email
        "template_a13kgtk", // Template ID for the thank-you email
        {
          from_name: selectedNgo.name, // Name of the selected NGO
          to_name: userName, // Donor's name
          to_email: userEmail, // Donor's email
          message: `Dear ${userName}, thank you for reaching out to ${selectedNgo.name}. We have received your request and will connect with you soon.`, // Thank-you message
        },
        "Y09VejLtQtLtcTnfG" // Public key
      );

      // Update donation count
      const updatedDonationCount = donationCount + 1;
      setDonationCount(updatedDonationCount);
      localStorage.setItem('donations', updatedDonationCount);

      alert(`Request sent successfully to ${selectedNgo.name}! A thank-you email has been sent.`);
      navigate("/dashboard", { state: { smsStatus: 'success' } });
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send the request or thank-you email. Please try again.");
    }
  };

  const handleNgoChange = (e) => {
    const ngoId = e.target.value;
    const selected = ngoOptions.find((ngo) => ngo.id === parseInt(ngoId));
    setSelectedNgo(selected);
    localStorage.setItem('selectedNgo', JSON.stringify(selected));
  };

  return (
    <div className="help-container">
      <h1>Reach Out to Nearby NGOs</h1>
      <p className="help-intro">We are here to help! Let us know what you need, and we will contact the nearest NGO.</p>
      <p className="help-subtitle">Fill out the form below to request help or make a donation request:</p>

      <label htmlFor="ngo-select">Select an NGO:</label>
      <select
        id="ngo-select"
        value={selectedNgo ? selectedNgo.id : ''}
        onChange={handleNgoChange}
      >
        <option value="">Select NGO</option>
        {ngoOptions.map((ngo) => (
          <option key={ngo.id} value={ngo.id}>
            {ngo.name}
          </option>
        ))}
      </select>
      {selectedNgo && (
        <div className="selected-ngo">
          <h2>Selected NGO:</h2>
          <p><strong>Name:</strong> {selectedNgo.name}</p>
          <p><strong>Phone:</strong> {selectedNgo.phone}</p>
          <p><strong>Email:</strong> {selectedNgo.email}</p>
        </div>
      )}
      <form ref={form} onSubmit={sendEmail} className="help-form">
        <label htmlFor="from_name">Your Name:</label>
        <input
          type="text"
          name="from_name"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label htmlFor="from_email">Your Email:</label>
        <input
          type="email"
          name="from_email"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />

        <label htmlFor="from_location">Your Location:</label>
        <input
          type="text"
          name="from_location"
          placeholder="Enter your location"
          value={userLocation}
          onChange={(e) => setUserLocation(e.target.value)}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you need help with?"
          required
        />

        <input type="submit" value="Send Request" className="submit-btn" />
      </form>

      <p>Total Donations Made: {donationCount}</p>
    </div>
  );
};

export default Help;
