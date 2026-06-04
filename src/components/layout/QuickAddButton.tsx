'use client';

import { useState } from 'react';
import { Plus, X, CheckSquare, MessageSquare, Lightbulb, Home, FileText, ShoppingCart, BookOpen, Megaphone } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';

const quickAddItems = [
  { key: 'task', icon: CheckSquare, label: 'مهمة جديدة', color: '#2563EB', bg: '#EFF6FF' },
  { key: 'request', icon: MessageSquare, label: 'طلب من شخص', color: '#7C3AED', bg: '#F5F3FF' },
  { key: 'wish', icon: Lightbulb, label: 'فكرة / Wish', color: '#D97706', bg: '#FFFBEB' },
  { key: 'home_item', icon: Home, label: 'عنصر بيت', color: '#059669', bg: '#ECFDF5' },
  { key: 'document', icon: FileText, label: 'وثيقة', color: '#DC2626', bg: '#FEF2F2' },
  { key: 'shortage', icon: ShoppingCart, label: 'نقص مطبخ', color: '#C8922A', bg: '#FFF7ED' },
  { key: 'recipe', icon: BookOpen, label: 'وصفة', color: '#DB2777', bg: '#FDF2F8' },
  { key: 'announcement', icon: Megaphone, label: 'إعلان عائلي', color: '#0891B2', bg: '#ECFEFF' },
];

interface QuickAddSheetProps {
  open: boolean;
  onClose: () => void;
  onSelect: (key: string) => void;
}

export function QuickAddSheet({ open, onClose, onSelect }: QuickAddSheetProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(3px)' }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 inset-x-0 z-50 slide-up"
        style={{
          background: '#FFFFFF',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: '#E8E0D5' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-lg font-bold" style={{ color: '#1C1917' }}>إضافة جديد</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-colors"
            style={{ background: '#F5F5F4' }}
          >
            <X size={18} color="#78716C" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3 px-4">
          {quickAddItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => { onSelect(item.key); onClose(); }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-transform active:scale-95"
                style={{ background: item.bg }}
              >
                <div className="p-2.5 rounded-xl" style={{ background: item.bg }}>
                  <Icon size={22} color={item.color} />
                </div>
                <span className="text-[11px] font-medium text-center leading-tight" style={{ color: '#1C1917' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function QuickAddButton() {
  const [open, setOpen] = useState(false);

  function handleSelect(key: string) {
    // TODO: open respective form modals
    console.log('Quick add:', key);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed z-30 transition-all duration-200 active:scale-90"
        style={{
          bottom: 'calc(var(--bottom-nav-height) + 12px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 56,
          height: 56,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #C8922A, #A37520)',
          boxShadow: '0 4px 20px rgba(200,146,42,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </button>

      <QuickAddSheet open={open} onClose={() => setOpen(false)} onSelect={handleSelect} />
    </>
  );
}
