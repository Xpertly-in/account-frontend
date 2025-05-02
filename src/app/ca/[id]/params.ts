import { mockCAs } from "@/mock/ca.mock";

export async function generateStaticParams() {
  // Filter out any reserved paths like "onboarding" and "dashboard"
  return mockCAs
    .map(ca => ({
      id: ca.id,
    }))
    .filter(param => param.id !== "onboarding" && param.id !== "dashboard");
}
