'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  height?: 'auto' | 'full';
}

export function BottomSheet({ open, onClose, title, children, height = 'auto' }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 inset-x-0 z-50 slide-up flex flex-col"
        style={{
          background: 'var(--bg-elevated)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: height === 'full' ? '92dvh' : '90dvh',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.50)',
          border: '1px solid var(--border-soft)',
          borderBottom: 'none',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <X size={18} color="var(--text-secondary)" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
          {children}
        </div>
      </div>
    </>
  );
}
