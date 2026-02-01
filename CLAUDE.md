# Gift Fundraiser - Project Documentation

This file consolidates all project documentation for Claude Code reference.

---

# 1. Project Overview (PRD)

# 생일 선물 펀딩 시스템 PRD

## 1. 개요 (Overview)

### 1.1 목적 (Goal)

-   사용자가 친구·가족·지인에게 생일 선물을 위해 쉽게 펀딩을 받고,
    투명하게 금액을 관리하며, 최종 선물을 선택·구매할 수 있는 플랫폼을
    제공한다.
-   기존의 송금 기반 축하 문화의 불편함을 제거하고, 목표 기반 펀딩을
    통해 UX의 품질을 높인다.

### 1.2 문제 정의 (Problem Statement)

-   여러 사람에게 금액을 모으는 과정이 비효율적이며 투명성이 부족함.
-   선물 선택 시 예산 조율과 그룹 의견 수렴이 어려움.

### 1.3 성공 지표 (Success Metrics)

  카테고리|지표
  ---|---
  Engagement|펀딩 생성 수, 참여자 수
  Conversion|목표 금액 달성률, 결제 완료율
  UX|펀딩 생성까지 평균 소요 시간, CS 발생률
  Business|결제 처리 수수료 수익, 추천 선물 구매율

## 2. 사용자 (Users)

### 2.1 페르소나(Personas)

1.  **생일 주인 (Host)**\
2.  **펀딩 참여자 (Contributor)**\
3.  **기획자/선물 추천자 (Organizer)**

## 3. 핵심 기능 요약 (Key Features)

  기능 영역|기능명|설명
  ---|---|---
  펀딩 생성|목표 설정|목표 금액/기간/선물 후보 선택
  펀딩 공유|링크 공유|카카오톡/메신저 공유
  결제|기여 결제|카드·계좌·페이 결제
  메시지|축하 메시지|메시지 카드 기록
  대시보드|실시간 현황|총 모금액/참여자/기간
  선물 관리|구매|목표 도달 시 선물 선택
  투명성|참여 내역 공개 옵션|익명/기명, 금액 공개 설정
  알림|푸시/카톡 알림|진행 상황 자동 알림

## 4. 사용자 흐름 (User Flow)

### 4.1 Host Flow

1.  펀딩 생성
2.  목표 및 선물 입력
3.  링크 공유
4.  실시간 현황 모니터링
5.  목표 도달 시 선물 구매

### 4.2 Contributor Flow

1.  링크 클릭
2.  소개 및 선물 정보 확인
3.  금액 입력 → 결제
4.  축하 메시지 작성

## 5. 상세 기능 요구사항 (Detailed Requirements)

### 5.1 펀딩 생성

-   목표 금액, 기간, 선물 후보 입력
-   커버 이미지 설정

### 5.2 결제

-   다양한 결제 수단 지원
-   목표 미달 시 환불 옵션 또는 금액 전달 선택 가능

### 5.3 대시보드

-   실시간 참여 현황, 메시지 카드, 금액 표시
-   초대 리마인드 기능

### 5.4 투명성 옵션

  항목|옵션
  ---|---
  금액 공개|공개/비공개
  참여자 이름|기명/익명
  목표 공개|보이기/숨기기

### 5.5 메시지 카드

-   템플릿 제공
-   PDF/Webbook로 다운로드 가능

### 5.6 알림 시스템

-   참여 발생, 마감 임박, 목표 달성, 선물 구매 등 알림

## 6. UX/UI 요구사항

-   단일 페이지 기반 간단한 참여 UX
-   감정적 가치 강조
-   모바일 최적화 필수

## 7. 비기능 요구사항 (NFR)

-   페이지 2초 내 로딩
-   실시간 업데이트 지연 ≤ 1초
-   결제 보안 및 데이터 보호

## 8. 향후 확장 기능 (Backlog)

-   AI 기반 선물 추천
-   선물 투표 기능
-   실물 메시지 카드 제작 서비스
-   자동 기념일 관리 기능

---

# 2. Deployment Guide

This guide explains how to set up and deploy the Gift Fundraiser application in different environments.

## Environment Configuration

The application supports two environments:
- **Development**: Local development on `http://localhost:3000`
- **Production**: GitHub Pages deployment on `https://jb-oh.github.io/gift_fundraiser`

### How It Works

The application automatically detects the environment and configures URLs accordingly:

- In **development** (`NODE_ENV=development`):
  - Base URL: `http://localhost:3000`
  - No base path added to routes
  - Assets served from root

- In **production** (`NODE_ENV=production`):
  - Base URL: `https://jb-oh.github.io/gift_fundraiser`
  - Base path: `/gift_fundraiser`
  - Assets served with `/gift_fundraiser` prefix

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/jb-oh/gift_fundraiser.git
   cd gift_fundraiser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**

   **Note**: The app works without Supabase using localStorage. Skip this step if you just want to test locally.

   For Supabase integration:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Production Deployment (GitHub Pages)

### Prerequisites

- GitHub repository set up with GitHub Pages enabled
- Supabase project created with credentials

### Setup GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Deploy

The application automatically deploys to GitHub Pages when you push to the `main` branch.

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Actions workflow will:
1. Install dependencies
2. Build the application with production settings
3. Deploy to GitHub Pages

Your site will be available at: `https://jb-oh.github.io/gift_fundraiser`

### Manual Build for Production

