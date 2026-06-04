'use client';

import { useAppStore } from '@/store/appStore';

export function HomeHealthScore() {
  const { tasks, currentFamilyGroupId } = useAppStore();

  const allTasks = tasks.filter(
    (t) =>
      t.familyGroupId === currentFamilyGroupId &&
      t.status !== 'cancelled'
  );
  const done = allTasks.filter((t) => t.status === 'done').length;
  const total = allTasks.length;
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const color =
    pct >= 70 ? '#16A34A' : pct >= 40 ? '#D97706' : '#DC2626';

  const label =
    pct >= 80
      ? 'ممتاز! 🎉'
      : pct >= 60
      ? 'جيد جداً 👍'
      : pct >= 40
      ? 'تحتاج جهد 💪'
      : 'يحتاج اهتمام ⚡';

  return (
    <div
      className="mx-4 mb-5 p-4 rounded-2xl flex items-center gap-4"
      style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
    >
      {/* Ring */}
      <div className="flex-shrink-0 relative w-24 h-24">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#F5F5F4" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Text */}
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: '#78716C' }}>
          حالة البيت هذا الأسبوع
        </p>
        <p className="text-lg font-bold mb-2" style={{ color: '#1C1917' }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: '#78716C' }}>
          {done} من {total} مهمة مكتملة
        </p>
      </div>
    </div>
  );
}
