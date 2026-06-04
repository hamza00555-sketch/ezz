'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';

interface AnnouncementFormProps {
  open: boolean;
  onClose: () => void;
}

export function AnnouncementForm({ open, onClose }: AnnouncementFormProps) {
  const { currentFamilyGroupId, currentUserId, announcements } = useAppStore();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'العنوان مطلوب';
    if (!message.trim()) e.message = 'نص الإعلان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Add to announcements via store (we'll add this action)
    const newAnn = {
      id: `ann-${Date.now()}`,
      familyGroupId: currentFamilyGroupId,
      title: title.trim(),
      message: message.trim(),
      publishedBy: currentUserId,
      audience: 'all' as const,
      requiresConfirmation,
      confirmedBy: [] as string[],
      status: 'active' as const,
      isPinned,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Direct store update via zustand
    useAppStore.setState((state) => ({
      announcements: [...state.announcements, newAnn],
    }));

    setTitle(''); setMessage('');
    setIsPinned(false); setRequiresConfirmation(false);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إعلان عائلي جديد">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="عنوان الإعلان" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تجمع عائلي يوم الجمعة"
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="نص الإعلان" required error={errors.message}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="اكتب تفاصيل الإعلان هنا..."
            error={!!errors.message}
            rows={4}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <label
            className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#FAF7F2', border: '1px solid var(--border)' }}
          >
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1C1917' }}>📌 تثبيت الإعلان</p>
              <p className="text-xs" style={{ color: '#78716C' }}>يظهر في الصفحة الرئيسية</p>
            </div>
          </label>

          <label
            className="flex items-center gap-3 p-3.5 rounded-xl cursor-pointer"
            style={{ background: '#FAF7F2', border: '1px solid var(--border)' }}
          >
            <input
              type="checkbox"
              checked={requiresConfirmation}
              onChange={(e) => setRequiresConfirmation(e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1C1917' }}>✅ يتطلب تأكيد القراءة</p>
              <p className="text-xs" style={{ color: '#78716C' }}>يُظهر زر تأكيد للأفراد</p>
            </div>
          </label>
        </div>

        <SubmitButton label="نشر الإعلان" />
      </form>
    </BottomSheet>
  );
}
