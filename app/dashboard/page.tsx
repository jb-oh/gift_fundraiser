'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getFundingsByHost, getFundingsByContributor } from '@/lib/storage';
import { Funding, Contribution } from '@/lib/types';
import ProtectedRoute from '@/components/ProtectedRoute';
import FundingCard from '@/components/FundingCard';
import Link from 'next/link';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';

function DashboardContent() {
  const { user } = useAuth();
  const { currentMode } = useRole();
  const [hostedFundings, setHostedFundings] = useState<Funding[]>([]);
  const [participatedFundings, setParticipatedFundings] = useState<{ funding: Funding; contribution: Contribution }[]>([]);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // Load hosted fundings
          const hosted = await getFundingsByHost(user.id);
          setHostedFundings(hosted);

          // Load participated fundings
          const participated = await getFundingsByContributor(user.email);
          setParticipatedFundings(participated);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          홈으로
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">대시보드</h1>
          <p className="mt-2 text-gray-600">
            {currentMode === 'host' ? '내가 주최한 펀딩' : '내가 참여한 펀딩'}
          </p>
        </div>

        {/* Host Mode: Show hosted fundings */}
        {currentMode === 'host' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                주최한 펀딩 ({hostedFundings.length})
              </h2>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <FiPlus className="h-4 w-4" />
                새 펀딩 만들기
              </Link>
            </div>

            {hostedFundings.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hostedFundings.map((funding) => (
                  <div key={funding.id} className="relative">
                    <FundingCard funding={funding} />
                    <Link
                      href={`/dashboard/${funding.id}`}
                      className="mt-2 block w-full rounded-lg border-2 border-purple-500 bg-purple-50 py-2 text-center text-sm font-medium text-purple-700 transition-all hover:bg-purple-100"
                    >
                      관리 대시보드로 이동
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-gray-600 mb-4">아직 주최한 펀딩이 없습니다</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
                >
                  <FiPlus className="h-5 w-5" />
                  첫 펀딩 만들기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Participant Mode: Show participated fundings */}
        {currentMode === 'participant' && (
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              참여한 펀딩 ({participatedFundings.length})
            </h2>

            {participatedFundings.length > 0 ? (
              <div className="space-y-4">
                {participatedFundings.map(({ funding, contribution }) => (
                  <div key={contribution.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{funding.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {funding.recipientName} · 주최자: {funding.hostName}
                        </p>
                        <div className="mt-4 flex items-center gap-6">
                          <div>
                            <p className="text-sm text-gray-500">내 기여 금액</p>
                            <p className="text-lg font-semibold text-pink-600">
                              {contribution.amount.toLocaleString()}원
                            </p>
                          </div>
                          {contribution.message && (
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">내 메시지</p>
                              <p className="text-sm text-gray-700">{contribution.message}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/funding/${funding.id}`}
                        className="ml-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        펀딩 보기
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                <p className="text-gray-600 mb-4">아직 참여한 펀딩이 없습니다</p>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
                >
                  펀딩 둘러보기
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
