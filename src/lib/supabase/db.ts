import { createClient } from './client';
import type {
  FamilyGroup, FamilyMember, Task, Request, HomeItem, Document,
  MaintenanceRecord, KitchenShortage, Recipe, MealPlan, WishItem,
  Wallet, Expense, Announcement,
} from '@/types';

// ─── Row mappers (snake_case → camelCase) ─────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMember(r: any): FamilyMember {
  return {
    id: r.id,
    familyGroupId: r.family_group_id ?? '',
    name: r.display_name,
    avatar: r.avatar_url,
    role: r.role,
    generation: r.generation ?? 2,
    permissions: {
      canManageTasks: r.can_manage_tasks ?? false,
      canManageHome: r.can_manage_home ?? false,
      canManageFinance: r.can_manage_finance ?? false,
      canInviteMembers: r.can_invite_members ?? false,
    },
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFamilyGroup(r: any, memberIds: string[]): FamilyGroup {
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji ?? '🏡',
    color: r.color ?? '#C8922A',
    members: memberIds,
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTask(r: any): Task {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    title: r.title,
    description: r.description,
    assignedTo: r.assigned_to ?? '',
    createdBy: r.created_by,
    dueDate: r.due_date,
    priority: r.priority,
    status: r.status,
    category: r.category_slug,
    isRecurring: r.is_recurring ?? false,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRequest(r: any): Request {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    title: r.title,
    description: r.description,
    type: r.type,
    from: r.from_user,
    to: r.to_user,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toShortage(r: any): KitchenShortage {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    name: r.name,
    category: r.category ?? 'other',
    quantity: r.quantity,
    priority: r.priority,
    status: r.status,
    addedBy: r.added_by ?? '',
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWishItem(r: any): WishItem {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    title: r.title,
    description: r.description,
    type: r.type,
    link: r.link,
    location: r.location,
    priority: r.priority,
    status: r.status,
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toExpense(r: any): Expense {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    walletId: r.wallet_id,
    amount: r.amount,
    category: r.category ?? '',
    date: r.date,
    addedBy: r.added_by ?? '',
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWallet(r: any): Wallet {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    name: r.name,
    monthlyBudget: r.monthly_budget ?? 0,
    spent: r.spent ?? 0,
    visibility: r.visibility ?? 'all',
    canAdd: r.can_add ?? 'all',
    canEdit: r.can_edit ?? [],
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAnnouncement(r: any): Announcement {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    title: r.title,
    message: r.message,
    publishedBy: r.published_by ?? '',
    audience: r.audience ?? 'all',
    requiresConfirmation: r.requires_confirmation ?? false,
    confirmedBy: r.confirmed_by ?? [],
    status: r.status,
    isPinned: r.is_pinned ?? false,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toHomeItem(r: any): HomeItem {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    name: r.name,
    category: r.category ?? 'other',
    location: r.location,
    purchaseDate: r.purchase_date,
    price: r.price,
    warrantyExpiry: r.warranty_expiry,
    notes: r.notes,
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDocument(r: any): Document {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    name: r.name,
    type: r.type,
    fileUrl: r.file_url,
    linkedItemId: r.linked_item_id,
    expiryDate: r.expiry_date,
    reminderDays: r.reminder_days,
    visibility: r.visibility ?? 'all',
    notes: r.notes,
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMaintenance(r: any): MaintenanceRecord {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    linkedItemId: r.linked_item_id,
    type: r.type,
    date: r.date,
    cost: r.cost,
    performedBy: r.performed_by,
    notes: r.notes,
    nextReminder: r.next_reminder,
    status: r.status ?? 'done',
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecipe(r: any): Recipe {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    name: r.name,
    ingredients: r.ingredients ?? [],
    steps: r.steps ?? [],
    prepTime: r.prep_time,
    mealTime: r.meal_time ?? [],
    favoritedBy: r.favorited_by ?? [],
    notes: r.notes,
    createdBy: r.created_by ?? '',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toMealPlan(r: any): MealPlan {
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    date: r.date,
    breakfast: r.breakfast,
    lunch: r.lunch,
    dinner: r.dinner,
    createdBy: r.created_by ?? '',
    updatedAt: r.updated_at,
  };
}

// ─── Fetch all data for a family group ────────────────────────────────────────

export interface FamilyData {
  familyGroup: FamilyGroup;
  members: FamilyMember[];
  tasks: Task[];
  requests: Request[];
  homeItems: HomeItem[];
  documents: Document[];
  maintenance: MaintenanceRecord[];
  shortages: KitchenShortage[];
  recipes: Recipe[];
  mealPlans: MealPlan[];
  wishItems: WishItem[];
  wallets: Wallet[];
  expenses: Expense[];
  announcements: Announcement[];
}

export async function fetchFamilyData(familyGroupId: string): Promise<FamilyData | null> {
  const sb = createClient();

  const [
    membersRes, tasksRes, requestsRes, homeItemsRes, docsRes,
    maintRes, shortagesRes, recipesRes, mealPlansRes, wishRes,
    walletsRes, expensesRes, announcementsRes, groupRes,
  ] = await Promise.all([
    sb.from('profiles').select('*').eq('family_group_id', familyGroupId),
    sb.from('tasks').select('*').eq('family_group_id', familyGroupId).is('deleted_at', null),
    sb.from('requests').select('*').eq('family_group_id', familyGroupId),
    sb.from('home_items').select('*').eq('family_group_id', familyGroupId),
    sb.from('documents').select('*').eq('family_group_id', familyGroupId),
    sb.from('maintenance_records').select('*').eq('family_group_id', familyGroupId),
    sb.from('kitchen_shortages').select('*').eq('family_group_id', familyGroupId),
    sb.from('recipes').select('*').eq('family_group_id', familyGroupId),
    sb.from('meal_plans').select('*').eq('family_group_id', familyGroupId),
    sb.from('wish_items').select('*').eq('family_group_id', familyGroupId),
    sb.from('wallets').select('*').eq('family_group_id', familyGroupId),
    sb.from('expenses').select('*').eq('family_group_id', familyGroupId),
    sb.from('announcements').select('*').eq('family_group_id', familyGroupId),
    sb.from('family_groups').select('*').eq('id', familyGroupId).single(),
  ]);

  if (groupRes.error || !groupRes.data) return null;

  const members = (membersRes.data ?? []).map(toMember);
  const memberIds = members.map((m) => m.id);

  return {
    familyGroup: toFamilyGroup(groupRes.data, memberIds),
    members,
    tasks: (tasksRes.data ?? []).map(toTask),
    requests: (requestsRes.data ?? []).map(toRequest),
    homeItems: (homeItemsRes.data ?? []).map(toHomeItem),
    documents: (docsRes.data ?? []).map(toDocument),
    maintenance: (maintRes.data ?? []).map(toMaintenance),
    shortages: (shortagesRes.data ?? []).map(toShortage),
    recipes: (recipesRes.data ?? []).map(toRecipe),
    mealPlans: (mealPlansRes.data ?? []).map(toMealPlan),
    wishItems: (wishRes.data ?? []).map(toWishItem),
    wallets: (walletsRes.data ?? []).map(toWallet),
    expenses: (expensesRes.data ?? []).map(toExpense),
    announcements: (announcementsRes.data ?? []).map(toAnnouncement),
  };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function dbAddTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('tasks').insert({
    family_group_id: task.familyGroupId,
    title: task.title,
    description: task.description,
    assigned_to: task.assignedTo || null,
    created_by: task.createdBy,
    due_date: task.dueDate || null,
    priority: task.priority,
    status: task.status,
    category_slug: task.category || 'other',
    is_recurring: task.isRecurring,
  }).select().single();
}

export async function dbUpdateTaskStatus(taskId: string, status: Task['status']) {
  const sb = createClient();
  return sb.from('tasks').update({ status, updated_at: new Date().toISOString() }).eq('id', taskId);
}

export async function dbAddRequest(req: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('requests').insert({
    family_group_id: req.familyGroupId,
    title: req.title,
    description: req.description,
    type: req.type,
    from_user: req.from,
    to_user: req.to,
    status: req.status,
  }).select().single();
}

export async function dbUpdateRequestStatus(reqId: string, status: Request['status']) {
  const sb = createClient();
  return sb.from('requests').update({ status }).eq('id', reqId);
}

export async function dbAddShortage(item: Omit<KitchenShortage, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('kitchen_shortages').insert({
    family_group_id: item.familyGroupId,
    name: item.name,
    category: item.category,
    quantity: item.quantity,
    priority: item.priority,
    status: item.status,
    added_by: item.addedBy || null,
    notes: item.notes,
  }).select().single();
}

export async function dbToggleShortageStatus(id: string, newStatus: 'missing' | 'provided') {
  const sb = createClient();
  return sb.from('kitchen_shortages').update({ status: newStatus }).eq('id', id);
}

export async function dbAddWishItem(item: Omit<WishItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('wish_items').insert({
    family_group_id: item.familyGroupId,
    title: item.title,
    description: item.description,
    type: item.type || 'idea',
    link: item.link,
    location: item.location,
    priority: item.priority,
    status: item.status,
    created_by: item.createdBy || null,
  }).select().single();
}

export async function dbAddExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  const { data, error } = await sb.from('expenses').insert({
    family_group_id: expense.familyGroupId,
    wallet_id: expense.walletId,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    added_by: expense.addedBy || null,
    notes: expense.notes,
  }).select().single();

  // Update wallet spent
  if (!error) {
    const { data: wallet } = await sb.from('wallets').select('spent').eq('id', expense.walletId).single();
    if (wallet) {
      await sb.from('wallets').update({ spent: wallet.spent + expense.amount }).eq('id', expense.walletId);
    }
  }
  return { data, error };
}

export async function dbConfirmAnnouncement(annId: string, userId: string) {
  const sb = createClient();
  // Atomic append — avoids lost-update if two members confirm simultaneously
  await sb.rpc('append_announcement_confirmation', { ann_id: annId, user_id: userId });
}

// ─── Family group creation/joining ───────────────────────────────────────────

export async function dbCreateFamilyGroup(userId: string, name: string, emoji: string) {
  const sb = createClient();

  const { data: group, error: groupError } = await sb
    .from('family_groups')
    .insert({ name, emoji, created_by: userId })
    .select()
    .single();

  if (groupError || !group) throw new Error(groupError?.message ?? 'فشل إنشاء البيت');

  await sb
    .from('profiles')
    .update({
      family_group_id: group.id,
      role: 'family_admin',
      can_manage_tasks: true,
      can_manage_home: true,
      can_manage_finance: true,
      can_invite_members: true,
    })
    .eq('id', userId);

  return group.id as string;
}

export async function dbJoinFamilyGroup(userId: string, inviteCode: string) {
  const sb = createClient();

  const { data: group, error } = await sb
    .from('family_groups')
    .select('id')
    .eq('invite_code', inviteCode.toUpperCase())
    .single();

  if (error || !group) throw new Error('الكود غير صحيح أو منتهي');

  await sb
    .from('profiles')
    .update({ family_group_id: group.id, role: 'adult' })
    .eq('id', userId);

  return group.id as string;
}
