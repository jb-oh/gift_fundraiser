'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFunding } from '@/lib/storage';
import { Funding } from '@/lib/types';
import { FundingProvider, useFunding } from '@/contexts/FundingContext';
import ProgressBar from '@/components/ProgressBar';
import PaymentForm from '@/components/PaymentForm';
import ParticipantList from '@/components/ParticipantList';
import GiftSelector from '@/components/GiftSelector';
import ShareButton from '@/components/ShareButton';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

function FundingContent() {
  const { funding, contributions, loading, refreshFunding } = useFunding();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-pink-500 border-t-transparent mx-auto" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!funding) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">펀딩을 찾을 수 없습니다</h2>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/funding/${funding.id}` : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Link>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
            기여해주셔서 감사합니다! 🎉
          </div>
        )}

        {/* Cover Image */}
        {funding.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg shadow-lg">
            <img
              src={funding.coverImage}
              alt={funding.title}
              className="h-64 w-full object-cover sm:h-96"
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {funding.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">주최자: {funding.hostName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <ProgressBar funding={funding} />
        </div>

        {/* Share Button */}
        <div className="mb-8">
          <ShareButton url={shareUrl} title={funding.title} />
        </div>

        {/* Gift Candidates */}
        {funding.giftCandidates.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <GiftSelector gifts={funding.giftCandidates} />
          </div>
        )}

        {/* Payment Form */}
        <div className="mb-8">
          <PaymentForm
            fundingId={funding.id}
            onSuccess={() => {
              setShowSuccess(true);
              refreshFunding();
            }}
          />
        </div>

        {/* Participants */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ParticipantList funding={funding} contributions={contributions} />
        </div>
      </div>
    </div>
  );
}

export default function FundingPage() {
  const params = useParams();
  const fundingId = params.id as string;

  return (
    <FundingProvider fundingId={fundingId}>
      <FundingContent />
    </FundingProvider>
  );
}



