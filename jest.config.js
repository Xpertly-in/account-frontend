const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/_*.{js,jsx,ts,tsx}",
    "!src/**/index.{js,ts}",
    "!src/mock/**",
    "!src/tests/**",
    "!src/**/types/**",
  ],
  // Commenting out coverage thresholds for initial testing
  // coverageThreshold: {
  //   global: {
  //     statements: 10,
  //     branches: 10,
  //     functions: 10,
  //     lines: 10,
  //   },
  //   "src/ui/": {
  //     statements: 80,
  //     branches: 60,
  //     functions: 80,
  //     lines: 80,
  //   },
  //   "src/components/layout/": {
  //     statements: 60,
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //   },
  //   "src/helper/": {
  //     statements: 60,
  //     branches: 60,
  //     functions: 60,
  //     lines: 60,
  //   },
  // },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