To build for production locally:

```bash
npm run build:prod
```

This will create an `out` directory with static files ready for deployment.

### Testing Production Build Locally

**Important**: You cannot fully test the production build locally with a simple static server because:
1. The production build uses `/gift_fundraiser` as the base path
2. Dynamic routes require GitHub Pages' redirect mechanism
3. Local servers don't replicate this environment

**Options for testing**:

1. **Use development mode for local testing** (Recommended):
   ```bash
   npm run dev
   ```
   This gives you the full experience without base path complications.

2. **Preview the static files** (Limited testing):
   ```bash
   npm run preview
   ```
   Opens the build at `http://localhost:3000`, but:
   - Home page will work
   - Dynamic routes (e.g., `/funding/123`) will show 404
   - This is expected and will work correctly on GitHub Pages

3. **Best approach**: Deploy to GitHub Pages and test there
   - The actual deployment is the only true test
   - GitHub Pages handles the base path and redirects correctly
   - If build succeeds, deployment will work

## Environment Variables Reference

| Variable | Required | Description | Default (Dev) | Default (Prod) |
|----------|----------|-------------|---------------|----------------|
| `NODE_ENV` | Auto-set | Environment mode | `development` | `production` |
| `NEXT_PUBLIC_BASE_URL` | Optional | Full base URL | `http://localhost:3000` | `https://jb-oh.github.io/gift_fundraiser` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | - | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key | - | - |

## URL Generation

The application uses the `getFullUrl()` helper function from `lib/env.ts` to generate correct URLs in both environments:

```typescript
import { getFullUrl } from '@/lib/env';

// Automatically generates the correct URL based on environment
const shareUrl = getFullUrl(`/funding/${funding.id}`);
// Development: http://localhost:3000/funding/123
// Production: https://jb-oh.github.io/gift_fundraiser/funding/123
```

## Troubleshooting

### Issue: "Failed to fetch at login" or Supabase connection errors

**Cause**: Supabase environment variables are not configured locally.

**Solution**: The app automatically falls back to localStorage when Supabase is not configured. You have two options:

1. **Work without Supabase (Quick Start)**:
   - The app will automatically use localStorage
   - All features work locally
   - Data is stored in browser storage
   - Just ignore the console warning

2. **Set up Supabase (Full Setup)**:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your Supabase credentials and restart dev server.

### Issue: Pages showing localhost URLs in production

**Cause**: The URL generation is using `window.location.origin` which doesn't include the base path.

**Solution**: This has been fixed by using the `getFullUrl()` helper function. Make sure you're using the latest version of the code.

### Issue: 404 errors on page refresh in production

**Cause**: GitHub Pages doesn't natively support client-side routing.

**Solution**: The app includes a `404.html` file that redirects to the index page with the correct path. This is automatically copied during the build process.

### Issue: Assets not loading in production

**Cause**: Missing base path in Next.js configuration.

**Solution**: The `next.config.ts` file is already configured with the correct `basePath` and `assetPrefix` for production.

## Switching Between Environments

### To run in development mode:
```bash
npm run dev
```

### To build for development (testing static export locally):
```bash
npm run build:dev
```

### To build for production:
```bash
npm run build:prod
```

## Configuration Files

- **next.config.ts**: Next.js configuration with environment-specific settings
- **lib/env.ts**: Environment utility functions and configuration
- **.github/workflows/deploy.yml**: GitHub Actions deployment workflow
- **.env.example**: Template for environment variables

## Best Practices

1. **Never commit** `.env.local` or any file containing secrets
2. **Always use** `getFullUrl()` helper for generating shareable URLs
3. **Test locally** before pushing to production
4. **Check GitHub Actions** logs if deployment fails
5. **Keep Supabase keys** secure and rotate them if exposed

---

# 3. Code Review: Supabase Integration

**Date:** 2026-01-30
**Branch:** `claude/rebuild-supabase-setup-ApcOK`

---

## Executive Summary

The Gift Fundraiser app is a well-structured Next.js 16 SPA deployed on GitHub Pages with an optional Supabase backend. The core architecture is solid, but the Supabase integration has several critical issues that need addressing before production use.

**Overall Assessment:** The foundation is good, but the Supabase integration is incomplete and has data integrity and security concerns.

---

## CRITICAL ISSUES

### 1. Placeholder Supabase Client Creates Silent Failures

**Location:** `lib/supabase.ts:19-21`

```typescript
export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : createClient('https://placeholder.supabase.co', 'placeholder-key');
```

**Problem:** When Supabase isn't configured, a client is created with placeholder values. This client will silently fail on all operations, making debugging difficult.

**Fix:** Return `null` when not configured and handle it properly:
```typescript
export const supabase = hasSupabaseConfig
    ? createClient(supabaseUrl, supabaseKey)
    : null;
```

---

### 2. Missing Contributor User ID Tracking

**Location:** `supabase/schema.sql:58-67` and `lib/storage/supabase.ts:149-167`

**Problem:** The `contributions` table only stores `contributor_name` (a text field), not the user's ID. The `getFundingsByContributor()` method uses ILIKE search on this field:

```typescript
.ilike('contributor_name', `%${contributorEmail}%`);
```

**Issues:**
- Users can contribute with any name, making lookups unreliable
- Email search on name field is semantically wrong
- No way to track anonymous user's contributions reliably
- Privacy concern: searching by email pattern in names

