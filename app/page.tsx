'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getAllFundings, getFundingsByHost, getFundingsByContributor } from '@/lib/storage';
import FundingCard from '@/components/FundingCard';
import { FiGift, FiUsers, FiHeart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { Funding } from '@/lib/types';

// Landing Page for logged out users
function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <FiGift className="h-4 w-4" />
              함께 만드는 특별한 순간
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
              <span className="block">선물 펀딩,</span>
              <span className="block bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                더 쉽고 투명하게
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-gray-600 sm:text-2xl">
              생일, 결혼, 졸업 등 소중한 순간을 위한 선물을<br />
              친구들과 함께 준비하세요
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/auth"
                className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-10 py-5 text-lg font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-pink-500/50"
              >
                <span>무료로 시작하기</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <div className="text-sm text-gray-500">
                💳 결제 정보 불필요 · ⚡️ 3분이면 시작
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              왜 선물 펀딩인가요?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              기존 선물 방식의 불편함을 해결합니다
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative rounded-2xl bg-gradient-to-br from-pink-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <div className="mb-4 inline-flex rounded-xl bg-pink-500 p-3 text-white shadow-lg">
                <FiGift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">부담 없는 참여</h3>
              <p className="mt-3 text-gray-600">
                원하는 금액만큼 자유롭게 참여하세요. 부담스러운 금액 걱정 없이 마음을 전할 수 있습니다.
              </p>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-purple-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <div className="mb-4 inline-flex rounded-xl bg-purple-500 p-3 text-white shadow-lg">
                <FiUsers className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">투명한 관리</h3>
              <p className="mt-3 text-gray-600">
                실시간으로 모금 현황을 확인하고 누가 참여했는지 투명하게 공유됩니다.
              </p>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-rose-50 to-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl">
              <div className="mb-4 inline-flex rounded-xl bg-rose-500 p-3 text-white shadow-lg">
                <FiHeart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">의미 있는 선물</h3>
              <p className="mt-3 text-gray-600">
                축하 메시지와 함께 여러 사람의 마음이 모여 더욱 특별한 선물이 됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              이렇게 간단합니다
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              복잡한 과정 없이 3단계면 충분합니다
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-3xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900">펀딩 만들기</h3>
              <p className="mt-3 text-gray-600">
                받는 사람, 목표 금액, 마감일을 입력하고<br />
                원하는 선물 후보를 추가하세요
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-3xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900">친구들과 공유</h3>
              <p className="mt-3 text-gray-600">
                링크를 복사해서 카카오톡이나 SNS로<br />
                친구들에게 간편하게 공유하세요
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-3xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900">선물 구매</h3>
              <p className="mt-3 text-gray-600">
                목표 금액 달성 후<br />
                모아진 금액으로 선물을 구매하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              다양한 순간에 활용하세요
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: '🎂', label: '생일' },
              { icon: '💒', label: '결혼' },
              { icon: '🎓', label: '졸업' },
              { icon: '👶', label: '출산' },
              { icon: '🏠', label: '집들이' },
              { icon: '🎉', label: '기타' },
            ].map((useCase) => (
              <div
                key={useCase.label}
                className="flex flex-col items-center gap-3 rounded-xl bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="text-4xl">{useCase.icon}</div>
                <div className="font-semibold text-gray-900">{useCase.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            지금 바로 시작해보세요
          </h2>
          <p className="mt-6 text-xl text-pink-100">
            가입비, 수수료 없이 무료로 시작할 수 있습니다
          </p>
          <div className="mt-10">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-lg font-bold text-gray-900 shadow-2xl transition-all hover:scale-105"
            >
              <span>무료로 시작하기</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home Page for logged in users
function LoggedInHome() {
  const { user } = useAuth();
  const { currentMode } = useRole();
  const [hostedFundings, setHostedFundings] = useState<Funding[]>([]);
  const [participatedFundings, setParticipatedFundings] = useState<any[]>([]);
  const [recentFundings, setRecentFundings] = useState<Funding[]>([]);

  useEffect(() => {
    if (user) {
      const hosted = getFundingsByHost(user.id);
      const participated = getFundingsByContributor(user.email);
      const all = getAllFundings();

      setHostedFundings(hosted.slice(0, 3));
      setParticipatedFundings(participated.slice(0, 3));
      setRecentFundings(all.slice(0, 6));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            안녕하세요, {user?.name}님! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            {currentMode === 'host' ? '펀딩을 만들고 관리하세요' : '펀딩에 참여하고 선물을 준비하세요'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {currentMode === 'host' && (
            <Link
              href="/create"
              className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white shadow-lg transition-all hover:scale-105"
            >
              <FiGift className="h-8 w-8" />
              <div>
                <h3 className="font-semibold">새 펀딩 만들기</h3>
                <p className="text-sm text-pink-100">선물 펀딩 시작하기</p>
              </div>
            </Link>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <FiTrendingUp className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold text-gray-900">대시보드</h3>
              <p className="text-sm text-gray-600">
                {currentMode === 'host' ? '내 펀딩 관리' : '참여 내역 보기'}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3 rounded-lg bg-white p-6 shadow-sm">
            <FiCalendar className="h-8 w-8 text-pink-500" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {currentMode === 'host' ? '주최한 펀딩' : '참여한 펀딩'}
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {currentMode === 'host' ? hostedFundings.length : participatedFundings.length}
              </p>
            </div>
          </div>
        </div>

        {/* My Fundings Section */}
        {currentMode === 'host' && hostedFundings.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">내가 주최한 펀딩</h2>
              <Link href="/dashboard" className="text-sm text-pink-600 hover:text-pink-700">
                모두 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hostedFundings.map((funding) => (
                <FundingCard key={funding.id} funding={funding} />
              ))}
            </div>
          </div>
        )}

        {currentMode === 'participant' && participatedFundings.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">내가 참여한 펀딩</h2>
              <Link href="/dashboard" className="text-sm text-pink-600 hover:text-pink-700">
                모두 보기 →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {participatedFundings.map(({ funding }) => (
                <FundingCard key={funding.id} funding={funding} />
              ))}
            </div>
          </div>
        )}

        {/* Browse All Fundings */}
        {recentFundings.length > 0 && (
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">둘러보기</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentFundings.map((funding) => (
                <FundingCard key={funding.id} funding={funding} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <LoggedInHome /> : <LandingPage />;
}
