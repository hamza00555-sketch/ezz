'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { categoryLabels } from '@/lib/utils';
import { Clock, Heart, ChefHat, CheckCircle2, Circle, FileText, X } from 'lucide-react';
import type { ShortagePriority, MealTime } from '@/types';

type KitchenTab = 'today' | 'week' | 'shortages' | 'recipes';
type MealSlot = 'breakfast' | 'lunch' | 'dinner';

const shortagePriorityColors: Record<ShortagePriority, { bg: string; text: string }> = {
  urgent: { bg: 'var(--danger-soft)',  text: 'var(--danger)'  },
  high:   { bg: 'var(--warning-soft)', text: 'var(--warning)' },
  medium: { bg: 'rgba(255,255,255,0.07)', text: 'var(--text-secondary)' },
  low:    { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-muted)'     },
};
const shortagePriorityLabels: Record<ShortagePriority, string> = {
  urgent: 'عاجل', high: 'مهم', medium: 'متوسط', low: 'عادي',
};
const mealLabels: Record<MealSlot, string> = { breakfast: 'فطور', lunch: 'غداء', dinner: 'عشاء' };
const mealIcons: Record<MealSlot, string>  = { breakfast: '🌅',  lunch: '☀️',   dinner: '🌙'   };
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

function pickSuggestions(meal: MealSlot, count = 4, exclude: string[] = []): string[] {
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

  // Inline meal editing
  const [editingCell, setEditingCell] = useState<{ date: string; meal: MealSlot } | null>(null);
  const [editValue, setEditValue]     = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Recipe import sheet
  const [importOpen, setImportOpen]         = useState(false);
  const [importText, setImportText]         = useState('');
  const [parsed, setParsed]                 = useState<ParsedRecipe | null>(null);
  const [parsedName, setParsedName]         = useState('');
  const [parsedMealTime, setParsedMealTime] = useState<MealTime[]>([]);

  const {
    shortages, recipes, mealPlans, members,
    currentFamilyGroupId, currentUserId,
    toggleShortageStatus, setMealPlan, addRecipe,
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

  function startEdit(date: string, meal: MealSlot, currentValue = '') {
    setEditingCell({ date, meal });
    setEditValue(currentValue);
    setSuggestions(pickSuggestions(meal, 4, currentValue ? [currentValue] : []));
  }

  function saveEdit() {
    if (!editingCell) return;
    setMealPlan(editingCell.date, editingCell.meal, editValue.trim());
    setEditingCell(null);
    setEditValue('');
    setSuggestions([]);
  }

  function chipSave(s: string) {
    if (!editingCell) return;
    setMealPlan(editingCell.date, editingCell.meal, s);
    setEditingCell(null);
    setEditValue('');
    setSuggestions([]);
  }

  function closeImport() {
    setImportOpen(false);
    setImportText('');
    setParsed(null);
    setParsedName('');
    setParsedMealTime([]);
  }

  function handleImportParse() {
    const result = parseRecipeText(importText);
    if (result) {
      setParsed(result);
      setParsedName(result.name);
      setParsedMealTime([]);
    }
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

  // ─── Inline meal row (used inside day cards) ─────────────────────────────────
  // Returned as JSX expression, not a React component, to avoid hook rules issues

  function mealRow(dateStr: string, meal: MealSlot, value?: string) {
    const isEditing = editingCell?.date === dateStr && editingCell?.meal === meal;
    return (
      <div key={meal}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '7px 0',
            cursor: canEdit && !isEditing ? 'pointer' : 'default',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
          onClick={() => canEdit && !isEditing && startEdit(dateStr, meal, value)}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', width: 36, flexShrink: 0 }}>
            {mealLabels[meal]}
          </span>
          {isEditing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(); } }}
              placeholder="اسم الوجبة..."
              style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: '1.5px solid var(--accent-strong)',
                color: 'var(--text-primary)', fontSize: 13,
                outline: 'none', padding: '2px 0',
                fontFamily: 'inherit', direction: 'rtl',
              }}
            />
          ) : (
            <span style={{ flex: 1, fontSize: 13, color: value ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)' }}>
              {value || (canEdit ? '+ أضف' : '—')}
            </span>
          )}
        </div>
        {isEditing && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '6px 0 8px 0' }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onPointerDown={(e) => e.preventDefault()}
                onClick={() => chipSave(s)}
                style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 20,
                  background: 'rgba(163,177,138,0.12)',
                  color: 'var(--accent-strong)',
                  border: '1px solid rgba(163,177,138,0.25)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <AppShell>
      <PageHeader title="المطبخ" />
      <Tabs tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as KitchenTab)} />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ─── TODAY ────────────────────────────────────────────────────────────── */}
        {activeTab === 'today' && (
          <>
            {!canEdit && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4 }}>
                لديك صلاحية العرض فقط — الأدمن يستطيع منح صلاحية التعديل
              </p>
            )}
            {meals.map((meal) => {
              const value = todayPlan?.[meal];
              const isEditing = editingCell?.date === todayStr && editingCell?.meal === meal;
              return (
                <div
                  key={meal}
                  style={{
                    padding: 16, borderRadius: 20,
                    background: 'var(--surface-card)',
                    border: `1px solid ${isEditing ? 'rgba(163,177,138,0.35)' : 'var(--border-soft)'}`,
                    cursor: canEdit && !isEditing ? 'pointer' : 'default',
                  }}
                  onClick={() => canEdit && !isEditing && startEdit(todayStr, meal, value)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{mealIcons[meal]}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {mealLabels[meal]}
                      </p>
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveEdit(); } }}
                          placeholder="اكتب اسم الوجبة..."
                          style={{
                            width: '100%', background: 'transparent', border: 'none',
                            borderBottom: '1.5px solid var(--accent-strong)',
                            color: 'var(--text-primary)', fontSize: 15,
                            outline: 'none', padding: '2px 0',
                            fontFamily: 'inherit', direction: 'rtl',
                            boxSizing: 'border-box',
                          }}
                        />
                      ) : (
                        <p style={{ fontSize: 15, color: value ? 'var(--text-primary)' : 'rgba(255,255,255,0.22)' }}>
                          {value || (canEdit ? 'اضغط للإضافة' : 'لم يُحدد')}
                        </p>
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onPointerDown={(e) => e.preventDefault()}
                          onClick={() => chipSave(s)}
                          style={{
                            fontSize: 12, padding: '5px 14px', borderRadius: 20,
                            background: 'rgba(163,177,138,0.12)',
                            color: 'var(--accent-strong)',
                            border: '1px solid rgba(163,177,138,0.25)',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ─── WEEK ─────────────────────────────────────────────────────────────── */}
        {activeTab === 'week' && (
          <>
            {!canEdit && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 4 }}>
                لديك صلاحية العرض فقط
              </p>
            )}
            {weekDays.map(({ date, dateStr, plan, dayLabel }) => {
              const isToday = dateStr === todayStr;
              return (
                <div
                  key={dateStr}
                  style={{
                    padding: '12px 16px', borderRadius: 20,
                    background: isToday ? 'rgba(176,141,87,0.08)' : 'var(--surface-card)',
                    border: `1px solid ${isToday ? 'rgba(176,141,87,0.35)' : 'var(--border-soft)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isToday ? 'var(--bronze)' : 'var(--text-primary)' }}>
                      {dayLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: 'var(--bronze)', color: '#0D0F12' }}>
                        اليوم
                      </span>
                    )}
                  </div>
                  <div>
                    {meals.map((meal) => mealRow(dateStr, meal, plan?.[meal]))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ─── SHORTAGES ────────────────────────────────────────────────────────── */}
        {activeTab === 'shortages' && (
          <>
            {myShortages.length === 0 ? (
              <EmptyState icon="🛒" title="لا توجد نواقص" description="سجّل ما ينقصك من المطبخ" />
            ) : (
              ['missing', 'provided'].map((status) => {
                const group = myShortages.filter((s) => s.status === status);
                if (!group.length) return null;
                const pOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                return (
                  <div key={status}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, color: status === 'missing' ? 'var(--danger)' : 'var(--success)' }}>
                      {status === 'missing' ? `ناقص (${group.length})` : `✓ تم توفيره (${group.length})`}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {group
                        .slice()
                        .sort((a, b) => pOrder[a.priority] - pOrder[b.priority])
                        .map((item) => {
                          const pColor = shortagePriorityColors[item.priority];
                          const isMissing = item.status === 'missing';
                          return (
                            <div
                              key={item.id}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: 12, borderRadius: 16,
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
                                  ? <Circle size={20} color="rgba(255,255,255,0.25)" />
                                  : <CheckCircle2 size={20} color="var(--success)" />
                                }
                              </button>
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textDecoration: isMissing ? 'none' : 'line-through' }}>
                                  {item.name}
                                </p>
                                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                                  {item.quantity && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity}</span>}
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{categoryLabels[item.category] || item.category}</span>
                                </div>
                              </div>
                              {isMissing && (
                                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, flexShrink: 0, background: pColor.bg, color: pColor.text }}>
                                  {shortagePriorityLabels[item.priority]}
                                </span>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ─── RECIPES ──────────────────────────────────────────────────────────── */}
        {activeTab === 'recipes' && (
          <>
            {canEdit && (
              <button
                onClick={() => setImportOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '12px 16px', borderRadius: 16,
                  background: 'rgba(232,121,249,0.08)',
                  border: '1px solid rgba(232,121,249,0.25)',
                  cursor: 'pointer', marginBottom: 4,
                  fontFamily: 'inherit',
                }}
                className="active:scale-[0.98]"
              >
                <FileText size={16} color="#E879F9" />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E879F9' }}>
                  استيراد وصفة بالنص
                </span>
              </button>
            )}
            {myRecipes.length === 0 ? (
              <EmptyState icon="👨‍🍳" title="لا توجد وصفات" description="احفظ وصفاتك المفضلة أو استوردها" />
            ) : (
              myRecipes.map((recipe) => (
                <div key={recipe.id} style={{ padding: 14, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: 'rgba(176,141,87,0.15)' }}>
                      <ChefHat size={20} color="var(--bronze)" strokeWidth={1.7} />
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
                          <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
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
              ))
            )}
          </>
        )}
      </div>

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
              background: 'var(--bg-elevated)',
              borderRadius: '28px 28px 0 0',
              padding: '20px 20px max(32px, env(safe-area-inset-bottom, 16px))',
              maxHeight: '88dvh', overflowY: 'auto',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
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
                  يعمل مع نصوص بالعربي تحتوي على: المقادير / الطريقة
                </p>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`كبسة دجاج\n\nالمقادير:\n- دجاج كامل\n- 3 أكواب رز بسمتي\n- بهارات كبسة\n\nالطريقة:\n1. يُسلق الدجاج مع البهارات والبصل\n2. يُقلى البصل والثوم بالزبدة\n3. تُضاف الطماطم والبهارات ثم الرز`}
                  style={{
                    width: '100%', height: 220, padding: 14,
                    borderRadius: 16, background: 'var(--surface-card)',
                    border: '1px solid var(--border-soft)',
                    color: 'var(--text-primary)', fontSize: 13,
                    fontFamily: 'inherit', direction: 'rtl',
                    resize: 'none', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  onClick={handleImportParse}
                  disabled={!importText.trim()}
                  style={{
                    marginTop: 12, width: '100%', padding: 14,
                    borderRadius: 16, fontWeight: 700, fontSize: 14,
                    background: importText.trim()
                      ? 'linear-gradient(135deg, #E879F9, #C026D3)'
                      : 'rgba(255,255,255,0.07)',
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
                {/* Name */}
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>اسم الوصفة</p>
                  <input
                    value={parsedName}
                    onChange={(e) => setParsedName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      borderRadius: 12, background: 'var(--surface-card)',
                      border: '1px solid var(--border-soft)',
                      color: 'var(--text-primary)', fontSize: 15, fontWeight: 600,
                      fontFamily: 'inherit', direction: 'rtl', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Ingredients */}
                {parsed.ingredients.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                      المكونات ({parsed.ingredients.length})
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {parsed.ingredients.map((ing, i) => (
                        <span key={i} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)' }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                {parsed.steps.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>
                      الخطوات ({parsed.steps.length})
                    </p>
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

                {/* Meal time selector */}
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>وقت الوجبة</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {allMealTimes.map((mt) => {
                      const active = parsedMealTime.includes(mt.key);
                      return (
                        <button
                          key={mt.key}
                          onClick={() => setParsedMealTime((prev) =>
                            active ? prev.filter((x) => x !== mt.key) : [...prev, mt.key]
                          )}
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

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => setParsed(null)}
                    style={{
                      flex: 1, padding: 12, borderRadius: 14, fontWeight: 600,
                      background: 'rgba(255,255,255,0.07)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border-soft)', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13,
                    }}
                  >
                    تعديل النص
                  </button>
                  <button
                    onClick={handleImportSave}
                    style={{
                      flex: 2, padding: 12, borderRadius: 14, fontWeight: 700,
                      background: 'linear-gradient(135deg, #E879F9, #C026D3)',
                      color: '#fff', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 14,
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
