'use client';

import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import { getDishImage, dishGradient } from '@/lib/dishImages';
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
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageGenerated, setImageGenerated] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // imageUrl stores either a real path (/dishes/x.png) or a CSS gradient string
  const isGradient = imageUrl?.startsWith('linear-gradient');
  const previewImg = !isGradient ? imageUrl : undefined;
  const previewGrad = isGradient ? imageUrl! : (name.trim() ? dishGradient(name.trim()) : 'linear-gradient(135deg, #F5D9A8 0%, #E8A860 50%, #D4875A 100%)');
  const hasGeneratedImage = !!imageUrl;

  function generateImage() {
    if (!name.trim()) return;
    const found = getDishImage(name.trim());
    // Save real photo path, or save the gradient as the image identity
    setImageUrl(found ?? dishGradient(name.trim()));
    setImageGenerated(true);
    setTimeout(() => setImageGenerated(false), 2000);
  }

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

    // imageUrl is already set via generateImage (photo path or gradient string)
    // fall back to auto-lookup if user didn't press the button
    const resolvedImg = imageUrl ?? getDishImage(name.trim()) ?? dishGradient(name.trim());

    const newRecipe: Recipe = {
      id: `rec-${Date.now()}`,
      familyGroupId: currentFamilyGroupId,
      name: name.trim(),
      ingredients: ingredients.filter((i) => i.trim()),
      steps: steps.filter((s) => s.trim()),
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      mealTime: selectedMealTimes as Recipe['mealTime'],
      imageUrl: resolvedImg,
      favoritedBy: [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    useAppStore.setState((state) => ({
      recipes: [...state.recipes, newRecipe],
    }));

    setName(''); setPrepTime(''); setSelectedMealTimes(['lunch']);
    setIngredients(['']); setSteps(['']); setImageUrl(undefined); setImageGenerated(false);
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="إضافة وصفة" height="full">
      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        <FormField label="اسم الوصفة" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => { setName(e.target.value); setImageUrl(undefined); setImageGenerated(false); }}
            placeholder="مثال: كبسة دجاج"
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        {/* Image preview + generate */}
        {name.trim() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Preview circle */}
            <div style={{
              width: 72, height: 72, borderRadius: 22, overflow: 'hidden', flexShrink: 0,
              border: hasGeneratedImage ? '2.5px solid rgba(163,177,138,0.60)' : '2.5px solid rgba(67,82,56,0.14)',
              boxShadow: hasGeneratedImage ? '0 6px 20px rgba(67,82,56,0.18)' : '0 2px 8px rgba(67,82,56,0.08)',
              transition: 'all 0.3s ease',
            }}>
              {previewImg ? (
                <img src={previewImg} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: previewGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, opacity: hasGeneratedImage ? 0.9 : 0.4 }}>🍽️</span>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, marginBottom: 8, color: imageGenerated ? 'var(--accent-strong)' : hasGeneratedImage ? 'var(--text-secondary)' : 'var(--text-muted)', fontWeight: hasGeneratedImage ? 600 : 400, transition: 'color 0.2s' }}>
                {imageGenerated
                  ? (previewImg ? 'تم ربط الصورة ✓' : 'تم توليد اللون ✓')
                  : hasGeneratedImage
                    ? (previewImg ? 'صورة حقيقية مرتبطة' : 'لون مميز مولَّد')
                    : 'اضغط لتوليد صورة للوجبة'}
              </p>
              <button
                type="button"
                onClick={generateImage}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 12,
                  background: imageGenerated ? 'rgba(163,177,138,0.22)' : 'rgba(163,177,138,0.12)',
                  border: `1px solid ${imageGenerated ? 'rgba(163,177,138,0.45)' : 'rgba(163,177,138,0.28)'}`,
                  color: 'var(--accent-strong)',
                  fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                <Sparkles size={13} strokeWidth={2} />
                {imageGenerated ? 'تم ✓' : hasGeneratedImage ? 'تحديث' : 'توليد صورة'}
              </button>
            </div>
          </div>
        )}

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
                    background: selectedMealTimes.includes(t.value) ? 'rgba(176,141,87,0.20)' : 'rgba(67,82,56,0.05)',
                    color: selectedMealTimes.includes(t.value) ? 'var(--bronze)' : 'var(--text-secondary)',
                    border: `1px solid ${selectedMealTimes.includes(t.value) ? 'transparent' : 'var(--border-soft)'}`,
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
                    style={{ background: 'var(--danger-soft)' }}
                  >
                    <X size={16} color="var(--danger)" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-2 py-2 text-sm font-medium"
              style={{ color: 'var(--bronze)' }}
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
                  style={{ background: 'rgba(176,141,87,0.18)', color: 'var(--bronze)' }}
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
                    style={{ background: 'var(--danger-soft)' }}
                  >
                    <X size={16} color="var(--danger)" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="flex items-center gap-2 py-2 text-sm font-medium"
              style={{ color: 'var(--bronze)' }}
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
