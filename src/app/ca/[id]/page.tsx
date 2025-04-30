import { mockCAs } from "@/mock/ca.mock";
import { notFound } from "next/navigation";
import CAProfileWrapper from "@/components/features/profile/CAProfileWrapper";
export { generateStaticParams } from "./params";

export default function CAProfile({ params }: { params: { id: string } }) {
  const ca = mockCAs.find(ca => ca.id === params.id);

  if (!ca) {
    notFound();
  }

  return <CAProfileWrapper ca={ca} />;
}
