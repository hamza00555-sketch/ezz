import { AppShell } from '@/components/layout/AppShell';
import { FamilySwitcher } from '@/components/dashboard/FamilySwitcher';
import { EzzWelcomeCard } from '@/components/dashboard/EzzWelcomeCard';
import { HomeHealthScore } from '@/components/dashboard/HomeHealthScore';
import { DailySummary } from '@/components/dashboard/DailySummary';
import { UrgentTasks } from '@/components/dashboard/UrgentTasks';
import { PendingRequests } from '@/components/dashboard/PendingRequests';
import { PinnedAnnouncements } from '@/components/dashboard/PinnedAnnouncements';
import { QuickShortcuts } from '@/components/dashboard/QuickShortcuts';

export default function DashboardPage() {
  return (
    <AppShell>
      <FamilySwitcher />
      <EzzWelcomeCard />
      <HomeHealthScore />
      <DailySummary />
      <UrgentTasks />
      <PendingRequests />
      <PinnedAnnouncements />
      <QuickShortcuts />
    </AppShell>
  );
}
