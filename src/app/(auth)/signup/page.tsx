'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, User, Eye, EyeOff } from 'lucide-react';
import { EzzLogo } from '@/components/brand/EzzLogo';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/onboarding');
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name } },
      });
      if (authError) throw authError;
      router.push('/onboarding');
    } catch (err: unknown) {
      if (err instanceof Error) {
        const anyErr = err as Error & { status?: number; code?: string };
        const detail = anyErr.status ? ` (${anyErr.status})` : '';
        setError(err.message + detail);
      } else {
        setError('حدث خطأ غير معروف');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    border: '1px solid var(--border-soft)',
    color: 'var(--text-primary, #0F1B33)',
    background: 'var(--color-bg, #F7F2EC)',
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: '#0F1B33', boxShadow: '0 8px 32px rgba(15,27,51,0.25)' }}
        >
          <EzzLogo variant="dark" size="sm" />
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted, #6B7A8D)' }}>ابدأ رحلة إدارة بيتك</p>
      </div>

      <div
        className="rounded-3xl p-6"
        style={{
          background: 'var(--surface-card, #FFFDF8)',
          boxShadow: '0 4px 24px rgba(15,27,51,0.08)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <h2 className="text-xl font-bold mb-5 text-center" style={{ color: 'var(--text-primary, #0F1B33)' }}>
          إنشاء حساب جديد
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="relative">
            <div className="absolute top-3.5 end-3.5">
              <User size={18} color="var(--text-muted, #6B7A8D)" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
              required
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute top-3.5 end-3.5">
              <Mail size={18} color="var(--text-muted, #6B7A8D)" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-3.5 end-3.5"
            >
              {showPassword
                ? <EyeOff size={18} color="var(--text-muted, #6B7A8D)" />
                : <Eye size={18} color="var(--text-muted, #6B7A8D)" />
              }
            </button>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور (6 أحرف على الأقل)"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none transition-colors"
              style={inputStyle}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
            style={{ background: '#0F1B33', color: '#FFFDF8', boxShadow: '0 4px 16px rgba(15,27,51,0.25)' }}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted, #6B7A8D)' }}>
          عندك حساب؟{' '}
          <Link href="/login" className="font-bold" style={{ color: '#C97A66' }}>
            سجّل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}
