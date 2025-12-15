import FundingClient from './FundingClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export const dynamicParams = process.env.NODE_ENV === 'production' ? false : true;

export default async function FundingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FundingClient fundingId={id} />;
}



