import { AppShell } from '@/components/layout/AppShell';
import { FamilySwitcher } from '@/components/dashboard/FamilySwitcher';
import { DailySummary } from '@/components/dashboard/DailySummary';
import { HomeHealthScore } from '@/components/dashboard/HomeHealthScore';
import { PinnedAnnouncements } from '@/components/dashboard/PinnedAnnouncements';
import { UrgentTasks } from '@/components/dashboard/UrgentTasks';
import { PendingRequests } from '@/components/dashboard/PendingRequests';
import { QuickShortcuts } from '@/components/dashboard/QuickShortcuts';

export default function DashboardPage() {
  return (
    <AppShell>
      <FamilySwitcher />
      <div className="pb-4">
        <DailySummary />
        <HomeHealthScore />
        <PinnedAnnouncements />
        <UrgentTasks />
        <PendingRequests />
        <QuickShortcuts />
      </div>
    </AppShell>
  );
}
