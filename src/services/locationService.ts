import { Geolocation } from '@nativescript/core';

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
  try {
    const location = await Geolocation.getCurrentLocation({
      desiredAccuracy: 3,
      updateDistance: 10,
      maximumAge: 20000,
      timeout: 20000
    });

    return {
      latitude: location.latitude,
      longitude: location.longitude
    };
  } catch (error) {
    console.error('Error getting location:', error);
    // Return default coordinates (e.g., city center)
    return {
      latitude: 40.7128,
      longitude: -74.0060
    };
  }
}