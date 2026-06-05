'use client';

import { Check, X, ArrowLeftRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import type { Request } from '@/types';

const typeConfig: Record<string, { label: string; emoji: string }> = {
  purchase:    { label: 'شراء',    emoji: '🛒' },
  help:        { label: 'مساعدة', emoji: '🤝' },
  errand:      { label: 'مشوار',  emoji: '🚗' },
  maintenance: { label: 'صيانة',  emoji: '🔧' },
  follow_up:   { label: 'متابعة', emoji: '📋' },
  other:       { label: 'أخرى',   emoji: '💬' },
};

const statusStyle: Record<string, { badge: string; text: string; label: string }> = {
  pending:   { badge: 'var(--warning-soft)',  text: 'var(--warning)',  label: 'بانتظار الرد'  },
  accepted:  { badge: 'var(--success-soft)',  text: 'var(--success)',  label: 'مقبول'         },
  rejected:  { badge: 'var(--danger-soft)',   text: 'var(--danger)',   label: 'مرفوض'         },
  converted: { badge: 'var(--info-soft)',     text: 'var(--info)',     label: 'تحوّل لمهمة'  },
};

interface RequestCardProps {
  request: Request;
  currentUserId: string;
}

export function RequestCard({ request, currentUserId }: RequestCardProps) {
  const { members, updateRequestStatus } = useAppStore(
    useShallow((s) => ({ members: s.members, updateRequestStatus: s.updateRequestStatus }))
  );
  const from = members.find((m) => m.id === request.from);
  const to   = members.find((m) => m.id === request.to);
  const isRecipient = request.to === currentUserId;
  const isPending   = request.status === 'pending';
  const type = typeConfig[request.type] ?? { label: 'أخرى', emoji: '💬' };
  const sStyle = statusStyle[request.status] ?? statusStyle.pending;

  return (
    <div
      style={{
        background: 'var(--surface-card)',
        border: `1px solid ${isPending && isRecipient ? 'rgba(253,186,116,0.30)' : 'var(--border-soft)'}`,
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header strip for incoming pending requests */}
      {isRecipient && isPending && (
        <div
          style={{
            padding: '8px 16px',
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--warning-soft)',
            borderBottom: '1px solid rgba(253,186,116,0.20)',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--warning)' }}>
            {type.emoji} طلب {type.label} من {from?.name}
          </span>
        </div>
      )}

      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {from && <MemberAvatar name={from.name} size="sm" />}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
              {request.title}
            </p>
            {request.description && (
              <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-secondary)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                {request.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span
                style={{
                  fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                  background: sStyle.badge, color: sStyle.text,
                }}
              >
                {sStyle.label}
              </span>
              {!isRecipient && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{type.emoji} {type.label}</span>
                  <ArrowLeftRight size={9} style={{ marginInline: 2 }} />
                  <span>{to?.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {isRecipient && isPending && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button
              onClick={() => updateRequestStatus(request.id, 'accepted')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 0', borderRadius: 12,
                background: 'var(--success-soft)', color: 'var(--success)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              }}
            >
              <Check size={13} strokeWidth={2.5} /> قبول
            </button>
            <button
              onClick={() => updateRequestStatus(request.id, 'converted')}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 0', borderRadius: 12,
                background: 'var(--info-soft)', color: 'var(--info)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              }}
            >
              تحويل لمهمة
            </button>
            <button
              onClick={() => updateRequestStatus(request.id, 'rejected')}
              style={{
                width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '10px 0', borderRadius: 12,
                background: 'var(--danger-soft)', color: 'var(--danger)',
                cursor: 'pointer', border: 'none',
              }}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
