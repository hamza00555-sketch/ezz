'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { categoryLabels } from '@/lib/utils';
import { Clock, Heart, ChefHat, CheckCircle2, Circle } from 'lucide-react';
import type { ShortagePriority } from '@/types';

type KitchenTab = 'shortages' | 'recipes' | 'today' | 'week';

const shortagePriorityColors: Record<ShortagePriority, { bg: string; text: string }> = {
  urgent: { bg: 'var(--danger-soft)',  text: 'var(--danger)'  },
  high:   { bg: 'var(--warning-soft)', text: 'var(--warning)' },
  medium: { bg: 'rgba(255,255,255,0.07)', text: 'var(--text-secondary)' },
  low:    { bg: 'rgba(255,255,255,0.05)', text: 'var(--text-muted)'     },
};

const shortagePriorityLabels: Record<ShortagePriority, string> = {
  urgent: 'عاجل',
  high: 'مهم',
  medium: 'متوسط',
  low: 'عادي',
};

const mealTimeLabels: Record<string, string> = {
  breakfast: 'فطور',
  lunch: 'غداء',
  dinner: 'عشاء',
  occasion: 'مناسبة',
};

const dayLabels = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export default function KitchenPage() {
  const [activeTab, setActiveTab] = useState<KitchenTab>('shortages');
  const { shortages, recipes, mealPlans, currentFamilyGroupId, currentUserId, toggleShortageStatus } =
    useAppStore();

  const myShortages = shortages.filter((s) => s.familyGroupId === currentFamilyGroupId);
  const missingCount = myShortages.filter((s) => s.status === 'missing').length;
  const myRecipes = recipes.filter((r) => r.familyGroupId === currentFamilyGroupId);
  const todayPlan = mealPlans.find(
    (p) =>
      p.familyGroupId === currentFamilyGroupId &&
      p.date === new Date().toISOString().split('T')[0]
  );

  const tabs = [
    { key: 'shortages', label: 'النواقص', count: missingCount },
    { key: 'recipes', label: 'الوصفات', count: myRecipes.length },
    { key: 'today', label: 'وجبات اليوم' },
    { key: 'week', label: 'الأسبوع' },
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const plan = mealPlans.find(
      (p) => p.familyGroupId === currentFamilyGroupId && p.date === dateStr
    );
    return { date: d, dateStr, plan, dayLabel: dayLabels[d.getDay()] };
  });

  return (
    <AppShell>
      <PageHeader title="المطبخ" />
      <Tabs tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as KitchenTab)} />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* SHORTAGES */}
        {activeTab === 'shortages' && (
          <>
            {myShortages.length === 0 ? (
              <EmptyState icon="🛒" title="لا توجد نواقص" description="سجّل ما ينقصك من المطبخ" />
            ) : (
              <>
                {['missing', 'provided'].map((status) => {
                  const group = myShortages.filter((s) => s.status === status);
                  if (group.length === 0) return null;
                  return (
                    <div key={status}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, color: status === 'missing' ? 'var(--danger)' : 'var(--success)' }}>
                        {status === 'missing' ? `ناقص (${group.length})` : `✓ تم توفيره (${group.length})`}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {group
                          .sort((a, b) => {
                            const o: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                            return o[a.priority] - o[b.priority];
                          })
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
                                  {isMissing ? (
                                    <Circle size={20} color="rgba(255,255,255,0.25)" />
                                  ) : (
                                    <CheckCircle2 size={20} color="var(--success)" />
                                  )}
                                </button>
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', textDecoration: isMissing ? 'none' : 'line-through' }}>
                                    {item.name}
                                  </p>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                    {item.quantity && (
                                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.quantity}</span>
                                    )}
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                      {categoryLabels[item.category] || item.category}
                                    </span>
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
                })}
              </>
            )}
          </>
        )}

        {/* RECIPES */}
        {activeTab === 'recipes' && (
          <>
            {myRecipes.length === 0 ? (
              <EmptyState icon="👨‍🍳" title="لا توجد وصفات" description="احفظ وصفاتك المفضلة" />
            ) : (
              myRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  style={{ padding: 14, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ padding: 10, borderRadius: 14, flexShrink: 0, background: 'rgba(176,141,87,0.15)' }}>
                      <ChefHat size={20} color="var(--bronze)" strokeWidth={1.7} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {recipe.name}
                        </p>
                        {recipe.favoritedBy.includes(currentUserId) && (
                          <Heart size={14} color="#F472B6" fill="#F472B6" />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                        {recipe.mealTime.map((t) => (
                          <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)' }}>
                            {mealTimeLabels[t]}
                          </span>
                        ))}
                        {recipe.prepTime && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                            <Clock size={10} />{recipe.prepTime} دقيقة
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>
                          المكونات:
                        </p>
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                          {recipe.ingredients.join(' · ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* TODAY'S MEALS */}
        {activeTab === 'today' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
              const icons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };
              const mealValue = todayPlan?.[meal];
              return (
                <div key={meal} style={{ padding: 16, borderRadius: 20, background: 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{icons[meal]}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {mealTimeLabels[meal]}
                    </span>
                  </div>
                  {mealValue ? (
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{mealValue}</p>
                  ) : (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>لم يُحدد بعد</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* WEEK PLAN */}
        {activeTab === 'week' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {weekDays.map(({ date, dateStr, plan, dayLabel }) => {
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={dateStr}
                  style={{
                    padding: 14, borderRadius: 20,
                    background: isToday ? 'rgba(176,141,87,0.10)' : 'var(--surface-card)',
                    border: `1px solid ${isToday ? 'rgba(176,141,87,0.35)' : 'var(--border-soft)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isToday ? 'var(--bronze)' : 'var(--text-primary)' }}>
                      {dayLabel}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                    {isToday && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600, background: 'var(--bronze)', color: '#0D0F12' }}>
                        اليوم
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                      <div key={meal}>
                        <p style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: 'var(--text-muted)' }}>
                          {mealTimeLabels[meal]}
                        </p>
                        <p style={{ fontSize: 12, color: plan?.[meal] ? 'var(--text-secondary)' : 'rgba(255,255,255,0.15)' }}>
                          {plan?.[meal] || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
