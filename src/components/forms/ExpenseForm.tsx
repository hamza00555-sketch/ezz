'use client';

import { useState, useEffect } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, Select, SubmitButton } from '@/components/shared/FormField';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
}

// Category is stored as its Arabic display string to match the existing
// expense data convention (the expenses page renders the value directly).
const categories = [
  'بقالة ومؤن',
  'فواتير وخدمات',
  'مواصلات',
  'صيانة',
  'صحة ودواء',
  'مصاريف الأطفال',
  'مطاعم',
  'خضروات وفواكه',
  'أخرى',
];

export function ExpenseForm({ open, onClose }: ExpenseFormProps) {
  const { wallets, currentFamilyGroupId, currentUserId, addExpense } = useAppStore(
    useShallow((s) => ({
      wallets: s.wallets,
      currentFamilyGroupId: s.currentFamilyGroupId,
      currentUserId: s.currentUserId,
      addExpense: s.addExpense,
    }))
  );
  const myWallets = wallets.filter((w) => w.familyGroupId === currentFamilyGroupId);

  const todayStr = new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState('');
  const [walletId, setWalletId] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Default the wallet selection to the first available wallet when the sheet opens.
  useEffect(() => {
    if (!open) return;
    setWalletId(myWallets[0]?.id ?? '');
    setAmount(''); setCategory(categories[0]); setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function validate() {
    const e: Record<string, string> = {};
    const value = parseFloat(amount);
    if (!amount.trim() || isNaN(value) || value <= 0) e.amount = 'أدخل مبلغاً صحيحاً';
    if (!walletId) e.walletId = 'اختر المحفظة';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    addExpense({
      familyGroupId: currentFamilyGroupId,
      walletId,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      addedBy: currentUserId,
      notes: notes.trim() || undefined,
    });

    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="تسجيل مصروف">
      {myWallets.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon="💳"
            title="لا توجد محفظة"
            description="أضف محفظة أولاً لتسجيل المصاريف"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <FormField label="المبلغ (ريال)" required error={errors.amount}>
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              error={!!errors.amount}
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="المحفظة" required error={errors.walletId}>
              <Select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                error={!!errors.walletId}
              >
                {myWallets.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </Select>
            </FormField>

            <FormField label="التصنيف">
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="التاريخ">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayStr}
            />
          </FormField>

          <FormField label="ملاحظة">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تفاصيل المصروف (اختياري)"
            />
          </FormField>

          <SubmitButton label="حفظ المصروف" />
        </form>
      )}
    </BottomSheet>
  );
}
