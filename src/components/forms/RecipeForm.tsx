'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import type { Recipe } from '@/types';

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
}

const mealTimes = [
  { value: 'breakfast', label: 'فطور' },
  { value: 'lunch', label: 'غداء' },
  { value: 'dinner', label: 'عشاء' },
  { value: 'occasion', label: 'مناسبة' },
];

export function RecipeForm({ open, onClose }: RecipeFormProps) {
  const { currentFamilyGroupId, currentUserId } = useAppStore();

  const [name, setName] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>(['lunch']);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleMealTime(value: string) {
    setSelectedMealTimes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  }

  function addIngredient() { setIngredients((p) => [...p, '']); }
  function updateIngredient(i: number, v: string) {
    setIngredients((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function removeIngredient(i: number) {
    if (ingredients.length === 1) return;
    setIngredients((p) => p.filter((_, idx) => idx !== i));
  }

  function addStep() { setSteps((p) => [...p, '']); }
  function updateStep(i: number, v: string) {
    setSteps((p) => p.map((x, idx) => (idx === i ? v : x)));
  }
  function removeStep(i: number) {
    if (steps.length === 1) return;
    setSteps((p) => p.filter((_, idx) => idx !== i));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'اسم الوصفة مطلوب';
    if (selectedMealTimes.length === 0) e.mealTime = 'اختر وقت الوجبة';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const newRecipe: Recipe = {
      id: `rec-${Date.now()}`,
      familyGroupId: currentFamilyGroupId,
      name: name.trim(),
      ingredients: ingredients.filter((i) => i.trim()),
      steps: steps.filter((s) => s.trim()),
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      mealTime: selectedMealTimes as Recipe['mealTime'],
      favoritedBy: [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAppStore.setState((state) => ({
      recipes: [...state.recipes, newRecipe],
    }));

    setName(''); setPrepTime(''); setSelectedMealTimes(['lunch']);
    setIngredients(['']); setSteps(['']);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إضافة وصفة" height="full">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        <FormField label="اسم الوصفة" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: كبسة دجاج"
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField label="وقت التحضير (دقيقة)">
            <Input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              placeholder="مثال: 60"
              min="1"
            />
          </FormField>

          <FormField label="وقت الوجبة" error={errors.mealTime}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {mealTimes.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => toggleMealTime(t.value)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedMealTimes.includes(t.value) ? '#C8922A' : '#F5F5F4',
                    color: selectedMealTimes.includes(t.value) ? '#FFFFFF' : '#57534E',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </FormField>
        </div>

        {/* Ingredients */}
        <FormField label="المكونات">
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder={`مكون ${i + 1}`}
                  className="flex-1"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(i)}
                    className="p-2 rounded-xl"
                    style={{ background: '#FEF2F2' }}
                  >
                    <X size={16} color="#DC2626" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-2 py-2 text-sm font-medium"
              style={{ color: '#C8922A' }}
            >
              <Plus size={16} /> إضافة مكون
            </button>
          </div>
        </FormField>

        {/* Steps */}
        <FormField label="طريقة التحضير">
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-3"
                  style={{ background: '#FFF7ED', color: '#C8922A' }}
                >
                  {i + 1}
                </span>
                <Input
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder={`الخطوة ${i + 1}`}
                  className="flex-1"
                />
                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    className="p-2 rounded-xl mt-1"
                    style={{ background: '#FEF2F2' }}
                  >
                    <X size={16} color="#DC2626" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-2 py-2 text-sm font-medium"
              style={{ color: '#C8922A' }}
            >
              <Plus size={16} /> إضافة خطوة
            </button>
          </div>
        </FormField>

        <SubmitButton label="حفظ الوصفة" />
      </form>
    </BottomSheet>
  );
}
