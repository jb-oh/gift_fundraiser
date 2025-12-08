'use client';

import { useState } from 'react';
import { PaymentMethod } from '@/lib/mockPayment';
import { processPayment } from '@/lib/mockPayment';
import { addContribution, generateId } from '@/lib/storage';
import { useFunding } from '@/contexts/FundingContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface PaymentFormProps {
  fundingId: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ fundingId, onSuccess }: PaymentFormProps) {
  const { refreshFunding } = useFunding();
  const { isAuthenticated, user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [contributorName, setContributorName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetAmounts = [10000, 20000, 30000, 50000, 100000];

  const handleAmountSelect = (preset: number) => {
    setAmount(preset);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value.replace(/,/g, ''), 10);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    } else {
      setAmount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (amount <= 0) {
      setError('금액을 입력해주세요.');
      return;
    }

    if (!contributorName.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // Process payment
      const paymentResult = await processPayment({
        amount,
        method: paymentMethod,
        contributorName: contributorName.trim(),
      });

      if (!paymentResult.success) {
        setError(paymentResult.error || '결제 처리에 실패했습니다.');
        setLoading(false);
        return;
      }

      // Add contribution
      addContribution({
        id: generateId(),
        fundingId,
        contributorName: contributorName.trim(),
        amount,
        message: message.trim(),
        isAnonymous,
        timestamp: new Date().toISOString(),
        paymentMethod,
      });

      // Refresh funding data
      refreshFunding();

      // Reset form
      setAmount(0);
      setCustomAmount('');
      setContributorName('');
      setMessage('');
      setIsAnonymous(false);

      // Show success
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="rounded-lg border-2 border-pink-200 bg-pink-50 p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
          <span className="text-3xl">🔒</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">로그인이 필요합니다</h3>
        <p className="mt-2 text-gray-600">
          펀딩에 참여하려면 로그인이 필요합니다
        </p>
        <Link
          href="/auth"
          className="mt-6 inline-block rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
        >
          로그인 / 회원가입
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900">기여하기</h3>

      {/* Amount Selection */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          금액 선택
        </label>
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleAmountSelect(preset)}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                amount === preset && customAmount === ''
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {preset.toLocaleString()}원
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="직접 입력"
          value={customAmount}
          onChange={(e) => handleCustomAmountChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Payment Method */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          결제 수단
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['card', 'account', 'pay'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors ${
                paymentMethod === method
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {method === 'card' ? '카드' : method === 'account' ? '계좌' : '페이'}
            </button>
          ))}
        </div>
      </div>

      {/* Contributor Name */}
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
          이름
        </label>
        <input
          id="name"
          type="text"
          value={contributorName}
          onChange={(e) => setContributorName(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="이름을 입력해주세요"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
          축하 메시지
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="생일 축하 메시지를 작성해주세요"
        />
      </div>

      {/* Anonymous Option */}
      <div className="flex items-center">
        <input
          id="anonymous"
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
          익명으로 기여하기
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || amount <= 0}
        className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? '처리 중...' : `${amount.toLocaleString()}원 기여하기`}
      </button>
    </form>
  );
}





