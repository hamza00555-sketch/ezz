'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, Building2, ChefHat, LayoutGrid } from 'lucide-react';

const navItems = [
  { href: '/dashboard',    icon: Home,       label: 'الرئيسية' },
  { href: '/tasks',        icon: ListChecks, label: 'المهام'   },
  { href: '/home-section', icon: Building2,  label: 'البيت'    },
  { href: '/kitchen',      icon: ChefHat,    label: 'المطبخ'   },
  { href: '/more',         icon: LayoutGrid, label: 'المزيد'   },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
        left: 16,
        right: 16,
        height: 72,
        borderRadius: 28,
        background: 'rgba(21, 24, 29, 0.90)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.50)',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
      }}
    >
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '8px 4px',
              borderRadius: 20,
              transition: 'all 0.2s ease',
              textDecoration: 'none',
            }}
          >
            {/* Pill behind icon */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                padding: active ? '6px 18px' : '6px 4px',
                borderRadius: 20,
                background: active ? 'rgba(163, 177, 138, 0.18)' : 'transparent',
                transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.2 : 1.6}
                color={active ? 'var(--accent-strong)' : 'var(--text-muted)'}
                style={{ transition: 'color 0.2s ease' }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: active ? 700 : 400,
                  color: active ? 'var(--accent-strong)' : 'var(--text-muted)',
                  lineHeight: 1,
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
