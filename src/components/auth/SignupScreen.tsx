import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";

type SignupScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Signup">;
};

export function SignupScreen({ navigation }: SignupScreenProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  const handleSignup = () => {
    // TODO: Implement signup logic
    console.log("Signup:", { email, password, name });
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-8 font-bold">Create Account</label>
      
      <textField
        className="w-3/4 p-4 mb-4 border rounded-lg"
        hint="Full Name"
        text={name}
        onTextChange={(args) => setName(args.value)}
      />

      <textField
        className="w-3/4 p-4 mb-4 border rounded-lg"
        hint="Email"
        keyboardType="email"
        text={email}
        onTextChange={(args) => setEmail(args.value)}
      />
      
      <textField
        className="w-3/4 p-4 mb-6 border rounded-lg"
        hint="Password"
        secure={true}
        text={password}
        onTextChange={(args) => setPassword(args.value)}
      />
      
      <button
        className="bg-blue-500 text-white p-4 rounded-lg w-3/4"
        onTap={handleSignup}
      >
        Sign Up
      </button>
      
      <button
        className="mt-4 text-blue-500"
        onTap={() => navigation.navigate("Login")}
      >
        Already have an account? Login
      </button>
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