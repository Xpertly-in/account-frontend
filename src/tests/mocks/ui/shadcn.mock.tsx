import React from "react";

/**
 * shadcn UI component mocks for testing
 */

/**
 * Creates mock implementations for shadcn SelectEnhanced components
 */
export const createSelectEnhancedMocks = () => {
  jest.mock("@/ui/SelectEnhanced.ui", () => ({
    Select: ({ children, ...props }: React.PropsWithChildren<{ [key: string]: any }>) => (
      <div data-testid="select-mock" {...props}>
        {children}
      </div>
    ),
    SelectContent: ({ children, ...props }: React.PropsWithChildren<{ [key: string]: any }>) => (
      <div data-testid="select-content-mock" {...props}>
        {children}
      </div>
    ),
    SelectTrigger: ({ children, ...props }: React.PropsWithChildren<{ [key: string]: any }>) => (
      <div data-testid="select-trigger-mock" {...props}>
        {children}
      </div>
    ),
    SelectValue: ({ children, ...props }: React.PropsWithChildren<{ [key: string]: any }>) => (
      <div data-testid="select-value-mock" {...props}>
        {children}
      </div>
    ),
    SelectItem: ({ children, ...props }: React.PropsWithChildren<{ [key: string]: any }>) => (
      <div data-testid="select-item-mock" {...props}>
        {children}
      </div>
    ),
  }));
};

/**
 * Creates mock implementation for shadcn Button component
 */
export const createButtonMock = () => {
  jest.mock("@/ui/Button.ui", () => ({
    Button: ({
      children,
      onClick,
      variant,
      size,
      className,
      ...props
    }: React.PropsWithChildren<{
      onClick?: React.MouseEventHandler;
      variant?: string;
      size?: string;
      className?: string;
      [key: string]: any;
    }>) => (
      <button
        onClick={onClick}
        data-variant={variant}
        data-size={size}
        className={className}
        {...props}
      >
        {children}
      </button>
    ),
  }));
};

/**
 * Creates mock implementation for shadcn Input component
 */
export const createInputMock = () => {
  jest.mock("@/ui/Input.ui", () => ({
    Input: ({
      value,
      onChange,
      className,
      placeholder,
      ...props
    }: {
      value?: string;
      onChange?: React.ChangeEventHandler<HTMLInputElement>;
      className?: string;
      placeholder?: string;
      [key: string]: any;
    }) => (
      <input
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        data-testid="input-mock"
        {...props}
      />
    ),
  }));
};

/**
 * Creates mock implementations for shadcn Card components
 */
export const createCardMocks = () => {
  const mockComponent = ({
    children,
    className,
    ...props
  }: React.PropsWithChildren<{
    className?: string;
    [key: string]: any;
  }>) => (
    <div className={className} {...props}>
      {children}
    </div>
  );

  jest.mock("@/ui/Card.ui", () => ({
    Card: mockComponent,
    CardHeader: mockComponent,
    CardTitle: mockComponent,
    CardDescription: mockComponent,
    CardContent: mockComponent,
    CardFooter: mockComponent,
  }));
};

/**
 * Creates mock implementation for shadcn Badge component
 */
export const createBadgeMock = () => {
  jest.mock("@/ui/Badge.ui", () => ({
    Badge: ({
      children,
      className,
      variant,
      ...props
    }: React.PropsWithChildren<{
      className?: string;
      variant?: string;
      [key: string]: any;
    }>) => (
      <span className={className} data-variant={variant} data-testid="badge-mock" {...props}>
        {children}
      </span>
    ),
  }));
};

/**
 * Creates mock implementation for shadcn Skeleton component
 */
export const createSkeletonMock = () => {
  jest.mock("@/ui/Skeleton.ui", () => ({
    Skeleton: ({ className, ...props }: { className?: string; [key: string]: any }) => (
      <div className={`${className} animate-pulse`} data-testid="skeleton-mock" {...props}></div>
    ),
  }));
};

/**
 * Creates mocks for all shadcn components at once
 */
export const createAllShadcnMocks = () => {
  createSelectEnhancedMocks();
  createButtonMock();
  createInputMock();
  createCardMocks();
  createBadgeMock();
  createSkeletonMock();
};
