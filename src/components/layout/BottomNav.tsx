'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, ListChecks, ChefHat, LayoutGrid, Plus, X, CheckSquare, MessageSquare, Lightbulb, Building2, FileText, ShoppingCart, BookOpen, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { TaskForm } from '@/components/forms/TaskForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { WishForm } from '@/components/forms/WishForm';
import { ShortageForm } from '@/components/forms/ShortageForm';
import { HomeItemForm } from '@/components/forms/HomeItemForm';
import { DocumentForm } from '@/components/forms/DocumentForm';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { AnnouncementForm } from '@/components/forms/AnnouncementForm';

const leftItems = [
  { href: '/dashboard', icon: Home,       label: 'الرئيسية' },
  { href: '/tasks',     icon: ListChecks, label: 'المهام'   },
];
const rightItems = [
  { href: '/kitchen', icon: ChefHat,    label: 'المطبخ' },
  { href: '/more',    icon: LayoutGrid, label: 'المزيد' },
];

const quickAddItems = [
  { key: 'task',         icon: CheckSquare,   label: 'مهمة',    color: 'var(--accent)',   bg: 'rgba(163,177,138,0.14)' },
  { key: 'request',      icon: MessageSquare, label: 'طلب',     color: 'var(--info)',     bg: 'var(--info-soft)'       },
  { key: 'wish',         icon: Lightbulb,     label: 'فكرة',    color: 'var(--warning)',  bg: 'var(--warning-soft)'    },
  { key: 'home_item',    icon: Building2,     label: 'ممتلكات', color: 'var(--accent)',   bg: 'rgba(163,177,138,0.10)' },
  { key: 'document',     icon: FileText,      label: 'وثيقة',   color: 'var(--danger)',   bg: 'var(--danger-soft)'     },
  { key: 'shortage',     icon: ShoppingCart,  label: 'نقص',     color: 'var(--warning)',  bg: 'var(--warning-soft)'    },
  { key: 'recipe',       icon: BookOpen,      label: 'وصفة',    color: '#E879F9',         bg: 'rgba(232,121,249,0.10)' },
  { key: 'announcement', icon: Megaphone,     label: 'إعلان',   color: 'var(--bronze)',   bg: 'rgba(176,141,87,0.12)'  },
];

type FormKey = 'task' | 'request' | 'wish' | 'home_item' | 'document' | 'shortage' | 'recipe' | 'announcement' | null;

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
  const { activeQuickForm, setActiveQuickForm } = useAppStore();

  // sync store-triggered forms (e.g. from dashboard quick-add buttons)
  if (activeQuickForm && !activeForm) {
    setActiveForm(activeQuickForm as FormKey);
    setActiveQuickForm(null);
  }

  function handleSelect(key: string) {
    setSheetOpen(false);
    setActiveForm(key as FormKey);
  }

  function closeAll() {
    setSheetOpen(false);
    setActiveForm(null);
  }

  const NAV_BOTTOM = 16; // px from screen bottom
  const NAV_HEIGHT = 72;

  return (
    <>
      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 28,
            background: 'rgba(0,0,0,0.60)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Quick-add sheet — anchored to left/right so no centering math needed */}
      {sheetOpen && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: NAV_BOTTOM + NAV_HEIGHT + 12,
            left: 16,
            right: 16,
            background: 'rgba(21,24,29,0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 28,
            padding: '16px 12px 12px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
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
                    border: '1px solid rgba(255,255,255,0.06)',
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
        {/* Left 2 items */}
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
              ? 'rgba(255,255,255,0.12)'
              : 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
            border: '1.5px solid rgba(255,255,255,0.18)',
            boxShadow: sheetOpen
              ? '0 4px 20px rgba(0,0,0,0.3)'
              : '0 6px 32px rgba(163,177,138,0.55), 0 2px 8px rgba(0,0,0,0.3)',
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
            ? <X size={22} color="var(--text-primary)" strokeWidth={2.5} />
            : <Plus size={27} color="#0D0F12" strokeWidth={2.8} />
          }
        </button>

        {/* Right 2 items */}
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
    </>
  );
}
