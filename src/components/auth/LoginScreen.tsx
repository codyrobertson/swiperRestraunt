import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";
import { AppleAuthService } from "../../services/appleAuthService";

type LoginScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Login">;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const [loading, setLoading] = React.useState(false);

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const response = await AppleAuthService.signIn();
      
      if (response.userId) {
        // Navigate to preferences if it's a new user, or directly to sessions if returning
        const isNewUser = !response.email; // Apple only provides email on first sign in
        navigation.navigate(isNewUser ? "Preferences" : "GroupSession");
      }
    } catch (error) {
      console.error('Apple Sign In failed:', error);
      // TODO: Show error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-8 font-bold">Welcome to Restaurant Matcher!</label>
      
      <button
        className="bg-black text-white p-4 rounded-lg w-3/4 mb-4"
        text={loading ? "Signing in..." : "Sign in with Apple"}
        onTap={handleAppleSignIn}
        isEnabled={!loading}
      />
      
      <label className="text-sm text-gray-500 text-center px-8">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </label>
    </flexboxLayout>
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