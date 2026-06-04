'use client';

import { useState } from 'react';
import { Plus, X, CheckSquare, MessageSquare, Lightbulb, Home, FileText, ShoppingCart, BookOpen, Megaphone } from 'lucide-react';
import { TaskForm } from '@/components/forms/TaskForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { WishForm } from '@/components/forms/WishForm';
import { ShortageForm } from '@/components/forms/ShortageForm';
import { HomeItemForm } from '@/components/forms/HomeItemForm';
import { DocumentForm } from '@/components/forms/DocumentForm';
import { RecipeForm } from '@/components/forms/RecipeForm';
import { AnnouncementForm } from '@/components/forms/AnnouncementForm';

const quickAddItems = [
  { key: 'task', icon: CheckSquare, label: 'مهمة', color: '#2563EB', bg: '#EFF6FF' },
  { key: 'request', icon: MessageSquare, label: 'طلب', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'wish', icon: Lightbulb, label: 'فكرة', color: '#D97706', bg: '#FFFBEB' },
  { key: 'home_item', icon: Home, label: 'ممتلكات', color: '#059669', bg: '#ECFDF5' },
  { key: 'document', icon: FileText, label: 'وثيقة', color: '#DC2626', bg: '#FEF2F2' },
  { key: 'shortage', icon: ShoppingCart, label: 'نقص', color: '#C8922A', bg: '#FFF7ED' },
  { key: 'recipe', icon: BookOpen, label: 'وصفة', color: '#DB2777', bg: '#FDF2F8' },
  { key: 'announcement', icon: Megaphone, label: 'إعلان', color: '#0891B2', bg: '#ECFEFF' },
];

type FormKey = 'task' | 'request' | 'wish' | 'home_item' | 'document' | 'shortage' | 'recipe' | 'announcement' | null;

export function QuickAddButton() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormKey>(null);

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
      {/* FAB button */}
      <button
        onClick={() => setSheetOpen((p) => !p)}
        className="fixed z-30 transition-all duration-200 active:scale-90"
        style={{
          bottom: 'calc(var(--bottom-nav-height) + 12px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 56,
          height: 56,
          borderRadius: 20,
          background: sheetOpen
            ? '#78716C'
            : 'linear-gradient(135deg, #C8922A, #A37520)',
          boxShadow: '0 4px 20px rgba(200,146,42,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {sheetOpen
          ? <X size={24} color="#FFFFFF" strokeWidth={2.5} />
          : <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
        }
      </button>

      {/* Quick-add sheet */}
      {sheetOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="fixed z-30 slide-up"
            style={{
              bottom: 'calc(var(--bottom-nav-height) + 76px + env(safe-area-inset-bottom, 0px))',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'calc(100vw - 32px)',
              maxWidth: 400,
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '16px 12px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
              border: '1px solid var(--border)',
            }}
          >
            <p className="text-xs font-semibold text-center mb-3" style={{ color: '#78716C' }}>
              ماذا تريد تضيف؟
            </p>
            <div className="grid grid-cols-4 gap-2">
              {quickAddItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSelect(item.key)}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-transform active:scale-95"
                    style={{ background: item.bg }}
                  >
                    <Icon size={20} color={item.color} />
                    <span className="text-[10px] font-semibold text-center" style={{ color: '#1C1917' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Forms */}
      <TaskForm open={activeForm === 'task'} onClose={closeAll} />
      <RequestForm open={activeForm === 'request'} onClose={closeAll} />
      <WishForm open={activeForm === 'wish'} onClose={closeAll} />
      <HomeItemForm open={activeForm === 'home_item'} onClose={closeAll} />
      <DocumentForm open={activeForm === 'document'} onClose={closeAll} />
      <ShortageForm open={activeForm === 'shortage'} onClose={closeAll} />
      <RecipeForm open={activeForm === 'recipe'} onClose={closeAll} />
      <AnnouncementForm open={activeForm === 'announcement'} onClose={closeAll} />
    </>
  );
}
