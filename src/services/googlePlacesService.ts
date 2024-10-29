import { Restaurant } from "../components/restaurant/RestaurantCard";

const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // TODO: Move to env

interface PlaceDetails {
  photos: string[];
  opening_hours: {
    weekday_text: string[];
    open_now: boolean;
  };
  price_level: number;
  website: string;
  formatted_phone_number: string;
  reviews: {
    rating: number;
    text: string;
    author_name: string;
  }[];
}

export interface EnhancedRestaurant extends Restaurant {
  details: PlaceDetails;
  distance: number; // in kilometers
  dietaryOptions: string[];
}

export const googlePlacesService = {
  searchNearbyRestaurants: async (
    latitude: number,
    longitude: number,
    radius: number,
    preferences: UserPreferences
  ): Promise<EnhancedRestaurant[]> => {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockRestaurants(preferences);
    }

    // TODO: Implement real Google Places API call
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return transformGooglePlacesToRestaurants(data.results, preferences);
    } catch (error) {
      console.error('Failed to fetch from Google Places:', error);
      return getMockRestaurants(preferences);
    }
  },

  getPlaceDetails: async (placeId: string): Promise<PlaceDetails> => {
    // For development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return getMockPlaceDetails();
    }

    // TODO: Implement real Google Places Details API call
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,opening_hours,price_level,website,formatted_phone_number,reviews&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Failed to fetch place details:', error);
      return getMockPlaceDetails();
    }
  }
};

// Mock data helpers
function getMockPlaceDetails(): PlaceDetails {
  return {
    photos: [
      'https://picsum.photos/500/300',
      'https://picsum.photos/500/301',
    ],
    opening_hours: {
      weekday_text: [
        'Monday: 9:00 AM – 10:00 PM',
        'Tuesday: 9:00 AM – 10:00 PM',
        'Wednesday: 9:00 AM – 10:00 PM',
        'Thursday: 9:00 AM – 10:00 PM',
        'Friday: 9:00 AM – 11:00 PM',
        'Saturday: 10:00 AM – 11:00 PM',
        'Sunday: 10:00 AM – 9:00 PM'
      ],
      open_now: true
    },
    price_level: 2,
    website: 'https://example.com',
    formatted_phone_number: '(555) 123-4567',
    reviews: [
      {
        rating: 4,
        text: 'Great food and atmosphere!',
        author_name: 'John D.'
      }
    ]
  };
}

function getMockRestaurants(preferences: UserPreferences): EnhancedRestaurant[] {
  const mockRestaurants: EnhancedRestaurant[] = [
    {
      id: '1',
      name: 'Sushi Master',
      imageUrl: 'https://picsum.photos/500/300',
      cuisine: 'Japanese',
      rating: 4,
      address: '123 Main St',
      details: getMockPlaceDetails(),
      distance: 2.5,
      dietaryOptions: ['Vegetarian', 'Gluten-Free']
    },
    {
      id: '2',
      name: 'Burger House',
      imageUrl: 'https://picsum.photos/500/301',
      cuisine: 'American',
      rating: 5,
      address: '456 Oak Ave',
      details: getMockPlaceDetails(),
      distance: 1.8,
      dietaryOptions: ['Vegan', 'Halal']
    }
  ];

  // Filter based on preferences
  return mockRestaurants.filter(restaurant => {
    const withinDistance = restaurant.distance <= preferences.maxDistance;
    const matchesDietary = preferences.dietaryRestrictions.every(restriction =>
      restaurant.dietaryOptions.includes(restriction)
    );
    const matchesCuisine = preferences.preferredCuisines.length === 0 ||
      preferences.preferredCuisines.includes(restaurant.cuisine);

    return withinDistance && matchesDietary && matchesCuisine;
  });
}

function transformGooglePlacesToRestaurants(
  places: any[],
  preferences: UserPreferences
): EnhancedRestaurant[] {
  // Transform Google Places API response to our EnhancedRestaurant format
  return places.map(place => ({
    id: place.place_id,
    name: place.name,
    imageUrl: place.photos?.[0]?.photo_reference || 'https://picsum.photos/500/300',
    cuisine: place.types?.[0] || 'Unknown',
    rating: place.rating || 0,
    address: place.vicinity,
    details: {
      photos: [],
      opening_hours: place.opening_hours || {},
      price_level: place.price_level || 0,
      website: '',
      formatted_phone_number: '',
      reviews: []
    },
    distance: calculateDistance(
      preferences.latitude,
      preferences.longitude,
      place.geometry.location.lat,
      place.geometry.location.lng
    ),
    dietaryOptions: [] // To be populated with additional API call
  }));
}