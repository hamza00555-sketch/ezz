'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, Select, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';

interface RequestFormProps {
  open: boolean;
  onClose: () => void;
}

const requestTypes = [
  { value: 'purchase', label: '🛒 شراء' },
  { value: 'help', label: '🤝 مساعدة' },
  { value: 'errand', label: '🚗 مشوار' },
  { value: 'maintenance', label: '🔧 صيانة' },
  { value: 'follow_up', label: '📋 متابعة' },
  { value: 'other', label: '💬 أخرى' },
];

export function RequestForm({ open, onClose }: RequestFormProps) {
  const { members, currentFamilyGroupId, currentUserId, addRequest } = useAppStore(
    useShallow((s) => ({ members: s.members, currentFamilyGroupId: s.currentFamilyGroupId, currentUserId: s.currentUserId, addRequest: s.addRequest }))
  );
  const others = members.filter(
    (m) => m.familyGroupId === currentFamilyGroupId && m.id !== currentUserId
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('other');
  const [to, setTo] = useState(others[0]?.id || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'عنوان الطلب مطلوب';
    if (!to) e.to = 'اختر الشخص';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addRequest({
      familyGroupId: currentFamilyGroupId,
      title: title.trim(),
      description: description.trim() || undefined,
      type: type as 'purchase' | 'help' | 'errand' | 'maintenance' | 'follow_up' | 'other',
      from: currentUserId,
      to,
      status: 'pending',
    });
    setTitle(''); setDescription(''); setType('other');
    setTo(others[0]?.id || '');
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="طلب من شخص">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="موضوع الطلب" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: أحتاج توصيلة للسوق"
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="التفاصيل">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أي تفاصيل إضافية..."
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="نوع الطلب">
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              {requestTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="إلى" required error={errors.to}>
            <Select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              error={!!errors.to}
            >
              {others.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <SubmitButton label="إرسال الطلب" />
      </form>
    </BottomSheet>
  );
}
