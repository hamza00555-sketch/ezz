import { create } from 'zustand';
import type {
  FamilyGroup,
  FamilyMember,
  Task,
  Request,
  HomeItem,
  Document,
  MaintenanceRecord,
  KitchenShortage,
  Recipe,
  MealPlan,
  WishItem,
  Wallet,
  Expense,
  Announcement,
} from '@/types';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = 'member-1';
const FAMILY_GROUP_ID = 'family-1';

const mockMembers: FamilyMember[] = [
  {
    id: 'member-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'أبو أحمد',
    role: 'family_admin',
    generation: 2,
    permissions: { canManageTasks: true, canManageHome: true, canManageFinance: true, canInviteMembers: true, canManageKitchen: true },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'أم أحمد',
    role: 'guardian',
    generation: 2,
    permissions: { canManageTasks: true, canManageHome: true, canManageFinance: true, canInviteMembers: false, canManageKitchen: true },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-3',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'أحمد',
    role: 'teen',
    generation: 3,
    permissions: { canManageTasks: false, canManageHome: false, canManageFinance: false, canInviteMembers: false, canManageKitchen: false },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-4',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'سارة',
    role: 'child',
    generation: 3,
    permissions: { canManageTasks: false, canManageHome: false, canManageFinance: false, canInviteMembers: false, canManageKitchen: false },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockFamilyGroups: FamilyGroup[] = [
  {
    id: FAMILY_GROUP_ID,
    name: 'بيت آل الأحمدي',
    emoji: '🏡',
    color: '#C8922A',
    members: ['member-1', 'member-2', 'member-3', 'member-4'],
    inviteCode: 'EZZ12345',
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'تنظيف الصالة والمطبخ',
    description: 'تنظيف شامل قبل قدوم الضيوف',
    assignedTo: 'member-2',
    createdBy: 'member-1',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: 'high',
    status: 'accepted',
    category: 'cleaning',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'دفع فاتورة الكهرباء',
    assignedTo: 'member-1',
    createdBy: 'member-1',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    priority: 'urgent',
    status: 'in_progress',
    category: 'bills',
    isRecurring: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'ترتيب غرفتك',
    assignedTo: 'member-3',
    createdBy: 'member-1',
    priority: 'medium',
    status: 'accepted',
    category: 'cleaning',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'تجديد تأمين السيارة',
    assignedTo: 'member-1',
    createdBy: 'member-1',
    dueDate: new Date(Date.now() + 604800000).toISOString(),
    priority: 'high',
    status: 'new',
    category: 'documents',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'شراء مستلزمات المدرسة',
    assignedTo: 'member-2',
    createdBy: 'member-2',
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    priority: 'medium',
    status: 'pending_acceptance',
    category: 'shopping',
    isRecurring: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockRequests: Request[] = [
  {
    id: 'req-1',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'أحتاج توصيلة للمدرسة غداً',
    type: 'errand',
    from: 'member-3',
    to: 'member-1',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'شراء كتاب رياضيات',
    description: 'الكتاب للسنة الثالثة متوسط',
    type: 'purchase',
    from: 'member-3',
    to: 'member-2',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockHomeItems: HomeItem[] = [
  {
    id: 'item-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'ثلاجة سامسونج',
    category: 'appliances',
    location: 'المطبخ',
    purchaseDate: '2022-03-15',
    price: 3500,
    warrantyExpiry: '2027-03-15',
    notes: 'موديل RF28R7351SR',
    createdBy: 'member-1',
    createdAt: '2022-03-15',
    updatedAt: '2022-03-15',
  },
  {
    id: 'item-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'تكييف جري',
    category: 'appliances',
    location: 'غرفة المعيشة',
    purchaseDate: '2023-06-01',
    price: 2800,
    warrantyExpiry: '2026-06-01',
    createdBy: 'member-1',
    createdAt: '2023-06-01',
    updatedAt: '2023-06-01',
  },
  {
    id: 'item-3',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'سيارة تويوتا كامري',
    category: 'vehicles',
    purchaseDate: '2021-08-20',
    price: 95000,
    warrantyExpiry: '2026-08-20',
    notes: 'لون أبيض، رقم اللوحة ABC 1234',
    createdBy: 'member-1',
    createdAt: '2021-08-20',
    updatedAt: '2021-08-20',
  },
];

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'تأمين السيارة',
    type: 'insurance',
    linkedItemId: 'item-3',
    expiryDate: new Date(Date.now() + 604800000).toISOString(),
    reminderDays: 30,
    visibility: 'all',
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'doc-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'عقد إيجار الشقة',
    type: 'contract',
    expiryDate: new Date(Date.now() + 7776000000).toISOString(),
    reminderDays: 60,
    visibility: 'all',
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: 'maint-1',
    familyGroupId: FAMILY_GROUP_ID,
    linkedItemId: 'item-3',
    type: 'تغيير زيت',
    date: new Date(Date.now() - 1296000000).toISOString(),
    cost: 200,
    performedBy: 'ورشة الأمين',
    nextReminder: new Date(Date.now() + 7776000000).toISOString(),
    status: 'done',
    createdBy: 'member-1',
    createdAt: new Date(Date.now() - 1296000000).toISOString(),
    updatedAt: new Date(Date.now() - 1296000000).toISOString(),
  },
];

const mockShortages: KitchenShortage[] = [
  {
    id: 'sh-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'رز',
    category: 'grains',
    quantity: '5 كيلو',
    priority: 'high',
    status: 'missing',
    addedBy: 'member-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sh-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'حليب',
    category: 'dairy',
    quantity: '6 كرتون',
    priority: 'urgent',
    status: 'missing',
    addedBy: 'member-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sh-3',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'بيض',
    category: 'protein',
    quantity: '30 بيضة',
    priority: 'medium',
    status: 'missing',
    addedBy: 'member-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sh-4',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'زيت طبخ',
    category: 'oils',
    priority: 'low',
    status: 'provided',
    addedBy: 'member-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockRecipes: Recipe[] = [
  {
    id: 'rec-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'كبسة دجاج',
    ingredients: ['دجاج كامل', 'رز بسمتي', 'بهارات كبسة', 'طماطم', 'بصل', 'ثوم', 'زبدة'],
    steps: ['يُسلق الدجاج مع البهارات', 'يُقلى البصل والثوم', 'تُضاف الطماطم والبهارات', 'يُضاف الرز والمرق'],
    prepTime: 90,
    mealTime: ['lunch', 'dinner'],
    favoritedBy: ['member-1', 'member-3'],
    createdBy: 'member-2',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'rec-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'شوربة عدس',
    ingredients: ['عدس أحمر', 'بصل', 'ثوم', 'كمون', 'ليمون', 'زيت'],
    steps: ['يُغسل العدس', 'يُطبخ مع البصل والثوم', 'يُخلط', 'يُتبل بالكمون والليمون'],
    prepTime: 30,
    mealTime: ['lunch'],
    favoritedBy: ['member-2', 'member-4'],
    createdBy: 'member-2',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const mockMealPlans: MealPlan[] = [
  {
    id: 'mp-1',
    familyGroupId: FAMILY_GROUP_ID,
    date: new Date().toISOString().split('T')[0],
    breakfast: ['بيض مع خبز', 'لحوح مع العسل', 'شكشوكة'],
    lunch: ['كبسة دجاج', 'مندي لحم', 'زربيان حضرمي'],
    dinner: ['شوربة عدس', 'حمص مع خبز'],
    createdBy: 'member-2',
    updatedAt: new Date().toISOString(),
  },
];

const mockWishItems: WishItem[] = [
  {
    id: 'wish-1',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'رف تنظيم للمطبخ',
    description: 'رف معلق فوق البوتاجاز لتنظيم التوابل',
    type: 'need',
    priority: 'medium',
    status: 'idea',
    createdBy: 'member-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wish-2',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'تغيير ستارة المجلس',
    type: 'idea',
    priority: 'low',
    status: 'studying',
    createdBy: 'member-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockWallets: Wallet[] = [
  {
    id: 'wallet-1',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'البقالة',
    monthlyBudget: 2000,
    spent: 1350,
    visibility: 'all',
    canAdd: 'all',
    canEdit: ['member-1', 'member-2'],
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wallet-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'الصيانة',
    monthlyBudget: 500,
    spent: 200,
    visibility: 'all',
    canAdd: ['member-1'],
    canEdit: ['member-1'],
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'wallet-3',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'المطاعم',
    monthlyBudget: 800,
    spent: 620,
    visibility: 'all',
    canAdd: 'all',
    canEdit: ['member-1', 'member-2'],
    createdBy: 'member-1',
    createdAt: '2024-01-01',
    updatedAt: new Date().toISOString(),
  },
];

const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    familyGroupId: FAMILY_GROUP_ID,
    walletId: 'wallet-1',
    amount: 350,
    category: 'خضروات وفواكه',
    date: new Date().toISOString(),
    addedBy: 'member-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    familyGroupId: FAMILY_GROUP_ID,
    walletId: 'wallet-3',
    amount: 180,
    category: 'عشاء',
    date: new Date(Date.now() - 86400000).toISOString(),
    addedBy: 'member-1',
    notes: 'ماكدونالدز',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    familyGroupId: FAMILY_GROUP_ID,
    title: 'زيارة عائلية الجمعة',
    message: 'سيزورنا الجد وأبناء العمومة يوم الجمعة القادم. يرجى من الجميع التواجد في البيت.',
    publishedBy: 'member-1',
    audience: 'all',
    requiresConfirmation: true,
    confirmedBy: ['member-2'],
    status: 'active',
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppState {
  currentUserId: string;
  currentFamilyGroupId: string;
  isLoaded: boolean;

  familyGroups: FamilyGroup[];
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

  // UI state
  activeTab: string;
  isQuickAddOpen: boolean;
  activeQuickForm: string | null;

  // Supabase sync
  loadFromSupabase: (userId: string, familyGroupId: string) => Promise<void>;
  setCurrentUser: (userId: string, familyGroupId: string) => void;

  // Actions
  setCurrentFamilyGroup: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setQuickAddOpen: (open: boolean) => void;
  setActiveQuickForm: (form: string | null) => void;

  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;

  // Request actions
  addRequest: (req: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (reqId: string, status: Request['status']) => void;

  // Shortage actions
  addShortage: (item: Omit<KitchenShortage, 'id' | 'createdAt' | 'updatedAt'>) => void;
  toggleShortageStatus: (id: string) => void;

  // Wish actions
  addWishItem: (item: Omit<WishItem, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Meal plan actions
  addMealOption: (date: string, meal: 'breakfast' | 'lunch' | 'dinner', option: string) => void;
  removeMealOption: (date: string, meal: 'breakfast' | 'lunch' | 'dinner', option: string) => void;

  // Recipe actions
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;

  // Announcement actions
  confirmAnnouncement: (annId: string, memberId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUserId: CURRENT_USER_ID,
  currentFamilyGroupId: FAMILY_GROUP_ID,
  isLoaded: false,

  familyGroups: mockFamilyGroups,
  members: mockMembers,
  tasks: mockTasks,
  requests: mockRequests,
  homeItems: mockHomeItems,
  documents: mockDocuments,
  maintenance: mockMaintenance,
  shortages: mockShortages,
  recipes: mockRecipes,
  mealPlans: mockMealPlans,
  wishItems: mockWishItems,
  wallets: mockWallets,
  expenses: mockExpenses,
  announcements: mockAnnouncements,

  activeTab: 'dashboard',
  isQuickAddOpen: false,
  activeQuickForm: null,

  setCurrentUser: (userId, familyGroupId) =>
    set({ currentUserId: userId, currentFamilyGroupId: familyGroupId }),

  loadFromSupabase: async (userId, familyGroupId) => {
    const { fetchFamilyData } = await import('@/lib/supabase/db');
    const data = await fetchFamilyData(familyGroupId);
    if (!data) return;
    set({
      currentUserId: userId,
      currentFamilyGroupId: familyGroupId,
      familyGroups: [data.familyGroup],
      members: data.members,
      tasks: data.tasks,
      requests: data.requests,
      homeItems: data.homeItems,
      documents: data.documents,
      maintenance: data.maintenance,
      shortages: data.shortages,
      recipes: data.recipes,
      mealPlans: data.mealPlans,
      wishItems: data.wishItems,
      wallets: data.wallets,
      expenses: data.expenses,
      announcements: data.announcements,
      isLoaded: true,
    });
  },

  setCurrentFamilyGroup: (id) => set({ currentFamilyGroupId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuickAddOpen: (open) => set({ isQuickAddOpen: open }),
  setActiveQuickForm: (form) => set({ activeQuickForm: form, isQuickAddOpen: false }),

  addTask: (taskData) => {
    const localId = `task-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      tasks: [...state.tasks, { ...taskData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddTask }) =>
        dbAddTask(taskData).then(({ data }) => {
          if (data?.id && data.id !== localId) {
            set((s) => ({ tasks: s.tasks.map((t) => t.id === localId ? { ...t, id: data.id } : t) }));
          }
        })
      );
    }
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbUpdateTaskStatus }) => dbUpdateTaskStatus(taskId, status));
    }
  },

  addRequest: (reqData) => {
    const localId = `req-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      requests: [...state.requests, { ...reqData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddRequest }) => dbAddRequest(reqData));
    }
  },

  updateRequestStatus: (reqId, status) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === reqId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbUpdateRequestStatus }) => dbUpdateRequestStatus(reqId, status));
    }
  },

  addShortage: (itemData) => {
    const localId = `sh-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      shortages: [...state.shortages, { ...itemData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddShortage }) => dbAddShortage(itemData));
    }
  },

  toggleShortageStatus: (id) => {
    const current = get().shortages.find((s) => s.id === id);
    const newStatus = current?.status === 'missing' ? 'provided' : 'missing';
    set((state) => ({
      shortages: state.shortages.map((s) =>
        s.id === id ? { ...s, status: newStatus, updatedAt: new Date().toISOString() } : s
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbToggleShortageStatus }) => dbToggleShortageStatus(id, newStatus));
    }
  },

  addWishItem: (itemData) => {
    const localId = `wish-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      wishItems: [...state.wishItems, { ...itemData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddWishItem }) => dbAddWishItem(itemData));
    }
  },

  addExpense: (expData) => {
    const localId = `exp-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      expenses: [...state.expenses, { ...expData, id: localId, createdAt: now, updatedAt: now }],
      wallets: state.wallets.map((w) =>
        w.id === expData.walletId
          ? { ...w, spent: w.spent + expData.amount, updatedAt: now }
          : w
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddExpense }) => dbAddExpense(expData));
    }
  },

  addMealOption: (date, meal, option) => {
    if (!option.trim()) return;
    const { mealPlans, currentFamilyGroupId, currentUserId } = get();
    const existing = mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === date);
    const now = new Date().toISOString();
    if (existing) {
      if (existing[meal].includes(option)) return;
      set((state) => ({
        mealPlans: state.mealPlans.map((p) =>
          p.id === existing.id ? { ...p, [meal]: [...p[meal], option], updatedAt: now } : p
        ),
      }));
    } else {
      const newPlan: MealPlan = {
        id: `mp-${generateId()}`,
        familyGroupId: currentFamilyGroupId,
        date,
        breakfast: meal === 'breakfast' ? [option] : [],
        lunch:     meal === 'lunch'     ? [option] : [],
        dinner:    meal === 'dinner'    ? [option] : [],
        createdBy: currentUserId,
        updatedAt: now,
      };
      set((state) => ({ mealPlans: [...state.mealPlans, newPlan] }));
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbSetMealPlan }) => {
        const plan = get().mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === date);
        if (plan) dbSetMealPlan(plan);
      });
    }
  },

  removeMealOption: (date, meal, option) => {
    const { mealPlans, currentFamilyGroupId } = get();
    const existing = mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === date);
    if (!existing) return;
    const now = new Date().toISOString();
    set((state) => ({
      mealPlans: state.mealPlans.map((p) =>
        p.id === existing.id
          ? { ...p, [meal]: p[meal].filter((o) => o !== option), updatedAt: now }
          : p
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbSetMealPlan }) => {
        const plan = get().mealPlans.find((p) => p.familyGroupId === currentFamilyGroupId && p.date === date);
        if (plan) dbSetMealPlan(plan);
      });
    }
  },

  addRecipe: (recipeData) => {
    const localId = `rec-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      recipes: [...state.recipes, { ...recipeData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddRecipe }) => dbAddRecipe(recipeData));
    }
  },

  confirmAnnouncement: (annId, memberId) => {
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === annId && !a.confirmedBy.includes(memberId)
          ? { ...a, confirmedBy: [...a.confirmedBy, memberId], updatedAt: new Date().toISOString() }
          : a
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbConfirmAnnouncement }) =>
        dbConfirmAnnouncement(annId, memberId)
      );
    }
  },
}));
