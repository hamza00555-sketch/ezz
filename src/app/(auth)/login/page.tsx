'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { EzzLogo } from '@/components/brand/EzzLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        router.push('/dashboard');
        return;
      }

      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center"
          style={{
            background: '#0F1B33',
            boxShadow: '0 8px 32px rgba(15,27,51,0.25)',
          }}
        >
          <EzzLogo variant="dark" size="sm" />
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted, #6B7A8D)' }}>بيت العز يا بتنا</p>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: 'var(--surface-card, #FFFDF8)',
          boxShadow: '0 4px 24px rgba(15,27,51,0.08)',
          border: '1px solid var(--border-soft)',
        }}
      >
        <h2 className="text-xl font-bold mb-5 text-center" style={{ color: 'var(--text-primary, #0F1B33)' }}>
          أهلاً بك
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              style={{
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary, #0F1B33)',
                background: 'var(--color-bg, #F7F2EC)',
              }}
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
              placeholder="كلمة المرور"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none transition-colors"
              style={{
                border: '1px solid var(--border-soft)',
                color: 'var(--text-primary, #0F1B33)',
                background: 'var(--color-bg, #F7F2EC)',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#C97A66'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-soft)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
            style={{
              background: '#0F1B33',
              color: '#FFFDF8',
              boxShadow: '0 4px 16px rgba(15,27,51,0.25)',
            }}
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted, #6B7A8D)' }}>
          ما عندك حساب؟{' '}
          <Link href="/signup" className="font-bold" style={{ color: '#C97A66' }}>
            سجّل الآن
          </Link>
        </p>
      </div>

      {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <div className="mt-4 p-3 rounded-2xl text-center text-xs" style={{ background: 'rgba(201,122,102,0.08)', color: 'var(--text-muted)', border: '1px solid rgba(201,122,102,0.20)' }}>
          وضع التجربة — لا يوجد Supabase حالياً
          <br />
          <button
            onClick={() => router.push('/dashboard')}
            className="font-bold mt-1 block mx-auto"
            style={{ color: '#C97A66' }}
          >
            ادخل للتطبيق مباشرة ←
          </button>
        </div>
      )}
    </div>
  );
}
