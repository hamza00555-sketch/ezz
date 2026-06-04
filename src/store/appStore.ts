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
    permissions: { canManageTasks: true, canManageHome: true, canManageFinance: true, canInviteMembers: true },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-2',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'أم أحمد',
    role: 'guardian',
    generation: 2,
    permissions: { canManageTasks: true, canManageHome: true, canManageFinance: true, canInviteMembers: false },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-3',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'أحمد',
    role: 'teen',
    generation: 3,
    permissions: { canManageTasks: false, canManageHome: false, canManageFinance: false, canInviteMembers: false },
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'member-4',
    familyGroupId: FAMILY_GROUP_ID,
    name: 'سارة',
    role: 'child',
    generation: 3,
    permissions: { canManageTasks: false, canManageHome: false, canManageFinance: false, canInviteMembers: false },
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
    breakfast: 'بيض مع خبز',
    lunch: 'كبسة دجاج',
    dinner: 'شوربة عدس',
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

  // Announcement actions
  confirmAnnouncement: (annId: string, memberId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export const useAppStore = create<AppState>((set) => ({
  currentUserId: CURRENT_USER_ID,
  currentFamilyGroupId: FAMILY_GROUP_ID,

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

  setCurrentFamilyGroup: (id) => set({ currentFamilyGroupId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setQuickAddOpen: (open) => set({ isQuickAddOpen: open }),
  setActiveQuickForm: (form) => set({ activeQuickForm: form, isQuickAddOpen: false }),

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: `task-${generateId()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),

  updateTaskStatus: (taskId, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    })),

  addRequest: (reqData) =>
    set((state) => ({
      requests: [
        ...state.requests,
        {
          ...reqData,
          id: `req-${generateId()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),

  updateRequestStatus: (reqId, status) =>
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === reqId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    })),

  addShortage: (itemData) =>
    set((state) => ({
      shortages: [
        ...state.shortages,
        {
          ...itemData,
          id: `sh-${generateId()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),

  toggleShortageStatus: (id) =>
    set((state) => ({
      shortages: state.shortages.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'missing' ? 'provided' : 'missing',
              updatedAt: new Date().toISOString(),
            }
          : s
      ),
    })),

  addWishItem: (itemData) =>
    set((state) => ({
      wishItems: [
        ...state.wishItems,
        {
          ...itemData,
          id: `wish-${generateId()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),

  addExpense: (expData) =>
    set((state) => {
      const newExpense: Expense = {
        ...expData,
        id: `exp-${generateId()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return {
        expenses: [...state.expenses, newExpense],
        wallets: state.wallets.map((w) =>
          w.id === expData.walletId
            ? { ...w, spent: w.spent + expData.amount, updatedAt: new Date().toISOString() }
            : w
        ),
      };
    }),

  confirmAnnouncement: (annId, memberId) =>
    set((state) => ({
      announcements: state.announcements.map((a) =>
        a.id === annId && !a.confirmedBy.includes(memberId)
          ? { ...a, confirmedBy: [...a.confirmedBy, memberId], updatedAt: new Date().toISOString() }
          : a
      ),
    })),
}));
