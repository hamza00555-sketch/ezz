'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

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
        <p className="text-sm mt-1" style={{ color: '#78716C' }}>ابدأ رحلة إدارة بيتك</p>
      </div>

      <div
        className="rounded-3xl p-6"
        style={{ background: '#FFFFFF', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid var(--border)' }}
      >
        <h2 className="text-xl font-bold mb-5 text-center" style={{ color: '#1C1917' }}>
          إنشاء حساب جديد
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center" style={{ background: '#FEF2F2', color: '#DC2626' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="relative">
            <div className="absolute top-3.5 end-3.5">
              <User size={18} color="#78716C" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم الكامل"
              required
              className="w-full px-4 py-3.5 pe-11 rounded-xl text-sm border outline-none focus:border-[#C8922A] transition-colors"
              style={{ border: '1px solid var(--border)', color: '#1C1917' }}
            />
          </div>

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
              placeholder="كلمة المرور (6 أحرف على الأقل)"
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
            {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
          </button>
        </form>

        <p className="text-center text-sm mt-4" style={{ color: '#78716C' }}>
          عندك حساب؟{' '}
          <Link href="/login" className="font-bold" style={{ color: '#C8922A' }}>
            سجّل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}
