import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [userType, setUserType] = useState("user");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pincode, setPincode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !organizationName || !userType || !address || !phone || !email || !password || !pincode) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage(""); 

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        { name, organizationName, userType, address, phone, email, password, pincode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/Dashboard"), 1500);
      } else {
        setMessage("Unexpected server response.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        const errorMessage = error.response.data?.message || "An error occurred during registration.";
        setMessage(errorMessage);
      } else if (error.request) {
        setMessage("No response from server. Please try again later.");
      } else {
        setMessage("An error occurred while processing your request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <header className="register-header">
          <h2>Register Here</h2>
        </header>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Enter your organization name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Enter your pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="input-field"
            required
          />
          <div className="role-selection">
            <label className="role-label">User Type:</label>
            <div className="role-options">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="ngo"
                  checked={userType === "user"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                NGO
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="donor"
                  checked={userType === "donor"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                Donor
              </label>
            </div>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {message && (
          <p className={`message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <Link to="/login" className="link">
          Already have an account? Login here
        </Link>
      </div>
    </div>
  );
}

export default Register;
