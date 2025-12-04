'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentMode, switchMode } = useRole();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleModeSwitch = () => {
    const newMode = currentMode === 'host' ? 'participant' : 'host';
    switchMode(newMode);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            선물 펀딩
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Create Funding (only in host mode) */}
                {currentMode === 'host' && (
                  <Link
                    href="/create"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg hover:shadow-lg transition-all"
                  >
                    펀딩 만들기
                  </Link>
                )}

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  대시보드
                </Link>

                {/* Nickname */}
                <span className="text-sm text-gray-600">
                  {user?.name}
                </span>

                {/* Role Switcher */}
                <button
                  onClick={handleModeSwitch}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentMode === 'host'
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                  }`}
                >
                  {currentMode === 'host' ? '호스트 모드' : '참여자 모드'}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg hover:shadow-lg transition-all"
              >
                로그인 / 회원가입
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
