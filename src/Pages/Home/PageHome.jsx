import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import "./PageHome.css";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="home-container">
        <section className="home-header">
          <h1>
            Connecting to <span style={{ color: "#629d96" }}>Surplus Smiles</span>
          </h1>
          <p>
            Helping to reduce food waste while spreading smiles by connecting
            restaurants, NGOs, and orphanages.
          </p>
          <button onClick={handleGetStarted} className="get-started-btn">
            Donate Now
          </button>
        </section>

        <section className="home-features">
          <h2 style={{textAlign:"center"}}>Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3 style={{ color: "#749c97" }}>Easy Donations</h3>
              <p>Donate surplus food effortlessly with just a click.</p>
            </div>
            <div className="feature-item">
              <h3 style={{ color: "#749c97" }}>Real-Time Tracking</h3>
              <p>Track logistics and delivery of your donations in real-time.</p>
            </div>
            <div className="feature-item">
              <Link to="/recipes" className="feature-item-link">
                <h3 style={{ color: "#749c97" }}>Recipe Generator</h3>
                <p>Create delicious recipes from available ingredients</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="impact-stats">
          <h2 style={{textAlign:"center",fontSize:"1.75em"}}>Our Impacts</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <p className="rotating-number">
                <CountUp start={0} end={50000} duration={5} separator="," />
              </p>
              <h3 style={{ color: "#749c97" }}>Meals Donated</h3>
            </div>
            <div className="stat-item">
              <p className="rotating-number">
                <CountUp start={0} end={20000} duration={5} separator="," />
              </p>
              <h3 style={{ color: "#749c97" }}>People Helped</h3>
            </div>
            <div className="stat-item">
              <p className="rotating-number">
                <CountUp start={0} end={150} duration={5} separator="," />
              </p>
              <h3 style={{ color: "#749c97" }}>NGOs Reached</h3>
            </div>
          </div>
        </section>

        <section className="social-proof">
          <p style={{ color: "#749c97", textAlign:"center" }}>
            "FoodLink helped us save thousands of meals and make a real difference in our community!"
            <br />
            - NGO Partner
          </p>
        </section>
      </div>
    </div>
  );
};

export default Home;
