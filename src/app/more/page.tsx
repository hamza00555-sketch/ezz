'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Users, Calendar, Wallet, Lightbulb, Megaphone, Settings,
  ChevronLeft, Building2
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';

const menuItems = [
  { href: '/home-section',       icon: Building2, label: 'البيت',                 description: 'الممتلكات والصيانة والوثائق',     color: 'var(--accent-strong)', bg: 'rgba(201,122,102,0.10)' },
  { href: '/more/family',        icon: Users,     label: 'العائلة والأفراد',      description: 'إدارة أفراد العائلة والصلاحيات',  color: 'var(--accent-strong)', bg: 'rgba(15,27,51,0.08)' },
  { href: '/more/calendar',      icon: Calendar,  label: 'التقويم',               description: 'مواعيد وصيانة وضمانات',           color: 'var(--info)',    bg: 'var(--info-soft)'    },
  { href: '/more/expenses',      icon: Wallet,    label: 'المصاريف',              description: 'محافظ وميزانيات يدوية',           color: 'var(--success)', bg: 'var(--success-soft)' },
  { href: '/more/wishes',        icon: Lightbulb, label: 'الأفكار والـ Wish List', description: 'احتياجات وأفكار مستقبلية',        color: 'var(--warning)', bg: 'var(--warning-soft)' },
  { href: '/more/announcements', icon: Megaphone, label: 'الإعلانات العائلية',    description: 'رسائل مثبتة ومهمة',              color: 'var(--bronze)',  bg: 'rgba(201,122,102,0.10)' },
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
          const Icon = item.icon;
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
                <Icon size={22} color={item.color} strokeWidth={1.8} />
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
            <Settings size={22} color="var(--text-secondary)" strokeWidth={1.8} />
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
