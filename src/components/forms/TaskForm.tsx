'use client';

import { useState } from 'react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, Textarea, Select, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'cleaning', label: 'تنظيف' },
  { value: 'shopping', label: 'تسوق' },
  { value: 'bills', label: 'فواتير' },
  { value: 'maintenance', label: 'صيانة' },
  { value: 'cooking', label: 'طبخ' },
  { value: 'childcare', label: 'رعاية أطفال' },
  { value: 'documents', label: 'وثائق' },
  { value: 'other', label: 'أخرى' },
];

const priorities = [
  { value: 'low', label: 'منخفضة' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'high', label: 'عالية' },
  { value: 'urgent', label: 'عاجلة 🔴' },
];

export function TaskForm({ open, onClose }: TaskFormProps) {
  const { members, currentFamilyGroupId, currentUserId, addTask } = useAppStore();
  const familyMembers = members.filter((m) => m.familyGroupId === currentFamilyGroupId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(currentUserId);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('other');
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'العنوان مطلوب';
    if (!assignedTo) e.assignedTo = 'اختر الشخص المسؤول';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    // Determine status based on assignment logic
    const assignee = members.find((m) => m.id === assignedTo);
    const creator = members.find((m) => m.id === currentUserId);
    let status: 'accepted' | 'pending_acceptance' | 'new' = 'new';

    if (assignedTo === currentUserId) {
      status = 'accepted';
    } else if (creator && assignee) {
      // Guardian/admin assigning to younger generation → auto-accept
      if (creator.generation < assignee.generation) {
        status = 'accepted';
      } else {
        status = 'pending_acceptance';
      }
    }

    addTask({
      familyGroupId: currentFamilyGroupId,
      title: title.trim(),
      description: description.trim() || undefined,
      assignedTo,
      createdBy: currentUserId,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      priority: priority as 'low' | 'medium' | 'high' | 'urgent',
      status,
      category,
      isRecurring,
    });

    // Reset
    setTitle(''); setDescription(''); setAssignedTo(currentUserId);
    setDueDate(''); setPriority('medium'); setCategory('other'); setIsRecurring(false);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="مهمة جديدة">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <FormField label="العنوان" required error={errors.title}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: تنظيف الصالة"
            error={!!errors.title}
            autoFocus
          />
        </FormField>

        <FormField label="الوصف">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="تفاصيل إضافية (اختياري)"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="المسؤول" required error={errors.assignedTo}>
            <Select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              error={!!errors.assignedTo}
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.id === currentUserId ? '(أنا)' : ''}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="الأولوية">
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {priorities.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="التصنيف">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </FormField>

          <FormField label="تاريخ الاستحقاق">
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormField>
        </div>

        <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
          style={{ background: '#FAF7F2', border: '1px solid var(--border)' }}>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <div>
            <p className="text-sm font-medium" style={{ color: '#1C1917' }}>مهمة متكررة</p>
            <p className="text-xs" style={{ color: '#78716C' }}>تتكرر بشكل منتظم</p>
          </div>
        </label>

        <SubmitButton label="إضافة المهمة" />
      </form>
    </BottomSheet>
  );
}
