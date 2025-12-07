import FundingClient from './FundingClient';

// Required for static export with dynamic routes
export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  // Since funding IDs are stored in localStorage (client-side),
  // we can't know them at build time. Return a placeholder and handle routing client-side.
  // The actual routing will work client-side via Next.js router.
  return [{ id: 'placeholder' }];
}

export default function FundingPage({ params }: { params: { id: string } }) {
  return <FundingClient fundingId={params.id} />;
}



