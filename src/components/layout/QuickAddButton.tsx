'use client';

import { useState, useEffect } from 'react';
import { Plus, X, CheckSquare, MessageSquare, Lightbulb, Building2, FileText, ShoppingCart, BookOpen, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { TaskForm } from '@/components/forms/TaskForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { WishForm } from '@/components/forms/WishForm';
import { ShortageForm } from '@/components/forms/ShortageForm';
import { HomeItemForm } from '@/components/forms/HomeItemForm';
import { DocumentForm } from '@/components/forms/DocumentForm';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { AnnouncementForm } from '@/components/forms/AnnouncementForm';

const quickAddItems = [
  { key: 'task',         icon: CheckSquare,  label: 'مهمة',     color: 'var(--c-green)',  bg: 'var(--c-green-soft)' },
  { key: 'request',      icon: MessageSquare,label: 'طلب',      color: '#7C3AED',         bg: '#F5F3FF' },
  { key: 'wish',         icon: Lightbulb,    label: 'فكرة',     color: 'var(--c-amber)',  bg: 'var(--c-amber-soft)' },
  { key: 'home_item',    icon: Building2,    label: 'ممتلكات',  color: 'var(--c-green)',  bg: 'var(--c-green-soft)' },
  { key: 'document',     icon: FileText,     label: 'وثيقة',    color: 'var(--c-red)',    bg: 'var(--c-red-soft)' },
  { key: 'shortage',     icon: ShoppingCart, label: 'نقص',      color: 'var(--c-amber)',  bg: 'var(--c-amber-soft)' },
  { key: 'recipe',       icon: BookOpen,     label: 'وصفة',     color: '#DB2777',         bg: '#FDF2F8' },
  { key: 'announcement', icon: Megaphone,    label: 'إعلان',    color: 'var(--c-dark)',   bg: '#F2F4F7' },
];

type FormKey = 'task' | 'request' | 'wish' | 'home_item' | 'document' | 'shortage' | 'recipe' | 'announcement' | null;

export function QuickAddButton() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormKey>(null);
  const { activeQuickForm, setActiveQuickForm } = useAppStore();

  // Handle forms triggered from Action Strip on dashboard
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

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setSheetOpen((p) => !p)}
        className="fixed z-30 transition-all duration-200 active:scale-90"
        style={{
          bottom: `calc(var(--bottom-nav-height) + 12px + env(safe-area-inset-bottom, 0px))`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 52,
          height: 52,
          borderRadius: 18,
          background: sheetOpen ? 'var(--c-muted)' : 'var(--c-green)',
          boxShadow: sheetOpen
            ? '0 4px 16px rgba(102,112,133,0.35)'
            : '0 4px 20px rgba(31,138,91,0.40)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {sheetOpen
          ? <X size={22} color="#fff" strokeWidth={2.5} />
          : <Plus size={26} color="#fff" strokeWidth={2.5} />
        }
      </button>

      {/* Sheet overlay */}
      {sheetOpen && (
        <div className="fixed inset-0 z-20 fade-in" onClick={() => setSheetOpen(false)}
          style={{ background: 'rgba(16,24,40,0.35)' }} />
      )}

      {/* Quick-add grid */}
      {sheetOpen && (
        <div
          className="fixed z-30 slide-up"
          style={{
            bottom: `calc(var(--bottom-nav-height) + 72px + env(safe-area-inset-bottom, 0px))`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100vw - 32px)',
            maxWidth: 400,
            background: 'var(--surface)',
            borderRadius: 24,
            padding: '16px 12px 12px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <p className="text-xs font-semibold text-center mb-3" style={{ color: 'var(--foreground-muted)' }}>
            ماذا تريد تضيف؟
          </p>
          <div className="grid grid-cols-4 gap-2">
            {quickAddItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-transform active:scale-95"
                  style={{ background: item.bg }}
                >
                  <Icon size={20} color={item.color} strokeWidth={1.8} />
                  <span className="text-[10px] font-semibold" style={{ color: item.color }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
