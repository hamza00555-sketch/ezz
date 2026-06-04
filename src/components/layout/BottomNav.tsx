'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Building2, ChefHat, Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'الرئيسية' },
  { href: '/tasks', icon: CheckSquare, label: 'المهام' },
  { href: '/home-section', icon: Building2, label: 'البيت' },
  { href: '/kitchen', icon: ChefHat, label: 'المطبخ' },
  { href: '/more', icon: Grid3X3, label: 'المزيد' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="flex items-stretch"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid #E8E0D5',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        }}
      >
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 py-2.5 transition-all duration-200',
                active ? 'text-[#C8922A]' : 'text-[#78716C]'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-xl transition-all duration-200',
                  active ? 'bg-[#F5E6CC]' : ''
                )}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium',
                  active ? 'font-semibold' : ''
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
