import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import SearchBox from "@/components/website/SearchBox";
import SearchResults from "@/components/website/SearchResults";

// Experience Search results. The query is read server-side (searchParams is a
// Promise in Next 16) and handed to the client component, which calls
// /api/dy/search — DY Semantic Search with a local fallback.
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "OTHER", data: ["SEARCH"] }} />
      <Navbar />

      <section id="dy-search-hero" className="bg-[#0B0D12] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#2563FF] text-xs font-bold uppercase tracking-widest mb-4">Search</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ letterSpacing: "-0.025em" }}>
            {q ? "Search results" : "What are you looking for?"}
          </h1>
          <SearchBox variant="hero" defaultValue={q} />
          <p className="text-[#6B7280] text-sm mt-4 max-w-2xl">
            Describe what you need in your own words — semantic search understands intent, not just keywords.
          </p>
        </div>
      </section>

      <SearchResults key={q} initialQuery={q} />

      <Footer />
    </div>
  );
}
