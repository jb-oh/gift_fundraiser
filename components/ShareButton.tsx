'use client';

import { useState } from 'react';
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';

interface ShareButtonProps {
  url: string;
  title?: string;
  description?: string;
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKakaoShare = () => {
    // Kakao SDK integration would go here
    // For now, fallback to copy
    handleCopy();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {copied ? (
          <>
            <FiCheck className="h-4 w-4" />
            복사됨
          </>
        ) : (
          <>
            <FiCopy className="h-4 w-4" />
            링크 복사
          </>
        )}
      </button>
      <button
        onClick={handleKakaoShare}
        className="flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-yellow-500"
      >
        <FiShare2 className="h-4 w-4" />
        카카오톡 공유
      </button>
    </div>
  );
}



