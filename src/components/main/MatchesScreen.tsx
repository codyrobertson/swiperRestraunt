import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../../NavigationParamList";

type MatchesScreenProps = {
  navigation: FrameNavigationProp<MainStackParamList, "Matches">;
};

export function MatchesScreen({ navigation }: MatchesScreenProps) {
  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4">Your Matches</label>
      <label className="text-gray-500">No matches yet</label>
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