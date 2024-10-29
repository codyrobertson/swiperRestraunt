import * as React from 'react';
import { StyleSheet } from 'react-nativescript';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // TODO: Send error to logging service
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <flexboxLayout style={styles.container}>
          <label className="text-xl font-bold mb-4">Something went wrong</label>
          <label className="text-gray-600 mb-4">{this.state.error?.message}</label>
          <button
            className="bg-blue-500 text-white p-4 rounded-lg"
            onTap={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </flexboxLayout>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});