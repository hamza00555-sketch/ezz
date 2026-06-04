'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';

const requestTypeLabels: Record<string, string> = {
  purchase: '🛒 شراء',
  help: '🤝 مساعدة',
  errand: '🚗 مشوار',
  maintenance: '🔧 صيانة',
  follow_up: '📋 متابعة',
  other: '💬 أخرى',
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
      <SectionHeader
        title="طلبات بانتظارك"
        action={
          <Link href="/tasks?tab=requests" className="text-xs font-medium" style={{ color: '#C8922A' }}>
            الكل <ArrowLeft size={12} className="inline" />
          </Link>
        }
      />
      <div className="flex flex-col gap-2">
        {pending.map((req) => {
          const from = members.find((m) => m.id === req.from);
          return (
            <div
              key={req.id}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
            >
              {from && <MemberAvatar name={from.name} size="sm" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#1C1917' }}>
                  {req.title}
                </p>
                <span className="text-xs" style={{ color: '#78716C' }}>
                  {requestTypeLabels[req.type]} · من {from?.name}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => updateRequestStatus(req.id, 'accepted')}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-white"
                  style={{ background: '#16A34A' }}
                >
                  قبول
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, 'rejected')}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{ background: '#FEE2E2', color: '#DC2626' }}
                >
                  رفض
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
