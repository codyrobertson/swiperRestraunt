export const ENV = {
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  API_URL: process.env.API_URL,
  // Add other environment variables
};

// Validate environment variables
Object.entries(ENV).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});