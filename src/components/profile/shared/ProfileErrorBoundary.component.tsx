// ProfileErrorBoundary Component - Error handling and recovery for profile sections
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { Component, ReactNode } from "react";
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { cn } from "@/lib/utils";

interface ProfileErrorBoundaryProps {
  children: ReactNode;
  /** Custom error message */
  fallbackMessage?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Whether to show home navigation */
  showHomeButton?: boolean;
  /** Custom retry callback */
  onRetry?: () => void;
  /** Additional CSS classes */
  className?: string;
}

interface ProfileErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: string;
}

export class ProfileErrorBoundary extends Component<
  ProfileErrorBoundaryProps,
  ProfileErrorBoundaryState
> {
  constructor(props: ProfileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ProfileErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ProfileErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      errorInfo: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      // Default retry: reset error state
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      const {
        fallbackMessage = "Something went wrong with your profile",
        showRetry = true,
        showHomeButton = false,
        className,
      } = this.props;

      return (
        <div className={cn("w-full", className)}>
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Error Icon */}
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertTriangleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/20 animate-ping" />
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Oops! Profile Error
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                  {fallbackMessage}
                </p>
              </div>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="w-full max-w-md">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                    Error Details (Dev Mode)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-left">
                    <div className="font-mono text-red-600 dark:text-red-400">
                      {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div className="mt-2 text-gray-500 dark:text-gray-400 overflow-auto max-h-32">
                        {this.state.errorInfo}
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                {showRetry && (
                  <Button
                    onClick={this.handleRetry}
                    className="flex-1 flex items-center justify-center gap-2"
                    variant="default"
                  >
                    <RefreshCwIcon className="w-4 h-4" />
                    Try Again
                  </Button>
                )}

                {showHomeButton && (
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <HomeIcon className="w-4 h-4" />
                    Go Home
                  </Button>
                )}
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md">
                If this problem persists, please refresh the page or contact support.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper for easier usage in modern React components
export function withProfileErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ProfileErrorBoundaryProps, "children">
) {
  return function WrappedComponent(props: P) {
    return (
      <ProfileErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ProfileErrorBoundary>
    );
  };
}

// Hook for functional components to trigger error boundary
export function useProfileErrorHandler() {
  const throwError = (error: Error) => {
    throw error;
  };

  return { throwError };
}
