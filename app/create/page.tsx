'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateId } from '@/lib/storage';
import { saveFunding } from '@/lib/storage';
import { Funding, GiftCandidate, TransparencySettings, OccasionType } from '@/lib/types';
import { FiArrowLeft, FiArrowRight, FiPlus, FiX } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { occasionLabels } from '@/lib/occasions';

function CreateFundingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Funding>>({
    hostName: user?.name || '',
    title: '',
    recipientName: '',
    occasion: 'birthday' as OccasionType,
    customOccasion: '',
    targetAmount: 0,
    deadline: '',
    coverImage: '',
    giftCandidates: [],
    transparencySettings: {
      showAmounts: true,
      showNames: true,
      showGoal: true,
    },
  });

  const [newGift, setNewGift] = useState<Partial<GiftCandidate>>({
    name: '',
    description: '',
    imageUrl: '',
    link: '',
    price: 0,
  });

  const handleInputChange = (field: keyof Funding, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransparencyChange = (field: keyof TransparencySettings, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      transparencySettings: {
        ...prev.transparencySettings!,
        [field]: value,
      },
    }));
  };

  const addGift = () => {
    if (!newGift.name) return;

    const gift: GiftCandidate = {
      id: generateId(),
      name: newGift.name!,
      description: newGift.description,
      imageUrl: newGift.imageUrl,
      link: newGift.link,
      price: newGift.price,
    };

    setFormData((prev) => ({
      ...prev,
      giftCandidates: [...(prev.giftCandidates || []), gift],
    }));

    setNewGift({
      name: '',
      description: '',
      imageUrl: '',
      link: '',
      price: 0,
    });
  };

  const removeGift = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      giftCandidates: prev.giftCandidates?.filter((g) => g.id !== id) || [],
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.hostName ||
      !formData.title ||
      !formData.recipientName ||
      !formData.targetAmount ||
      !formData.deadline
    ) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.occasion === 'other' && !formData.customOccasion) {
      alert('기타 행사 내용을 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    const funding: Funding = {
      id: generateId(),
      hostId: user.id,
      hostName: formData.hostName,
      title: formData.title,
      recipientName: formData.recipientName,
      occasion: formData.occasion!,
      customOccasion: formData.customOccasion,
      targetAmount: formData.targetAmount,
      currentAmount: 0,
      deadline: formData.deadline,
      coverImage: formData.coverImage || undefined,
      giftCandidates: formData.giftCandidates || [],
      transparencySettings: formData.transparencySettings!,
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    saveFunding(funding);
    router.push(`/dashboard/${funding.id}`);
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title || !formData.recipientName || !formData.hostName)) {
      alert('제목, 받는 분, 주최자 이름을 입력해주세요.');
      return;
    }
    if (step === 2 && (!formData.targetAmount || !formData.deadline)) {
      alert('목표 금액과 마감일을 입력해주세요.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step >= s
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-16 ${
                      step > s ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-lg">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  펀딩 제목 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="예: 홍길동님의 생일 선물"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  행사 종류 *
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => handleInputChange('occasion', e.target.value as OccasionType)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  {Object.entries(occasionLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.occasion === 'other' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    행사 내용 *
                  </label>
                  <input
                    type="text"
                    value={formData.customOccasion}
                    onChange={(e) => handleInputChange('customOccasion', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="예: 취업 축하"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  받는 분 이름 *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => handleInputChange('recipientName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="예: 홍길동"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  주최자 이름 *
                </label>
                <input
                  type="text"
                  value={formData.hostName}
                  onChange={(e) => handleInputChange('hostName', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="예: 김철수"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  커버 이미지 URL (선택)
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          )}

          {/* Step 2: Goal & Deadline */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">목표 설정</h2>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  목표 금액 (원) *
                </label>
                <input
                  type="number"
                  value={formData.targetAmount || ''}
                  onChange={(e) => handleInputChange('targetAmount', parseInt(e.target.value, 10))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="예: 100000"
                  min="1"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  마감일 *
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          {/* Step 3: Gift Candidates */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">선물 후보</h2>
              <div className="space-y-4">
                {formData.giftCandidates?.map((gift) => (
                  <div
                    key={gift.id}
                    className="flex items-start justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{gift.name}</h4>
                      {gift.description && (
                        <p className="text-sm text-gray-600">{gift.description}</p>
                      )}
                      {gift.price && (
                        <p className="text-sm font-medium text-gray-700">
                          {gift.price.toLocaleString()}원
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeGift(gift.id)}
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                <input
                  type="text"
                  placeholder="선물 이름 *"
                  value={newGift.name}
                  onChange={(e) => setNewGift((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="설명 (선택)"
                  value={newGift.description}
                  onChange={(e) =>
                    setNewGift((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="url"
                  placeholder="이미지 URL (선택)"
                  value={newGift.imageUrl}
                  onChange={(e) =>
                    setNewGift((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="url"
                  placeholder="링크 (선택)"
                  value={newGift.link}
                  onChange={(e) => setNewGift((prev) => ({ ...prev, link: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="number"
                  placeholder="가격 (원, 선택)"
                  value={newGift.price || ''}
                  onChange={(e) =>
                    setNewGift((prev) => ({ ...prev, price: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={addGift}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <FiPlus className="h-4 w-4" />
                  선물 추가
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Transparency Settings */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">공개 설정</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">금액 공개</span>
                  <input
                    type="checkbox"
                    checked={formData.transparencySettings?.showAmounts}
                    onChange={(e) =>
                      handleTransparencyChange('showAmounts', e.target.checked)
                    }
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">참여자 이름 공개</span>
                  <input
                    type="checkbox"
                    checked={formData.transparencySettings?.showNames}
                    onChange={(e) => handleTransparencyChange('showNames', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">목표 금액 공개</span>
                  <input
                    type="checkbox"
                    checked={formData.transparencySettings?.showGoal}
                    onChange={(e) => handleTransparencyChange('showGoal', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 disabled:opacity-50"
            >
              <FiArrowLeft className="h-4 w-4" />
              이전
            </button>
            {step < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-white"
              >
                다음
                <FiArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-white"
              >
                펀딩 만들기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateFundingPage() {
  return (
    <ProtectedRoute>
      <CreateFundingContent />
    </ProtectedRoute>
  );
}





