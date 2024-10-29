import * as React from 'react';
import { StyleSheet } from 'react-nativescript';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message = 'Loading...' }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <absoluteLayout style={styles.overlay}>
      <stackLayout style={styles.container}>
        <activityIndicator busy={true} className="mb-4" />
        <label className="text-white text-lg">{message}</label>
      </stackLayout>
    </absoluteLayout>
  );
}

const styles = StyleSheet.create({
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});