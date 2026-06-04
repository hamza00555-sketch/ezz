'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, Select, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';

interface WishFormProps {
  open: boolean;
  onClose: () => void;
}

const wishTypes = [
  { value: 'idea', label: '💡 فكرة' },
  { value: 'need', label: '🛒 احتياج' },
  { value: 'link', label: '🔗 رابط' },
  { value: 'fix', label: '🔧 إصلاح' },
];

const priorities = [
  { value: 'low', label: 'منخفضة' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'high', label: 'عالية' },
  { value: 'urgent', label: 'عاجلة' },
];

export function WishForm({ open, onClose }: WishFormProps) {
  const { currentFamilyGroupId, currentUserId, addWishItem } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('idea');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'العنوان مطلوب';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addWishItem({
      familyGroupId: currentFamilyGroupId,
      title: title.trim(),
      description: description.trim() || undefined,
      type: type as 'idea' | 'need' | 'link' | 'fix',
      link: link.trim() || undefined,
      location: location.trim() || undefined,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      status: 'idea',
      createdBy: currentUserId,
    });
    setTitle(''); setDescription(''); setType('idea');
    setLink(''); setLocation(''); setPriority('medium');
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="فكرة جديدة / Wish">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="العنوان" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: رف للمطبخ، تغيير الستائر..."
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="النوع">
          <div className="grid grid-cols-4 gap-2">
            {wishTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className="py-2.5 rounded-xl text-xs font-medium transition-all text-center"
                style={{
                  background: type === t.value ? '#FFF7ED' : '#F5F5F4',
                  color: type === t.value ? '#C8922A' : '#57534E',
                  border: type === t.value ? '1.5px solid #C8922A' : '1.5px solid transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="الوصف">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="تفاصيل الفكرة (اختياري)"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="الأولوية">
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="المكان">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: المطبخ"
            />
          </FormField>
        </div>

        {(type === 'link') && (
          <FormField label="الرابط">
            <Input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              dir="ltr"
            />
          </FormField>
        )}

        <SubmitButton label="حفظ الفكرة" />
      </form>
    </BottomSheet>
  );
}