**Fix:** Add `contributor_id` column to track authenticated contributors:
```sql
contributor_id uuid references auth.users(id),  -- NULL for anonymous
```

---

### 3. Insecure RPC Function

**Location:** `supabase/schema.sql:103-113`

```sql
create or replace function increment_funding_amount(funding_id text, amount_to_add numeric)
returns void
language plpgsql
security definer
as $$
begin
  update public.fundings
  set current_amount = current_amount + amount_to_add
  where id = funding_id;
end;
$$;
```

**Problem:** This function is `security definer` but has NO access control. Any user (even unauthenticated via RLS bypass) can increment any funding by any amount, including negative values.

**Risks:**
- Malicious actors can inflate funding amounts
- Negative values can decrease amounts
- No validation that contribution exists

**Fix:** Add validation and constraints:
```sql
create or replace function increment_funding_amount(
  p_funding_id text,
  p_amount_to_add numeric
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate positive amount
  if p_amount_to_add <= 0 then
    raise exception 'Amount must be positive';
  end if;

  update public.fundings
  set current_amount = current_amount + p_amount_to_add
  where id = p_funding_id;

  if not found then
    raise exception 'Funding not found';
  end if;
end;
$$;
```

---

### 4. Missing .env.example File

**Location:** Referenced in `lib/supabase.ts:12` but doesn't exist

**Problem:** Documentation and code reference `.env.example` but the file doesn't exist. New developers can't set up the project easily.

**Fix:** Create `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

### 5. No Magic Link Redirect URL Configuration

**Location:** `lib/auth.ts:17-31`

```typescript
export async function signup(name: string, email: string, userType: UserType): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { name, userType },
    },
  });
  // ...
}
```

**Problem:** No `emailRedirectTo` is specified. Supabase will use default redirect which may not work correctly with GitHub Pages deployment at `/gift_fundraiser` base path.

**Fix:** Add proper redirect URL:
```typescript
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    data: { name, userType },
    emailRedirectTo: `${getBaseUrl()}/auth/callback`,
  },
});
```

---

## HIGH PRIORITY ISSUES

### 6. No Auth Callback Handler

**Problem:** Magic link authentication requires a callback handler to process the auth token from the URL. Currently missing `/auth/callback` route.

**Fix:** Create `app/auth/callback/page.tsx` to handle the OAuth callback.

---

### 7. Contributions Allow Anyone Insert (No Rate Limiting)

**Location:** `supabase/schema.sql:72`

```sql
create policy "Anyone can insert contributions." on contributions for insert with check ( true );
```

**Problem:** Anyone can insert unlimited contributions without authentication, enabling spam attacks.

**Fix:** Implement rate limiting via Supabase Edge Functions or require authentication for contributions.

---

### 8. No Input Validation

**Location:** Throughout the codebase

**Problems:**
- No email format validation
- No URL validation for gift links
- No amount bounds checking (min/max)
- No text length limits

**Fix:** Add Zod schema validation for all forms.

---

### 9. SmartStorage Adapter Inconsistency

**Location:** `lib/storage/smartStorage.ts:12-14`

```typescript
private get storage(): IStorage {
  return isSupabaseConfigured ? supabaseStorage : localStorageImpl;
}
```

**Problem:** `isSupabaseConfigured` is evaluated at import time, not runtime. If environment changes, the wrong storage is used.

**Fix:** Check configuration on each operation or use a singleton that's initialized lazily.

---

### 10. Auth Context Loading State Shows Nothing

**Location:** `contexts/AuthContext.tsx:87-89`

```typescript
if (isLoading) {
  return null; // Or a loading spinner
}
```

**Problem:** Returns `null` during auth loading, causing layout shift and flash of content.

**Fix:** Return a proper loading skeleton/spinner.

---

## MEDIUM PRIORITY ISSUES

### 11. Polling Instead of Realtime Subscriptions

**Location:** `contexts/FundingContext.tsx`

**Problem:** The app polls every 2 seconds for updates instead of using Supabase Realtime subscriptions.

**Impact:**
- Unnecessary API calls
- Higher latency for updates
- Potential rate limiting at scale

**Fix:** Implement Supabase Realtime subscriptions:
```typescript
supabase
  .channel('fundings')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'fundings' },
    (payload) => handleUpdate(payload))
  .subscribe();
```

---

### 12. No Error Boundaries

**Problem:** React error boundaries are not implemented. Errors in components crash the entire app.

**Fix:** Add error boundaries around major sections (Dashboard, Funding, Create).

---

### 13. Host Name Stored Redundantly

**Location:** `fundings` table has both `host_id` and `host_name`

**Problem:** `host_name` is denormalized and can become stale if user updates their name.

**Fix:** Join with profiles table when needed, or update host_name on profile changes.

---

### 14. No Delete/Cancel Functionality Enforcement

**Problem:** Schema allows fundings to be cancelled but:
- No UI to cancel fundings
- No RLS policy to restrict deletion
- Contributions can't be refunded

---

### 15. Image Handling Issues

**Problem:**
- `cover_image` and `imageUrl` store URLs but no validation
- No file upload to Supabase Storage
- External URLs may become dead links

**Fix:** Implement Supabase Storage for image uploads.

---

## LOW PRIORITY / IMPROVEMENTS

### 16. Kakao Share Non-Functional

**Location:** `components/ShareButton.tsx`

**Problem:** Kakao share button doesn't use Kakao SDK, just copies link.

### 17. No Testing

**Problem:** No unit tests, integration tests, or E2E tests.

### 18. TypeScript Type Safety

**Problem:** Several `any` types in mappers (e.g., `lib/storage/supabase.ts:7`).

### 19. ID Generation

**Location:** `lib/storage/supabase.ts:76-78`

```typescript
generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

