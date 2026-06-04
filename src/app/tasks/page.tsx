'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { Tabs } from '@/components/shared/Tabs';
import { TaskCard } from '@/components/tasks/TaskCard';
import { RequestCard } from '@/components/tasks/RequestCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAppStore } from '@/store/appStore';

type TaskFilter = 'mine' | 'requests' | 'all';

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState<TaskFilter>('mine');
  const { tasks, requests, currentUserId, currentFamilyGroupId } = useAppStore();

  const myTasks = tasks.filter(
    (t) =>
      t.familyGroupId === currentFamilyGroupId &&
      t.assignedTo === currentUserId &&
      t.status !== 'cancelled'
  );

  const allTasks = tasks.filter(
    (t) => t.familyGroupId === currentFamilyGroupId && t.status !== 'cancelled'
  );

  const myRequests = requests.filter(
    (r) =>
      r.familyGroupId === currentFamilyGroupId &&
      (r.to === currentUserId || r.from === currentUserId)
  );

  const pendingRequestsCount = requests.filter(
    (r) =>
      r.familyGroupId === currentFamilyGroupId &&
      r.to === currentUserId &&
      r.status === 'pending'
  ).length;

  const tabs = [
    { key: 'mine', label: 'مهامي', count: myTasks.filter((t) => t.status !== 'done').length },
    { key: 'requests', label: 'الطلبات', count: pendingRequestsCount },
    { key: 'all', label: 'الكل', count: allTasks.length },
  ];

  const renderContent = () => {
    if (activeTab === 'mine') {
      if (myTasks.length === 0)
        return <EmptyState icon="✅" title="لا توجد مهام" description="أضف مهمة جديدة بزر +" />;
      return (
        <div className="flex flex-col gap-2 p-4">
          {myTasks
            .sort((a, b) => {
              const order = { urgent: 0, high: 1, medium: 2, low: 3 };
              return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
            })
            .map((task) => (
              <TaskCard key={task.id} task={task} showAssignee={false} />
            ))}
        </div>
      );
    }

    if (activeTab === 'requests') {
      if (myRequests.length === 0)
        return <EmptyState icon="📨" title="لا توجد طلبات" description="أرسل طلباً لأحد أفراد العائلة" />;
      return (
        <div className="flex flex-col gap-2 p-4">
          {myRequests.map((req) => (
            <RequestCard key={req.id} request={req} currentUserId={currentUserId} />
          ))}
        </div>
      );
    }

    if (activeTab === 'all') {
      if (allTasks.length === 0)
        return <EmptyState icon="📋" title="لا توجد مهام" description="أضف أول مهمة للعائلة" />;
      return (
        <div className="flex flex-col gap-2 p-4">
          {allTasks
            .sort((a, b) => {
              const order = { urgent: 0, high: 1, medium: 2, low: 3 };
              return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
            })
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      );
    }
  };

  return (
    <AppShell>
      <PageHeader title="المهام" />
      <Tabs tabs={tabs} active={activeTab} onChange={(k) => setActiveTab(k as TaskFilter)} />
      {renderContent()}
    </AppShell>
  );
}
