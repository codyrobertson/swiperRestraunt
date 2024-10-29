import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { EnhancedRestaurant } from "../../services/googlePlacesService";
import { ShareSheet } from "../sharing/ShareSheet";

type RestaurantDetailsScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "RestaurantDetails">;
  route: { params: { restaurantId: string } };
};

export function RestaurantDetailsScreen({ navigation, route }: RestaurantDetailsScreenProps) {
  const [restaurant, setRestaurant] = React.useState<EnhancedRestaurant | null>(null);
  const [showShareSheet, setShowShareSheet] = React.useState(false);

  React.useEffect(() => {
    // TODO: Fetch restaurant details
  }, [route.params.restaurantId]);

  if (!restaurant) {
    return (
      <flexboxLayout style={styles.container}>
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  return (
    <scrollView>
      <stackLayout className="p-4">
        <image
          src={restaurant.imageUrl}
          stretch="aspectFill"
          className="h-64 rounded-lg mb-4"
        />

        <flexboxLayout className="justify-between items-center mb-4">
          <label className="text-2xl font-bold">{restaurant.name}</label>
          <button
            className="bg-blue-500 text-white p-2 rounded-full"
            text="Share"
            onTap={() => setShowShareSheet(true)}
          />
        </flexboxLayout>

        <label className="text-lg text-gray-600 mb-2">{restaurant.cuisine}</label>
        
        <flexboxLayout className="mb-4">
          <label className="text-yellow-500">{"★".repeat(restaurant.rating)}</label>
          <label className="text-gray-300">{"★".repeat(5 - restaurant.rating)}</label>
          <label className="ml-2 text-gray-600">{"$".repeat(restaurant.details.price_level)}</label>
        </flexboxLayout>

        <label className="font-semibold mb-2">Address</label>
        <label className="text-gray-600 mb-4">{restaurant.address}</label>

        <label className="font-semibold mb-2">Hours</label>
        {restaurant.details.opening_hours.weekday_text.map((hours, index) => (
          <label key={index} className="text-gray-600">{hours}</label>
        ))}

        <label className="font-semibold mt-4 mb-2">Contact</label>
        <button
          className="text-blue-500 mb-2"
          text={restaurant.details.formatted_phone_number}
          onTap={() => {
            // TODO: Open phone dialer
          }}
        />
        <button
          className="text-blue-500"
          text={restaurant.details.website}
          onTap={() => {
            // TODO: Open website
          }}
        />

        <label className="font-semibold mt-4 mb-2">Dietary Options</label>
        <wrapLayout className="mb-4">
          {restaurant.dietaryOptions.map(option => (
            <label
              key={option}
              className="bg-gray-200 p-2 m-1 rounded-full text-sm"
              text={option}
            />
          ))}
        </wrapLayout>

        <label className="font-semibold mb-2">Reviews</label>
        {restaurant.details.reviews.map((review, index) => (
          <stackLayout key={index} className="bg-gray-100 p-4 rounded-lg mb-2">
            <flexboxLayout className="justify-between">
              <label className="font-semibold">{review.author_name}</label>
              <label className="text-yellow-500">{"★".repeat(review.rating)}</label>
            </flexboxLayout>
            <label className="text-gray-600 mt-2">{review.text}</label>
          </stackLayout>
        ))}
      </stackLayout>

      <ShareSheet
        visible={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        restaurant={restaurant}
      />
    </scrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});