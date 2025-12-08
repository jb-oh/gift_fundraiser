'use client';

import { Contribution, Funding } from '@/lib/types';
import MessageCard from './MessageCard';

interface ParticipantListProps {
  funding: Funding;
  contributions: Contribution[];
}

export default function ParticipantList({ funding, contributions }: ParticipantListProps) {
  const sortedContributions = [...contributions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (sortedContributions.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">아직 참여자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          참여자 ({sortedContributions.length}명)
        </h3>
      </div>
      <div className="space-y-3">
        {sortedContributions.map((contribution) => (
          <MessageCard
            key={contribution.id}
            contribution={contribution}
            showName={funding.transparencySettings.showNames}
            showAmount={funding.transparencySettings.showAmounts}
          />
        ))}
      </div>
    </div>
  );
}





