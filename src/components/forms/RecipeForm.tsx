'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, X, Camera, ImageIcon } from 'lucide-react';
import { BottomSheet } from '@/components/shared/BottomSheet';
import { FormField, Input, SubmitButton } from '@/components/shared/FormField';
import { useAppStore } from '@/store/appStore';
import { getDishImage, dishGradient, loadDishManifest } from '@/lib/dishImages';
import { saveImageToIdb, resolveImage, isIdbRef } from '@/lib/imageStore';
import type { MealTime, Recipe } from '@/types';

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  initialRecipe?: Recipe;
}

const mealTimes = [
  { value: 'breakfast', label: 'فطور' },
  { value: 'lunch', label: 'غداء' },
  { value: 'dinner', label: 'عشاء' },
  { value: 'occasion', label: 'مناسبة' },
];

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 600;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objUrl);
      // prefer WebP for smaller size, fall back to JPEG
      const webp = canvas.toDataURL('image/webp', 0.80);
      resolve(webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.75));
    };
    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('failed')); };
    img.src = objUrl;
  });
}

export function RecipeForm({ open, onClose, initialRecipe }: RecipeFormProps) {
  const { currentFamilyGroupId, currentUserId, addRecipe, updateRecipe } = useAppStore();
  const isEditing = !!initialRecipe;

  const [name, setName] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>(['lunch']);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  // imageRef: what gets stored in recipe.imageUrl (idb: ref, /path, gradient, or undefined)
  const [imageRef, setImageRef] = useState<string | undefined>();
  // previewUrl: actual data URL for display in this form session
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [compressing, setCompressing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // Sync form state when opening
  useEffect(() => {
    if (!open) return;
    if (initialRecipe) {
      setName(initialRecipe.name);
      setPrepTime(initialRecipe.prepTime?.toString() ?? '');
      setSelectedMealTimes(initialRecipe.mealTime.length ? initialRecipe.mealTime : ['lunch']);
      setIngredients(initialRecipe.ingredients.length ? [...initialRecipe.ingredients] : ['']);
      setSteps(initialRecipe.steps.length ? [...initialRecipe.steps] : ['']);
      setImageRef(initialRecipe.imageUrl);
      // Load preview for IDB refs
      if (isIdbRef(initialRecipe.imageUrl)) {
        resolveImage(initialRecipe.imageUrl!).then(setPreviewUrl);
      } else {
        setPreviewUrl(initialRecipe.imageUrl);
      }
    } else {
      setName(''); setPrepTime(''); setSelectedMealTimes(['lunch']);
      setIngredients(['']); setSteps(['']);
      setImageRef(undefined); setPreviewUrl(undefined);
    }
    setErrors({});
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const isGradient = !previewUrl || previewUrl.startsWith('linear-gradient');
  const showImg = previewUrl && !isGradient;
  const fallbackGrad = name.trim() ? dishGradient(name.trim()) : 'linear-gradient(135deg, #F5D9A8 0%, #E8A860 50%, #D4875A 100%)';
  const hasImage = !!previewUrl && !isGradient;

  async function handleNameChange(newName: string) {
    setName(newName);
    if (imageRef && !imageRef.startsWith('linear-gradient')) return; // keep user photo
    await loadDishManifest();
    const lib = getDishImage(newName.trim());
    setImageRef(lib);
    setPreviewUrl(lib);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    try {
      let dataUrl: string;
      try {
        dataUrl = await compressImage(file);
      } catch {
        dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = (ev) => ev.target?.result ? res(ev.target.result as string) : rej();
          r.onerror = rej;
          r.readAsDataURL(file);
        });
      }
      // Save to IndexedDB — store only the idb: ref in the recipe
      const ref = await saveImageToIdb(dataUrl);
      setImageRef(ref);
      setPreviewUrl(dataUrl); // show instantly without re-loading from IDB
    } finally {
      setCompressing(false);
      e.target.value = '';
    }
  }

  function clearImage() {
    const lib = getDishImage(name.trim());
    setImageRef(lib);
    setPreviewUrl(lib);
  }

  const isUserPhoto = !!imageRef && isIdbRef(imageRef);

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

    const resolvedRef = imageRef ?? getDishImage(name.trim()) ?? dishGradient(name.trim());
    const data = {
      name: name.trim(),
      ingredients: ingredients.filter((i) => i.trim()),
      steps: steps.filter((s) => s.trim()),
      prepTime: prepTime ? parseInt(prepTime) : undefined,
      mealTime: selectedMealTimes as MealTime[],
      imageUrl: resolvedRef,
    };

    if (isEditing) {
      updateRecipe(initialRecipe.id, data);
    } else {
      addRecipe({ ...data, familyGroupId: currentFamilyGroupId, favoritedBy: [], createdBy: currentUserId });
    }
    onClose();
  }

  return (
    <BottomSheet open={open} onClose={onClose} title={isEditing ? 'تعديل الوصفة' : 'إضافة وصفة'} height="full">
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileSelect} />
      <input ref={galleryRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        <FormField label="اسم الوصفة" required error={errors.name}>
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="مثال: كبسة دجاج"
            error={!!errors.name}
            autoFocus
          />
        </FormField>

        {/* Image section */}
        {name.trim() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Preview circle */}
            <div style={{
              width: 72, height: 72, borderRadius: 22, overflow: 'hidden', flexShrink: 0,
              border: hasImage ? '2.5px solid rgba(163,177,138,0.60)' : '2.5px solid rgba(67,82,56,0.14)',
              boxShadow: hasImage ? '0 6px 20px rgba(67,82,56,0.18)' : '0 2px 8px rgba(67,82,56,0.08)',
              position: 'relative', transition: 'all 0.3s ease',
            }}>
              {compressing && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(255,253,247,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2.5px solid rgba(163,177,138,0.25)', borderTopColor: 'var(--accent-strong)', animation: 'spin 0.8s linear infinite' }} />
                </div>
              )}
              {showImg ? (
                <img src={previewUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: fallbackGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, opacity: 0.35 }}>🍽️</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, marginBottom: 8, color: hasImage ? 'var(--accent-strong)' : 'var(--text-muted)', fontWeight: hasImage ? 600 : 400 }}>
                {compressing ? 'جاري حفظ الصورة...' : hasImage ? (isUserPhoto ? 'صورة مخصصة ✓' : 'صورة من المكتبة ✓') : 'أضف صورة للوجبة'}
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button type="button" onClick={() => cameraRef.current?.click()} disabled={compressing}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 12, background: 'rgba(163,177,138,0.12)', border: '1px solid rgba(163,177,138,0.28)', color: 'var(--accent-strong)', fontSize: 12, fontWeight: 700, cursor: compressing ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: compressing ? 0.6 : 1 }}>
                  <Camera size={13} strokeWidth={2} />صوّر الطبق
                </button>
                <button type="button" onClick={() => galleryRef.current?.click()} disabled={compressing}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 12, background: 'rgba(163,177,138,0.12)', border: '1px solid rgba(163,177,138,0.28)', color: 'var(--accent-strong)', fontSize: 12, fontWeight: 700, cursor: compressing ? 'wait' : 'pointer', fontFamily: 'inherit', opacity: compressing ? 0.6 : 1 }}>
                  <ImageIcon size={13} strokeWidth={2} />من المعرض
                </button>
                {isUserPhoto && (
                  <button type="button" onClick={clearImage}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '7px 10px', borderRadius: 12, background: 'var(--danger-soft)', border: '1px solid transparent', color: 'var(--danger)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <X size={12} strokeWidth={2.5} />إزالة
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <FormField label="وقت التحضير (دقيقة)">
            <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="مثال: 60" min="1" />
          </FormField>
          <FormField label="وقت الوجبة" error={errors.mealTime}>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {mealTimes.map((t) => (
                <button key={t.value} type="button" onClick={() => toggleMealTime(t.value)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: selectedMealTimes.includes(t.value) ? 'rgba(176,141,87,0.20)' : 'rgba(67,82,56,0.05)',
                    color: selectedMealTimes.includes(t.value) ? 'var(--bronze)' : 'var(--text-secondary)',
                    border: `1px solid ${selectedMealTimes.includes(t.value) ? 'transparent' : 'var(--border-soft)'}`,
                  }}>
                  {t.label}
                </button>
              ))}
            </div>
          </FormField>
        </div>

        <FormField label="المكونات">
          <div className="flex flex-col gap-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <Input value={ing} onChange={(e) => updateIngredient(i, e.target.value)} placeholder={`مكون ${i + 1}`} className="flex-1" />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)} className="p-2 rounded-xl" style={{ background: 'var(--danger-soft)' }}>
                    <X size={16} color="var(--danger)" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="flex items-center gap-2 py-2 text-sm font-medium" style={{ color: 'var(--bronze)' }}>
              <Plus size={16} /> إضافة مكون
            </button>
          </div>
        </FormField>

        <FormField label="طريقة التحضير">
          <div className="flex flex-col gap-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-3" style={{ background: 'rgba(176,141,87,0.18)', color: 'var(--bronze)' }}>
                  {i + 1}
                </span>
                <Input value={step} onChange={(e) => updateStep(i, e.target.value)} placeholder={`الخطوة ${i + 1}`} className="flex-1" />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(i)} className="p-2 rounded-xl mt-1" style={{ background: 'var(--danger-soft)' }}>
                    <X size={16} color="var(--danger)" />
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="flex items-center gap-2 py-2 text-sm font-medium" style={{ color: 'var(--bronze)' }}>
              <Plus size={16} /> إضافة خطوة
            </button>
          </div>
        </FormField>

        <SubmitButton label={isEditing ? 'حفظ التعديلات' : 'حفظ الوصفة'} />
      </form>
    </BottomSheet>
  );
}
