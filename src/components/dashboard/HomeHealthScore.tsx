'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function HomeHealthScore() {
  const { tasks, currentFamilyGroupId } = useAppStore();

  const allTasks = tasks.filter(
    (t) => t.familyGroupId === currentFamilyGroupId && t.status !== 'cancelled'
  );
  const done = allTasks.filter((t) => t.status === 'done').length;
  const total = allTasks.length;
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);

  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const ringColor =
    pct >= 70 ? 'var(--c-green)' : pct >= 40 ? 'var(--c-amber)' : 'var(--c-red)';
  const pillBg =
    pct >= 70 ? 'var(--c-green-soft)' : pct >= 40 ? 'var(--c-amber-soft)' : 'var(--c-red-soft)';
  const pillText =
    pct >= 70 ? 'var(--c-green)' : pct >= 40 ? '#92400E' : 'var(--c-red)';
  const label =
    pct >= 80 ? 'ممتاز!' : pct >= 60 ? 'جيد جداً' : pct >= 40 ? 'تحتاج جهد' : 'يحتاج اهتمام';

  const nextTask = allTasks
    .filter((t) => !['done', 'cancelled'].includes(t.status))
    .sort((a, b) => {
      const o: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (o[a.priority] ?? 4) - (o[b.priority] ?? 4);
    })[0];

  return (
    <div className="mx-4 mb-5 overflow-hidden" style={{ borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
      {/* Hero */}
      <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #101828 0%, #1A2D4A 100%)' }}>
        <div className="flex items-center gap-5">
          {/* Progress ring */}
          <div className="relative flex-shrink-0 w-[88px] h-[88px]">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="9" />
              <circle
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black text-white">{pct}%</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              حالة البيت هذا الأسبوع
            </p>
            <p className="text-xl font-bold text-white mb-2">{label}</p>
            <span
              className="badge text-xs"
              style={{ background: pillBg, color: pillText }}
            >
              {done} من {total} مهمة مكتملة
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      {nextTask ? (
        <Link
          href="/tasks"
          className="flex items-center justify-between px-4 py-3 active:opacity-80 transition-opacity"
          style={{ background: 'var(--c-green)' }}
        >
          <div className="min-w-0">
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>ابدأ بأهم مهمة</p>
            <p className="text-sm font-semibold text-white truncate">{nextTask.title}</p>
          </div>
          <ArrowLeft size={17} color="rgba(255,255,255,0.75)" className="flex-shrink-0 ms-3" />
        </Link>
      ) : (
        <div
          className="flex items-center justify-center px-4 py-3 gap-2"
          style={{ background: 'var(--c-green)' }}
        >
          <span className="text-sm font-semibold text-white">البيت مرتب اليوم 👌</span>
        </div>
      )}
    </div>
  );
}
