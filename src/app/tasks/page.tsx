'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { TaskCard } from '@/components/tasks/TaskCard';
import { RequestCard } from '@/components/tasks/RequestCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';

type TaskFilter = 'waiting' | 'urgent' | 'requests' | 'all' | 'done';

const filterLabels: { key: TaskFilter; label: string }[] = [
  { key: 'waiting',  label: 'بانتظاري' },
  { key: 'urgent',   label: 'عاجل'      },
  { key: 'requests', label: 'الطلبات'   },
  { key: 'all',      label: 'الكل'      },
  { key: 'done',     label: 'منجز'      },
];

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TaskFilter>('waiting');

  const {
    tasks, requests,
    currentUserId, currentFamilyGroupId,
    setActiveQuickForm,
  } = useAppStore();

  const familyTasks = tasks.filter(
    (t) => t.familyGroupId === currentFamilyGroupId && t.status !== 'cancelled',
  );

  const waitingTasks  = familyTasks.filter(
    (t) => t.assignedTo === currentUserId && !['done', 'cancelled'].includes(t.status),
  );
  const urgentTasks   = familyTasks.filter(
    (t) => !['done', 'cancelled'].includes(t.status) && (t.priority === 'urgent' || t.priority === 'high'),
  );
  const doneTasks     = familyTasks.filter((t) => t.status === 'done');
  const allActive     = familyTasks.filter((t) => t.status !== 'done');

  const myRequests        = requests.filter(
    (r) => r.familyGroupId === currentFamilyGroupId && (r.to === currentUserId || r.from === currentUserId),
  );
  const pendingIncoming   = requests.filter(
    (r) => r.familyGroupId === currentFamilyGroupId && r.to === currentUserId && r.status === 'pending',
  );

  const counts: Record<TaskFilter, number> = {
    waiting:  waitingTasks.length,
    urgent:   urgentTasks.length,
    requests: pendingIncoming.length,
    all:      allActive.length,
    done:     doneTasks.length,
  };

  const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
  const sortByPriority = (a: typeof tasks[0], b: typeof tasks[0]) =>
    (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);

  const taskList = (() => {
    switch (activeTab) {
      case 'waiting':  return [...waitingTasks].sort(sortByPriority);
      case 'urgent':   return [...urgentTasks].sort(sortByPriority);
      case 'done':     return [...doneTasks].sort(sortByPriority);
      default:         return [...allActive].sort(sortByPriority);
    }
  })();

  const emptyMessages: Record<TaskFilter, { icon: string; title: string; desc: string }> = {
    waiting:  { icon: '✅', title: 'البيت مرتب اليوم 👌',       desc: 'ما في مهام معلقة عليك'       },
    urgent:   { icon: '⚡', title: 'ما في شيء عاجل',             desc: 'كل المهام في حالة جيدة'       },
    requests: { icon: '📨', title: 'لا توجد طلبات',              desc: 'أرسل طلباً لأحد أفراد العائلة' },
    all:      { icon: '📋', title: 'لا توجد مهام',               desc: 'أضف أول مهمة للعائلة'         },
    done:     { icon: '🎯', title: 'لا توجد مهام منجزة بعد',     desc: 'أنهِ مهمة لتظهر هنا'          },
  };

  return (
    <AppShell>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'sticky', top: 0, zIndex: 20,
          padding: '16px 16px 0',
          background: 'var(--bg-app)',
          borderBottom: '1px solid var(--border-soft)',
        }}
      >
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              المهام
            </h1>
            <p style={{ fontSize: 12, marginTop: 3, color: 'var(--text-muted)' }}>
              كل ما يحتاجه البيت في مكان واحد
            </p>
          </div>
          <button
            onClick={() => setActiveQuickForm('task')}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 14px', borderRadius: 14, marginTop: 2,
              background: 'rgba(163,177,138,0.18)',
              border: '1px solid rgba(163,177,138,0.32)',
              color: 'var(--accent-strong)',
              fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            className="active:scale-[0.96]"
          >
            <Plus size={14} strokeWidth={2.5} />
            مهمة جديدة
          </button>
        </div>

        {/* Filter pills */}
        <div
          style={{
            display: 'flex', gap: 8,
            overflowX: 'auto', paddingBottom: 12,
            scrollbarWidth: 'none',
          }}
        >
          {filterLabels.map(({ key, label }) => {
            const isActive = activeTab === key;
            const count = counts[key];
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 20, whiteSpace: 'nowrap',
                  minHeight: 34,
                  background: isActive ? 'rgba(163,177,138,0.18)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isActive ? 'rgba(163,177,138,0.35)' : 'rgba(255,255,255,0.08)'}`,
                  color: isActive ? 'var(--accent-strong)' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.16s ease',
                  flexShrink: 0,
                }}
              >
                {label}
                {count > 0 && (
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700,
                      padding: '1px 7px', borderRadius: 10,
                      background: isActive ? 'rgba(163,177,138,0.28)' : 'rgba(255,255,255,0.10)',
                      color: isActive ? 'var(--accent-strong)' : 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Requests tab */}
        {activeTab === 'requests' && (
          myRequests.length === 0 ? (
            <EmptyState icon="📨" title="لا توجد طلبات" description="أرسل طلباً لأحد أفراد العائلة" />
          ) : (
            <>
              {pendingIncoming.length > 0 && (
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--warning)', letterSpacing: '0.05em', marginBottom: 4 }}>
                  بانتظار ردك ({pendingIncoming.length})
                </p>
              )}
              {myRequests.map((req) => (
                <RequestCard key={req.id} request={req} currentUserId={currentUserId} />
              ))}
            </>
          )
        )}

        {/* All other task filters */}
        {activeTab !== 'requests' && (
          taskList.length === 0 ? (
            <EmptyState
              icon={emptyMessages[activeTab].icon}
              title={emptyMessages[activeTab].title}
              description={emptyMessages[activeTab].desc}
            />
          ) : (
            taskList.map((task) => (
              <TaskCard key={task.id} task={task} showAssignee={activeTab !== 'waiting'} />
            ))
          )
        )}
      </div>
    </AppShell>
  );
}
