import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { DietaryOptions, CuisineTypes, UserPreferences } from "../../types/preferences";
import { getCurrentLocation } from "../../services/locationService";

type PreferencesScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Preferences">;
};

export function PreferencesScreen({ navigation }: PreferencesScreenProps) {
  const [preferences, setPreferences] = React.useState<UserPreferences>({
    dietaryRestrictions: [],
    preferredCuisines: [],
    maxDistance: 10,
    priceRange: [1, 4],
    latitude: 0,
    longitude: 0
  });

  React.useEffect(() => {
    getCurrentLocation().then(({ latitude, longitude }) => {
      setPreferences(prev => ({ ...prev, latitude, longitude }));
    });
  }, []);

  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const toggleCuisine = (cuisine: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredCuisines: prev.preferredCuisines.includes(cuisine)
        ? prev.preferredCuisines.filter(c => c !== cuisine)
        : [...prev.preferredCuisines, cuisine]
    }));
  };

  const handleSave = () => {
    // TODO: Save to persistent storage
    navigation.navigate("Swipe");
  };

  return (
    <scrollView>
      <stackLayout className="p-4">
        <label className="text-2xl font-bold mb-6">Your Preferences</label>

        <label className="text-lg font-semibold mb-2">Dietary Restrictions</label>
        <wrapLayout className="mb-6">
          {DietaryOptions.map(restriction => (
            <button
              key={restriction}
              className={`m-1 p-2 rounded-full ${
                preferences.dietaryRestrictions.includes(restriction)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onTap={() => toggleDietaryRestriction(restriction)}
            >
              {restriction}
            </button>
          ))}
        </wrapLayout>

        <label className="text-lg font-semibold mb-2">Preferred Cuisines</label>
        <wrapLayout className="mb-6">
          {CuisineTypes.map(cuisine => (
            <button
              key={cuisine}
              className={`m-1 p-2 rounded-full ${
                preferences.preferredCuisines.includes(cuisine)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onTap={() => toggleCuisine(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </wrapLayout>

        <label className="text-lg font-semibold mb-2">
          Maximum Distance: {preferences.maxDistance}km
        </label>
        <slider
          value={preferences.maxDistance}
          minValue={1}
          maxValue={50}
          onValueChange={(args) => {
            setPreferences(prev => ({
              ...prev,
              maxDistance: Math.round(args.value)
            }));
          }}
          className="mb-6"
        />

        <label className="text-lg font-semibold mb-2">Price Range</label>
        <flexboxLayout className="mb-6">
          {[1, 2, 3, 4].map(price => (
            <button
              key={price}
              className={`flex-1 m-1 p-2 ${
                preferences.priceRange[0] <= price && price <= preferences.priceRange[1]
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              text={'$'.repeat(price)}
              onTap={() => {
                setPreferences(prev => ({
                  ...prev,
                  priceRange: [price, price]
                }));
              }}
            />
          ))}
        </flexboxLayout>

        <button
          className="bg-blue-500 text-white p-4 rounded-lg"
          onTap={handleSave}
        >
          Save Preferences
        </button>
      </stackLayout>
    </scrollView>
  );
}

const styles = StyleSheet.create({});