export interface UserPreferences {
  dietaryRestrictions: string[];
  preferredCuisines: string[];
  maxDistance: number; // in kilometers
  priceRange: number[]; // 1-4, matching Google's price levels
  latitude: number;
  longitude: number;
}

export const DietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free',
  'Nut-Free',
  'Pescatarian'
] as const;

export const CuisineTypes = [
  'American',
  'Italian',
  'Japanese',
  'Chinese',
  'Mexican',
  'Indian',
  'Thai',
  'Mediterranean',
  'French',
  'Korean',
  'Vietnamese',
  'Greek'
] as const;