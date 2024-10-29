import { Restaurant } from "../components/restaurant/RestaurantCard";

// Mock data - replace with actual API calls
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Sushi Master",
    imageUrl: "https://picsum.photos/500/300",
    cuisine: "Japanese",
    rating: 4,
    address: "123 Main St"
  },
  {
    id: "2",
    name: "Burger House",
    imageUrl: "https://picsum.photos/500/301",
    cuisine: "American",
    rating: 5,
    address: "456 Oak Ave"
  },
  {
    id: "3",
    name: "Pizza Palace",
    imageUrl: "https://picsum.photos/500/302",
    cuisine: "Italian",
    rating: 4,
    address: "789 Pine St"
  }
];

export const restaurantService = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRestaurants), 1000);
    });
  },

  likeRestaurant: async (restaurantId: string, userId: string): Promise<void> => {
    // TODO: Implement with real backend
    console.log(`User ${userId} liked restaurant ${restaurantId}`);
  },

  dislikeRestaurant: async (restaurantId: string, userId: string): Promise<void> => {
    // TODO: Implement with real backend
    console.log(`User ${userId} disliked restaurant ${restaurantId}`);
  }
};