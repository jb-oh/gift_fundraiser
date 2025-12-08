'use client';

import { GiftCandidate } from '@/lib/types';
import { FiExternalLink } from 'react-icons/fi';

interface GiftSelectorProps {
  gifts: GiftCandidate[];
  onSelect?: (gift: GiftCandidate) => void;
  selectedGiftId?: string;
}

export default function GiftSelector({
  gifts,
  onSelect,
  selectedGiftId,
}: GiftSelectorProps) {
  if (gifts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">선물 후보</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className={`rounded-lg border-2 p-4 transition-all ${
              selectedGiftId === gift.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {gift.imageUrl && (
              <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={gift.imageUrl}
                  alt={gift.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <h4 className="mb-1 font-semibold text-gray-900">{gift.name}</h4>
            {gift.description && (
              <p className="mb-2 text-sm text-gray-600">{gift.description}</p>
            )}
            <div className="flex items-center justify-between">
              {gift.price && (
                <span className="font-semibold text-gray-900">
                  {gift.price.toLocaleString()}원
                </span>
              )}
              {gift.link && (
                <a
                  href={gift.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  자세히 보기
                  <FiExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {onSelect && (
              <button
                onClick={() => onSelect(gift)}
                className={`mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  selectedGiftId === gift.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {selectedGiftId === gift.id ? '선택됨' : '선택하기'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}





