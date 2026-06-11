'use client';

import Link from 'next/link';
import { ArrowLeft, Zap, Clock, MessageSquare } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useShallow } from 'zustand/react/shallow';
import { isOverdue } from '@/lib/utils';

export function HomeHealthScore() {
  const { tasks, requests, currentUserId, currentFamilyGroupId } = useAppStore(
    useShallow((s) => ({
      tasks: s.tasks,
      requests: s.requests,
      currentUserId: s.currentUserId,
      currentFamilyGroupId: s.currentFamilyGroupId,
    }))
  );

  const allTasks = tasks.filter(
    (t) => t.familyGroupId === currentFamilyGroupId && t.status !== 'cancelled'
  );
  const done  = allTasks.filter((t) => t.status === 'done').length;
  const total = allTasks.length;
  const pct   = total === 0 ? 100 : Math.round((done / total) * 100);

  const urgentCount = allTasks.filter(
    (t) => !['done', 'cancelled'].includes(t.status) &&
      (t.priority === 'urgent' || t.priority === 'high' || isOverdue(t.dueDate))
  ).length;

  const pendingReqs = requests.filter(
    (r) => r.familyGroupId === currentFamilyGroupId && r.to === currentUserId && r.status === 'pending'
  ).length;

  const nextTask = allTasks
    .filter((t) => !['done', 'cancelled'].includes(t.status))
    .sort((a, b) => {
      const o: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
      return (o[a.priority] ?? 4) - (o[b.priority] ?? 4);
    })[0];

  const radius = 42;
  const circ   = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const ringColor = pct >= 70 ? 'var(--accent-strong)' : pct >= 40 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div
      className="hero-card mx-4 mb-6"
      style={{ padding: '24px 20px 20px', overflow: 'hidden', position: 'relative' }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,122,102,0.10), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Title */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 500, letterSpacing: '0.04em' }}>
        حالة البيت اليوم
      </p>

      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: 84, height: 84, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(15,27,51,0.10)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{pct}%</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
            {done}
            <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-muted)' }}> / {total} مهمة</span>
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {urgentCount > 0 && (
              <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Zap size={10} /> {urgentCount} عاجلة
              </span>
            )}
            {pendingReqs > 0 && (
              <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MessageSquare size={10} /> {pendingReqs} طلب
              </span>
            )}
            {urgentCount === 0 && pendingReqs === 0 && (
              <span className="badge badge-success">البيت مرتب 👌</span>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      {nextTask ? (
        <Link
          href="/tasks"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 16,
            background: 'rgba(201,122,102,0.10)',
            border: '1px solid rgba(201,122,102,0.20)',
            textDecoration: 'none',
            transition: 'background 0.15s ease',
          }}
          className="active:opacity-80"
        >
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>ابدأ بأهم مهمة</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextTask.title}
            </p>
          </div>
          <ArrowLeft size={16} color="var(--accent)" style={{ flexShrink: 0, marginRight: 8 }} />
        </Link>
      ) : (
        <div
          style={{
            padding: '12px 14px', borderRadius: 16,
            background: 'var(--success-soft)',
            border: '1px solid rgba(114,191,163,0.25)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>
            كل المهام مكتملة 🎉
          </p>
        </div>
      )}
    </div>
  );
}
