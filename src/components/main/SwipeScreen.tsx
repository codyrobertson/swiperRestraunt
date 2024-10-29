import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { Restaurant } from "../restaurant/RestaurantCard";
import { SwipeContainer } from "../swipe/SwipeContainer";
import { restaurantService } from "../../services/restaurantService";
import { openTableService } from "../../services/openTableService";
import { getCurrentLocation } from "../../services/locationService";

type SwipeScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Swipe">;
};

export function SwipeScreen({ navigation }: SwipeScreenProps) {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const location = await getCurrentLocation();
      
      // Fetch from both services
      const [regularRestaurants, openTableRestaurants] = await Promise.all([
        restaurantService.getRestaurants(),
        openTableService.searchRestaurants(location.latitude, location.longitude)
      ]);

      // Combine and deduplicate restaurants
      const combined = [...regularRestaurants, ...openTableRestaurants];
      const unique = combined.filter((restaurant, index, self) =>
        index === self.findIndex((r) => r.id === restaurant.id)
      );

      setRestaurants(unique);
    } catch (error) {
      console.error('Error loading restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipeLeft = async (restaurant: Restaurant) => {
    try {
      await restaurantService.dislikeRestaurant(restaurant.id, 'current-user-id');
    } catch (error) {
      console.error('Error recording dislike:', error);
    }
  };

  const handleSwipeRight = async (restaurant: Restaurant) => {
    try {
      await restaurantService.likeRestaurant(restaurant.id, 'current-user-id');
    } catch (error) {
      console.error('Error recording like:', error);
    }
  };

  if (loading) {
    return (
      <flexboxLayout style={styles.container}>
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  return (
    <gridLayout rows="auto, *">
      <flexboxLayout row={0} className="p-4 justify-between">
        <button
          className="text-blue-500"
          text="Preferences"
          onTap={() => navigation.navigate("Preferences")}
        />
        <button
          className="text-blue-500"
          text="Matches"
          onTap={() => navigation.navigate("Matches")}
        />
      </flexboxLayout>
      
      <SwipeContainer
        row={1}
        restaurants={restaurants}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </gridLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});