'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { ChevronLeft } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { BrandIcon, type BrandIconName } from '@/components/brand/BrandIcon';

const menuItems: { href: string; icon: BrandIconName; label: string; description: string; color: string; bg: string }[] = [
  { href: '/home-section',       icon: 'home',          label: 'البيت',              description: 'الممتلكات والصيانة والوثائق',    color: 'var(--accent)',        bg: 'rgba(201,122,102,0.10)' },
  { href: '/more/family',        icon: 'family-members',label: 'العائلة والأفراد',   description: 'إدارة أفراد العائلة والصلاحيات', color: 'var(--accent-strong)', bg: 'rgba(15,27,51,0.08)'    },
  { href: '/more/calendar',      icon: 'calendar',      label: 'التقويم',            description: 'مواعيد وصيانة وضمانات',          color: '#B8604E',              bg: 'rgba(246,201,178,0.35)' },
  { href: '/more/expenses',      icon: 'wallet',        label: 'المصاريف',           description: 'محافظ وميزانيات يدوية',          color: 'var(--accent-strong)', bg: 'rgba(15,27,51,0.08)'    },
  { href: '/more/wishes',        icon: 'ideas',         label: 'الأفكار والرغبات',   description: 'احتياجات وأفكار مستقبلية',       color: 'var(--accent)',        bg: 'rgba(201,122,102,0.10)' },
  { href: '/more/announcements', icon: 'announcements', label: 'الإعلانات العائلية', description: 'رسائل مثبتة ومهمة',             color: '#B8604E',              bg: 'rgba(246,201,178,0.35)' },
];

export default function MorePage() {
  const { members, currentFamilyGroupId, wishItems, announcements, currentUserId } = useAppStore(
    useShallow((s) => ({ members: s.members, currentFamilyGroupId: s.currentFamilyGroupId, wishItems: s.wishItems, announcements: s.announcements, currentUserId: s.currentUserId }))
  );
  const familyMembers = members.filter((m) => m.familyGroupId === currentFamilyGroupId);
  const activeAnnouncements = announcements.filter(
    (a) => a.familyGroupId === currentFamilyGroupId && a.status === 'active' && !a.confirmedBy.includes(currentUserId)
  ).length;
  const pendingWishes = wishItems.filter(
    (w) => w.familyGroupId === currentFamilyGroupId && w.status === 'idea'
  ).length;

  const badges: Record<string, number> = {
    '/more/announcements': activeAnnouncements,
    '/more/wishes': pendingWishes,
    '/more/family': familyMembers.length,
  };

  return (
    <AppShell>
      <PageHeader title="المزيد" />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {menuItems.map((item) => {
          const badge = badges[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="active:scale-[0.98] transition-transform"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: 16, borderRadius: 20,
                background: 'var(--surface-card)',
                border: '1px solid var(--border-soft)',
                textDecoration: 'none',
              }}
            >
              <div style={{ padding: 12, borderRadius: 16, flexShrink: 0, background: item.bg }}>
                <BrandIcon name={item.icon} size={22} color={item.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 12, marginTop: 2, color: 'var(--text-muted)' }}>
                  {item.description}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {badge !== undefined && badge > 0 && (
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700,
                      padding: '2px 8px', borderRadius: 10,
                      minWidth: 22, textAlign: 'center',
                      background: item.bg, color: item.color,
                    }}
                  >
                    {badge}
                  </span>
                )}
                <ChevronLeft size={16} color="var(--text-muted)" />
              </div>
            </Link>
          );
        })}

        {/* Settings */}
        <Link
          href="/more/settings"
          className="active:scale-[0.98] transition-transform"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 16, borderRadius: 20, marginTop: 6,
            background: 'var(--surface-card)',
            border: '1px solid var(--border-soft)',
            textDecoration: 'none',
          }}
        >
          <div style={{ padding: 12, borderRadius: 16, flexShrink: 0, background: 'rgba(15,27,51,0.06)' }}>
            <BrandIcon name="settings" size={22} color="var(--text-secondary)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
              الإعدادات
            </p>
          </div>
          <ChevronLeft size={16} color="var(--text-muted)" />
        </Link>
      </div>
    </AppShell>
  );
}
