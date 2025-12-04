'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFunding } from '@/lib/storage';
import { Funding } from '@/lib/types';
import { FundingProvider, useFunding } from '@/contexts/FundingContext';
import ProgressBar from '@/components/ProgressBar';
import ParticipantList from '@/components/ParticipantList';
import GiftSelector from '@/components/GiftSelector';
import ShareButton from '@/components/ShareButton';
import { FiArrowLeft, FiCopy, FiCheck, FiGift } from 'react-icons/fi';
import Link from 'next/link';
import { differenceInDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

function DashboardContent() {
  const { funding, contributions, loading, refreshFunding } = useFunding();
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState<string | undefined>();

  useEffect(() => {
    refreshFunding();
    const interval = setInterval(refreshFunding, 2000);
    return () => clearInterval(interval);
  }, [refreshFunding]);

  useEffect(() => {
    // Verify the logged-in user is the host of this funding
    if (!loading && funding && user && funding.hostId !== user.id) {
      alert('이 대시보드에 접근할 권한이 없습니다.');
      router.push('/');
    }
  }, [loading, funding, user, router]);

  const handleCopyLink = async () => {
    if (!funding) return;
    const url = typeof window !== 'undefined' 
      ? `${window.location.origin}/funding/${funding.id}` 
      : '';
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePurchaseGift = () => {
    if (!selectedGiftId) {
      alert('선물을 선택해주세요.');
      return;
    }
    alert('선물 구매 기능은 추후 구현될 예정입니다.');
  };

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

  const isGoalReached = funding.currentAmount >= funding.targetAmount;
  const daysRemaining = differenceInDays(new Date(funding.deadline), new Date());
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/funding/${funding.id}` 
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">대시보드</h1>
          <p className="mt-2 text-gray-600">
            {funding.title}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">총 모금액</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {funding.currentAmount.toLocaleString()}원
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">참여자 수</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {contributions.length}명
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-600">남은 기간</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {daysRemaining >= 0 ? `${daysRemaining}일` : '마감됨'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <ProgressBar funding={funding} />
        </div>

        {/* Share Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">펀딩 공유하기</h2>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  복사됨
                </>
              ) : (
                <>
                  <FiCopy className="h-4 w-4" />
                  복사
                </>
              )}
            </button>
          </div>
          <ShareButton url={shareUrl} title={funding.title} />
        </div>

        {/* Gift Selection */}
        {funding.giftCandidates.length > 0 && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
            <GiftSelector
              gifts={funding.giftCandidates}
              onSelect={(gift) => setSelectedGiftId(gift.id)}
              selectedGiftId={selectedGiftId}
            />
            {isGoalReached && (
              <button
                onClick={handlePurchaseGift}
                disabled={!selectedGiftId}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiGift className="h-5 w-5" />
                선물 구매하기
              </button>
            )}
          </div>
        )}

        {/* Participants */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ParticipantList funding={funding} contributions={contributions} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const fundingId = params.id as string;

  return (
    <ProtectedRoute>
      <FundingProvider fundingId={fundingId}>
        <DashboardContent />
      </FundingProvider>
    </ProtectedRoute>
  );
}



