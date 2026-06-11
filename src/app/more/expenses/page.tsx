'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { MemberAvatar } from '@/components/shared/MemberAvatar';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { formatArabicDate, formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const { wallets, expenses, members, currentFamilyGroupId } = useAppStore(
    useShallow((s) => ({ wallets: s.wallets, expenses: s.expenses, members: s.members, currentFamilyGroupId: s.currentFamilyGroupId }))
  );
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
          <Link href="/more" style={{ padding: 8, display: 'block' }}>
            <ChevronRight size={20} color="var(--text-muted)" />
          </Link>
        }
      />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Monthly hero */}
        <div
          style={{
            padding: 20, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(201,122,102,0.30) 0%, rgba(201,122,102,0.14) 60%, rgba(28,32,39,0.80) 100%)',
            border: '1px solid rgba(201,122,102,0.30)',
          }}
        >
          <p style={{ fontSize: 13, color: 'rgba(245,242,234,0.70)', marginBottom: 4 }}>إجمالي الشهر</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
            {formatCurrency(totalSpent)}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(245,242,234,0.60)', marginTop: 4 }}>
            من {formatCurrency(totalBudget)}
          </p>
          <div style={{ marginTop: 16, height: 6, borderRadius: 6, background: 'rgba(15,27,51,0.10)' }}>
            <div
              style={{
                height: 6, borderRadius: 6, transition: 'width 0.4s ease',
                width: `${Math.min(totalPct, 100)}%`,
                background: totalPct > 90 ? 'var(--danger)' : 'var(--accent-strong)',
              }}
            />
          </div>
          <p style={{ fontSize: 12, color: 'rgba(245,242,234,0.60)', marginTop: 6 }}>{totalPct}% من الميزانية</p>
        </div>

        {/* Wallets */}
        {myWallets.length > 0 && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>المحافظ</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myWallets.map((wallet) => {
                const pct = wallet.monthlyBudget > 0
                  ? Math.round((wallet.spent / wallet.monthlyBudget) * 100)
                  : 0;
                const remaining = wallet.monthlyBudget - wallet.spent;
                const isOver = remaining < 0;
                return (
                  <div
                    key={wallet.id}
                    style={{
                      padding: 14, borderRadius: 20,
                      background: 'var(--surface-card)',
                      border: `1px solid ${isOver ? 'rgba(249,112,102,0.30)' : 'var(--border-soft)'}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {wallet.name}
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: isOver ? 'var(--danger)' : 'var(--success)' }}>
                        {isOver ? 'تجاوز' : 'متبقي'} {formatCurrency(Math.abs(remaining))}
                      </p>
                    </div>
                    <div style={{ height: 5, borderRadius: 5, marginBottom: 8, background: 'rgba(15,27,51,0.06)' }}>
                      <div
                        style={{
                          height: 5, borderRadius: 5, transition: 'width 0.4s ease',
                          width: `${Math.min(pct, 100)}%`,
                          background: pct > 90 ? 'var(--danger)' : pct > 70 ? 'var(--warning)' : 'var(--success)',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{formatCurrency(wallet.spent)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>من {formatCurrency(wallet.monthlyBudget)} ({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent transactions */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: 'var(--text-primary)' }}>آخر المعاملات</p>
          {myExpenses.length === 0 ? (
            <EmptyState icon="💳" title="لا توجد معاملات" description="أضف أول مصروف" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myExpenses.slice(0, 20).map((exp) => {
                const wallet = myWallets.find((w) => w.id === exp.walletId);
                const addedBy = members.find((m) => m.id === exp.addedBy);
                return (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: 14, borderRadius: 20,
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-soft)',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {exp.category}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        {wallet && (
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(15,27,51,0.06)', color: 'var(--text-muted)' }}>
                            {wallet.name}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {formatArabicDate(exp.date)}
                        </span>
                        {addedBy && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            · {addedBy.name}
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <p style={{ fontSize: 11, marginTop: 4, color: 'var(--text-muted)' }}>{exp.notes}</p>
                      )}
                    </div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--danger)', flexShrink: 0 }}>
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
