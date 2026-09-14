import { notFound } from "next/navigation";
import ProductDetail from "@/components/website/ProductDetail";
import { productBySlug } from "@/lib/catalog-config";
import { productsByCategory, slugOf } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return productsByCategory("Accounts").map((p) => ({ slug: slugOf(p) }));
}

export default async function AccountProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug("Accounts", slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
