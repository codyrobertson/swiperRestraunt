import { BaseNavigationContainer } from '@react-navigation/core';
import * as React from "react";
import { stackNavigatorFactory } from "react-nativescript-navigation";
import { LoginScreen } from "./auth/LoginScreen";
import { SignupScreen } from "./auth/SignupScreen";
import { GroupSessionScreen } from "./session/GroupSessionScreen";
import { SwipeScreen } from "./main/SwipeScreen";
import { MatchesScreen } from "./main/MatchesScreen";
import { PreferencesScreen } from "./preferences/PreferencesScreen";
import { RestaurantDetailsScreen } from "./restaurant/RestaurantDetailsScreen";
import { authStore } from "../services/authStore";
import { AppleAuthService } from "../services/appleAuthService";

const StackNavigator = stackNavigatorFactory();

export const MainStack = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [initializing, setInitializing] = React.useState(true);

  React.useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userId = await AppleAuthService.getCurrentUser();
      if (userId) {
        authStore.setUser({ id: userId });
        setIsAuthenticated(true);
      }
    } finally {
      setInitializing(false);
    }
  };

  if (initializing) {
    return (
      <flexboxLayout className="items-center justify-center">
        <activityIndicator busy={true} />
      </flexboxLayout>
    );
  }

  return (
    <BaseNavigationContainer>
      <StackNavigator.Navigator
        initialRouteName={isAuthenticated ? "GroupSession" : "Login"}
        screenOptions={{
          headerShown: true,
        }}
      >
        {!isAuthenticated ? (
          <>
            <StackNavigator.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <StackNavigator.Screen
              name="GroupSession"
              component={GroupSessionScreen}
              options={{ title: "Group Session" }}
            />
            <StackNavigator.Screen
              name="Preferences"
              component={PreferencesScreen}
              options={{ title: "Preferences" }}
            />
            <StackNavigator.Screen
              name="Swipe"
              component={SwipeScreen}
              options={{ title: "Find Restaurants" }}
            />
            <StackNavigator.Screen
              name="Matches"
              component={MatchesScreen}
              options={{ title: "Your Matches" }}
            />
            <StackNavigator.Screen
              name="RestaurantDetails"
              component={RestaurantDetailsScreen}
              options={{ title: "Restaurant Details" }}
            />
          </>
        )}
      </StackNavigator.Navigator>
    </BaseNavigationContainer>
  );
};