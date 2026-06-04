'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';
import { cn, categoryLabels } from '@/lib/utils';
import { Clock, Heart, ChefHat, CheckCircle2, Circle } from 'lucide-react';
import type { ShortagePriority } from '@/types';

type KitchenTab = 'shortages' | 'recipes' | 'today' | 'week';

const shortagePriorityColors: Record<ShortagePriority, { bg: string; text: string }> = {
  urgent: { bg: '#FEF2F2', text: '#DC2626' },
  high: { bg: '#FFF7ED', text: '#C8922A' },
  medium: { bg: '#FFFBEB', text: '#D97706' },
  low: { bg: '#F5F5F4', text: '#78716C' },
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

  // Build week plan rows
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

      <div className="p-4 flex flex-col gap-3">
        {/* SHORTAGES */}
        {activeTab === 'shortages' && (
          <>
            {myShortages.length === 0 ? (
              <EmptyState icon="🛒" title="لا توجد نواقص" description="سجّل ما ينقصك من المطبخ" />
            ) : (
              <>
                {/* Group by status */}
                {['missing', 'provided'].map((status) => {
                  const group = myShortages.filter((s) => s.status === status);
                  if (group.length === 0) return null;
                  return (
                    <div key={status}>
                      <p
                        className="text-xs font-semibold uppercase tracking-wide mb-2"
                        style={{ color: status === 'missing' ? '#DC2626' : '#16A34A' }}
                      >
                        {status === 'missing' ? `ناقص (${group.length})` : `✓ تم توفيره (${group.length})`}
                      </p>
                      <div className="flex flex-col gap-2">
                        {group
                          .sort((a, b) => {
                            const o = { urgent: 0, high: 1, medium: 2, low: 3 };
                            return o[a.priority] - o[b.priority];
                          })
                          .map((item) => {
                            const pColor = shortagePriorityColors[item.priority];
                            const isMissing = item.status === 'missing';
                            return (
                              <div
                                key={item.id}
                                className={cn(
                                  'flex items-center gap-3 p-3 rounded-2xl',
                                  !isMissing && 'opacity-60'
                                )}
                                style={{
                                  background: isMissing ? '#FFFFFF' : '#F9FAFB',
                                  border: '1px solid var(--border)',
                                }}
                              >
                                <button
                                  onClick={() => toggleShortageStatus(item.id)}
                                  className="flex-shrink-0"
                                >
                                  {isMissing ? (
                                    <Circle size={20} color="#D6D3D1" />
                                  ) : (
                                    <CheckCircle2 size={20} color="#16A34A" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p
                                    className={cn('text-sm font-medium', !isMissing && 'line-through')}
                                    style={{ color: '#1C1917' }}
                                  >
                                    {item.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {item.quantity && (
                                      <span className="text-xs" style={{ color: '#78716C' }}>
                                        {item.quantity}
                                      </span>
                                    )}
                                    <span className="text-xs" style={{ color: '#78716C' }}>
                                      {categoryLabels[item.category] || item.category}
                                    </span>
                                  </div>
                                </div>
                                {isMissing && (
                                  <span
                                    className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                                    style={{ background: pColor.bg, color: pColor.text }}
                                  >
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
                  className="p-3.5 rounded-2xl"
                  style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: '#FFF7ED' }}>
                      <ChefHat size={20} color="#C8922A" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                          {recipe.name}
                        </p>
                        {recipe.favoritedBy.includes(currentUserId) && (
                          <Heart size={14} color="#DB2777" fill="#DB2777" />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {recipe.mealTime.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ background: '#F5F5F4', color: '#78716C' }}
                          >
                            {mealTimeLabels[t]}
                          </span>
                        ))}
                        {recipe.prepTime && (
                          <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                            <Clock size={10} />{recipe.prepTime} دقيقة
                          </span>
                        )}
                      </div>
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1" style={{ color: '#57534E' }}>
                          المكونات:
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: '#78716C' }}>
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
          <div>
            {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => {
              const icons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' };
              const mealValue = todayPlan?.[meal];
              return (
                <div
                  key={meal}
                  className="mb-3 p-4 rounded-2xl"
                  style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{icons[meal]}</span>
                    <span className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                      {mealTimeLabels[meal]}
                    </span>
                  </div>
                  {mealValue ? (
                    <p className="text-sm" style={{ color: '#57534E' }}>
                      {mealValue}
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: '#A8A29E' }}>
                      لم يُحدد بعد
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* WEEK PLAN */}
        {activeTab === 'week' && (
          <div className="flex flex-col gap-2">
            {weekDays.map(({ date, dateStr, plan, dayLabel }) => {
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              return (
                <div
                  key={dateStr}
                  className="p-3.5 rounded-2xl"
                  style={{
                    background: isToday ? '#FFF7ED' : '#FFFFFF',
                    border: `1px solid ${isToday ? '#FED7AA' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="font-bold text-sm"
                      style={{ color: isToday ? '#C8922A' : '#1C1917' }}
                    >
                      {dayLabel}
                    </span>
                    <span className="text-xs" style={{ color: '#78716C' }}>
                      {date.getDate()}/{date.getMonth() + 1}
                    </span>
                    {isToday && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#C8922A', color: '#FFFFFF' }}
                      >
                        اليوم
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                      <div key={meal}>
                        <p className="text-[10px] font-medium mb-1" style={{ color: '#A8A29E' }}>
                          {mealTimeLabels[meal]}
                        </p>
                        <p className="text-xs" style={{ color: plan?.[meal] ? '#57534E' : '#D6D3D1' }}>
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
