import FundingClient from './FundingClient';

// Required for static export with dynamic routes
// For static export, we generate a placeholder page
// The actual routing is handled client-side via SpaRedirectHandler
export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function FundingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FundingClient fundingId={id} />;
}



