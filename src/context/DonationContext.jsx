import React, { createContext, useContext, useReducer } from 'react';

const DonationContext = createContext();

const initialState = {
  recentActivities: [],
  stats: {
    totalDonations: 0,
    activeDonors: 0,
    impactedLives: 0,
    monthlyGrowth: 0
  }
};

const donationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_DONATION':
      return {
        ...state,
        recentActivities: [action.payload, ...state.recentActivities],
        stats: {
          ...state.stats,
          totalDonations: state.stats.totalDonations + 1,
          activeDonors: state.stats.activeDonors + (state.recentActivities.findIndex(d => 
            d.details.user === action.payload.details.user) === -1 ? 1 : 0),
          impactedLives: state.stats.impactedLives + parseInt(action.payload.details.quantity || 0)
        }
      };
    case 'UPDATE_DONATION_STATUS':
      return {
        ...state,
        recentActivities: state.recentActivities.map(donation =>
          donation.id === action.payload.id
            ? { ...donation, status: action.payload.status }
            : donation
        )
      };
    default:
      return state;
  }
};

export const DonationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(donationReducer, initialState);

  const addDonation = (donation) => {
    dispatch({
      type: 'ADD_DONATION',
      payload: {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        details: donation
      }
    });
  };

  const updateDonationStatus = (id, status) => {
    dispatch({
      type: 'UPDATE_DONATION_STATUS',
      payload: { id, status }
    });
  };

  return (
    <DonationContext.Provider value={{ state, addDonation, updateDonationStatus }}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};
