import { EnhancedRestaurant } from './googlePlacesService';
import { UserPreferences } from '../types/preferences';

interface RestaurantScore {
  restaurant: EnhancedRestaurant;
  score: number;
}

export class RecommendationService {
  private static readonly WEIGHTS = {
    distance: 0.3,
    price: 0.2,
    rating: 0.2,
    dietaryMatch: 0.15,
    cuisineMatch: 0.15
  };

  static scoreRestaurant(
    restaurant: EnhancedRestaurant,
    preferences: UserPreferences
  ): number {
    const scores = {
      distance: this.calculateDistanceScore(restaurant.distance, preferences.maxDistance),
      price: this.calculatePriceScore(restaurant.details.price_level, preferences.priceRange),
      rating: restaurant.rating / 5,
      dietaryMatch: this.calculateDietaryScore(restaurant.dietaryOptions, preferences.dietaryRestrictions),
      cuisineMatch: this.calculateCuisineScore(restaurant.cuisine, preferences.preferredCuisines)
    };

    return Object.entries(scores).reduce((total, [key, score]) => {
      return total + score * this.WEIGHTS[key as keyof typeof this.WEIGHTS];
    }, 0);
  }

  static rankRestaurants(
    restaurants: EnhancedRestaurant[],
    preferences: UserPreferences
  ): EnhancedRestaurant[] {
    const scored: RestaurantScore[] = restaurants.map(restaurant => ({
      restaurant,
      score: this.scoreRestaurant(restaurant, preferences)
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .map(item => item.restaurant);
  }

  private static calculateDistanceScore(distance: number, maxDistance: number): number {
    return Math.max(0, 1 - (distance / maxDistance));
  }

  private static calculatePriceScore(price: number, preferredRange: number[]): number {
    const [min, max] = preferredRange;
    if (price >= min && price <= max) return 1;
    const closestBound = Math.abs(price - min) < Math.abs(price - max) ? min : max;
    return Math.max(0, 1 - Math.abs(price - closestBound) * 0.5);
  }

  private static calculateDietaryScore(
    options: string[],
    restrictions: string[]
  ): number {
    if (restrictions.length === 0) return 1;
    const matchedRestrictions = restrictions.filter(r => options.includes(r));
    return matchedRestrictions.length / restrictions.length;
  }

  private static calculateCuisineScore(
    cuisine: string,
    preferred: string[]
  ): number {
    if (preferred.length === 0) return 1;
    return preferred.includes(cuisine) ? 1 : 0;
  }
}