**Issue:** Not using UUID. Could use `crypto.randomUUID()` for better uniqueness.

### 20. No Audit Trail

**Problem:** No logging of who created/modified what and when (besides `created_at`).

---

## ARCHITECTURE ISSUES

### Current Flow Concerns

```
User → Auth Context → Supabase Auth
                         ↓
                    Creates Profile (trigger)
                         ↓
User → Storage → Smart Storage → Supabase Storage → Database
                             ↘→ localStorage (fallback)
```

**Concerns:**
1. Auth and storage are decoupled but share the same Supabase client
2. No clear error propagation strategy
3. Mixing sync (localStorage) and async (Supabase) operations

### Recommended Architecture

```
User → Auth Context → Supabase Auth → Profile Created
         ↓
      Auth State
         ↓
User → Storage Service → Supabase Client → Database
         |                      ↓
         ↓              Realtime Subscriptions
      Error Handler
         ↓
      Toast Notifications
```

---

## RECOMMENDED IMPROVEMENTS

### Phase 1: Critical Fixes (Do First)

1. ✅ Create `.env.example` file
2. ✅ Fix placeholder Supabase client issue
3. ✅ Secure the `increment_funding_amount` RPC
4. ✅ Add `contributor_id` to contributions schema
5. ✅ Add auth callback handler
6. ✅ Configure magic link redirect URLs

### Phase 2: Security & Reliability

7. Add input validation with Zod
8. Implement proper error handling
9. Add loading states and skeletons
10. Rate limit contribution inserts
11. Add error boundaries

### Phase 3: Features & Performance

12. Implement Supabase Realtime subscriptions
13. Add Supabase Storage for images
14. Implement proper Kakao SDK integration
15. Add audit logging

### Phase 4: Quality

16. Add TypeScript strict mode
17. Write unit tests for storage layer
18. Write E2E tests with Playwright
19. Add Sentry for error tracking

---

## SCHEMA IMPROVEMENTS

### Current Schema Issues

```sql
-- contributions table missing user tracking
contributions (
  contributor_name text,  -- Fragile!
  -- Missing: contributor_id uuid references auth.users(id)
)
```

### Proposed Schema Updates

```sql
-- Add contributor tracking
ALTER TABLE public.contributions
ADD COLUMN contributor_id uuid REFERENCES auth.users(id);

-- Add indexes for performance
CREATE INDEX idx_contributions_funding_id ON contributions(funding_id);
CREATE INDEX idx_contributions_contributor_id ON contributions(contributor_id);
CREATE INDEX idx_fundings_host_id ON fundings(host_id);
CREATE INDEX idx_fundings_status ON fundings(status);

-- Add updated_at tracking
ALTER TABLE public.fundings
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.profiles
ADD COLUMN updated_at timestamp with time zone DEFAULT now();
```

---

## IMPLEMENTATION CHECKLIST

```
[ ] Phase 1: Critical
    [ ] Create .env.example
    [ ] Fix null Supabase client handling
    [ ] Update increment_funding_amount with validation
    [ ] Add contributor_id to schema
    [ ] Create /auth/callback route
    [ ] Configure emailRedirectTo for magic links

[ ] Phase 2: Security
    [ ] Add Zod validation schemas
    [ ] Implement error boundaries
    [ ] Add loading skeletons
    [ ] Review and tighten RLS policies

[ ] Phase 3: Features
    [ ] Implement Realtime subscriptions
    [ ] Set up Supabase Storage
    [ ] Add proper Kakao SDK

[ ] Phase 4: Quality
    [ ] Enable TypeScript strict
    [ ] Write tests
    [ ] Add monitoring
```

---

## CONCLUSION

The Gift Fundraiser app has a solid foundation but requires significant work on the Supabase integration before being production-ready. The critical issues around security (`increment_funding_amount`), data integrity (contributor tracking), and developer experience (missing `.env.example`) should be addressed immediately.

The smart storage abstraction is a good pattern, but the implementation needs refinement to handle edge cases properly. The authentication flow needs a callback handler and proper redirect URL configuration.

---

# 4. Supabase Integration Rebuild Plan

**Priority Order:** Critical → High → Medium → Low

---

## PHASE 1: CRITICAL FIXES

### 1.1 Create .env.example File

**File:** `.env.example` (NEW)

```env
# Supabase Configuration (Required for cloud storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Override base URL (defaults based on NODE_ENV)
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

### 1.2 Fix Supabase Client Null Handling

**File:** `lib/supabase.ts`

**Current Issue:** Creates a placeholder client that silently fails.

**New Implementation:**
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Only create client when properly configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

// Helper to get client with error if not configured
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }
  return supabase;
}

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.warn(
    '⚠️  Supabase not configured. Using localStorage fallback.\n' +
    'To enable Supabase, copy .env.example to .env.local and add your credentials.'
  );
}
```

---

### 1.3 Fix Auth Functions for Null Client

**File:** `lib/auth.ts`

