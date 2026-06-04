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

  if (step === 'choice') {
    return (
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl">🏡</span>
          <h1 className="text-2xl font-black mt-4 mb-2" style={{ color: '#1C1917' }}>مرحباً بك في عز</h1>
          <p className="text-sm" style={{ color: '#78716C' }}>هل تريد إنشاء بيت جديد أو الانضمام لبيت موجود؟</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setStep('create')}
            className="flex items-center gap-4 p-5 rounded-2xl text-right transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)', border: '1.5px solid #FED7AA' }}
          >
            <div className="p-3 rounded-2xl" style={{ background: '#C8922A' }}>
              <Home size={24} color="#FFFFFF" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: '#1C1917' }}>إنشاء بيت جديد</p>
              <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>ابدأ من الصفر وادعِ عائلتك</p>
            </div>
          </button>

          <button
            onClick={() => setStep('join')}
            className="flex items-center gap-4 p-5 rounded-2xl text-right transition-all active:scale-[0.98]"
            style={{ background: '#FFFFFF', border: '1.5px solid var(--border)' }}
          >
            <div className="p-3 rounded-2xl" style={{ background: '#F5F3FF' }}>
              <Users size={24} color="#7C3AED" />
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: '#1C1917' }}>الانضمام لبيت</p>
              <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>ادخل كود الدعوة من أحد أفراد العائلة</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (step === 'create') {
    return (
      <div className="w-full max-w-sm">
        <button onClick={() => setStep('choice')} className="flex items-center gap-1 mb-6" style={{ color: '#78716C' }}>
          <ArrowLeft size={16} /> رجوع
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#1C1917' }}>إنشاء بيتك</h2>
          <p className="text-sm mt-1" style={{ color: '#78716C' }}>اختر اسماً وأيقونة لبيتك</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <p className="text-sm font-medium mb-2" style={{ color: '#44403C' }}>الأيقونة</p>
            <div className="grid grid-cols-8 gap-2">
              {homeEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className="p-2 rounded-xl text-2xl transition-all"
                  style={{
                    background: emoji === e ? '#FFF7ED' : '#F5F5F4',
                    border: emoji === e ? '2px solid #C8922A' : '2px solid transparent',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Home name */}
          <div>
            <p className="text-sm font-medium mb-1.5" style={{ color: '#44403C' }}>اسم البيت</p>
            <input
              value={homeName}
              onChange={(e) => setHomeName(e.target.value)}
              placeholder="مثال: بيت آل الأحمدي"
              className="w-full px-4 py-3.5 rounded-xl text-sm border outline-none focus:border-[#C8922A] transition-colors"
              style={{ border: '1px solid var(--border)', color: '#1C1917' }}
              autoFocus
            />
          </div>

          {/* Preview */}
          {homeName && (
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ background: '#FFF7ED', border: '1px solid #FED7AA' }}
            >
              <span className="text-3xl">{emoji}</span>
              <p className="font-bold text-lg" style={{ color: '#1C1917' }}>{homeName}</p>
            </div>
          )}

          <button
            onClick={createHome}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)' }}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء البيت 🏡'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <button onClick={() => setStep('choice')} className="flex items-center gap-1 mb-6" style={{ color: '#78716C' }}>
        <ArrowLeft size={16} /> رجوع
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#1C1917' }}>انضم لبيت</h2>
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>ادخل كود الدعوة المكون من 8 أحرف</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#FEF2F2', color: '#DC2626' }}>
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
          className="w-full px-4 py-4 rounded-xl text-2xl font-black text-center border outline-none focus:border-[#C8922A] tracking-widest transition-colors"
          style={{ border: '1px solid var(--border)', color: '#1C1917', letterSpacing: '0.3em' }}
          autoFocus
        />

        <button
          onClick={joinHome}
          disabled={loading || inviteCode.length !== 8}
          className="w-full py-3.5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)' }}
        >
          {loading ? 'جاري التحقق...' : 'انضم الآن'}
        </button>
      </div>
    </div>
  );
}
