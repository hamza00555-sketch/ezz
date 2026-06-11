'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Copy, Share2, Check } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { roleLabels } from '@/lib/utils';

const roleStyle: Record<string, { bg: string; color: string }> = {
  admin:  { bg: 'rgba(201,122,102,0.12)', color: 'var(--accent-strong)' },
  member: { bg: 'rgba(15,27,51,0.06)',    color: 'var(--text-muted)'    },
};

export default function FamilyPage() {
  const { members, tasks, familyGroups, currentFamilyGroupId, currentUserId } = useAppStore(
    useShallow((s) => ({ members: s.members, tasks: s.tasks, familyGroups: s.familyGroups, currentFamilyGroupId: s.currentFamilyGroupId, currentUserId: s.currentUserId }))
  );
  const familyMembers = members.filter((m) => m.familyGroupId === currentFamilyGroupId);
  const familyGroup   = familyGroups.find((g) => g.id === currentFamilyGroupId);
  const currentMember = members.find((m) => m.id === currentUserId);
  const canInvite     = currentMember?.role === 'family_admin' || !!currentMember?.permissions.canInviteMembers;

  const [copied, setCopied] = useState(false);

  const inviteCode = familyGroup?.inviteCode;
  const shareText  = `انضم لبيتنا "${familyGroup?.name ?? 'عز'}" على تطبيق عز بالكود: ${inviteCode}`;

  function handleCopy() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShare() {
    if (!inviteCode) return;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

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

        {/* ── Invite Code Card ─────────────────────────────────────────────── */}
        {canInvite && inviteCode && (
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 22,
              background: 'linear-gradient(135deg, rgba(201,122,102,0.08) 0%, rgba(247,242,236,0.90) 100%)',
              border: '1px solid rgba(201,122,102,0.22)',
              marginBottom: 4,
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--bronze)', marginBottom: 10, letterSpacing: '0.05em' }}>
              كود دعوة البيت
            </p>

            {/* Code display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  flex: 1,
                  fontFamily: 'monospace',
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: '0.25em',
                  color: 'var(--text-primary)',
                  direction: 'ltr',
                  textAlign: 'center',
                  padding: '10px 14px',
                  borderRadius: 14,
                  background: 'rgba(15,27,51,0.05)',
                  border: '1px solid rgba(15,27,51,0.08)',
                }}
              >
                {inviteCode}
              </span>
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
              شارك هذا الكود مع أفراد عائلتك — يُدخلونه عند إنشاء حسابهم للانضمام للبيت
            </p>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 14,
                  background: copied ? 'rgba(201,122,102,0.12)' : 'rgba(15,27,51,0.06)',
                  border: `1px solid ${copied ? 'rgba(201,122,102,0.25)' : 'rgba(15,27,51,0.10)'}`,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                {copied
                  ? <Check size={14} color="var(--accent-strong)" />
                  : <Copy size={14} color="var(--text-muted)" />
                }
                <span style={{ fontSize: 12, fontWeight: 600, color: copied ? 'var(--accent-strong)' : 'var(--text-secondary)' }}>
                  {copied ? 'تم النسخ' : 'نسخ الكود'}
                </span>
              </button>

              <button
                onClick={handleShare}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '10px 16px', borderRadius: 14,
                  background: 'rgba(201,122,102,0.10)',
                  border: '1px solid rgba(201,122,102,0.22)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <Share2 size={14} color="var(--bronze)" />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bronze)' }}>مشاركة</span>
              </button>
            </div>
          </div>
        )}

        {/* ── Members list ─────────────────────────────────────────────────── */}
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
                border: `1px solid ${isCurrentUser ? 'rgba(201,122,102,0.25)' : 'var(--border-soft)'}`,
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
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: 'rgba(201,122,102,0.12)', color: 'var(--accent-strong)' }}>
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
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'rgba(201,122,102,0.10)', color: 'var(--bronze)' }}>
                    إدارة المصاريف
                  </span>
                )}
                {member.permissions.canInviteMembers && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'rgba(15,27,51,0.08)', color: 'var(--accent-strong)' }}>
                    دعوة أفراد
                  </span>
                )}
                {member.permissions.canManageKitchen && (
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 10, background: 'rgba(201,122,102,0.10)', color: 'var(--accent)' }}>
                    إدارة المطبخ
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
