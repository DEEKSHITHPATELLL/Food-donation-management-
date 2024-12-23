// Function to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Sample NGO data covering different areas
const allNGOs = [
  // Tumkur NGOs
  {
    id: 1,
    name: "Tumkur Food Bank",
    location: "Near City Market, Tumkur",
    coordinates: [13.3379, 77.1173],
    city: "Tumkur",
    description: "Collecting and distributing food to needy people in Tumkur",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
    phone: "080-12345678",
    email: "tumkurfoodbank@email.com",
    rating: 4.5,
    activePickups: 3,
    workingHours: "8:00 AM - 8:00 PM"
  },
  // Bangalore NGOs
  {
    id: 2,
    name: "Bangalore Food Relief",
    location: "Koramangala, Bangalore",
    coordinates: [12.9716, 77.6246],
    city: "Bangalore",
    description: "Urban food rescue and distribution network",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
    phone: "080-23456789",
    email: "bangalorefood@email.com",
    rating: 4.8,
    activePickups: 12,
    workingHours: "24/7"
  },
  {
    id: 3,
    name: "Whitefield Food Trust",
    location: "Whitefield, Bangalore",
    coordinates: [12.9698, 77.7500],
    city: "Bangalore",
    description: "Tech corridor food distribution network",
    image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
    phone: "080-34567890",
    email: "whitefield.trust@email.com",
    rating: 4.6,
    activePickups: 8,
    workingHours: "7:00 AM - 10:00 PM"
  },
  // Mysore NGOs
  {
    id: 4,
    name: "Mysore Food Network",
    location: "Palace Road, Mysore",
    coordinates: [12.2958, 76.6394],
    city: "Mysore",
    description: "Heritage city's premier food relief organization",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2hhcml0eXxlbnwwfHwwfHx8MA%3D%3D",
    phone: "080-45678901",
    email: "mysore.food@email.com",
    rating: 4.7,
    activePickups: 6,
    workingHours: "6:00 AM - 9:00 PM"
  },
  // Hassan NGOs
  {
    id: 5,
    name: "Hassan Food Relief",
    location: "BM Road, Hassan",
    coordinates: [13.0068, 76.1003],
    city: "Hassan",
    description: "District-wide food distribution network",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D%3D",
    phone: "080-56789012",
    email: "hassan.relief@email.com",
    rating: 4.5,
    activePickups: 4,
    workingHours: "7:00 AM - 8:00 PM"
  },
  // Hubli NGOs
  {
    id: 6,
    name: "Hubli Food Bank",
    location: "Koppikar Road, Hubli",
    coordinates: [15.3647, 75.1240],
    city: "Hubli",
    description: "North Karnataka's largest food relief network",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNoYXJpdHl8ZW58MHx8MHx8fDA%3D%3D",
    phone: "080-67890123",
    email: "hubli.food@email.com",
    rating: 4.6,
    activePickups: 7,
    workingHours: "6:00 AM - 10:00 PM"
  }
];

// Function to get nearby NGOs based on user location
export const getNearbyNGOs = (userLat, userLon, radiusKm = 50) => {
  return allNGOs.filter(ngo => {
    const distance = calculateDistance(
      userLat,
      userLon,
      ngo.coordinates[0],
      ngo.coordinates[1]
    );
    ngo.distance = Math.round(distance * 10) / 10; // Round to 1 decimal place
    return distance <= radiusKm;
  }).sort((a, b) => a.distance - b.distance);
};

// Function to get NGO details by ID
export const getNGOById = (id) => {
  return allNGOs.find(ngo => ngo.id === id);
};

// Function to search NGOs by name or location
export const searchNGOs = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return allNGOs.filter(ngo => 
    ngo.name.toLowerCase().includes(lowercaseQuery) ||
    ngo.location.toLowerCase().includes(lowercaseQuery) ||
    ngo.city.toLowerCase().includes(lowercaseQuery)
  );
};
