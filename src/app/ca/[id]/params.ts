import { mockCAs } from "@/mock/ca.mock";

export async function generateStaticParams() {
  return mockCAs.map((ca) => ({
    id: ca.id,
  }));
}