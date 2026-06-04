'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { formatArabicDate, formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const { wallets, expenses, members, currentFamilyGroupId, currentUserId } = useAppStore();
  const myWallets = wallets.filter((w) => w.familyGroupId === currentFamilyGroupId);
  const myExpenses = expenses
    .filter((e) => e.familyGroupId === currentFamilyGroupId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalBudget = myWallets.reduce((s, w) => s + w.monthlyBudget, 0);
  const totalSpent = myWallets.reduce((s, w) => s + w.spent, 0);
  const totalPct = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <AppShell>
      <PageHeader
        title="المصاريف"
        action={
          <Link href="/more" className="p-2">
            <ChevronRight size={20} color="#78716C" />
          </Link>
        }
      />

      <div className="p-4 flex flex-col gap-4">
        {/* Monthly summary */}
        <div
          className="p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #C8922A, #A37520)' }}
        >
          <p className="text-white/80 text-sm mb-1">إجمالي الشهر</p>
          <p className="text-white text-3xl font-black">{formatCurrency(totalSpent)}</p>
          <p className="text-white/70 text-sm">من {formatCurrency(totalBudget)}</p>
          <div className="mt-3 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.3)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(totalPct, 100)}%`,
                background: totalPct > 90 ? '#FCA5A5' : '#FFFFFF',
              }}
            />
          </div>
          <p className="text-white/70 text-xs mt-1">{totalPct}% من الميزانية</p>
        </div>

        {/* Wallets */}
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>المحافظ</p>
          <div className="grid grid-cols-1 gap-2">
            {myWallets.map((wallet) => {
              const pct = wallet.monthlyBudget > 0
                ? Math.round((wallet.spent / wallet.monthlyBudget) * 100)
                : 0;
              const remaining = wallet.monthlyBudget - wallet.spent;
              const isOver = remaining < 0;
              return (
                <div
                  key={wallet.id}
                  className="p-3.5 rounded-2xl"
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${isOver ? '#FECACA' : 'var(--border)'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: '#1C1917' }}>
                      {wallet.name}
                    </p>
                    <p
                      className="text-xs font-bold"
                      style={{ color: isOver ? '#DC2626' : '#16A34A' }}
                    >
                      {isOver ? 'تجاوز' : 'متبقي'} {formatCurrency(Math.abs(remaining))}
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full mb-1.5" style={{ background: '#F5F5F4' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${Math.min(pct, 100)}%`,
                        background: pct > 90 ? '#DC2626' : pct > 70 ? '#D97706' : '#16A34A',
                      }}
                    />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs" style={{ color: '#78716C' }}>
                      {formatCurrency(wallet.spent)}
                    </span>
                    <span className="text-xs" style={{ color: '#A8A29E' }}>
                      من {formatCurrency(wallet.monthlyBudget)} ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: '#1C1917' }}>آخر المعاملات</p>
          {myExpenses.length === 0 ? (
            <EmptyState icon="💳" title="لا توجد معاملات" description="أضف أول مصروف" />
          ) : (
            <div className="flex flex-col gap-2">
              {myExpenses.slice(0, 20).map((exp) => {
                const wallet = myWallets.find((w) => w.id === exp.walletId);
                const addedBy = members.find((m) => m.id === exp.addedBy);
                return (
                  <div
                    key={exp.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl"
                    style={{ background: '#FFFFFF', border: '1px solid var(--border)' }}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm" style={{ color: '#1C1917' }}>
                        {exp.category}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {wallet && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5F5F4', color: '#78716C' }}>
                            {wallet.name}
                          </span>
                        )}
                        <span className="text-xs" style={{ color: '#A8A29E' }}>
                          {formatArabicDate(exp.date)}
                        </span>
                        {addedBy && (
                          <span className="text-xs" style={{ color: '#A8A29E' }}>
                            · {addedBy.name}
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
                          {exp.notes}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-base" style={{ color: '#DC2626' }}>
                      -{exp.amount.toLocaleString('ar-SA')}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
