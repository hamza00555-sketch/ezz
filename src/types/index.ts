export type Role = 'family_admin' | 'guardian' | 'adult' | 'teen' | 'child' | 'guest';

export type TaskStatus =
  | 'new'
  | 'pending_acceptance'
  | 'accepted'
  | 'in_progress'
  | 'done'
  | 'rejected'
  | 'postponed'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestType = 'purchase' | 'help' | 'errand' | 'maintenance' | 'follow_up' | 'other';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'converted';

export type WishStatus = 'idea' | 'studying' | 'approved' | 'done' | 'postponed' | 'cancelled';

export type DocumentType = 'contract' | 'warranty' | 'invoice' | 'insurance' | 'form' | 'other';

export type MaintenanceStatus = 'scheduled' | 'done';

export type ShortageStatus = 'missing' | 'provided';
export type ShortagePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'occasion';

export type AnnouncementStatus = 'active' | 'expired';

export interface FamilyMember {
  id: string;
  familyGroupId: string;
  name: string;
  avatar?: string;
  role: Role;
  generation: number; // 1=grandparents, 2=parents, 3=children
  phone?: string;
  permissions: {
    canManageTasks: boolean;
    canManageHome: boolean;
    canManageFinance: boolean;
    canInviteMembers: boolean;
    canManageKitchen: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  emoji: string;
  color: string;
  members: string[]; // member IDs
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  familyGroupId: string;
  title: string;
  description?: string;
  assignedTo: string; // member ID
  createdBy: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  category?: string;
  attachments?: string[];
  isRecurring: boolean;
  recurrence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  familyGroupId: string;
  title: string;
  description?: string;
  type: RequestType;
  from: string; // member ID
  to: string; // member ID
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HomeItem {
  id: string;
  familyGroupId: string;
  name: string;
  category: string;
  location?: string;
  imageUrl?: string;
  purchaseDate?: string;
  price?: number;
  warrantyExpiry?: string;
  notes?: string;
  maintenanceLog?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  familyGroupId: string;
  name: string;
  type: DocumentType;
  fileUrl?: string;
  linkedItemId?: string;
  expiryDate?: string;
  reminderDays?: number;
  visibility: 'all' | string[]; // 'all' or array of member IDs
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  familyGroupId: string;
  linkedItemId?: string;
  type: string;
  date: string;
  cost?: number;
  performedBy?: string;
  notes?: string;
  nextReminder?: string;
  status: MaintenanceStatus;
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface KitchenShortage {
  id: string;
  familyGroupId: string;
  name: string;
  category: string;
  quantity?: string;
  priority: ShortagePriority;
  status: ShortageStatus;
  addedBy: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Recipe {
  id: string;
  familyGroupId: string;
  name: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
  prepTime?: number; // minutes
  mealTime: MealTime[];
  favoritedBy: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealPlan {
  id: string;
  familyGroupId: string;
  date: string; // ISO date
  breakfast?: string; // recipe name or free text
  lunch?: string;
  dinner?: string;
  createdBy: string;
  updatedAt: string;
}

export interface WishItem {
  id: string;
  familyGroupId: string;
  title: string;
  description?: string;
  type: 'idea' | 'need' | 'link' | 'fix';
  link?: string;
  imageUrl?: string;
  location?: string;
  priority: TaskPriority;
  status: WishStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  familyGroupId: string;
  walletId: string;
  amount: number;
  category: string;
  date: string;
  addedBy: string;
  notes?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  id: string;
  familyGroupId: string;
  name: string;
  monthlyBudget: number;
  spent: number;
  visibility: 'all' | string[];
  canAdd: 'all' | string[];
  canEdit: 'all' | string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  familyGroupId: string;
  title: string;
  message: string;
  publishedBy: string;
  audience: 'all' | string[];
  expiresAt?: string;
  requiresConfirmation: boolean;
  confirmedBy: string[];
  status: AnnouncementStatus;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  familyGroupId: string;
  title: string;
  date: string;
  time?: string;
  type: 'task' | 'appointment' | 'occasion' | 'warranty' | 'maintenance' | 'document';
  linkedId?: string;
  color: string;
  createdBy: string;
  createdAt: string;
}
