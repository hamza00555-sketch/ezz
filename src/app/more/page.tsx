'use client';

import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Users, Calendar, Wallet, Lightbulb, Megaphone, Settings,
  ChevronLeft
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const menuItems = [
  { href: '/more/family', icon: Users, label: 'العائلة والأفراد', description: 'إدارة أفراد العائلة والصلاحيات', color: '#7C3AED', bg: '#F5F3FF' },
  { href: '/more/calendar', icon: Calendar, label: 'التقويم', description: 'مواعيد وصيانة وضمانات', color: '#2563EB', bg: '#EFF6FF' },
  { href: '/more/expenses', icon: Wallet, label: 'المصاريف', description: 'محافظ وميزانيات يدوية', color: '#16A34A', bg: '#ECFDF5' },
  { href: '/more/wishes', icon: Lightbulb, label: 'الأفكار والـ Wish List', description: 'احتياجات وأفكار مستقبلية', color: '#D97706', bg: '#FFFBEB' },
  { href: '/more/announcements', icon: Megaphone, label: 'الإعلانات العائلية', description: 'رسائل مثبتة ومهمة', color: '#0891B2', bg: '#ECFEFF' },
];

export default function MorePage() {
  const { members, currentFamilyGroupId, wishItems, announcements, currentUserId } = useAppStore();
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

      <div className="p-4 flex flex-col gap-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const badge = badges[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 p-4 rounded-2xl active:scale-[0.98] transition-transform"
              style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
            >
              <div className="p-3 rounded-xl flex-shrink-0" style={{ background: item.bg }}>
                <Icon size={22} color={item.color} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                  {item.label}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
                  {item.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {badge !== undefined && badge > 0 && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {badge}
                  </span>
                )}
                <ChevronLeft size={16} color="#A8A29E" />
              </div>
            </Link>
          );
        })}

        {/* Settings */}
        <Link
          href="/more/settings"
          className="flex items-center gap-3.5 p-4 rounded-2xl active:scale-[0.98] transition-transform mt-2"
          style={{ background: '#F5F5F4', border: '1px solid var(--border)' }}
        >
          <div className="p-3 rounded-xl flex-shrink-0" style={{ background: '#E7E5E4' }}>
            <Settings size={22} color="#78716C" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: '#57534E' }}>
              الإعدادات
            </p>
          </div>
          <ChevronLeft size={16} color="#A8A29E" />
        </Link>
      </div>
    </AppShell>
  );
}
