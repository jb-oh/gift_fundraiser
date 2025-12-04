'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiArrowLeft, FiTrash2 } from 'react-icons/fi';

export default function ResetPage() {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [selectedData, setSelectedData] = useState({
    fundings: true,
    contributions: true,
    users: false,
    currentUser: false,
    roleMode: false,
  });

  const handleToggle = (key: keyof typeof selectedData) => {
    setSelectedData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReset = () => {
    // Clear selected localStorage data
    if (typeof window !== 'undefined') {
      if (selectedData.fundings) {
        localStorage.removeItem('gift_fundraiser_fundings');
      }
      if (selectedData.contributions) {
        localStorage.removeItem('gift_fundraiser_contributions');
      }
      if (selectedData.users) {
        localStorage.removeItem('gift_fundraiser_users');
      }
      if (selectedData.currentUser) {
        localStorage.removeItem('gift_fundraiser_current_user');
      }
      if (selectedData.roleMode) {
        localStorage.removeItem('gift_fundraiser_role_mode');
      }

      setIsReset(true);

      // Redirect to home after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  const hasSelection = Object.values(selectedData).some((val) => val);

  if (isReset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <div className="text-3xl">✅</div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">데이터 초기화 완료</h1>
          <p className="mt-2 text-gray-600">모든 데이터가 삭제되었습니다.</p>
          <p className="mt-4 text-sm text-gray-500">잠시 후 홈으로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-white p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Link>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <FiAlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            데이터 초기화
          </h1>

          <div className="mb-6 rounded-lg bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-sm text-yellow-800 font-medium mb-3">삭제할 데이터를 선택하세요</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.fundings}
                  onChange={() => handleToggle('fundings')}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">펀딩 데이터</span>
                  <p className="text-xs text-gray-600">모든 펀딩 정보 삭제</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.contributions}
                  onChange={() => handleToggle('contributions')}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">참여/기여 내역</span>
                  <p className="text-xs text-gray-600">모든 기여 데이터 삭제</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.users}
                  onChange={() => handleToggle('users')}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">사용자 계정</span>
                  <p className="text-xs text-gray-600">모든 사용자 정보 삭제</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.currentUser}
                  onChange={() => handleToggle('currentUser')}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">로그인 세션</span>
                  <p className="text-xs text-gray-600">현재 로그인 정보 삭제 (로그아웃)</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedData.roleMode}
                  onChange={() => handleToggle('roleMode')}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-2 focus:ring-red-500"
                />
                <div className="flex-1">
                  <span className="font-medium text-gray-900">역할 모드 설정</span>
                  <p className="text-xs text-gray-600">호스트/참여자 모드 초기화</p>
                </div>
              </label>
            </div>
          </div>

          {!hasSelection && (
            <div className="mb-4 rounded-lg bg-gray-50 border border-gray-200 p-3 text-center text-sm text-gray-600">
              최소 하나 이상의 항목을 선택해주세요
            </div>
          )}

          {!isConfirming ? (
            <button
              onClick={() => setIsConfirming(true)}
              disabled={!hasSelection}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 className="h-5 w-5" />
              선택한 데이터 삭제
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-900">
                선택한 데이터를 삭제하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsConfirming(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
