import { Container } from "@/components/layout/Container.component";
import { SearchBar } from "@/components/features/SearchBar.component";
import { CACard } from "@/components/features/CACard.component";
import { mockCAs } from "@/lib/utils/ca.utils";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { location?: string; service?: string };
}) {
  // In a real application, we would filter CAs based on search parameters
  // For now, we'll just display all mock CAs
  const filteredCAs = mockCAs;

  return (
    <Container>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Find a CA</h1>
          <p className="text-muted-foreground">
            Search for verified Chartered Accountants in your area
          </p>
        </div>

        <div className="my-6">
          <SearchBar />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCAs.map(ca => (
            <CACard key={ca.id} ca={ca} />
          ))}
        </div>

        {filteredCAs.length === 0 && (
          <div className="mt-12 text-center">
            <h2 className="text-xl font-semibold">No results found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </Container>
  );
}
