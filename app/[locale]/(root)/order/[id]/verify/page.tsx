import PaymentStatus from "./payment-status";

// server component - page.tsx
export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string;locale:string }>;
  searchParams: Promise<{ tap_id: string }>;
}) {
  const { tap_id } = await searchParams;
  const { id, locale } = await params;
  console.log("testing testing" + tap_id);
  return <PaymentStatus tapId={tap_id} orderId={id} locale={locale} />;
}
