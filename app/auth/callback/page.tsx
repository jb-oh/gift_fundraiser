'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Check if Supabase is configured
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase가 설정되지 않았습니다. 인증을 사용할 수 없습니다.');
        return;
      }

      // Get URL parameters
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Handle error from Supabase
      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      // Exchange code for session (PKCE flow)
      if (code) {
        try {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          // Success - redirect to dashboard
          router.replace('/dashboard');
        } catch (err: unknown) {
          console.error('Auth callback error:', err);
          const message = err instanceof Error ? err.message : '인증에 실패했습니다. 다시 시도해 주세요.';
          setError(message);
        }
      } else {
        // No code - check if already authenticated (hash-based fallback)
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session) {
            router.replace('/dashboard');
          } else {
            setError('인증 코드가 없습니다. 다시 로그인해 주세요.');
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : '세션 확인에 실패했습니다.';
          setError(message);
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">&#10060;</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">인증 오류</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

// Wrap in Suspense for useSearchParams (Next.js 13+ requirement)
export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
