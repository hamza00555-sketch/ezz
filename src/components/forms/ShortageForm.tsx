'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Select, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';

interface ShortageFormProps {
  open: boolean;
  onClose: () => void;
}

const shortageCategories = [
  { value: 'grains', label: 'حبوب ودقيق' },
  { value: 'dairy', label: 'ألبان وأجبان' },
  { value: 'protein', label: 'بروتين (لحوم/بيض)' },
  { value: 'vegetables', label: 'خضروات وفواكه' },
  { value: 'oils', label: 'زيوت وتوابل' },
  { value: 'cleaning_supplies', label: 'مواد تنظيف' },
  { value: 'other', label: 'أخرى' },
];

const priorities = [
  { value: 'urgent', label: 'عاجل 🔴' },
  { value: 'high', label: 'مهم' },
  { value: 'medium', label: 'متوسط' },
  { value: 'low', label: 'عادي' },
];

export function ShortageForm({ open, onClose }: ShortageFormProps) {
  const { currentFamilyGroupId, currentUserId, addShortage } = useAppStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [quantity, setQuantity] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'اسم العنصر مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addShortage({
      familyGroupId: currentFamilyGroupId,
      name: name.trim(),
      category,
      quantity: quantity.trim() || undefined,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      status: 'missing',
      addedBy: currentUserId,
      notes: notes.trim() || undefined,
    });
    setName(''); setCategory('other'); setQuantity('');
    setPriority('medium'); setNotes('');
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إضافة نقص للمطبخ">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="اسم العنصر" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: رز، حليب، بيض..."
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="التصنيف">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {shortageCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="الكمية">
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="مثال: 5 كيلو"
            />
          </FormField>
        </div>

        <FormField label="الأولوية">
          <div className="grid grid-cols-4 gap-2">
            {priorities.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className="py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: priority === p.value ? '#C8922A' : '#F5F5F4',
                  color: priority === p.value ? '#FFFFFF' : '#57534E',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="ملاحظة">
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أي ملاحظة إضافية (اختياري)"
          />
        </FormField>

        <SubmitButton label="إضافة للقائمة" />
      </form>
    </BottomSheet>
  );
}
