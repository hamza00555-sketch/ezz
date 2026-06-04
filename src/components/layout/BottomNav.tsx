'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, Building2, ChefHat, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard',    icon: Home,        label: 'الرئيسية' },
  { href: '/tasks',        icon: ListChecks,  label: 'المهام'   },
  { href: '/home-section', icon: Building2,   label: 'البيت'    },
  { href: '/kitchen',      icon: ChefHat,     label: 'المطبخ'   },
  { href: '/more',         icon: LayoutGrid,  label: 'المزيد'   },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div
        className="flex items-stretch h-[80px] px-2"
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          boxShadow: '0 -4px 24px rgba(16,24,40,0.07)',
        }}
      >
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 gap-0.5 transition-all duration-200"
            >
              <div
                className={cn(
                  'flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200',
                  active ? '' : ''
                )}
                style={active ? { background: 'var(--c-green-soft)' } : {}}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.2 : 1.7}
                  color={active ? 'var(--c-green)' : 'var(--foreground-muted)'}
                />
              </div>
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? 'var(--c-green)' : 'var(--foreground-muted)' }}
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
