'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, ArrowLeft } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice');
  const [homeName, setHomeName] = useState('');
  const [emoji, setEmoji] = useState('🏡');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const homeEmojis = ['🏡', '🏠', '🏰', '🏯', '🏛️', '🏗️', '🌇', '🌆'];

  async function createHome() {
    if (!homeName.trim()) { setError('اسم البيت مطلوب'); return; }
    setLoading(true);
    setError('');
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/dashboard');
        return;
      }
      const { createClient } = await import('@/lib/supabase/client');
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error('يرجى تسجيل الدخول أولاً');

      const { dbCreateFamilyGroup } = await import('@/lib/supabase/db');
      await dbCreateFamilyGroup(user.id, homeName.trim(), emoji);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  }

  async function joinHome() {
    if (inviteCode.trim().length !== 8) { setError('الكود يجب أن يكون 8 أحرف'); return; }
    setLoading(true);
    setError('');
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/dashboard');
        return;
      }
      const { createClient } = await import('@/lib/supabase/client');
      const sb = createClient();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) throw new Error('يرجى تسجيل الدخول أولاً');

      const { dbJoinFamilyGroup } = await import('@/lib/supabase/db');
      await dbJoinFamilyGroup(user.id, inviteCode.trim());
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'الكود غير صحيح أو منتهي');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    border: '1px solid var(--border-soft)',
    color: 'var(--text-primary, #0F1B33)',
    background: 'var(--color-bg, #F7F2EC)',
  };

  const errorStyle = {
    background: 'var(--danger-soft)',
    color: 'var(--danger)',
  };

  if (step === 'choice') {
    return (
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl">🏡</span>
          <h1 className="text-2xl font-black mt-4 mb-2" style={{ color: 'var(--text-primary, #0F1B33)' }}>مرحباً بك في عز</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted, #6B7A8D)' }}>هل تريد إنشاء بيت جديد أو الانضمام لبيت موجود؟</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStep('create')}
            className="flex items-center gap-4 p-5 rounded-2xl text-right transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(201,122,102,0.08)',
              border: '1.5px solid rgba(201,122,102,0.25)',
            }}
          >
            <div className="p-3 rounded-2xl" style={{ background: '#C97A66' }}>
              <Home size={24} color="#FFFDF8" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--text-primary, #0F1B33)' }}>إنشاء بيت جديد</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted, #6B7A8D)' }}>ابدأ من الصفر وادعِ عائلتك</p>
            </div>
          </button>

          <button
            onClick={() => setStep('join')}
            className="flex items-center gap-4 p-5 rounded-2xl text-right transition-all active:scale-[0.98]"
            style={{
              background: 'var(--surface-card, #FFFDF8)',
              border: '1.5px solid var(--border-soft)',
            }}
          >
            <div className="p-3 rounded-2xl" style={{ background: 'rgba(15, 27, 51, 0.08)' }}>
              <Users size={24} color="#0F1B33" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: 'var(--text-primary, #0F1B33)' }}>الانضمام لبيت</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted, #6B7A8D)' }}>ادخل كود الدعوة من أحد أفراد العائلة</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div className="w-full max-w-sm">
        <button onClick={() => setStep('choice')} className="flex items-center gap-1 mb-6" style={{ color: 'var(--text-muted, #6B7A8D)' }}>
          <ArrowLeft size={16} /> رجوع
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary, #0F1B33)' }}>إنشاء بيتك</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted, #6B7A8D)' }}>اختر اسماً وأيقونة لبيتك</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={errorStyle}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary, #2C3E5C)' }}>الأيقونة</p>
            <div className="grid grid-cols-8 gap-2">
              {homeEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="p-2 rounded-xl text-2xl transition-all"
                  style={{
                    background: emoji === e ? 'rgba(201,122,102,0.12)' : 'rgba(15,27,51,0.04)',
                    border: emoji === e ? '2px solid #C97A66' : '2px solid transparent',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Home name */}
          <div>
            <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary, #2C3E5C)' }}>اسم البيت</p>
            <input
              value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              placeholder="مثال: بيت آل الأحمدي"
              className="w-full px-4 py-3.5 rounded-xl text-sm border outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
              autoFocus
            />
          </div>

          {/* Preview */}
          {homeName && (
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ background: 'rgba(201,122,102,0.08)', border: '1px solid rgba(201,122,102,0.20)' }}
            >
              <span className="text-3xl">{emoji}</span>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary, #0F1B33)' }}>{homeName}</p>
            </div>
          )}

          <button
            onClick={createHome}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: '#0F1B33', color: '#FFFDF8', boxShadow: '0 4px 16px rgba(15,27,51,0.25)' }}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء البيت 🏡'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <button onClick={() => setStep('choice')} className="flex items-center gap-1 mb-6" style={{ color: 'var(--text-muted, #6B7A8D)' }}>
        <ArrowLeft size={16} /> رجوع
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary, #0F1B33)' }}>انضم لبيت</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted, #6B7A8D)' }}>ادخل كود الدعوة المكون من 8 أحرف</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm text-center" style={errorStyle}>
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          placeholder="ABCD1234"
          maxLength={8}
          dir="ltr"
          className="w-full px-4 py-4 rounded-xl text-2xl font-black text-center border outline-none transition-colors tracking-widest"
          style={{ ...inputStyle, letterSpacing: '0.3em' }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
          autoFocus
        />

        <button
          onClick={joinHome}
          disabled={loading || inviteCode.length !== 8}
          className="w-full py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: '#0F1B33', color: '#FFFDF8', boxShadow: '0 4px 16px rgba(15,27,51,0.25)' }}
        >
          {loading ? 'جاري التحقق...' : 'انضم الآن'}
        </button>
      </div>
    </div>
  );
}
