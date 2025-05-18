import React from "react";

/**
 * Next.js component mocks for testing
 */

/**
 * Creates mock implementations for Next.js Script component
 */
export const createNextScriptMock = () => {
  jest.mock("next/script", () => ({
    __esModule: true,
    default: ({ id, strategy, src, dangerouslySetInnerHTML }: any) => (
      <script
        data-testid={id || "script"}
        data-strategy={strategy}
        data-src={src}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    ),
  }));
};

/**
 * Creates mock implementation for Next.js Image component
 */
export const createNextImageMock = () => {
  jest.mock("next/image", () => {
    const MockImage = ({
      src,
      alt,
      width,
      height,
      ...rest
    }: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      [key: string]: any;
    }) => (
      <img src={src} alt={alt} width={width} height={height} data-testid="next-image" {...rest} />
    );
    MockImage.displayName = "MockNextImage";
    return MockImage;
  });
};

/**
 * Creates mocks for all Next.js components at once
 */
export const createAllNextComponentMocks = () => {
  createNextScriptMock();
  createNextImageMock();
};
