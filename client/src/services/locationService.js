const GOOGLE_API_KEY = 'YOUR_GOOGLE_API_KEY'; // You'll need to replace this with your actual API key

export const getNearbyNGOs = async (latitude, longitude, radius = 5000) => {
  try {
    // Search for places of type 'food_bank' and other relevant keywords
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=food_bank&keyword=food%20bank%7Ccharity%7CNGO&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    // Transform the Google Places data into our NGO format
    return data.results.map(place => ({
      id: place.place_id,
      name: place.name,
      location: place.vicinity,
      coordinates: [place.geometry.location.lat, place.geometry.location.lng],
      rating: place.rating || 4.0,
      image: place.photos?.[0]?.photo_reference 
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
        : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500",
      distance: calculateDistance(
        latitude,
        longitude,
        place.geometry.location.lat,
        place.geometry.location.lng
      ),
      activePickups: Math.floor(Math.random() * 10) + 1, // Placeholder
      workingHours: "Contact for hours" // We'd need an additional Places Details request for actual hours
    }));
  } catch (error) {
    console.error('Error fetching nearby NGOs:', error);
    return [];
  }
};

// Calculate distance between two points in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // Round to 1 decimal place
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

// Get additional details for an NGO
export const getNGODetails = async (placeId) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_phone_number,formatted_address,opening_hours,website,rating,reviews&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (!data.result) {
      return null;
    }

    return {
      ...data.result,
      workingHours: data.result.opening_hours?.weekday_text || ["Contact for hours"],
      phone: data.result.formatted_phone_number || "Not available",
      website: data.result.website || null,
      reviews: data.result.reviews || []
    };
  } catch (error) {
    console.error('Error fetching NGO details:', error);
    return null;
  }
};
