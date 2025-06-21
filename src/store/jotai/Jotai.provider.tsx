"use client";

import { Provider } from "jotai/react";
import { ReactNode } from "react";

interface JotaiProviderProps {
  children: ReactNode;
}

export function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
