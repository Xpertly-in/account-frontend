import React from "react";

/**
 * Phosphor icon mocks for testing
 */

/**
 * Creates mock implementations for commonly used Phosphor icons
 */
export const createPhosphorIconsMocks = () => {
  jest.mock("@phosphor-icons/react", () => ({
    // General UI icons
    CaretDown: () => <div data-testid="caret-down-icon" />,
    Check: () => <div data-testid="check-icon" />,
    X: () => <div data-testid="close-icon" />,
    MagnifyingGlass: () => <div data-testid="search-icon" />,
    Plus: () => <div data-testid="plus-icon" />,
    Minus: () => <div data-testid="minus-icon" />,
    ArrowLeft: () => <div data-testid="arrow-left-icon" />,
    ArrowRight: () => <div data-testid="arrow-right-icon" />,

    // Notification and status icons
    Bell: () => <div data-testid="bell-icon" />,
    BellRinging: () => <div data-testid="bell-ringing-icon" />,
    CheckCircle: () => <div data-testid="check-circle-icon" />,
    Warning: () => <div data-testid="warning-icon" />,
    Info: () => <div data-testid="info-icon" />,

    // Dashboard specific icons
    EnvelopeOpen: () => <div data-testid="envelope-icon" />,
    FunnelSimple: () => <div data-testid="filter-icon" />,
    Gear: () => <div data-testid="gear-icon" />,
    User: () => <div data-testid="user-icon" />,
    Users: () => <div data-testid="users-icon" />,
    Calendar: () => <div data-testid="calendar-icon" />,
    FileText: () => <div data-testid="file-text-icon" />,
    ChartLine: () => <div data-testid="chart-line-icon" />,
    SignOut: () => <div data-testid="sign-out-icon" />,

    // Form and input icons
    Eye: () => <div data-testid="eye-icon" />,
    EyeSlash: () => <div data-testid="eye-slash-icon" />,
    Upload: () => <div data-testid="upload-icon" />,

    // Allow dynamic icons with Icon component
    Icon: ({ icon, ...props }: { icon: string; [key: string]: any }) => (
      <div data-testid={`${icon.toLowerCase()}-icon`} {...props} />
    ),
  }));
};

/**
 * Creates a targeted subset of Phosphor icon mocks for dashboard-specific tests
 */
export const createDashboardIconMocks = () => {
  jest.mock("@phosphor-icons/react", () => ({
    EnvelopeOpen: () => <div data-testid="envelope-icon" />,
    FunnelSimple: () => <div data-testid="filter-icon" />,
    MagnifyingGlass: () => <div data-testid="search-icon" />,
    X: () => <div data-testid="close-icon" />,
    Plus: () => <div data-testid="plus-icon" />,
    CheckCircle: () => <div data-testid="check-circle-icon" />,
    Warning: () => <div data-testid="warning-icon" />,
    ChartLine: () => <div data-testid="chart-line-icon" />,
  }));
};
