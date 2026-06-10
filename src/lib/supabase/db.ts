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
      canManageKitchen: r.can_manage_kitchen ?? false,
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
    inviteCode: r.invite_code,
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
    imageUrl: r.image_url,
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
    imageUrl: r.image_url,
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
  const toArr = (v: unknown): string[] => {
    if (Array.isArray(v)) return v as string[];
    if (typeof v === 'string' && v.startsWith('[')) {
      try { const p = JSON.parse(v); if (Array.isArray(p)) return p; } catch { /* fall through */ }
    }
    return v ? [v as string] : [];
  };
  return {
    id: r.id,
    familyGroupId: r.family_group_id,
    date: r.date,
    breakfast: toArr(r.breakfast),
    lunch:     toArr(r.lunch),
    dinner:    toArr(r.dinner),
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

export async function dbAddHomeItem(item: Omit<HomeItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('home_items').insert({
    family_group_id: item.familyGroupId,
    name: item.name,
    category: item.category,
    location: item.location,
    image_url: item.imageUrl,
    purchase_date: item.purchaseDate,
    price: item.price,
    warranty_expiry: item.warrantyExpiry,
    notes: item.notes,
    created_by: item.createdBy || null,
  }).select().single();
}

export async function dbAddDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('documents').insert({
    family_group_id: document.familyGroupId,
    name: document.name,
    type: document.type,
    file_url: document.fileUrl,
    linked_item_id: document.linkedItemId,
    expiry_date: document.expiryDate,
    reminder_days: document.reminderDays,
    visibility: document.visibility,
    notes: document.notes,
    created_by: document.createdBy || null,
  }).select().single();
}

export async function dbAddRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('recipes').insert({
    family_group_id: recipe.familyGroupId,
    name: recipe.name,
    image_url: recipe.imageUrl,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    prep_time: recipe.prepTime,
    meal_time: recipe.mealTime,
    favorited_by: recipe.favoritedBy,
    notes: recipe.notes,
    created_by: recipe.createdBy || null,
  }).select().single();
}

export async function dbUpdateRecipe(
  id: string,
  data: Omit<Partial<Recipe>, 'id' | 'familyGroupId' | 'createdBy' | 'createdAt'>,
) {
  const sb = createClient();
  // Only send columns that are present in `data` to avoid clobbering with undefined.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patch: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.name !== undefined) patch.name = data.name;
  if (data.imageUrl !== undefined) patch.image_url = data.imageUrl;
  if (data.ingredients !== undefined) patch.ingredients = data.ingredients;
  if (data.steps !== undefined) patch.steps = data.steps;
  if (data.prepTime !== undefined) patch.prep_time = data.prepTime;
  if (data.mealTime !== undefined) patch.meal_time = data.mealTime;
  if (data.favoritedBy !== undefined) patch.favorited_by = data.favoritedBy;
  if (data.notes !== undefined) patch.notes = data.notes;
  return sb.from('recipes').update(patch).eq('id', id);
}

export async function dbAddAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) {
  const sb = createClient();
  return sb.from('announcements').insert({
    family_group_id: announcement.familyGroupId,
    title: announcement.title,
    message: announcement.message,
    published_by: announcement.publishedBy || null,
    audience: announcement.audience,
    requires_confirmation: announcement.requiresConfirmation,
    confirmed_by: announcement.confirmedBy,
    status: announcement.status,
    is_pinned: announcement.isPinned,
  }).select().single();
}

export async function uploadRecipeImage(file: File, familyGroupId: string) {
  const sb = createClient();
  // Derive extension from MIME type (canvas-compressed blobs have no filename ext)
  const mimeExt: Record<string, string> = {
    'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/jpg': 'jpg',
    'image/png': 'png', 'image/gif': 'gif', 'image/avif': 'avif',
  };
  const extension =
    mimeExt[file.type] || file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${familyGroupId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await sb.storage.from('recipe-images').upload(path, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  return sb.storage.from('recipe-images').getPublicUrl(path).data.publicUrl;
}

/** Best-effort delete of a recipe image given its public URL (cleanup on failed save). */
export async function deleteRecipeImage(publicUrl: string): Promise<void> {
  if (!publicUrl) return;
  const marker = '/recipe-images/';
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return; // not a Storage URL — nothing to clean up
  const path = publicUrl.slice(idx + marker.length).split('?')[0];
  if (!path) return;
  const sb = createClient();
  await sb.storage.from('recipe-images').remove([path]);
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

  // Atomically increment wallet.spent via RPC to avoid race conditions
  if (!error) {
    const { error: rpcError } = await sb.rpc('increment_wallet_spent', {
      p_wallet_id: expense.walletId,
      p_amount: expense.amount,
    });
    if (rpcError) console.error('[dbAddExpense] wallet increment failed', rpcError);
  }
  return { data, error };
}

export async function dbConfirmAnnouncement(annId: string, userId: string) {
  const sb = createClient();
  // Atomic append — avoids lost-update if two members confirm simultaneously
  await sb.rpc('append_announcement_confirmation', { ann_id: annId, user_id: userId });
}

// ─── Family group creation/joining ───────────────────────────────────────────

export async function dbCreateFamilyGroup(_userId: string, name: string, emoji: string) {
  const sb = createClient();
  const { data, error } = await sb.rpc('create_family_group', { p_name: name, p_emoji: emoji });
  if (error) throw new Error(error.message ?? 'فشل إنشاء البيت');
  return data as string;
}

export async function dbSetMealPlan(plan: MealPlan) {
  const sb = createClient();
  return sb.from('meal_plans').upsert({
    family_group_id: plan.familyGroupId,
    date: plan.date,
    breakfast: plan.breakfast?.length ? JSON.stringify(plan.breakfast) : null,
    lunch:     plan.lunch?.length     ? JSON.stringify(plan.lunch)     : null,
    dinner:    plan.dinner?.length    ? JSON.stringify(plan.dinner)    : null,
    created_by: plan.createdBy,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'family_group_id,date' });
}

export async function dbJoinFamilyGroup(_userId: string, inviteCode: string) {
  const sb = createClient();
  const { data, error } = await sb.rpc('join_family_group', { p_invite_code: inviteCode });
  if (error) throw new Error(error.message === 'Invalid invite code' ? 'الكود غير صحيح أو منتهي' : error.message);
  return data as string;
}
