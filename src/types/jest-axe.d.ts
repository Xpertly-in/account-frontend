declare module "jest-axe" {
  export interface AxeResults {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
  }

  export interface RunOptions {
    rules?: any;
    context?: any;
    runOnly?: {
      type: "tag" | "rule";
      values: string[];
    };
    resultTypes?: ("violations" | "passes" | "incomplete" | "inapplicable")[];
  }

  export function axe(
    element: Element | Document | React.ReactElement,
    options?: RunOptions
  ): Promise<AxeResults>;

  export function toHaveNoViolations(): jest.CustomMatcherResult;
}
