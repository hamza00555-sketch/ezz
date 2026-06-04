'use client';

import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { MemberAvatar } from '@/components/shared/MemberAvatar';

const typeLabels: Record<string, string> = {
  purchase:   '🛒 شراء',
  help:       '🤝 مساعدة',
  errand:     '🚗 مشوار',
  maintenance:'🔧 صيانة',
  follow_up:  '📋 متابعة',
  other:      '💬 أخرى',
};

export function PendingRequests() {
  const { requests, members, currentUserId, currentFamilyGroupId, updateRequestStatus } = useAppStore();

  const pending = requests.filter(
    (r) =>
      r.familyGroupId === currentFamilyGroupId &&
      r.to === currentUserId &&
      r.status === 'pending'
  );

  if (pending.length === 0) return null;

  return (
    <div className="px-4 mb-5">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold" style={{ color: 'var(--foreground)' }}>طلبات تنتظرك</h2>
          <span className="badge badge-red">{pending.length}</span>
        </div>
        <Link href="/tasks" className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--c-green)' }}>
          الكل <ArrowLeft size={12} className="mt-px" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {pending.map((req) => {
          const from = members.find((m) => m.id === req.from);
          return (
            <div
              key={req.id}
              className="p-4"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--card-radius)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {/* Request info */}
              <div className="flex items-start gap-3 mb-3">
                {from && <MemberAvatar name={from.name} size="sm" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                    {req.title}
                  </p>
                  {req.description && (
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--foreground-muted)' }}>
                      {req.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="badge badge-muted">{typeLabels[req.type]}</span>
                    {from && (
                      <span className="text-[11px]" style={{ color: 'var(--foreground-muted)' }}>
                        من {from.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateRequestStatus(req.id, 'accepted')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: 'var(--c-green-soft)', color: 'var(--c-green)' }}
                >
                  <Check size={13} strokeWidth={2.5} /> قبول
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, 'converted')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: '#EFF6FF', color: '#1D4ED8' }}
                >
                  تحويل لمهمة
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, 'rejected')}
                  className="w-9 flex items-center justify-center py-2 rounded-xl text-xs"
                  style={{ background: 'var(--c-red-soft)', color: 'var(--c-red)' }}
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
