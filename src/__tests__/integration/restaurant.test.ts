import { googlePlacesService } from '../../services/googlePlacesService';
import { openTableService } from '../../services/openTableService';
import { restaurantService } from '../../services/restaurantService';
import { UserPreferences } from '../../types/preferences';

describe('Restaurant Data Integration', () => {
  const mockPreferences: UserPreferences = {
    dietaryRestrictions: ['Vegetarian'],
    preferredCuisines: ['Italian'],
    maxDistance: 10,
    priceRange: [1, 3],
    latitude: 40.7128,
    longitude: -74.0060
  };

  it('should fetch and combine restaurant data from multiple sources', async () => {
    const googlePlacesResults = await googlePlacesService.searchNearbyRestaurants(
      mockPreferences.latitude,
      mockPreferences.longitude,
      mockPreferences.maxDistance * 1000,
      mockPreferences
    );

    const openTableResults = await openTableService.searchRestaurants(
      mockPreferences.latitude,
      mockPreferences.longitude,
      mockPreferences.maxDistance
    );

    expect(googlePlacesResults).toBeDefined();
    expect(openTableResults).toBeDefined();

    // Verify data structure
    googlePlacesResults.forEach(restaurant => {
      expect(restaurant).toHaveProperty('id');
      expect(restaurant).toHaveProperty('name');
      expect(restaurant).toHaveProperty('imageUrl');
      expect(restaurant).toHaveProperty('rating');
    });
  });

  it('should handle restaurant preferences filtering', async () => {
    const restaurants = await restaurantService.getRestaurants();
    
    // Filter by preferences
    const filtered = restaurants.filter(restaurant => {
      const withinPriceRange = restaurant.price 
        ? restaurant.price >= mockPreferences.priceRange[0] && 
          restaurant.price <= mockPreferences.priceRange[1]
        : true;

      return withinPriceRange;
    });

    expect(filtered.length).toBeLessThanOrEqual(restaurants.length);
  });

  it('should handle restaurant likes/dislikes', async () => {
    const userId = 'test-user';
    const restaurantId = 'test-restaurant';

    await restaurantService.likeRestaurant(restaurantId, userId);
    await restaurantService.dislikeRestaurant(restaurantId, userId);

    // Add assertions based on your actual implementation
    // This is just a structure example
  });
});