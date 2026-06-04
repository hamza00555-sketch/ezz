'use client';

import { useAppStore } from '@/store/appStore';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { ArrowLeftRight } from 'lucide-react';
import type { Request } from '@/types';

const typeLabels: Record<string, string> = {
  purchase: '🛒 شراء',
  help: '🤝 مساعدة',
  errand: '🚗 مشوار',
  maintenance: '🔧 صيانة',
  follow_up: '📋 متابعة',
  other: '💬 أخرى',
};

const statusLabels: Record<string, string> = {
  pending: 'بانتظار الرد',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  converted: 'تحوّل لمهمة',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  converted: 'bg-blue-100 text-blue-700',
};

interface RequestCardProps {
  request: Request;
  currentUserId: string;
}

export function RequestCard({ request, currentUserId }: RequestCardProps) {
  const { members, updateRequestStatus } = useAppStore();
  const from = members.find((m) => m.id === request.from);
  const to = members.find((m) => m.id === request.to);
  const isRecipient = request.to === currentUserId;
  const isPending = request.status === 'pending';

  return (
    <div
      className="p-3.5 rounded-2xl"
      style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
    >
      <div className="flex items-start gap-3">
        {from && <MemberAvatar name={from.name} size="sm" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: '#1C1917' }}>
            {request.title}
          </p>
          {request.description && (
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#78716C' }}>
              {request.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs" style={{ color: '#78716C' }}>
              {typeLabels[request.type]}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[request.status]}`}>
              {statusLabels[request.status]}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: '#A8A29E' }}>
            {from && <span>{from.name}</span>}
            <ArrowLeftRight size={10} />
            {to && <span>{to.name}</span>}
          </div>
        </div>
      </div>

      {isRecipient && isPending && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => updateRequestStatus(request.id, 'accepted')}
            className="flex-1 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: '#16A34A' }}
          >
            قبول
          </button>
          <button
            onClick={() => updateRequestStatus(request.id, 'converted')}
            className="flex-1 py-2 rounded-xl text-sm font-medium"
            style={{ background: '#EFF6FF', color: '#2563EB' }}
          >
            تحويل لمهمة
          </button>
          <button
            onClick={() => updateRequestStatus(request.id, 'rejected')}
            className="flex-1 py-2 rounded-xl text-sm font-medium"
            style={{ background: '#FEF2F2', color: '#DC2626' }}
          >
            رفض
          </button>
        </div>
      )}
    </div>
  );
}
