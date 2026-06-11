'use client';

import Link from 'next/link';
import { ArrowLeft, Check, X, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { MemberAvatar } from '@/components/shared/MemberAvatar';

const typeLabels: Record<string, string> = {
  purchase:    'شراء',
  help:        'مساعدة',
  errand:      'مشوار',
  maintenance: 'صيانة',
  follow_up:   'متابعة',
  other:       'أخرى',
};

export function PendingRequests() {
  const { requests, members, currentUserId, currentFamilyGroupId, updateRequestStatus } = useAppStore(
    useShallow((s) => ({
      requests: s.requests,
      members: s.members,
      currentUserId: s.currentUserId,
      currentFamilyGroupId: s.currentFamilyGroupId,
      updateRequestStatus: s.updateRequestStatus,
    }))
  );

  const pending = requests.filter(
    (r) =>
      r.familyGroupId === currentFamilyGroupId &&
      r.to === currentUserId &&
      r.status === 'pending'
  );

  if (pending.length === 0) return null;

  return (
    <div style={{ padding: `0 var(--page-px)`, marginBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MessageSquare size={15} color="var(--warning)" strokeWidth={2} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            طلبات تنتظرك
          </span>
          <span className="badge badge-warning">{pending.length}</span>
        </div>
        <Link
          href="/tasks"
          style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 500, color: 'var(--accent)', textDecoration: 'none' }}
        >
          الكل <ArrowLeft size={12} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pending.map((req) => {
          const from = members.find((m) => m.id === req.from);
          return (
            <div
              key={req.id}
              style={{
                background: 'var(--surface-card)',
                border: '1px solid rgba(253,186,116,0.20)',
                borderRadius: 20,
                padding: '14px 14px 12px',
              }}
            >
              {/* Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                {from && <MemberAvatar name={from.name} size="sm" />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                    {req.title}
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge badge-muted">{typeLabels[req.type]}</span>
                    {from && (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
                        من {from.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => updateRequestStatus(req.id, 'accepted')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '9px 0', borderRadius: 12,
                    background: 'var(--success-soft)', color: 'var(--success)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                  }}
                  className="active:scale-95"
                >
                  <Check size={12} strokeWidth={2.5} /> قبول
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, 'converted')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '9px 0', borderRadius: 12,
                    background: 'var(--info-soft)', color: 'var(--info)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                  }}
                  className="active:scale-95"
                >
                  تحويل لمهمة
                </button>
                <button
                  onClick={() => updateRequestStatus(req.id, 'rejected')}
                  style={{
                    width: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 12,
                    background: 'var(--danger-soft)', color: 'var(--danger)',
                    cursor: 'pointer', border: 'none',
                  }}
                  className="active:scale-95"
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