**Changes:**
```typescript
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { User, UserType } from './types';
import { getBaseUrl } from './env';

function mapSupabaseUser(u: any): User | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email!,
    name: u.user_metadata?.name || u.email?.split('@')[0] || 'User',
    userType: u.user_metadata?.userType || 'user',
    createdAt: u.created_at,
  };
}

export async function signup(name: string, email: string, userType: UserType): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      data: { name, userType },
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function login(email: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    },
  });

  if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) console.error('Error logging out:', error);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return mapSupabaseUser(user);
}
```

---

### 1.4 Create Auth Callback Handler

**File:** `app/auth/callback/page.tsx` (NEW)

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      if (!supabase) {
        setError('Supabase is not configured');
        return;
      }

      // Get the code from URL (Supabase PKCE flow)
      const code = searchParams.get('code');
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setError(errorDescription || errorParam);
        return;
      }

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;

          // Successful auth - redirect to dashboard
          router.replace('/dashboard');
        } catch (err: any) {
          setError(err.message || 'Authentication failed');
        }
      } else {
        // No code - might be hash-based callback (older flow)
        // Check if there's a session already
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace('/dashboard');
        } else {
          setError('No authentication code found');
        }
      }
    };

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">인증 오류</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg"
          >
            다시 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}
```

---

### 1.5 Update Schema with Contributor ID and Secure RPC

**File:** `supabase/schema.sql`

**Key Changes:**

```sql
-- *** CONTRIBUTIONS TABLE (Updated) ***
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_id uuid references auth.users(id),  -- NEW: Track authenticated users
  contributor_name text not null,
  amount numeric not null check (amount > 0),     -- NEW: Ensure positive amounts
  message text,
  is_anonymous boolean default false,
  payment_method text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster lookups
create index idx_contributions_funding_id on contributions(funding_id);
create index idx_contributions_contributor_id on contributions(contributor_id);

-- *** SECURE RPC FUNCTION (Updated) ***
create or replace function increment_funding_amount(
  p_funding_id text,
  p_amount_to_add numeric
)
returns void
language plpgsql
security definer
as $$
begin
  -- Validate amount is positive
  if p_amount_to_add <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  -- Validate amount is reasonable (max 10 million KRW per contribution)
  if p_amount_to_add > 10000000 then
    raise exception 'Amount exceeds maximum allowed';
  end if;

  -- Update with existence check
  update public.fundings
  set current_amount = current_amount + p_amount_to_add
  where id = p_funding_id;

  if not found then
    raise exception 'Funding not found: %', p_funding_id;
  end if;
end;
$$;
```

---

### 1.6 Update Storage to Track Contributor ID

**File:** `lib/storage/supabase.ts`

**Changes to `addContribution`:**
```typescript
async addContribution(contribution: Contribution, userId?: string): Promise<void> {
  const dbPayload = {
    ...mapContributionToDB(contribution),
    contributor_id: userId || null,  // Track the authenticated user
  };

  const { error } = await getSupabaseClient()
    .from('contributions')
    .insert(dbPayload);

  if (error) throw new Error(`Failed to add contribution: ${error.message}`);

  // Update funding current amount via secure RPC
  const { error: updateError } = await getSupabaseClient().rpc('increment_funding_amount', {
    p_funding_id: contribution.fundingId,
    p_amount_to_add: contribution.amount
  });

  if (updateError) throw new Error(`Failed to update funding: ${updateError.message}`);
}
```

**Changes to `getFundingsByContributor`:**
```typescript
async getFundingsByContributor(userId: string): Promise<{ funding: Funding; contribution: Contribution }[]> {
  // Now search by contributor_id instead of name
  const { data: contributions, error } = await getSupabaseClient()
    .from('contributions')
    .select(`
      *,
      funding:fundings(*)
    `)
    .eq('contributor_id', userId);

  if (error) return [];

  return (contributions || []).map((c: any) => ({
    contribution: mapContributionFromDB(c),
    funding: mapFundingFromDB(c.funding)
  }));
}
```

---

## PHASE 2: SECURITY & RELIABILITY

### 2.1 Add Zod Validation Schemas

**File:** `lib/validation.ts` (NEW)

```typescript
import { z } from 'zod';

export const emailSchema = z.string().email('유효한 이메일을 입력하세요');

export const fundingSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100, '제목이 너무 깁니다'),
  recipientName: z.string().min(1, '받는 분 이름을 입력하세요').max(50),
  occasion: z.enum(['birthday', 'wedding', 'graduation', 'baby', 'housewarming', 'retirement', 'other']),
  customOccasion: z.string().max(50).optional(),
  targetAmount: z.number().min(10000, '최소 금액은 10,000원입니다').max(100000000, '최대 금액을 초과했습니다'),
  deadline: z.string().refine((date) => new Date(date) > new Date(), '마감일은 미래 날짜여야 합니다'),
  coverImage: z.string().url().optional().or(z.literal('')),
  giftCandidates: z.array(z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    imageUrl: z.string().url().optional().or(z.literal('')),
    link: z.string().url().optional().or(z.literal('')),
    price: z.number().min(0).optional(),
  })),
});

export const contributionSchema = z.object({
  contributorName: z.string().min(1, '이름을 입력하세요').max(50),
  amount: z.number().min(1000, '최소 금액은 1,000원입니다').max(10000000, '최대 금액을 초과했습니다'),
  message: z.string().max(500, '메시지가 너무 깁니다').optional(),
  paymentMethod: z.enum(['card', 'account', 'pay']),
  isAnonymous: z.boolean(),
});
```

---

### 2.2 Add Error Boundary Component

**File:** `components/ErrorBoundary.tsx` (NEW)

```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // TODO: Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-bold text-red-600 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-4">페이지를 새로고침해 주세요.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

