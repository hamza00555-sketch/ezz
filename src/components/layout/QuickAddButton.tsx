'use client';

import { useState, useEffect } from 'react';
import { Plus, X, CheckSquare, MessageSquare, Lightbulb, Building2, FileText, ShoppingCart, BookOpen, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { TaskForm } from '@/components/forms/TaskForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { WishForm } from '@/components/forms/WishForm';
import { ShortageForm } from '@/components/forms/ShortageForm';
import { HomeItemForm } from '@/components/forms/HomeItemForm';
import { DocumentForm } from '@/components/forms/DocumentForm';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { AnnouncementForm } from '@/components/forms/AnnouncementForm';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

const quickAddItems = [
  { key: 'task',         icon: CheckSquare,  label: 'مهمة',    color: 'var(--accent)',   bg: 'rgba(163,177,138,0.14)' },
  { key: 'request',      icon: MessageSquare,label: 'طلب',     color: 'var(--info)',     bg: 'var(--info-soft)'       },
  { key: 'wish',         icon: Lightbulb,    label: 'فكرة',    color: 'var(--warning)',  bg: 'var(--warning-soft)'    },
  { key: 'home_item',    icon: Building2,    label: 'ممتلكات', color: 'var(--accent)',   bg: 'rgba(163,177,138,0.10)' },
  { key: 'document',     icon: FileText,     label: 'وثيقة',   color: 'var(--danger)',   bg: 'var(--danger-soft)'     },
  { key: 'shortage',     icon: ShoppingCart, label: 'نقص',     color: 'var(--warning)',  bg: 'var(--warning-soft)'    },
  { key: 'recipe',       icon: BookOpen,     label: 'وصفة',    color: '#E879F9',         bg: 'rgba(232,121,249,0.10)' },
  { key: 'announcement', icon: Megaphone,    label: 'إعلان',   color: 'var(--bronze)',   bg: 'rgba(176,141,87,0.12)'  },
];

type FormKey = 'task' | 'request' | 'wish' | 'home_item' | 'document' | 'shortage' | 'recipe' | 'announcement' | 'expense' | null;

export function QuickAddButton() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const { activeQuickForm, setActiveQuickForm } = useAppStore(
    useShallow((s) => ({ activeQuickForm: s.activeQuickForm, setActiveQuickForm: s.setActiveQuickForm }))
  );

  useEffect(() => {
    if (activeQuickForm) {
      queueMicrotask(() => {
        setActiveForm(activeQuickForm as FormKey);
        setActiveQuickForm(null);
      });
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

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setSheetOpen((p) => !p)}
        style={{
          position: 'fixed',
          bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 52,
          height: 52,
          borderRadius: 18,
          background: sheetOpen
            ? 'rgba(255,255,255,0.12)'
            : 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: sheetOpen
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 24px rgba(163,177,138,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 31,
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        className="active:scale-90 transition-all"
      >
        {sheetOpen
          ? <X size={22} color="var(--text-primary)" strokeWidth={2.5} />
          : <Plus size={26} color="#0D0F12" strokeWidth={2.8} />
        }
      </button>

      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fade-in"
          style={{
            position: 'fixed', inset: 0, zIndex: 20,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Sheet */}
      {sheetOpen && (
        <div
          className="slide-up"
          style={{
            position: 'fixed',
            bottom: 'calc(var(--bottom-nav-height) + 64px + env(safe-area-inset-bottom, 0px))',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100vw - 32px)',
            maxWidth: 400,
            background: 'rgba(21,24,29,0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 28,
            padding: '16px 12px 12px',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            zIndex: 30,
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
