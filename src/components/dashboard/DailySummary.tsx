'use client';

import { useAppStore } from '@/store/appStore';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export function DailySummary() {
  const { tasks, currentUserId, members, currentFamilyGroupId } = useAppStore();
  const me = members.find((m) => m.id === currentUserId);
  const today = new Date();

  const myTasks = tasks.filter(
    (t) =>
      t.familyGroupId === currentFamilyGroupId &&
      t.assignedTo === currentUserId &&
      !['done', 'cancelled'].includes(t.status)
  );

  const doneToday = tasks.filter(
    (t) =>
      t.familyGroupId === currentFamilyGroupId &&
      t.status === 'done' &&
      t.updatedAt &&
      new Date(t.updatedAt).toDateString() === today.toDateString()
  ).length;

  const greeting = () => {
    const h = today.getHours();
    if (h < 12) return 'صباح الخير';
    if (h < 17) return 'مساء الخير';
    return 'مساء النور';
  };

  return (
    <div className="px-4 py-4">
      {/* Greeting */}
      <div className="mb-4">
        <p className="text-sm" style={{ color: '#78716C' }}>
          {format(today, 'EEEE، dd MMMM yyyy', { locale: ar })}
        </p>
        <h2 className="text-2xl font-bold mt-0.5" style={{ color: '#1C1917' }}>
          {greeting()}، {me?.name.split(' ')[0]} 👋
        </h2>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="flex flex-col items-center py-4 rounded-2xl"
          style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
        >
          <span className="text-2xl font-bold" style={{ color: '#C8922A' }}>
            {myTasks.length}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: '#78716C' }}>
            مهام معلقة
          </span>
        </div>
        <div
          className="flex flex-col items-center py-4 rounded-2xl"
          style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
        >
          <span className="text-2xl font-bold" style={{ color: '#16A34A' }}>
            {doneToday}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: '#78716C' }}>
            أُنجز اليوم
          </span>
        </div>
        <div
          className="flex flex-col items-center py-4 rounded-2xl"
          style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
        >
          <span className="text-2xl font-bold" style={{ color: '#2563EB' }}>
            {myTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: '#78716C' }}>
            عاجلة
          </span>
        </div>
      </div>
    </div>
  );
}
