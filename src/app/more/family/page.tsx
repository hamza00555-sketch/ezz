'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { roleLabels, roleColors } from '@/lib/utils';

export default function FamilyPage() {
  const { members, tasks, currentFamilyGroupId, currentUserId } = useAppStore();
  const familyMembers = members.filter((m) => m.familyGroupId === currentFamilyGroupId);

  const getActiveTasks = (memberId: string) =>
    tasks.filter(
      (t) =>
        t.familyGroupId === currentFamilyGroupId &&
        t.assignedTo === memberId &&
        !['done', 'cancelled'].includes(t.status)
    ).length;

  return (
    <AppShell>
      <PageHeader
        title="العائلة والأفراد"
        subtitle={`${familyMembers.length} أفراد`}
        action={
          <Link href="/more" className="p-2">
            <ChevronRight size={20} color="#78716C" />
          </Link>
        }
      />

      <div className="p-4 flex flex-col gap-3">
        {familyMembers.map((member) => {
          const activeTasks = getActiveTasks(member.id);
          const isCurrentUser = member.id === currentUserId;
          return (
            <div
              key={member.id}
              className="p-4 rounded-2xl"
              style={{
                background: '#FFFFFF',
                border: `1px solid ${isCurrentUser ? '#FED7AA' : 'var(--border)'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <MemberAvatar name={member.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-base" style={{ color: '#1C1917' }}>
                      {member.name}
                    </p>
                    {isCurrentUser && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#FED7AA', color: '#92400E' }}
                      >
                        أنت
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${roleColors[member.role]}`}
                  >
                    {roleLabels[member.role]}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black" style={{ color: activeTasks > 0 ? '#C8922A' : '#A8A29E' }}>
                    {activeTasks}
                  </p>
                  <p className="text-[10px]" style={{ color: '#78716C' }}>
                    مهمة نشطة
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {member.permissions.canManageTasks && (
                  <span className="text-[10px] px-2 py-1 rounded-lg" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                    إدارة المهام
                  </span>
                )}
                {member.permissions.canManageHome && (
                  <span className="text-[10px] px-2 py-1 rounded-lg" style={{ background: '#ECFDF5', color: '#059669' }}>
                    إدارة البيت
                  </span>
                )}
                {member.permissions.canManageFinance && (
                  <span className="text-[10px] px-2 py-1 rounded-lg" style={{ background: '#FFF7ED', color: '#C8922A' }}>
                    إدارة المصاريف
                  </span>
                )}
                {member.permissions.canInviteMembers && (
                  <span className="text-[10px] px-2 py-1 rounded-lg" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                    دعوة أفراد
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
