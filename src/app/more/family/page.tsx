'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { roleLabels } from '@/lib/utils';

const roleStyle: Record<string, { bg: string; color: string }> = {
  admin:  { bg: 'rgba(199,231,123,0.15)', color: 'var(--accent-strong)' },
  member: { bg: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)'    },
};

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
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {familyMembers.map((member) => {
          const activeTasks = getActiveTasks(member.id);
          const isCurrentUser = member.id === currentUserId;
          const rStyle = roleStyle[member.role] ?? roleStyle.member;
          return (
            <div
              key={member.id}
              style={{
                padding: 16, borderRadius: 20,
                background: 'var(--surface-card)',
                border: `1px solid ${isCurrentUser ? 'rgba(199,231,123,0.25)' : 'var(--border-soft)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <MemberAvatar name={member.name} size="lg" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {member.name}
                    </p>
                    {isCurrentUser && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: 'rgba(199,231,123,0.15)', color: 'var(--accent-strong)' }}>
                        أنت
                      </span>
                    )}
                  </div>
                  <span style={{ display: 'inline-block', marginTop: 4, fontSize: 11, padding: '2px 10px', borderRadius: 10, fontWeight: 600, background: rStyle.bg, color: rStyle.color }}>
                    {roleLabels[member.role]}
                  </span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 24, fontWeight: 900, lineHeight: 1, color: activeTasks > 0 ? 'var(--warning)' : 'var(--text-muted)' }}>
                    {activeTasks}
                  </p>
                  <p style={{ fontSize: 10, marginTop: 2, color: 'var(--text-muted)' }}>
                    مهمة نشطة
                  </p>
                </div>
              </div>

              {/* Permissions */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
                {member.permissions.canManageTasks && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'var(--info-soft)', color: 'var(--info)' }}>
                    إدارة المهام
                  </span>
                )}
                {member.permissions.canManageHome && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'var(--success-soft)', color: 'var(--success)' }}>
                    إدارة البيت
                  </span>
                )}
                {member.permissions.canManageFinance && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'rgba(176,141,87,0.15)', color: 'var(--bronze)' }}>
                    إدارة المصاريف
                  </span>
                )}
                {member.permissions.canInviteMembers && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'rgba(167,130,255,0.12)', color: '#A782FF' }}>
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
