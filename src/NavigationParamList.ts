export type MainStackParamList = {
  Login: {};
  Signup: {};
  Preferences: {};
  GroupSession: {};
  Swipe: {
    sessionId?: string;
  };
  Matches: {};
  RestaurantDetails: {
    restaurantId: string;
  };
};