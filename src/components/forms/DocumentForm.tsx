'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import type { Document } from '@/types';

interface DocumentFormProps {
  open: boolean;
  onClose: () => void;
}

const docTypes = [
  { value: 'contract', label: '📄 عقد' },
  { value: 'warranty', label: '🛡️ ضمان' },
  { value: 'invoice', label: '🧾 فاتورة' },
  { value: 'insurance', label: '🔐 تأمين' },
  { value: 'form', label: '📋 استمارة' },
  { value: 'other', label: '📎 أخرى' },
];

export function DocumentForm({ open, onClose }: DocumentFormProps) {
  const { currentFamilyGroupId, currentUserId, homeItems } = useAppStore();
  const items = homeItems.filter((i) => i.familyGroupId === currentFamilyGroupId);

  const [name, setName] = useState('');
  const [type, setType] = useState('other');
  const [linkedItemId, setLinkedItemId] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [reminderDays, setReminderDays] = useState('30');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'اسم الوثيقة مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      familyGroupId: currentFamilyGroupId,
      name: name.trim(),
      type: type as Document['type'],
      linkedItemId: linkedItemId || undefined,
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      reminderDays: expiryDate ? parseInt(reminderDays) : undefined,
      visibility: 'all',
      notes: notes.trim() || undefined,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAppStore.setState((state) => ({
      documents: [...state.documents, newDoc],
    }));

    setName(''); setType('other'); setLinkedItemId('');
    setExpiryDate(''); setReminderDays('30'); setNotes('');
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إضافة وثيقة">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="اسم الوثيقة" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: تأمين السيارة 2025"
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        <FormField label="نوع الوثيقة">
          <div className="grid grid-cols-3 gap-2">
            {docTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className="py-2.5 px-2 rounded-xl text-xs font-medium transition-all text-center"
                style={{
                  background: type === t.value ? 'rgba(176,141,87,0.18)' : 'rgba(255,255,255,0.06)',
                  color: type === t.value ? 'var(--bronze)' : 'var(--text-secondary)',
                  border: type === t.value ? '1.5px solid rgba(176,141,87,0.50)' : '1.5px solid var(--border-soft)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FormField>

        {items.length > 0 && (
          <FormField label="مرتبطة بـ">
            <Select value={linkedItemId} onChange={(e) => setLinkedItemId(e.target.value)}>
              <option value="">— غير مرتبطة —</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </FormField>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="تاريخ الانتهاء">
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </FormField>

          {expiryDate && (
            <FormField label="تذكير قبل (يوم)">
              <Select value={reminderDays} onChange={(e) => setReminderDays(e.target.value)}>
                <option value="7">أسبوع</option>
                <option value="14">أسبوعان</option>
                <option value="30">شهر</option>
                <option value="60">شهران</option>
                <option value="90">3 أشهر</option>
              </Select>
            </FormField>
          )}
        </div>

        <FormField label="ملاحظات">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي ملاحظات مهمة..."
          />
        </FormField>

        <SubmitButton label="حفظ الوثيقة" />
      </form>
    </BottomSheet>
  );
}