### 2.3 Add Loading Skeleton

**File:** `components/LoadingSkeleton.tsx` (NEW)

```typescript
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function FundingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <LoadingSkeleton className="h-40 w-full mb-4" />
      <LoadingSkeleton className="h-6 w-3/4 mb-2" />
      <LoadingSkeleton className="h-4 w-1/2 mb-4" />
      <LoadingSkeleton className="h-2 w-full mb-2" />
      <LoadingSkeleton className="h-4 w-1/3" />
    </div>
  );
}

export function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>
  );
}
```

---

## PHASE 3: FEATURES & PERFORMANCE

### 3.1 Implement Supabase Realtime Subscriptions

**File:** `hooks/useRealtimeFunding.ts` (NEW)

```typescript
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Funding, Contribution } from '@/lib/types';
import { smartStorage } from '@/lib/storage';

export function useRealtimeFunding(fundingId: string) {
  const [funding, setFunding] = useState<Funding | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const loadData = async () => {
      const [f, c] = await Promise.all([
        smartStorage.getFunding(fundingId),
        smartStorage.getContributions(fundingId),
      ]);
      setFunding(f);
      setContributions(c);
      setLoading(false);
    };
    loadData();

    // Set up realtime subscription if Supabase is configured
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`funding:${fundingId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fundings',
          filter: `id=eq.${fundingId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            // Map and update funding
            loadData(); // Refetch for simplicity
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contributions',
          filter: `funding_id=eq.${fundingId}`,
        },
        () => {
          loadData(); // Refetch contributions
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fundingId]);

  return { funding, contributions, loading };
}
```

---

## PHASE 4: COMPLETE UPDATED SCHEMA

**File:** `supabase/schema.sql` (FULL REPLACEMENT)

```sql
-- Gift Fundraiser Database Schema
-- Version: 2.0.0
-- Last Updated: 2026-01-30

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE (User Data)
-- =============================================
create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  name text not null,
  user_type text default 'user' check (user_type in ('user', 'host')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone." on profiles;
create policy "Profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- =============================================
-- 2. FUNDINGS TABLE
-- =============================================
drop table if exists public.contributions cascade;
drop table if exists public.fundings cascade;

create table public.fundings (
  id text not null primary key,
  host_id uuid not null references public.profiles(id) on delete cascade,
  host_name text not null,
  title text not null,
  recipient_name text not null,
  occasion text not null check (occasion in ('birthday', 'wedding', 'graduation', 'baby', 'housewarming', 'retirement', 'other')),
  custom_occasion text,
  target_amount numeric not null check (target_amount > 0),
  current_amount numeric default 0 check (current_amount >= 0),
  deadline timestamp with time zone not null,
  cover_image text,
  gift_candidates jsonb default '[]'::jsonb,
  transparency_settings jsonb default '{"showAmounts": true, "showNames": true, "showGoal": true}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' check (status in ('active', 'completed', 'cancelled'))
);

alter table public.fundings enable row level security;

create policy "Fundings are viewable by everyone." on fundings
  for select using (true);

create policy "Hosts can insert fundings." on fundings
  for insert with check (auth.uid() = host_id);

create policy "Hosts can update their fundings." on fundings
  for update using (auth.uid() = host_id);

-- Indexes for performance
create index idx_fundings_host_id on fundings(host_id);
create index idx_fundings_status on fundings(status);
create index idx_fundings_deadline on fundings(deadline);

-- =============================================
-- 3. CONTRIBUTIONS TABLE
-- =============================================
create table public.contributions (
  id text not null primary key,
  funding_id text not null references public.fundings(id) on delete cascade,
  contributor_id uuid references auth.users(id),
  contributor_name text not null,
  amount numeric not null check (amount > 0 and amount <= 10000000),
  message text,
  is_anonymous boolean default false,
  payment_method text not null check (payment_method in ('card', 'account', 'pay')),
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contributions enable row level security;

create policy "Contributions are viewable by everyone." on contributions
  for select using (true);

create policy "Anyone can insert contributions." on contributions
  for insert with check (true);

-- Indexes for performance
create index idx_contributions_funding_id on contributions(funding_id);
create index idx_contributions_contributor_id on contributions(contributor_id);

-- =============================================
-- 4. FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, user_type)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'userType', 'user')
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, profiles.name),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Secure atomic increment function for contributions
create or replace function increment_funding_amount(
  p_funding_id text,
  p_amount_to_add numeric
)
returns void
language plpgsql
security definer
as $$
declare
  v_funding_exists boolean;
begin
  -- Validate amount is positive
  if p_amount_to_add <= 0 then
    raise exception 'Amount must be greater than zero';
  end if;

  -- Validate amount is within bounds
  if p_amount_to_add > 10000000 then
    raise exception 'Amount exceeds maximum allowed (10,000,000 KRW)';
  end if;

  -- Update with existence check
  update public.fundings
  set
    current_amount = current_amount + p_amount_to_add,
    updated_at = now()
  where id = p_funding_id
  returning true into v_funding_exists;

  if v_funding_exists is null then
    raise exception 'Funding not found: %', p_funding_id;
  end if;
end;
$$;

-- Auto-update timestamp function
create or replace function update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at triggers
drop trigger if exists fundings_updated_at on fundings;
create trigger fundings_updated_at
  before update on fundings
  for each row execute procedure update_updated_at();

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- =============================================
-- 5. ENABLE REALTIME
-- =============================================
alter publication supabase_realtime add table fundings;
alter publication supabase_realtime add table contributions;

-- =============================================
-- 6. BACKFILL EXISTING USERS
-- =============================================
insert into public.profiles (id, email, name, user_type)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  coalesce(raw_user_meta_data->>'userType', 'user')
from auth.users
on conflict (id) do nothing;
```

---

## FILES TO CREATE/MODIFY SUMMARY

| File | Action | Priority |
|------|--------|----------|
| `.env.example` | CREATE | Critical |
| `lib/supabase.ts` | MODIFY | Critical |
| `lib/auth.ts` | MODIFY | Critical |
| `app/auth/callback/page.tsx` | CREATE | Critical |
| `supabase/schema.sql` | REPLACE | Critical |
| `lib/storage/supabase.ts` | MODIFY | Critical |
| `lib/storage/interface.ts` | MODIFY | High |
| `lib/validation.ts` | CREATE | High |
| `components/ErrorBoundary.tsx` | CREATE | High |
| `components/LoadingSkeleton.tsx` | CREATE | High |
| `contexts/AuthContext.tsx` | MODIFY | High |
| `hooks/useRealtimeFunding.ts` | CREATE | Medium |

---

## TESTING CHECKLIST

After implementing changes:

1. **Without Supabase (localStorage mode)**
   - [ ] App loads without errors
   - [ ] Can create fundings
   - [ ] Can contribute
   - [ ] Dashboard shows data

2. **With Supabase**
   - [ ] Environment variables load correctly
   - [ ] Magic link signup works
   - [ ] Auth callback redirects properly
   - [ ] Can create fundings (saved to DB)
   - [ ] Can contribute (contribution tracked)
   - [ ] RLS policies enforce correctly
   - [ ] Realtime updates work

3. **Edge Cases**
   - [ ] Expired magic links show error
   - [ ] Invalid amounts rejected
   - [ ] Network errors handled gracefully

---

# 5. Storage Migration Guide

This guide explains how to migrate from localStorage to a cloud database like Supabase.

## Current Setup

The app currently uses **localStorage** for data persistence:
- Works great for prototypes and demos
- No backend or database setup required
- Fully client-side, works on GitHub Pages
- Data is browser-specific (not shared across devices)
- Data can be lost if browser data is cleared
- No real-time synchronization

## Migration to Supabase

### Step 1: Set up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Note your project URL and anon key

### Step 2: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 3: Create Supabase Tables

Run this SQL in the Supabase SQL editor:

```sql
-- Fundings table
CREATE TABLE fundings (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  host_name TEXT NOT NULL,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  occasion TEXT NOT NULL,
  custom_occasion TEXT,
  target_amount INTEGER NOT NULL,
  current_amount INTEGER NOT NULL DEFAULT 0,
  deadline TIMESTAMP NOT NULL,
  cover_image TEXT,
  gift_candidates JSONB NOT NULL DEFAULT '[]',
  transparency_settings JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Contributions table
CREATE TABLE contributions (
  id TEXT PRIMARY KEY,
  funding_id TEXT NOT NULL REFERENCES fundings(id),
  contributor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP DEFAULT NOW(),
  payment_method TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE fundings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON fundings FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON contributions FOR SELECT USING (true);

-- Allow inserts (you can make this more restrictive based on auth)
CREATE POLICY "Allow public insert" ON fundings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON contributions FOR INSERT WITH CHECK (true);

-- Allow updates only for the host
CREATE POLICY "Allow host update" ON fundings FOR UPDATE
  USING (host_id = current_setting('request.jwt.claims', true)::json->>'sub');
```

### Step 4: Create Supabase Storage Implementation

Create `lib/storage/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import { Funding, Contribution } from '../types';
import { IStorage } from './interface';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

class SupabaseStorage implements IStorage {
  generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async saveFunding(funding: Funding): Promise<void> {
    const { error } = await supabase
      .from('fundings')
      .upsert(funding);

    if (error) throw new Error(`Failed to save funding: ${error.message}`);
  }

  async getFunding(id: string): Promise<Funding | null> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  async getAllFundings(): Promise<Funding[]> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async addContribution(contribution: Contribution): Promise<void> {
    const { error } = await supabase
      .from('contributions')
      .insert(contribution);

    if (error) throw new Error(`Failed to add contribution: ${error.message}`);

    // Update funding current amount
    const { error: updateError } = await supabase.rpc('increment_funding_amount', {
      funding_id: contribution.fundingId,
      amount_to_add: contribution.amount
    });

    if (updateError) throw new Error(`Failed to update funding: ${updateError.message}`);
  }

  async getContributions(fundingId: string): Promise<Contribution[]> {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('funding_id', fundingId)
      .order('timestamp', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async getFundingsByHost(hostId: string): Promise<Funding[]> {
    const { data, error } = await supabase
      .from('fundings')
      .select('*')
      .eq('host_id', hostId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async getFundingsByContributor(contributorEmail: string): Promise<{ funding: Funding; contribution: Contribution }[]> {
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select(`
        *,
        funding:fundings(*)
      `)
      .ilike('contributor_name', `%${contributorEmail}%`);

    if (error) return [];

    return (contributions || []).map(c => ({
      contribution: c,
      funding: c.funding
    }));
  }
}

export const supabaseStorage = new SupabaseStorage();
```

You'll also need to create a database function for updating the funding amount:

```sql
CREATE OR REPLACE FUNCTION increment_funding_amount(funding_id TEXT, amount_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE fundings
  SET current_amount = current_amount + amount_to_add
  WHERE id = funding_id;
END;
$$ LANGUAGE plpgsql;
```

### Step 5: Update Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 6: Switch Storage Implementation

In `lib/storage/index.ts`, change:

```typescript
// Old:
import { localStorageImpl } from './localStorage';
export const storage = localStorageImpl;

// New:
import { supabaseStorage } from './supabase';
export const storage = supabaseStorage;
```

### Step 7: Handle Async Operations

Since Supabase operations are async, update any synchronous calls to use async/await:

```typescript
// Before:
const funding = getFunding(id);

// After:
const funding = await getFunding(id);
```

Most of your components already use `useEffect` hooks, so this should be straightforward.

### Step 8: Update Next.js Config for Dynamic Rendering

If you want real-time data from Supabase, you might want to remove `output: 'export'` and deploy to Vercel instead of GitHub Pages. Alternatively, keep static export and fetch data client-side (which is what's currently happening with localStorage).

## Other Cloud Database Options

The same pattern works for other databases:

1. **Firebase Firestore**: Create `lib/storage/firebase.ts` implementing `IStorage`
2. **PocketBase**: Create `lib/storage/pocketbase.ts` implementing `IStorage`
3. **Your own API**: Create `lib/storage/api.ts` implementing `IStorage`

The `IStorage` interface ensures a consistent API regardless of the backend!

---

# 6. Session Progress

## Branch: `claude/rebuild-supabase-setup-ApcOK`

## Session Summary (2026-01-30)

### Completed Work

#### 1. Comprehensive Code Review
- Created `CODE_REVIEW.md` with 20+ identified issues
- Created `IMPLEMENTATION_PLAN.md` with phased fix approach
- Created `.env.example` template file

#### 2. Phase 1: Critical Supabase Fixes (COMPLETED)

| File | Change |
|------|--------|
| `lib/supabase.ts` | Returns `null` when not configured; added `getSupabaseClient()` helper |
| `lib/auth.ts` | Added `emailRedirectTo` for magic link callbacks |
| `app/auth/callback/page.tsx` | **NEW** - Handles PKCE code exchange for magic links |
| `contexts/AuthContext.tsx` | Guards auth listener with null checks for localStorage mode |
| `lib/types.ts` | Added `contributorId` to Contribution interface |
| `lib/storage/interface.ts` | Updated `addContribution` signature to accept `userId` |
| `lib/storage/localStorage.ts` | Accept `userId` param (ignored in local mode) |
| `lib/storage/smartStorage.ts` | Pass `userId` through to underlying storage |
| `lib/storage/supabase.ts` | Track `contributor_id`, use `getSupabaseClient()` |
| `lib/storage/index.ts` | Updated convenience export to accept `userId` |
| `components/PaymentForm.tsx` | Pass `user.id` when creating contributions |
| `supabase/schema.sql` | Added `contributor_id`, secured RPC, added indexes |
| `lib/env.ts` | Added `getBaseUrl()` helper |
| `app/layout.tsx` | Removed Google Fonts (network issues) |

#### 3. Auth Redirect URL Fix
- Updated `.env.example` with documentation for `NEXT_PUBLIC_BASE_URL`
- User configured Supabase Dashboard with both redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://jb-oh.github.io/gift_fundraiser/auth/callback`

#### 4. Infinite Redirect Loop Fix (COMPLETED)
- Fixed `public/404.html` line 30: Path extraction now includes leading slash
- Fixed `components/SpaRedirectHandler.tsx`: Added path normalization safety check

### Database Migration Required

Run this SQL in Supabase SQL Editor:

```sql
-- Add contributor_id column
ALTER TABLE public.contributions
ADD COLUMN IF NOT EXISTS contributor_id uuid REFERENCES auth.users(id);

-- Add index
CREATE INDEX IF NOT EXISTS idx_contributions_contributor_id ON contributions(contributor_id);

-- Secure the RPC function (see supabase/schema.sql for full version)
```

### Commits on Branch

```
0427d20 fix: Resolve infinite redirect loop on dynamic routes
763e722 docs: Improve .env.example with auth redirect URL documentation
0229ff3 chore: Update package-lock.json
be0fbcd feat: Implement Phase 1 critical Supabase fixes
83e4c32 docs: Add comprehensive Supabase code review and implementation plan
```

### Next Steps

1. **Merge to main** to trigger GitHub Pages deployment
2. **Apply database migration** in Supabase SQL Editor
3. **Test auth flow** end-to-end on deployed site
4. **Phase 2** (optional): Add Zod validation, error boundaries, loading skeletons

### Key Files for Reference

- `supabase/schema.sql` - Complete database schema
- `.env.example` - Environment variable template

### Testing Checklist

- [ ] Magic link signup sends email with correct redirect URL
- [ ] Auth callback exchanges code and redirects to dashboard
- [ ] Funding pages load without redirect loops
- [ ] Contributions save with `contributor_id`
- [ ] App works in localStorage mode (no Supabase)
