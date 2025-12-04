'use client';

import Link from 'next/link';
import { differenceInDays } from 'date-fns';
import { Funding } from '@/lib/types';
import ProgressBar from './ProgressBar';
import { getOccasionLabel } from '@/lib/occasions';

interface FundingCardProps {
  funding: Funding;
}

export default function FundingCard({ funding }: FundingCardProps) {
  const progress = Math.min((funding.currentAmount / funding.targetAmount) * 100, 100);
  const daysRemaining = differenceInDays(new Date(funding.deadline), new Date());
  const isCompleted = funding.currentAmount >= funding.targetAmount;
  const occasionText = getOccasionLabel(funding);

  return (
    <Link
      href={`/funding/${funding.id}`}
      className="block overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {funding.coverImage && (
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
          <img
            src={funding.coverImage}
            alt={funding.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{funding.title}</h3>
          {isCompleted && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              완료
            </span>
          )}
        </div>
        <p className="mb-2 text-sm text-gray-500">
          {funding.recipientName} · {occasionText}
        </p>
        <p className="mb-4 text-sm text-gray-600">
          주최자: {funding.hostName} · {daysRemaining >= 0 ? `${daysRemaining}일 남음` : '마감됨'}
        </p>
        <ProgressBar funding={funding} />
      </div>
    </Link>
  );
}

