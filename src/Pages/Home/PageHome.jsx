import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PageHome.css';
import { FaHandHoldingHeart, FaUsers, FaLeaf, FaArrowDown, FaMapMarkerAlt, FaHeart, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PageHome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <FaHandHoldingHeart />,
      title: "Donate Food",
      description: "Share your excess food with those who need it. Every donation helps reduce food waste and hunger.",
      color: "#FF6B6B"
    },
    {
      icon: <FaUsers />,
      title: "Connect with NGOs",
      description: "We partner with local NGOs to ensure your donations reach those who need them most.",
      color: "#4ECDC4"
    },
    {
      icon: <FaHandsHelping />,
      title: "Make an Impact",
      description: "Track your contributions and see the real difference you're making in your community.",
      color: "#45B7D1"
    }
  ];

  return (
    <div className="home-container">
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-icon"
          >
            <FaHandHoldingHeart />
          </motion.div>
          <motion.h1 
            className="hero-title"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Share Food, Share Love
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join our mission to reduce food waste and help those in need. Every donation makes a difference.
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/donate" className="donate-btn primary">
                <FaHandHoldingHeart className="btn-icon" />
                Start Donating
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="scroll-indicator"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FaArrowDown />
        </motion.div>
      </motion.section>

      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              whileHover={{ y: -10, scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === index 
                  ? `linear-gradient(135deg, ${feature.color}, ${feature.color}dd)`
                  : 'white'
              }}
            >
              <div className="feature-icon" style={{ color: hoveredCard === index ? 'white' : feature.color }}>
                {feature.icon}
              </div>
              <h3 className="feature-title" style={{ color: hoveredCard === index ? 'white' : '#2D3436' }}>
                {feature.title}
              </h3>
              <p className="feature-description" style={{ color: hoveredCard === index ? 'white' : '#636E72' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="impact-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="section-title">Our Impact</h2>
        <div className="impact-grid">
          {[
            { number: "10,000+", label: "Meals Donated", icon: <FaHeart />, color: "#FF6B6B" },
            { number: "50+", label: "NGO Partners", icon: <FaUsers />, color: "#4ECDC4" },
            { number: "5,000+", label: "Lives Impacted", icon: <FaMapMarkerAlt />, color: "#45B7D1" }
          ].map((impact, index) => (
            <motion.div 
              key={index}
              className="impact-card"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ 
                scale: 1.05,
                background: `linear-gradient(135deg, ${impact.color}, ${impact.color}dd)`,
                color: 'white'
              }}
            >
              <motion.div 
                className="impact-icon"
                style={{ color: impact.color }}
                whileHover={{ color: 'white' }}
              >
                {impact.icon}
              </motion.div>
              <motion.div 
                className="impact-number"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
              >
                {impact.number}
              </motion.div>
              <div className="impact-label">{impact.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <motion.div
          className="cta-icon"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <FaHandHoldingHeart />
        </motion.div>
        <h2 className="cta-title">Ready to Make a Difference?</h2>
        <p className="cta-description">
          Join our community of food donors and help us create a world where no one goes hungry.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/register" className="donate-btn primary">
            <FaHandsHelping className="btn-icon" />
            Join Now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default PageHome;
