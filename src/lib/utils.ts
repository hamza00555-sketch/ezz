import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, isToday, isTomorrow, isPast, format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { TaskStatus, TaskPriority, Role, WishStatus, ShortageStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArabicDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'اليوم';
  if (isTomorrow(date)) return 'غداً';
  return format(date, 'dd MMM', { locale: ar });
}

export function formatRelativeArabic(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ar });
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return isPast(new Date(dateStr)) && !isToday(new Date(dateStr));
}

export function isDueSoon(dateStr?: string): boolean {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const twoDaysFromNow = new Date(Date.now() + 172800000);
  return date <= twoDaysFromNow && !isPast(date);
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  new: 'جديدة',
  pending_acceptance: 'بانتظار القبول',
  accepted: 'مقبولة',
  in_progress: 'قيد التنفيذ',
  done: 'مكتملة',
  rejected: 'مرفوضة',
  postponed: 'مؤجلة',
  cancelled: 'ملغية',
};

export const taskStatusColors: Record<TaskStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  pending_acceptance: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-orange-100 text-orange-700',
  done: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  postponed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export const priorityLabels: Record<TaskPriority, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
  urgent: 'عاجلة',
};

export const priorityColors: Record<TaskPriority, string> = {
  low: 'text-slate-500',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

export const roleLabels: Record<Role, string> = {
  family_admin: 'مدير العائلة',
  guardian: 'ولي أمر',
  adult: 'بالغ',
  teen: 'مراهق',
  child: 'طفل',
  guest: 'ضيف',
};

export const roleColors: Record<Role, string> = {
  family_admin: 'bg-amber-100 text-amber-800',
  guardian: 'bg-blue-100 text-blue-800',
  adult: 'bg-green-100 text-green-800',
  teen: 'bg-purple-100 text-purple-800',
  child: 'bg-pink-100 text-pink-800',
  guest: 'bg-gray-100 text-gray-600',
};

export const wishStatusLabels: Record<WishStatus, string> = {
  idea: 'فكرة',
  studying: 'قيد الدراسة',
  approved: 'معتمدة',
  done: 'تم التنفيذ',
  postponed: 'مؤجلة',
  cancelled: 'ملغية',
};

export const wishStatusColors: Record<WishStatus, string> = {
  idea: 'bg-slate-100 text-slate-700',
  studying: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  postponed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

export const categoryLabels: Record<string, string> = {
  cleaning: 'تنظيف',
  shopping: 'تسوق',
  bills: 'فواتير',
  maintenance: 'صيانة',
  cooking: 'طبخ',
  childcare: 'رعاية أطفال',
  documents: 'وثائق',
  other: 'أخرى',
  appliances: 'أجهزة',
  vehicles: 'سيارات',
  furniture: 'أثاث',
  tools: 'أدوات',
  grains: 'حبوب ودقيق',
  dairy: 'ألبان وأجبان',
  protein: 'بروتين',
  oils: 'زيوت وتوابل',
  vegetables: 'خضروات وفواكه',
  cleaning_supplies: 'مواد تنظيف',
};

export function getMemberAvatar(name: string): string {
  return name.charAt(0);
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ar-SA')} ريال`;
}
