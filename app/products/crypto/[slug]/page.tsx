import { notFound } from "next/navigation";
import ProductDetail from "@/components/website/ProductDetail";
import { productBySlug } from "@/lib/catalog-config";
import { productsByCategory, slugOf } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return productsByCategory("Crypto").map((p) => ({ slug: slugOf(p) }));
}

export default async function CryptoProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug("Crypto", slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
