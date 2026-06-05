'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { categoryLabels } from '@/lib/utils';
import { dishImages, dishGradient, getDishImage } from '@/lib/dishImages';
import { Clock, Heart, ChefHat, CheckCircle2, Circle, FileText, X, RefreshCw, Image as ImageIcon, ChevronLeft, Plus } from 'lucide-react';
import type { ShortagePriority, MealTime } from '@/types';

type KitchenTab = 'today' | 'week' | 'shortages' | 'recipes';
type MealSlot = 'breakfast' | 'lunch' | 'dinner';

const shortagePriorityColors: Record<ShortagePriority, { bg: string; text: string }> = {
  urgent: { bg: 'var(--danger-soft)',  text: 'var(--danger)'  },
  high:   { bg: 'var(--warning-soft)', text: 'var(--warning)' },
  medium: { bg: 'rgba(67,82,56,0.07)', text: 'var(--text-secondary)' },
  low:    { bg: 'rgba(67,82,56,0.05)', text: 'var(--text-muted)'     },
};
const shortagePriorityLabels: Record<ShortagePriority, string> = {
  urgent: 'عاجل', high: 'مهم', medium: 'متوسط', low: 'عادي',
};
const mealLabels: Record<MealSlot, string> = { breakfast: 'فطور', lunch: 'غداء', dinner: 'عشاء' };
const mealIcons:  Record<MealSlot, string>  = { breakfast: '🌅',  lunch: '☀️',   dinner: '🌙'  };
const dayLabels = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const allMealTimes: { key: MealTime; label: string }[] = [
  { key: 'breakfast', label: 'فطور' },
  { key: 'lunch',     label: 'غداء' },
  { key: 'dinner',    label: 'عشاء' },
  { key: 'occasion',  label: 'مناسبة' },
];

// ─── Dish database (Saudi · Yemeni · Hadrami · Indonesian · Universal) ─────────

const dishes: Record<MealSlot, string[]> = {
  breakfast: [
    'هريسة بالسمن', 'جريش', 'عريكة', 'مدى بالعسل', 'خبز تنور بالسمن',
    'لحوح مع العسل', 'عصيد فطور', 'شفوت', 'كحالة',
    'أسيدة بالسمن', 'خبز حضرمي بالعسل',
    'ناسي لمك', 'بوبور أيام', 'تيمبو',
    'بيض مقلي', 'شكشوكة', 'فول مدمس', 'بيض مع جبنة',
    'لبنة مع زيت زيتون', 'بيض بالطماطم', 'فطائر جبن',
  ],
  lunch: [
    'كبسة دجاج', 'مندي لحم', 'مرقوق', 'هريسة لحم', 'سليق', 'ثريد', 'جريش لحم', 'مجبوس',
    'سلتة يمنية', 'مندي يمني', 'فتة يمنية', 'فهسة', 'حساء أسماك يمني',
    'زربيان حضرمي', 'كبسة حضرمية', 'مرق حضرمي', 'مطبق حضرمي',
    'ناسي غورينج', 'ريندانج', 'غادو غادو', 'سوتو أيام', 'ميغورينج',
    'برياني دجاج', 'شوربة عدس', 'ملوخية', 'فريكة', 'شاورما دجاج',
  ],
  dinner: [
    'كبسة خضروات', 'عريكة', 'حريرة', 'مرقوق خفيف',
    'شفوت', 'فتة يمنية', 'مرق دجاج يمني',
    'أسيدة بالسمن', 'شوربة حضرمية', 'مرق سمك حضرمي',
    'ساتي أيام', 'باكسو', 'غادو غادو',
    'شوربة خضار', 'سلطة مع تونة', 'حمص مع خبز',
    'بيض مقلي', 'كشري', 'فتة', 'شوربة دجاج',
  ],
};

