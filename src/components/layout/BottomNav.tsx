'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Home, ListChecks, ChefHat, LayoutGrid, Plus, X, CheckSquare, MessageSquare, Lightbulb, ShoppingCart, Megaphone, Wallet } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { TaskForm } from '@/components/forms/TaskForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { WishForm } from '@/components/forms/WishForm';
import { ShortageForm } from '@/components/forms/ShortageForm';
import { HomeItemForm } from '@/components/forms/HomeItemForm';
import { DocumentForm } from '@/components/forms/DocumentForm';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { AnnouncementForm } from '@/components/forms/AnnouncementForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

const leftItems = [
  { href: '/dashboard', icon: Home,       label: 'الرئيسية' },
  { href: '/tasks',     icon: ListChecks, label: 'المهام'   },
];
const rightItems = [
  { href: '/kitchen', icon: ChefHat,    label: 'المطبخ' },
  { href: '/more',    icon: LayoutGrid, label: 'المزيد' },
];

const quickAddItems = [
  { key: 'task',         icon: CheckSquare,   label: 'مهمة',   color: 'var(--accent-strong)', bg: 'rgba(15,27,51,0.08)'    },
  { key: 'request',      icon: MessageSquare, label: 'طلب',    color: 'var(--accent)',        bg: 'rgba(201,122,102,0.12)' },
  { key: 'shortage',     icon: ShoppingCart,  label: 'نقص',    color: '#B8604E',              bg: 'rgba(246,201,178,0.35)' },
  { key: 'expense',      icon: Wallet,        label: 'مصروف',  color: 'var(--accent-strong)', bg: 'rgba(15,27,51,0.08)'    },
  { key: 'announcement', icon: Megaphone,     label: 'إعلان',  color: 'var(--accent)',        bg: 'rgba(201,122,102,0.12)' },
  { key: 'wish',         icon: Lightbulb,     label: 'فكرة',   color: '#B8604E',              bg: 'rgba(246,201,178,0.35)' },
];

type FormKey = 'task' | 'request' | 'wish' | 'home_item' | 'document' | 'shortage' | 'recipe' | 'announcement' | 'expense' | null;

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      prefetch={true}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        padding: '8px 4px',
        textDecoration: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: active ? '6px 18px' : '6px 4px',
          borderRadius: 20,
          background: active ? 'rgba(246, 201, 178, 0.35)' : 'transparent',
          transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.3 : 1.9}
          color={active ? 'var(--accent-strong)' : '#8EA0B3'}
          style={{ transition: 'color 0.2s ease' }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: active ? 700 : 500,
            color: active ? 'var(--accent-strong)' : '#8EA0B3',
            lineHeight: 1,
            transition: 'color 0.2s ease',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const activeQuickForm = useAppStore((s) => s.activeQuickForm);
  const setActiveQuickForm = useAppStore((s) => s.setActiveQuickForm);

  // Must be in useEffect — calling setState during render causes infinite loop
  useEffect(() => {
    if (activeQuickForm) {
      setActiveForm(activeQuickForm as FormKey);
      setActiveQuickForm(null);
    }
  }, [activeQuickForm, setActiveQuickForm]);

  function handleSelect(key: string) {
    setSheetOpen(false);
    setActiveForm(key as FormKey);
  }

  function closeAll() {
    setSheetOpen(false);
    setActiveForm(null);
  }

  const NAV_BOTTOM = 16;
  const NAV_HEIGHT = 72;

  return (
    <>
      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 28,
            background: 'rgba(15, 27, 51, 0.35)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Quick-add sheet */}
      {sheetOpen && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: NAV_BOTTOM + NAV_HEIGHT + 12,
            left: 16,
            right: 16,
            background: '#FFFDF8',
            borderRadius: 28,
            padding: '16px 12px 12px',
            border: '1px solid var(--border-soft)',
            boxShadow: '0 20px 60px rgba(15, 27, 51, 0.12)',
            zIndex: 29,
          }}
        >
          <p
            style={{
              textAlign: 'center',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: 12,
              letterSpacing: '0.02em',
            }}
          >
            ماذا تريد تضيف؟
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {quickAddItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '12px 4px',
                    borderRadius: 18,
                    background: item.bg,
                    border: '1px solid rgba(15, 27, 51, 0.06)',
                    cursor: 'pointer',
                    transition: 'transform 0.12s ease',
                  }}
                  className="active:scale-95"
                >
                  <Icon size={20} color={item.color} strokeWidth={1.8} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: item.color, lineHeight: 1 }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav
        style={{
          position: 'fixed',
          bottom: NAV_BOTTOM,
          left: 16,
          right: 16,
          height: NAV_HEIGHT,
          borderRadius: 28,
          background: 'rgba(247, 242, 236, 0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(232, 221, 211, 0.70)',
          boxShadow: '0 8px 40px rgba(15, 27, 51, 0.10)',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
        }}
      >
        {leftItems.map((item) => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}

        {/* Center FAB */}
        <button
          onClick={() => setSheetOpen((p) => !p)}
          style={{
            width: 58,
            height: 58,
            borderRadius: 22,
            flexShrink: 0,
            background: sheetOpen
              ? 'rgba(201, 122, 102, 0.10)'
              : 'var(--accent-strong)',
            border: sheetOpen
              ? '1.5px solid rgba(201, 122, 102, 0.20)'
              : '1.5px solid rgba(15, 27, 51, 0.20)',
            boxShadow: sheetOpen
              ? '0 4px 16px rgba(201,122,102,0.10)'
              : '0 8px 32px rgba(15, 27, 51, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            margin: '0 4px',
          }}
          className="active:scale-90"
        >
          {sheetOpen
            ? <X size={22} color="var(--accent)" strokeWidth={2.5} />
            : <Plus size={27} color="#FFFDF8" strokeWidth={2.8} />
          }
        </button>

        {rightItems.map((item) => (
          <NavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
        ))}
      </nav>

      {/* Forms */}
      <TaskForm         open={activeForm === 'task'}         onClose={closeAll} />
      <RequestForm      open={activeForm === 'request'}      onClose={closeAll} />
      <WishForm         open={activeForm === 'wish'}         onClose={closeAll} />
      <HomeItemForm     open={activeForm === 'home_item'}    onClose={closeAll} />
      <DocumentForm     open={activeForm === 'document'}     onClose={closeAll} />
      <ShortageForm     open={activeForm === 'shortage'}     onClose={closeAll} />
      <RecipeForm       open={activeForm === 'recipe'}       onClose={closeAll} />
      <AnnouncementForm open={activeForm === 'announcement'} onClose={closeAll} />
      <ExpenseForm      open={activeForm === 'expense'}      onClose={closeAll} />
    </>
  );
}
