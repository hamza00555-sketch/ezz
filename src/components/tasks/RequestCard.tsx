'use client';

import { Check, X, ArrowLeftRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
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
  pending:   { badge: 'var(--c-amber-soft)', text: '#92400E',         label: 'بانتظار الرد'  },
  accepted:  { badge: 'var(--c-green-soft)', text: 'var(--c-green)',  label: 'مقبول'         },
  rejected:  { badge: 'var(--c-red-soft)',   text: 'var(--c-red)',    label: 'مرفوض'         },
  converted: { badge: '#EFF6FF',             text: '#1D4ED8',         label: 'تحوّل لمهمة'  },
};

interface RequestCardProps {
  request: Request;
  currentUserId: string;
}

export function RequestCard({ request, currentUserId }: RequestCardProps) {
  const { members, updateRequestStatus } = useAppStore();
  const from = members.find((m) => m.id === request.from);
  const to   = members.find((m) => m.id === request.to);
  const isRecipient = request.to === currentUserId;
  const isPending   = request.status === 'pending';
  const type = typeConfig[request.type] ?? { label: 'أخرى', emoji: '💬' };
  const sStyle = statusStyle[request.status] ?? statusStyle.pending;

  return (
    <div
      className="overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isPending && isRecipient ? 'rgba(242,169,59,0.35)' : 'var(--border)'}`,
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* Top: from→to */}
      {isRecipient && isPending && (
        <div
          className="px-4 py-2 flex items-center gap-2"
          style={{ background: 'var(--c-amber-soft)', borderBottom: '1px solid rgba(242,169,59,0.2)' }}
        >
          <span className="text-xs font-semibold" style={{ color: '#92400E' }}>
            {type.emoji} طلب {type.label} من {from?.name}
          </span>
        </div>
      )}

      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {from && <MemberAvatar name={from.name} size="sm" />}
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold" style={{ color: 'var(--foreground)' }}>
              {request.title}
            </p>
            {request.description && (
              <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: 'var(--foreground-muted)' }}>
                {request.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="badge"
                style={{ background: sStyle.badge, color: sStyle.text }}
              >
                {sStyle.label}
              </span>
              {!isRecipient && (
                <span className="flex items-center gap-1 text-[11px]" style={{ color: 'var(--foreground-faint)' }}>
                  <span>{type.emoji} {type.label}</span>
                  <ArrowLeftRight size={9} className="mx-0.5" />
                  <span>{to?.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {isRecipient && isPending && (
          <div className="flex gap-2 mt-3.5">
            <button
              onClick={() => updateRequestStatus(request.id, 'accepted')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
              style={{ background: 'var(--c-green-soft)', color: 'var(--c-green)' }}
            >
              <Check size={13} strokeWidth={2.5} /> قبول
            </button>
            <button
              onClick={() => updateRequestStatus(request.id, 'converted')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold"
              style={{ background: '#EFF6FF', color: '#1D4ED8' }}
            >
              تحويل لمهمة
            </button>
            <button
              onClick={() => updateRequestStatus(request.id, 'rejected')}
              className="w-9 flex items-center justify-center py-2 rounded-xl"
              style={{ background: 'var(--c-red-soft)', color: 'var(--c-red)' }}
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
