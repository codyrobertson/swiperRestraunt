import { Restaurant } from "../components/restaurant/RestaurantCard";

interface OpenTableRestaurant {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  area: string;
  postal_code: string;
  country: string;
  phone: string;
  lat: number;
  lng: number;
  price: number;
  reserve_url: string;
  mobile_reserve_url: string;
  image_url: string;
}

const OPENTABLE_API_BASE = 'https://opentable.herokuapp.com/api';

export const openTableService = {
  searchRestaurants: async (
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<Restaurant[]> => {
    try {
      const response = await fetch(
        `${OPENTABLE_API_BASE}/restaurants?lat=${latitude}&lon=${longitude}&radius=${radius}`
      );
      const data = await response.json();
      return transformOpenTableResults(data.restaurants);
    } catch (error) {
      console.error('Failed to fetch from OpenTable:', error);
      return [];
    }
  },

  getRestaurantById: async (id: number): Promise<Restaurant | null> => {
    try {
      const response = await fetch(`${OPENTABLE_API_BASE}/restaurants/${id}`);
      const data = await response.json();
      return transformOpenTableRestaurant(data);
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
      return null;
    }
  },

  searchByCity: async (city: string): Promise<Restaurant[]> => {
    try {
      const response = await fetch(
        `${OPENTABLE_API_BASE}/restaurants?city=${encodeURIComponent(city)}`
      );
      const data = await response.json();
      return transformOpenTableResults(data.restaurants);
    } catch (error) {
      console.error('Failed to fetch restaurants by city:', error);
      return [];
    }
  },

  makeReservation: async (restaurantId: number, datetime: Date, partySize: number): Promise<string> => {
    // Note: This is a mock since the actual OpenTable API doesn't provide direct booking
    const restaurant = await openTableService.getRestaurantById(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }
    return `https://www.opentable.com/restref/client/?rid=${restaurantId}&datetime=${datetime.toISOString()}&covers=${partySize}`;
  }
};

function transformOpenTableResults(restaurants: OpenTableRestaurant[]): Restaurant[] {
  return restaurants.map(transformOpenTableRestaurant).filter((r): r is Restaurant => r !== null);
}

function transformOpenTableRestaurant(restaurant: OpenTableRestaurant): Restaurant | null {
  if (!restaurant) return null;

  return {
    id: restaurant.id.toString(),
    name: restaurant.name,
    imageUrl: restaurant.image_url || 'https://picsum.photos/500/300',
    cuisine: 'Unknown', // OpenTable API doesn't provide cuisine type
    rating: 0, // OpenTable API doesn't provide ratings
    address: `${restaurant.address}, ${restaurant.city}, ${restaurant.state} ${restaurant.postal_code}`,
    price: restaurant.price,
    reserveUrl: restaurant.mobile_reserve_url || restaurant.reserve_url,
    coordinates: {
      latitude: restaurant.lat,
      longitude: restaurant.lng
    }
  };
}