function pickSuggestions(meal: MealSlot, count = 5, exclude: string[] = []): string[] {
  const pool = dishes[meal].filter((d) => !exclude.includes(d));
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

// ─── Recipe text parser ────────────────────────────────────────────────────────

interface ParsedRecipe {
  name: string;
  ingredients: string[];
  steps: string[];
  mealTime: MealTime[];
}

function parseRecipeText(raw: string): ParsedRecipe | null {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return null;
  const name = lines[0].replace(/^[#*\-\•‏]+\s*/, '').trim();
  const ingredients: string[] = [];
  const steps: string[] = [];
  let mode: 'none' | 'ing' | 'steps' = 'none';
  const ingRe  = /مقادير|المقادير|مكونات|المكونات|الكميات|ingredients/i;
  const stepRe = /طريقة|الطريقة|الطريقه|التحضير|خطوات|الخطوات|steps|الطبخ|الطهي/i;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (ingRe.test(line))  { mode = 'ing';   continue; }
    if (stepRe.test(line)) { mode = 'steps'; continue; }
    const clean = line.replace(/^[\d.\-\•*●•‏]+\s*/, '').trim();
    if (!clean) continue;
    if (mode === 'ing') {
      ingredients.push(clean);
    } else if (mode === 'steps') {
      steps.push(clean);
    } else {
      if (/\d+\s*(كوب|ملعقة|غرام|كجم|كيلو|قطعة|حبة|لتر|مل)/.test(line)) {
        ingredients.push(clean);
      } else if (/^\d+[.)]\s/.test(line)) {
        steps.push(clean);
      }
    }
  }
  return { name, ingredients, steps, mealTime: [] };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KitchenPage() {
  const [activeTab, setActiveTab] = useState<KitchenTab>('today');

  // Today: which index in each meal's options array is currently shown
  const [mealIndices, setMealIndices] = useState<Record<MealSlot, number>>({
    breakfast: 0, lunch: 0, dinner: 0,
  });

  // Week: picker sheet state
  const [pickerCell, setPickerCell]   = useState<{ date: string; meal: MealSlot } | null>(null);
  const [pickerInput, setPickerInput] = useState('');
  const [pickerSugg, setPickerSugg]   = useState<string[]>([]);

  // Import recipe sheet
  const [importOpen, setImportOpen]         = useState(false);
  const [importText, setImportText]         = useState('');
  const [parsed, setParsed]                 = useState<ParsedRecipe | null>(null);
  const [parsedName, setParsedName]         = useState('');
  const [parsedMealTime, setParsedMealTime] = useState<MealTime[]>([]);
  const [quickAddVal, setQuickAddVal]       = useState('');

  const {
    shortages, recipes, mealPlans, members,
    currentFamilyGroupId, currentUserId,
    toggleShortageStatus, addMealOption, removeMealOption, addRecipe, addShortage, setActiveQuickForm,
  } = useAppStore();

  const currentMember = members.find((m) => m.id === currentUserId);
  const canEdit = currentMember?.role === 'family_admin' || !!currentMember?.permissions.canManageKitchen;

  const myShortages  = shortages.filter((s) => s.familyGroupId === currentFamilyGroupId);
  const missingCount = myShortages.filter((s) => s.status === 'missing').length;
  const myRecipes    = recipes.filter((r) => r.familyGroupId === currentFamilyGroupId);
  const todayStr     = new Date().toISOString().split('T')[0];
  const todayPlan    = mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === todayStr);

  const tabs = [
    { key: 'today',     label: 'وجبات اليوم' },
    { key: 'week',      label: 'الأسبوع' },
    { key: 'shortages', label: 'النواقص', count: missingCount },
    { key: 'recipes',   label: 'الوصفات', count: myRecipes.length },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const plan = mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === dateStr);
    return { date: d, dateStr, plan, dayLabel: dayLabels[d.getDay()] };
  });

  const meals: MealSlot[] = ['breakfast', 'lunch', 'dinner'];

  // ─── Today tab handlers ───────────────────────────────────────────────────

  function rerollMeal(meal: MealSlot) {
    const opts = todayPlan?.[meal] ?? [];
    if (opts.length <= 1) return;
    setMealIndices((prev) => ({
      ...prev,
      [meal]: (prev[meal] + 1) % opts.length,
    }));
  }

  // ─── Week tab handlers ────────────────────────────────────────────────────

  function openPicker(date: string, meal: MealSlot, existingOptions: string[]) {
    setPickerCell({ date, meal });
    setPickerInput('');
    setPickerSugg(pickSuggestions(meal, 8, existingOptions));
  }

  function closePicker() {
    setPickerCell(null);
    setPickerInput('');
    setPickerSugg([]);
  }

  function pickerAdd(name: string) {
    if (!pickerCell || !name.trim()) return;
    addMealOption(pickerCell.date, pickerCell.meal, name.trim());
    closePicker();
  }

  function pickerSaveInput() {
    pickerAdd(pickerInput);
  }

  // ─── Import handlers ──────────────────────────────────────────────────────

  function handleQuickAdd() {
    if (!quickAddVal.trim() || !canEdit) return;
    addShortage({
      familyGroupId: currentFamilyGroupId,
      name: quickAddVal.trim(),
      category: 'other',
      priority: 'medium',
      status: 'missing',
      addedBy: currentUserId,
    });
    setQuickAddVal('');
  }

  function closeImport() {
    setImportOpen(false);
    setImportText('');
    setParsed(null);
    setParsedName('');
    setParsedMealTime([]);
  }

  function handleImportSave() {
    if (!parsed) return;
    addRecipe({
      familyGroupId: currentFamilyGroupId,
      name: parsedName || parsed.name,
      ingredients: parsed.ingredients,
      steps: parsed.steps,
      mealTime: parsedMealTime,
      favoritedBy: [],
      createdBy: currentUserId,
    });
    closeImport();
    setActiveTab('recipes');
  }

  return (
    <AppShell extraClass="kitchen-shell">
      <PageHeader title="المطبخ" subtitle="وجبات البيت ونواقص المطبخ" />
      <Tabs tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as KitchenTab)} />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* ─── TODAY ────────────────────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <>
            {meals.map((meal, mealIdx) => {
              const options = todayPlan?.[meal] ?? [];
              const idx = Math.min(mealIndices[meal], options.length - 1);
              const selected = options[idx] ?? null;
              const others   = options.filter((_, i) => i !== idx);
              const isLunch  = meal === 'lunch';

              // Image: real photo if known dish, else dish-specific gradient, else slot gradient
              const slotGradients: Record<MealSlot, string> = {
                breakfast: 'linear-gradient(135deg, #F5D9A8 0%, #E8A860 50%, #D4875A 100%)',
                lunch:     'linear-gradient(135deg, #C4907A 0%, #B87560 50%, #A86550 100%)',
                dinner:    'linear-gradient(135deg, #C98272 0%, #B86F58 50%, #9A5A48 100%)',
              };
              const dishImg   = selected ? getDishImage(selected) : undefined;
              const imgGrad   = selected ? dishGradient(selected) : slotGradients[meal];

              return (
                <div
                  key={meal}
                  className="kitchen-card interactive-card"
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: 132,
                    padding: '20px 20px 20px 148px',
                    borderRadius: 28,
                    ...(isLunch && {
                      background: 'linear-gradient(135deg, rgba(244,217,207,0.65) 0%, rgba(255,255,255,0.74) 60%)',
                      border: '1px solid rgba(201,130,114,0.22)',
                    }),
                  }}
                >
                  {/* Meal label tag */}
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                    padding: '3px 10px', borderRadius: 20, marginBottom: 8,
                    background: 'rgba(201,130,114,0.14)',
                    color: 'var(--kitchen-rose)',
                    border: '1px solid rgba(201,130,114,0.18)',
                  }}>
                    {mealLabels[meal]}
                  </span>

                  {/* Dish name */}
                  {selected ? (
                    <>
                      <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--azz-text-main)', lineHeight: 1.3, marginBottom: 8 }}>
                        {selected}
                      </p>
                      {others.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                          {others.map((opt) => (
                            <span key={opt} style={{
                              fontSize: 10, padding: '2px 8px', borderRadius: 20,
                              background: 'rgba(201,130,114,0.10)',
                              color: 'var(--kitchen-terracotta)',
                              border: '1px solid rgba(201,130,114,0.14)',
                            }}>
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                      لم تُضَف وجبات بعد
                    </p>
                  )}

                  {/* Actions row */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {options.length > 1 && (
                      <button
                        onClick={() => rerollMeal(meal)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 20,
                          background: 'rgba(255,255,255,0.60)',
                          border: '1px solid rgba(201,130,114,0.18)',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        <RefreshCw size={11} color="var(--kitchen-rose)" />
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--kitchen-rose)' }}>غيّر</span>
                      </button>
                    )}
                    {mealIdx === 1 && selected && (
                      <span style={{
                        fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                        background: 'rgba(181,139,85,0.14)', color: 'var(--azz-bronze)',
                        border: '1px solid rgba(181,139,85,0.20)',
                      }}>
                        وجبة اليوم الرئيسية
                      </span>
                    )}
                  </div>

                  {/* Image circle — positioned on physical left (RTL end) */}
                  <div style={{
                    position: 'absolute',
                    left: 16, top: '50%',
                    width: 112, height: 112,
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    boxShadow: '0 18px 34px rgba(184,111,88,0.20)',
                    border: '3px solid rgba(255,255,255,0.85)',
                    flexShrink: 0,
                  }}>
                    {dishImg ? (
                      <img src={dishImg} alt={selected!} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: imgGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 36, opacity: 0.85 }}>{mealIcons[meal]}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ─── WEEK ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'week' && (
          <>
            {!canEdit && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 2 }}>
                لديك صلاحية العرض فقط
              </p>
            )}
            {canEdit && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 2 }}>
                وزّع الوجبات على الأسبوع — كل خانة تقبل أكثر من خيار
              </p>
            )}
            {weekDays.map(({ date, dateStr, plan, dayLabel }) => {
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  style={{
                    padding: '14px 16px', borderRadius: 22,
                    background: isToday ? 'rgba(176,141,87,0.08)' : 'var(--surface-card)',
                    border: `1px solid ${isToday ? 'rgba(176,141,87,0.35)' : 'var(--border-soft)'}`,
                  }}
                >
                  {/* Day header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isToday ? 'var(--bronze)' : 'var(--text-primary)' }}>
                      {dayLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: 'rgba(181,139,85,0.16)', color: 'var(--bronze)' }}>
                        اليوم
                      </span>
                    )}
                  </div>

                  {/* Meal rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {meals.map((meal) => {
                      const options = plan?.[meal] ?? [];
                      return (
                        <div key={meal} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', paddingTop: 5, width: 34, flexShrink: 0 }}>
                            {mealLabels[meal]}
                          </span>
                          <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                            {options.map((opt) => {
                              const optImg = getDishImage(opt);
                              return (
                                <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px 3px 5px', borderRadius: 20, background: 'rgba(163,177,138,0.12)', border: '1px solid rgba(163,177,138,0.22)' }}>
                                  {/* Mini image circle */}
                                  <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                    {optImg ? (
                                      <img src={optImg} alt={opt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ width: '100%', height: '100%', background: dishGradient(opt) }} />
                                    )}
                                  </div>
                                  <span style={{ fontSize: 12, color: 'var(--accent-strong)' }}>{opt}</span>
                                  {canEdit && (
                                    <button onClick={() => removeMealOption(dateStr, meal, opt)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1, color: 'rgba(163,177,138,0.5)', fontSize: 14 }}>×</button>
                                  )}
                                </div>
                              );
                            })}
                            {canEdit && (
                              <button
                                onClick={() => openPicker(dateStr, meal, options)}
                                style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: 'transparent', border: '1px dashed rgba(67,82,56,0.22)', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit' }}
                              >
                                + أضف
                              </button>
                            )}
                            {!canEdit && options.length === 0 && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ─── SHORTAGES ────────────────────────────────────────────────────────── */}
        {activeTab === 'shortages' && (
          <>
            {/* Quick add */}
            {canEdit && (
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={quickAddVal}
                  onChange={(e) => setQuickAddVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                  placeholder="وش ناقص؟"
                  style={{
                    flex: 1, padding: '11px 14px', borderRadius: 14,
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-primary)', fontSize: 14,
                    fontFamily: 'inherit', direction: 'rtl', outline: 'none',
                  }}
                />
                <button
                  onClick={handleQuickAdd}
                  disabled={!quickAddVal.trim()}
                  style={{
                    padding: '11px 18px', borderRadius: 14,
                    background: quickAddVal.trim() ? 'rgba(163,177,138,0.18)' : 'rgba(67,82,56,0.05)',
                    border: `1px solid ${quickAddVal.trim() ? 'rgba(163,177,138,0.35)' : 'rgba(67,82,56,0.10)'}`,
                    color: quickAddVal.trim() ? 'var(--accent-strong)' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: 700,
                    cursor: quickAddVal.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}
                >
                  إضافة
                </button>
              </div>
            )}

            {/* Summary chips */}
            {myShortages.length > 0 && (() => {
              const urgentCount   = myShortages.filter((s) => s.status === 'missing' && (s.priority === 'urgent' || s.priority === 'high')).length;
              const providedCount = myShortages.filter((s) => s.status === 'provided').length;
              return (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'rgba(67,82,56,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border-soft)' }}>
                    🛒 ناقص {missingCount}
                  </span>
                  {urgentCount > 0 && (
                    <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid rgba(249,112,102,0.22)' }}>
                      ⚡ عاجل {urgentCount}
                    </span>
                  )}
                  {providedCount > 0 && (
                    <span style={{ fontSize: 12, padding: '5px 12px', borderRadius: 20, background: 'var(--success-soft)', color: 'var(--success)', border: '1px solid rgba(134,239,172,0.22)' }}>
                      ✓ تم توفيره {providedCount}
                    </span>
                  )}
                </div>
              );
            })()}

            {myShortages.length === 0 ? (
              <EmptyState icon="🛒" title="لا توجد نواقص" description="سجّل ما ينقصك من المطبخ" />
            ) : (() => {
              const missing = myShortages.filter((s) => s.status === 'missing');
              const provided = myShortages.filter((s) => s.status === 'provided');

              const priorityGroups: { key: string; label: string; color: string; items: typeof missing }[] = [
                {
                  key: 'urgent',
                  label: 'عاجل',
                  color: 'var(--danger)',
                  items: missing.filter((s) => s.priority === 'urgent'),
                },
                {
                  key: 'high',
                  label: 'مهم',
                  color: 'var(--warning)',
                  items: missing.filter((s) => s.priority === 'high'),
                },
                {
                  key: 'medium',
                  label: 'متوسط',
                  color: 'var(--text-secondary)',
                  items: missing.filter((s) => s.priority === 'medium' || s.priority === 'low'),
                },
              ];

              const renderItem = (item: typeof missing[0], isMissing: boolean) => {
                const pColor = shortagePriorityColors[item.priority];
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 16,
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-soft)',
                      opacity: isMissing ? 1 : 0.55,
                    }}
                  >
                    <button
                      onClick={() => toggleShortageStatus(item.id)}
                      style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {isMissing
                        ? <Circle size={20} color="rgba(67,82,56,0.25)" />
                        : <CheckCircle2 size={20} color="var(--success)" />
                      }
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textDecoration: isMissing ? 'none' : 'line-through', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.name}
                      </p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                        {item.quantity && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity}</span>}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{categoryLabels[item.category] || item.category}</span>
                      </div>
                    </div>
                    {isMissing && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, flexShrink: 0, background: pColor.bg, color: pColor.text }}>
                        {shortagePriorityLabels[item.priority]}
                      </span>
                    )}
                  </div>
                );
              };

              return (
                <>
                  {priorityGroups.map(({ key, label, color, items }) =>
                    items.length === 0 ? null : (
                      <div key={key} style={{ marginBottom: 4 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, color }}>
                          {label} ({items.length})
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {items.map((item) => renderItem(item, true))}
                        </div>
                      </div>
                    )
                  )}
                  {provided.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, color: 'var(--success)' }}>
                        ✓ تم توفيره ({provided.length})
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {provided.map((item) => renderItem(item, false))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}

        {/* ─── RECIPES ──────────────────────────────────────────────────────────── */}
        {activeTab === 'recipes' && (
          <>
            {canEdit && (
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Primary: add new recipe */}
                <button
                  onClick={() => setActiveQuickForm('recipe')}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 16,
                    background: 'rgba(163,177,138,0.16)',
                    border: '1px solid rgba(163,177,138,0.32)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  className="active:scale-[0.98]"
                >
                  <Plus size={16} color="var(--accent-strong)" strokeWidth={2.5} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-strong)' }}>
                    وصفة جديدة
                  </span>
                </button>
                {/* Secondary: import from text */}
                <button
                  onClick={() => setImportOpen(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '12px 14px', borderRadius: 16,
                    background: 'rgba(232,121,249,0.07)',
                    border: '1px solid rgba(232,121,249,0.20)',
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                  className="active:scale-[0.98]"
                >
                  <FileText size={15} color="#E879F9" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#E879F9' }}>استيراد</span>
                </button>
              </div>
            )}
            {myRecipes.length === 0 ? (
              <EmptyState icon="👨‍🍳" title="لا توجد وصفات" description="اضغط وصفة جديدة لتبدأ" />
            ) : (
              myRecipes.map((recipe) => {
                const isGrad = recipe.imageUrl?.startsWith('linear-gradient');
                const recipeImg = !isGrad ? (recipe.imageUrl || getDishImage(recipe.name)) : undefined;
                const recipeGrad = isGrad ? recipe.imageUrl! : (getDishImage(recipe.name) ? undefined : dishGradient(recipe.name));
                return (
                <div key={recipe.id} style={{ padding: 14, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {/* Recipe image circle */}
                    <div style={{ width: 52, height: 52, borderRadius: 16, flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 4px 12px rgba(67,82,56,0.12)' }}>
                      {recipeImg ? (
                        <img src={recipeImg} alt={recipe.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', background: recipeGrad ?? dishGradient(recipe.name), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ChefHat size={20} color="rgba(255,255,255,0.85)" strokeWidth={1.7} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{recipe.name}</p>
                        {recipe.favoritedBy.includes(currentUserId) && (
                          <Heart size={14} color="#F472B6" fill="#F472B6" />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        {recipe.mealTime.map((t) => (
                          <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(67,82,56,0.07)', color: 'var(--text-muted)' }}>
                            {t === 'breakfast' ? 'فطور' : t === 'lunch' ? 'غداء' : t === 'dinner' ? 'عشاء' : 'مناسبة'}
                          </span>
                        ))}
                        {recipe.prepTime && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Clock size={10} />{recipe.prepTime} دقيقة
                          </span>
                        )}
                      </div>
                      {recipe.ingredients.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>المكونات:</p>
                          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                            {recipe.ingredients.join(' · ')}
                          </p>
                        </div>
                      )}
                      {recipe.steps.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>الخطوات:</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {recipe.steps.map((step, i) => (
                              <div key={i} style={{ display: 'flex', gap: 6 }}>
                                <span style={{ fontSize: 11, color: 'var(--accent-strong)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );})
            )}
          </>
        )}
      </div>

      {/* ─── Meal Picker Sheet ───────────────────────────────────────────────── */}
      {pickerCell && (() => {
        const { meal } = pickerCell;
        const mealRecipes = myRecipes.filter(
          (r) => r.mealTime.length === 0 || r.mealTime.includes(meal as MealTime)
        );
        return (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 48, background: 'rgba(31,33,28,0.35)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
              onClick={closePicker}
            />
            <div
              className="slide-up"
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 49,
                background: 'rgba(255,253,247,0.98)',
                backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
                borderRadius: '28px 28px 0 0',
                padding: '20px 16px max(28px, env(safe-area-inset-bottom, 16px))',
                maxHeight: '72dvh', overflowY: 'auto',
                border: '1px solid rgba(67,82,56,0.10)',
                boxShadow: '0 -16px 48px rgba(67,82,56,0.14)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                  اختر وجبة {mealLabels[meal]}
                </p>
                <button onClick={closePicker} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={20} color="var(--text-muted)" />
                </button>
              </div>

              {/* Saved recipes */}
              {mealRecipes.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 10 }}>
                    من وصفاتي ({mealRecipes.length})
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {mealRecipes.map((r) => {
                      const rIsGrad = r.imageUrl?.startsWith('linear-gradient');
                      const rImg = !rIsGrad ? (r.imageUrl || getDishImage(r.name)) : undefined;
                      const rGrad = rIsGrad ? r.imageUrl! : (rImg ? undefined : dishGradient(r.name));
                      return (
                        <button
                          key={r.id}
                          onClick={() => pickerAdd(r.name)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 12px', borderRadius: 18, width: '100%', textAlign: 'right',
                            background: 'var(--surface-card)',
                            border: '1px solid var(--border-soft)',
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'transform 0.12s ease',
                          }}
                          className="active:scale-[0.98]"
                        >
                          {/* Image circle */}
                          <div style={{ width: 44, height: 44, borderRadius: 14, overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(255,255,255,0.7)', boxShadow: '0 2px 8px rgba(67,82,56,0.10)' }}>
                            {rImg ? (
                              <img src={rImg} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', background: rGrad ?? dishGradient(r.name), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ChefHat size={16} color="rgba(255,255,255,0.85)" strokeWidth={1.8} />
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{r.name}</p>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {r.prepTime && (
                                <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                                  <Clock size={9} />{r.prepTime} د
                                </span>
                              )}
                              {r.ingredients.length > 0 && (
                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                  {r.ingredients.slice(0, 2).join(' · ')}{r.ingredients.length > 2 ? '...' : ''}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronLeft size={16} color="var(--text-muted)" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {pickerSugg.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 10 }}>
                    اقتراحات
                  </p>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {pickerSugg.map((s) => {
                      const hasImg = !!getDishImage(s);
                      return (
                        <button
                          key={s}
                          onClick={() => pickerAdd(s)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 5,
                            fontSize: 12, padding: '6px 12px', borderRadius: 20,
                            background: hasImg ? 'rgba(201,130,114,0.10)' : 'rgba(176,141,87,0.10)',
                            color: hasImg ? 'var(--kitchen-rose)' : 'var(--bronze)',
                            border: `1px solid ${hasImg ? 'rgba(201,130,114,0.22)' : 'rgba(176,141,87,0.22)'}`,
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          {hasImg && <ImageIcon size={10} strokeWidth={2} />}
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Manual input */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={pickerInput}
                  onChange={(e) => setPickerInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); pickerSaveInput(); } }}
                  placeholder="أو اكتب اسم الوجبة..."
                  style={{
                    flex: 1, padding: '11px 14px', borderRadius: 14,
                    background: 'rgba(67,82,56,0.05)',
                    border: '1px solid rgba(67,82,56,0.12)',
                    color: 'var(--text-primary)', fontSize: 14,
                    fontFamily: 'inherit', direction: 'rtl', outline: 'none',
                  }}
                />
                <button
                  onClick={pickerSaveInput}
                  disabled={!pickerInput.trim()}
                  style={{
                    padding: '11px 18px', borderRadius: 14,
                    background: pickerInput.trim() ? 'rgba(163,177,138,0.20)' : 'rgba(67,82,56,0.05)',
                    border: `1px solid ${pickerInput.trim() ? 'rgba(163,177,138,0.38)' : 'rgba(67,82,56,0.10)'}`,
                    color: pickerInput.trim() ? 'var(--accent-strong)' : 'var(--text-muted)',
                    fontSize: 13, fontWeight: 700,
                    cursor: pickerInput.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                  }}
                >
                  إضافة
                </button>
              </div>
            </div>
          </>
        );
      })()}

      {/* ─── Import Recipe Sheet ──────────────────────────────────────────────── */}
      {importOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 48, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
            onClick={closeImport}
          />
          <div
            className="slide-up"
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 49,
              background: 'rgba(255,253,247,0.98)',
              borderRadius: '28px 28px 0 0',
              padding: '20px 20px max(32px, env(safe-area-inset-bottom, 16px))',
              maxHeight: '88dvh', overflowY: 'auto',
              border: '1px solid rgba(67,82,56,0.12)',
              boxShadow: '0 -20px 60px rgba(67,82,56,0.18)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>استيراد وصفة</p>
              <button onClick={closeImport} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            {!parsed ? (
              <>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, lineHeight: 1.6 }}>
                  الصق نص الوصفة — سيُستخرج الاسم والمقادير والخطوات تلقائياً.
                  يعمل مع نصوص تحتوي على: المقادير / الطريقة
                </p>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`كبسة دجاج\n\nالمقادير:\n- دجاج كامل\n- 3 أكواب رز بسمتي\n- بهارات كبسة\n\nالطريقة:\n1. يُسلق الدجاج مع البهارات\n2. يُقلى البصل والثوم بالزبدة`}
                  style={{
                    width: '100%', height: 220, padding: 14, borderRadius: 16,
                    background: 'var(--surface-card)', border: '1px solid var(--border-soft)',
                    color: 'var(--text-primary)', fontSize: 13,
                    fontFamily: 'inherit', direction: 'rtl',
                    resize: 'none', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={() => {
                    const result = parseRecipeText(importText);
                    if (result) { setParsed(result); setParsedName(result.name); setParsedMealTime([]); }
                  }}
                  disabled={!importText.trim()}
                  style={{
                    marginTop: 12, width: '100%', padding: 14, borderRadius: 16,
                    fontWeight: 700, fontSize: 14,
                    background: importText.trim() ? 'linear-gradient(135deg, #E879F9, #C026D3)' : 'rgba(67,82,56,0.06)',
                    color: importText.trim() ? '#fff' : 'var(--text-muted)',
                    border: 'none', cursor: importText.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                  }}
                  className="active:scale-[0.98]"
                >
                  تحليل الوصفة ✨
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>اسم الوصفة</p>
                  <input
                    value={parsedName}
                    onChange={(e) => setParsedName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 12,
                      background: 'var(--surface-card)', border: '1px solid var(--border-soft)',
                      color: 'var(--text-primary)', fontSize: 15, fontWeight: 600,
                      fontFamily: 'inherit', direction: 'rtl', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
                {parsed.ingredients.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>المكونات ({parsed.ingredients.length})</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {parsed.ingredients.map((ing, i) => (
                        <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: 'rgba(67,82,56,0.07)', color: 'var(--text-secondary)' }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {parsed.steps.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>الخطوات ({parsed.steps.length})</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {parsed.steps.map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8 }}>
                          <span style={{ fontSize: 12, color: 'var(--accent-strong)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>وقت الوجبة</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {allMealTimes.map((mt) => {
                      const active = parsedMealTime.includes(mt.key);
                      return (
                        <button
                          key={mt.key}
                          onClick={() => setParsedMealTime((prev) => active ? prev.filter((x) => x !== mt.key) : [...prev, mt.key])}
                          style={{
                            fontSize: 13, padding: '6px 16px', borderRadius: 20, cursor: 'pointer',
                            background: active ? 'rgba(163,177,138,0.18)' : 'var(--surface-card)',
                            color: active ? 'var(--accent-strong)' : 'var(--text-muted)',
                            border: active ? '1px solid rgba(163,177,138,0.35)' : '1px solid var(--border-soft)',
                            fontFamily: 'inherit',
                          }}
                        >
                          {mt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => setParsed(null)}
                    style={{
                      flex: 1, padding: 12, borderRadius: 14, fontWeight: 600,
                      background: 'rgba(67,82,56,0.06)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                    }}
                  >
                    تعديل النص
                  </button>
                  <button
                    onClick={handleImportSave}
                    style={{
                      flex: 2, padding: 12, borderRadius: 14, fontWeight: 700,
                      background: 'linear-gradient(135deg, #E879F9, #C026D3)',
                      color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14,
                    }}
                    className="active:scale-[0.98]"
                  >
                    حفظ الوصفة ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
