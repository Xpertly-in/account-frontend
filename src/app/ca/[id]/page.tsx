import { mockCAs } from "@/mock/ca.mock";
import { notFound } from "next/navigation";
import CAProfileWrapper from "@/components/features/profile/CAProfileWrapper";

// Generate static params for the CA profiles at build time
export function generateStaticParams() {
  // Return all CA IDs
  return mockCAs.map(ca => ({
    id: ca.id,
  }));
}

export default function CAProfile({ params }: { params: { id: string } }) {
  const ca = mockCAs.find(ca => ca.id === params.id);

  if (!ca) {
    notFound();
  }

  return <CAProfileWrapper ca={ca} />;
}
