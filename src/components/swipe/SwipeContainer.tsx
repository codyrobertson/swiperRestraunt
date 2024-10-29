import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { GestureEventData, PanGestureEventData } from "@nativescript/core";
import { Restaurant, RestaurantCard } from "../restaurant/RestaurantCard";

interface SwipeContainerProps {
  restaurants: Restaurant[];
  onSwipeLeft: (restaurant: Restaurant) => void;
  onSwipeRight: (restaurant: Restaurant) => void;
  row?: number;
}

export function SwipeContainer({ restaurants, onSwipeLeft, onSwipeRight, row }: SwipeContainerProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [translateX, setTranslateX] = React.useState(0);
  const [rotating, setRotating] = React.useState(false);

  const handlePan = (args: PanGestureEventData) => {
    if (args.state === 1) { // BEGAN
      setTranslateX(0);
      setRotating(true);
    } else if (args.state === 2) { // CHANGED
      setTranslateX(args.deltaX);
    } else if (args.state === 3) { // ENDED
      setRotating(false);
      const threshold = 100;
      if (args.deltaX < -threshold) {
        onSwipeLeft(restaurants[currentIndex]);
        setCurrentIndex(prev => Math.min(prev + 1, restaurants.length - 1));
      } else if (args.deltaX > threshold) {
        onSwipeRight(restaurants[currentIndex]);
        setCurrentIndex(prev => Math.min(prev + 1, restaurants.length - 1));
      }
      setTranslateX(0);
    }
  };

  if (!restaurants.length || currentIndex >= restaurants.length) {
    return (
      <flexboxLayout row={row} style={styles.container}>
        <label className="text-xl text-gray-500">No more restaurants!</label>
        <button
          className="bg-blue-500 text-white p-4 rounded-lg mt-4"
          text="Reset"
          onTap={() => setCurrentIndex(0)}
        />
      </flexboxLayout>
    );
  }

  const rotation = (translateX / 400) * 15; // Max 15 degree rotation

  return (
    <gridLayout row={row} style={styles.container}>
      <gridLayout
        translateX={translateX}
        rotate={rotating ? rotation : 0}
        onPan={handlePan}
        className="w-full h-full"
      >
        <RestaurantCard restaurant={restaurants[currentIndex]} />
      </gridLayout>
      
      <stackLayout className="absolute bottom-0 w-full p-4 flex-row justify-around">
        <button 
          className="bg-red-500 text-white rounded-full w-16 h-16"
          text="✕"
          onTap={() => {
            onSwipeLeft(restaurants[currentIndex]);
            setCurrentIndex(prev => Math.min(prev + 1, restaurants.length - 1));
          }}
        />
        <button 
          className="bg-green-500 text-white rounded-full w-16 h-16"
          text="♥"
          onTap={() => {
            onSwipeRight(restaurants[currentIndex]);
            setCurrentIndex(prev => Math.min(prev + 1, restaurants.length - 1));
          }}
        />
      </stackLayout>
    </gridLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});