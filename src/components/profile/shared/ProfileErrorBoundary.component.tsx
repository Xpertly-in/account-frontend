"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { AlertTriangle, RefreshCw, Home } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ProfileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to external service
    console.error("ProfileErrorBoundary caught an error:", error, errorInfo);
    
    // Update state with error details
    this.setState({ error, errorInfo });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    // Reset error state to retry rendering
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <AlertTriangle 
                  size={48} 
                  weight="bold" 
                  className="text-red-500 dark:text-red-400"
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an error while loading your profile. Please try again or return to the home page.
              </p>
            </div>

            {/* Error Details (Debug Mode) */}
            {this.props.showDetails && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Error Details
                </summary>
                <div className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-auto max-h-32">
                  <p className="font-mono text-red-600 dark:text-red-400 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-400">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white"
              >
                <RefreshCw size={16} weight="bold" />
                Try Again
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home size={16} weight="bold" />
                Go Home
              </Button>
            </div>

            {/* Support Message */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              If this problem persists, please contact TheFinXperts support.
            </p>
          </div>
        </Card>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// Functional wrapper for React hooks compatibility
export function ProfileErrorBoundaryWrapper({
  children,
  fallback,
  showDetails = false,
  onError,
}: Props) {
  return (
    <ProfileErrorBoundary
      fallback={fallback}
      showDetails={showDetails}
      onError={onError}
    >
      {children}
    </ProfileErrorBoundary>
  );
}

// Preset error boundaries for specific contexts
export function ProfileSectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ProfileErrorBoundary
      showDetails={process.env.NODE_ENV === "development"}
      fallback={
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <AlertTriangle size={32} className="text-amber-500 mx-auto" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Section Unavailable
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                This profile section could not be loaded. Please refresh the page.
              </p>
            </div>
          </div>
        </Card>
      }
    >
      {children}
    </ProfileErrorBoundary>
  );
}

export function ProfileFormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ProfileErrorBoundary
      showDetails={process.env.NODE_ENV === "development"}
      fallback={
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <AlertTriangle size={32} className="text-red-500 mx-auto" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Form Error
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                There was an error with the form. Please try refreshing the page.
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              size="sm"
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        </Card>
      }
    >
      {children}
    </ProfileErrorBoundary>
  );
} 