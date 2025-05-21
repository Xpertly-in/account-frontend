import React from "react";

/**
 * Navigation-related mocks for testing
 */

/**
 * Creates mock implementations for Next.js navigation hooks and components
 * @returns Object containing mock implementations that can be controlled in tests
 */
export const createNavigationMocks = () => {
  const usePathnameMock = jest.fn().mockReturnValue("/test-page");
  const useSearchParamsMock = jest.fn().mockReturnValue({
    toString: () => "?param=value",
    get: jest.fn(),
  });
  const useRouterMock = jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  });

  jest.mock("next/navigation", () => ({
    __esModule: true,
    usePathname: usePathnameMock,
    useSearchParams: useSearchParamsMock,
    useRouter: useRouterMock,
  }));

  return {
    usePathnameMock,
    useSearchParamsMock,
    useRouterMock,
  };
};

/**
 * Creates mock implementations for Next.js Link and other routing components
 */
export const createNextLinkMock = () => {
  jest.mock("next/link", () => {
    const MockLink = ({
      children,
      href,
      ...rest
    }: React.PropsWithChildren<{ href: string; [key: string]: any }>) => (
      <a href={href} data-testid="next-link" {...rest}>
        {children}
      </a>
    );
    MockLink.displayName = "MockNextLink";
    return MockLink;
  });
};
