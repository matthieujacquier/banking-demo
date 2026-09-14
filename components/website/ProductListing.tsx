import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import DYContext from "@/components/DYContext";
import ProductCard from "@/components/website/ProductCard";
import CreditCardTile from "@/components/website/CreditCardTile";
import { productsByCategory, type ProductCategory } from "@/lib/products";
import { CATEGORY_CONFIG } from "@/lib/catalog-config";

// A category listing page: dark hero with stats, then the product grid DY can
// target via id="dy-{category}-grid".
export default function ProductListing({ category }: { category: ProductCategory }) {
  const cfg = CATEGORY_CONFIG[category];
  const products = productsByCategory(category);

  return (
    <div className="flex flex-col min-h-screen">
      <DYContext context={{ type: "CATEGORY", data: [category] }} />
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0B0D12] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: cfg.eyebrowColor }}>
            {cfg.eyebrow}
          </p>
          <h1 className="text-5xl font-bold mb-4" style={{ letterSpacing: "-0.025em" }}>
            {cfg.title}
          </h1>
          <p className="text-[#6B7280] max-w-xl text-lg mb-10">{cfg.subtitle}</p>
          <div className="flex flex-wrap gap-10">
            {cfg.heroStats(products).map(([value, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>
                  {value}
                </p>
                <p className="text-[#6B7280] text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section id={cfg.dyId} className="py-20 px-6 bg-[#F6F7FB] flex-1">
        <div className={`max-w-7xl mx-auto grid ${cfg.gridCols} gap-6`}>
          {products.map((product) =>
            cfg.bespoke === "cards" ? (
              <CreditCardTile key={product.sku} product={product} />
            ) : (
              <ProductCard key={product.sku} product={product} />
            ),
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
