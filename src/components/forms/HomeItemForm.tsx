'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Select, Textarea, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import type { HomeItem } from '@/types';

interface HomeItemFormProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'appliances', label: 'أجهزة كهربائية' },
  { value: 'vehicles', label: 'سيارات' },
  { value: 'furniture', label: 'أثاث' },
  { value: 'tools', label: 'أدوات' },
  { value: 'electronics', label: 'إلكترونيات' },
  { value: 'other', label: 'أخرى' },
];

const locations = ['المطبخ', 'الصالة', 'غرفة النوم', 'الحمام', 'المرآب', 'الخارج', 'أخرى'];

export function HomeItemForm({ open, onClose }: HomeItemFormProps) {
  const { currentFamilyGroupId, currentUserId } = useAppStore(
    useShallow((s) => ({ currentFamilyGroupId: s.currentFamilyGroupId, currentUserId: s.currentUserId }))
  );

  const [name, setName] = useState('');
  const [category, setCategory] = useState('appliances');
  const [location, setLocation] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
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

    const newItem: HomeItem = {
      id: `item-${Date.now()}`,
      familyGroupId: currentFamilyGroupId,
      name: name.trim(),
      category,
      location: location || undefined,
      purchaseDate: purchaseDate || undefined,
      price: price ? parseFloat(price) : undefined,
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry).toISOString() : undefined,
      notes: notes.trim() || undefined,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAppStore.setState((state) => ({
      homeItems: [...state.homeItems, newItem],
    }));

    setName(''); setCategory('appliances'); setLocation('');
    setPurchaseDate(''); setPrice(''); setWarrantyExpiry(''); setNotes('');
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إضافة ممتلكات" height="full">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="اسم العنصر" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: ثلاجة سامسونج"
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="التصنيف">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="الموقع">
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">اختر الموقع</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="تاريخ الشراء">
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </FormField>

          <FormField label="السعر (ريال)">
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
            />
          </FormField>
        </div>

        <FormField label="انتهاء الضمان">
          <Input
            type="date"
            value={warrantyExpiry}
            onChange={(e) => setWarrantyExpiry(e.target.value)}
          />
        </FormField>

        <FormField label="ملاحظات">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="رقم الموديل، ملاحظات مهمة..."
          />
        </FormField>

        <SubmitButton label="إضافة العنصر" />
      </form>
    </BottomSheet>
  );
}
