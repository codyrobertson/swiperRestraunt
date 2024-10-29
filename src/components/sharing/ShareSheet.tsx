import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { EnhancedRestaurant } from "../../services/googlePlacesService";
import { Social } from "@nativescript/social";

interface ShareSheetProps {
  visible: boolean;
  onClose: () => void;
  restaurant: EnhancedRestaurant;
  sessionId?: string;
}

export function ShareSheet({ visible, onClose, restaurant, sessionId }: ShareSheetProps) {
  if (!visible) return null;

  const handleShare = async () => {
    const social = new Social();
    let shareText = `Check out ${restaurant.name}! ${restaurant.details.website}`;
    
    if (sessionId) {
      shareText += `\n\nJoin my restaurant matching session: https://your-app-domain.com/join/${sessionId}`;
    }
    
    try {
      await social.shareText(shareText);
    } catch (error) {
      console.error('Error sharing:', error);
    }
    onClose();
  };

  return (
    <absoluteLayout className="bg-black bg-opacity-50" style={styles.overlay}>
      <stackLayout className="bg-white rounded-t-lg p-4" style={styles.sheet}>
        <label className="text-xl font-bold mb-4">Share</label>
        
        <button
          className="bg-blue-500 text-white p-4 rounded-lg mb-2"
          onTap={handleShare}
        >
          Share {sessionId ? 'Session' : 'Restaurant'}
        </button>
        
        <button
          className="bg-gray-200 p-4 rounded-lg"
          onTap={onClose}
        >
          Cancel
        </button>
      </stackLayout>
    </absoluteLayout>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: "100%",
    height: "100%",
  },
  sheet: {
    width: "100%",
    verticalAlignment: "bottom",
  },
});