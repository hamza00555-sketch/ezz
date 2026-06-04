'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

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
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Demo mode — skip auth
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
          className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)', boxShadow: '0 8px 32px rgba(200,146,42,0.3)' }}
        >
          🏡
        </div>
        <h1 className="text-3xl font-black" style={{ color: '#1C1917' }}>عز</h1>
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>بيت العز يا بتنا</p>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl p-6"
        style={{ background: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-xl font-bold mb-5 text-center" style={{ color: '#1C1917' }}>
          أهلاً بك 👋
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="relative">
            <div className="absolute top-3.5 end-3.5">
              <Mail size={18} color="#78716C" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none focus:border-[#C8922A] transition-colors"
              style={{ border: '1px solid var(--border)', color: '#1C1917' }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-3.5 end-3.5"
            >
              {showPassword ? <EyeOff size={18} color="#78716C" /> : <Eye size={18} color="#78716C" />}
            </button>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              required
              dir="ltr"
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none focus:border-[#C8922A] transition-colors"
              style={{ border: '1px solid var(--border)', color: '#1C1917' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
            style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)' }}
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: '#78716C' }}>
          ما عندك حساب؟{' '}
          <Link href="/signup" className="font-bold" style={{ color: '#C8922A' }}>
            سجّل الآن
          </Link>
        </p>
      </div>

      {/* Demo notice */}
      {!process.env.NEXT_PUBLIC_SUPABASE_URL && (
        <div className="mt-4 p-3 rounded-2xl text-center text-xs" style={{ background: '#FFF7ED', color: '#78716C', border: '1px solid #FED7AA' }}>
          وضع التجربة — لا يوجد Supabase حالياً
          <br />
          <button
            onClick={() => router.push('/dashboard')}
            className="font-bold mt-1 block mx-auto"
            style={{ color: '#C8922A' }}
          >
            ادخل للتطبيق مباشرة ←
          </button>
        </div>
      )}
    </div>
  );
}
