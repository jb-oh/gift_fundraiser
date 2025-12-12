'use client';

import { format } from 'date-fns';
import { Contribution } from '@/lib/types';

interface MessageCardProps {
  contribution: Contribution;
  showName?: boolean;
  showAmount?: boolean;
}

export default function MessageCard({
  contribution,
  showName = true,
  showAmount = false,
}: MessageCardProps) {
  const displayName = contribution.isAnonymous ? '익명' : contribution.contributorName;

  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-pink-50 to-rose-50 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-400 text-white font-semibold">
            {displayName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(contribution.timestamp), 'yyyy.MM.dd HH:mm')}
            </p>
          </div>
        </div>
        {showAmount && (
          <span className="text-lg font-bold text-gray-900">
            {contribution.amount.toLocaleString()}원
          </span>
        )}
      </div>
      {contribution.message && (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {contribution.message}
        </p>
      )}
    </div>
  );
}








