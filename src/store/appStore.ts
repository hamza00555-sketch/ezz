import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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

// ─── Initial values ───────────────────────────────────────────────────────────
// No mock/demo data. New users start empty; real data is loaded from Supabase.

const CURRENT_USER_ID = '';
const FAMILY_GROUP_ID = '';

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppState {
  currentUserId: string;
  currentFamilyGroupId: string;
  isLoaded: boolean;
  appReady: boolean;
  lastLoadedAt: number;

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
  setAppReady: (v: boolean) => void;
  clearUserData: () => void;

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
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>, onError?: () => void) => void;
  updateRecipe: (id: string, data: Omit<Partial<Recipe>, 'id' | 'familyGroupId' | 'createdBy' | 'createdAt'>, onError?: () => void) => void;

  // Announcement actions
  confirmAnnouncement: (annId: string, memberId: string) => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export const useAppStore = create<AppState>()(persist((set, get) => ({
  currentUserId: CURRENT_USER_ID,
  currentFamilyGroupId: FAMILY_GROUP_ID,
  isLoaded: false,
  appReady: false,
  lastLoadedAt: 0,

  familyGroups: [],
  members: [],
  tasks: [],
  requests: [],
  homeItems: [],
  documents: [],
  maintenance: [],
  shortages: [],
  recipes: [],
  mealPlans: [],
  wishItems: [],
  wallets: [],
  expenses: [],
  announcements: [],

  activeTab: 'dashboard',
  isQuickAddOpen: false,
  activeQuickForm: null,

  setCurrentUser: (userId, familyGroupId) =>
    set({ currentUserId: userId, currentFamilyGroupId: familyGroupId }),

  setAppReady: (v) => set({ appReady: v }),

  clearUserData: () => set({
    currentUserId: '',
    currentFamilyGroupId: '',
    familyGroups: [],
    members: [],
    tasks: [],
    requests: [],
    homeItems: [],
    documents: [],
    maintenance: [],
    shortages: [],
    recipes: [],
    mealPlans: [],
    wishItems: [],
    wallets: [],
    expenses: [],
    announcements: [],
    isLoaded: false,
    appReady: false,
    lastLoadedAt: 0,
  }),

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
      lastLoadedAt: Date.now(),
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
        dbAddTask(taskData).then(({ data, error }) => {
          if (error) {
            console.error('[addTask] insert failed, rolling back', error);
            set((s) => ({ tasks: s.tasks.filter((t) => t.id !== localId) }));
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ tasks: s.tasks.map((t) => t.id === localId ? { ...t, id: data.id } : t) }));
          }
        })
      ).catch((err) => {
        console.error('[addTask] sync error, rolling back', err);
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== localId) }));
      });
    }
  },

  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db')
        .then(({ dbUpdateTaskStatus }) => dbUpdateTaskStatus(taskId, status))
        .catch((err) => console.error('[updateTaskStatus] sync failed', err));
    }
  },

  addRequest: (reqData) => {
    const localId = `req-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      requests: [...state.requests, { ...reqData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddRequest }) =>
        dbAddRequest(reqData).then(({ data, error }) => {
          if (error) {
            console.error('[addRequest] insert failed, rolling back', error);
            set((s) => ({ requests: s.requests.filter((r) => r.id !== localId) }));
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ requests: s.requests.map((r) => r.id === localId ? { ...r, id: data.id } : r) }));
          }
        })
      ).catch((err) => {
        console.error('[addRequest] sync error, rolling back', err);
        set((s) => ({ requests: s.requests.filter((r) => r.id !== localId) }));
      });
    }
  },

  updateRequestStatus: (reqId, status) => {
    set((state) => ({
      requests: state.requests.map((r) =>
        r.id === reqId ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db')
        .then(({ dbUpdateRequestStatus }) => dbUpdateRequestStatus(reqId, status))
        .catch((err) => console.error('[updateRequestStatus] sync failed', err));
    }
  },

  addShortage: (itemData) => {
    const localId = `sh-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      shortages: [...state.shortages, { ...itemData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddShortage }) =>
        dbAddShortage(itemData).then(({ data, error }) => {
          if (error) {
            console.error('[addShortage] insert failed, rolling back', error);
            set((s) => ({ shortages: s.shortages.filter((sh) => sh.id !== localId) }));
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ shortages: s.shortages.map((sh) => sh.id === localId ? { ...sh, id: data.id } : sh) }));
          }
        })
      ).catch((err) => {
        console.error('[addShortage] sync error, rolling back', err);
        set((s) => ({ shortages: s.shortages.filter((sh) => sh.id !== localId) }));
      });
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
      import('@/lib/supabase/db')
        .then(({ dbToggleShortageStatus }) => dbToggleShortageStatus(id, newStatus))
        .catch((err) => console.error('[toggleShortageStatus] sync failed', err));
    }
  },

  addWishItem: (itemData) => {
    const localId = `wish-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      wishItems: [...state.wishItems, { ...itemData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddWishItem }) =>
        dbAddWishItem(itemData).then(({ data, error }) => {
          if (error) {
            console.error('[addWishItem] insert failed, rolling back', error);
            set((s) => ({ wishItems: s.wishItems.filter((w) => w.id !== localId) }));
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ wishItems: s.wishItems.map((w) => w.id === localId ? { ...w, id: data.id } : w) }));
          }
        })
      ).catch((err) => {
        console.error('[addWishItem] sync error, rolling back', err);
        set((s) => ({ wishItems: s.wishItems.filter((w) => w.id !== localId) }));
      });
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
      import('@/lib/supabase/db').then(({ dbAddExpense }) =>
        dbAddExpense(expData).then(({ data, error }) => {
          if (error) {
            console.error('[addExpense] insert failed, rolling back', error);
            set((s) => ({
              expenses: s.expenses.filter((e) => e.id !== localId),
              wallets: s.wallets.map((w) =>
                w.id === expData.walletId
                  ? { ...w, spent: w.spent - expData.amount }
                  : w
              ),
            }));
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ expenses: s.expenses.map((e) => e.id === localId ? { ...e, id: data.id } : e) }));
          }
        })
      ).catch((err) => {
        console.error('[addExpense] sync error, rolling back', err);
        set((s) => ({
          expenses: s.expenses.filter((e) => e.id !== localId),
          wallets: s.wallets.map((w) =>
            w.id === expData.walletId
              ? { ...w, spent: w.spent - expData.amount }
              : w
          ),
        }));
      });
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
        if (plan) return dbSetMealPlan(plan);
      }).catch((err) => console.error('[addMealOption] sync failed', err));
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
        if (plan) return dbSetMealPlan(plan);
      }).catch((err) => console.error('[removeMealOption] sync failed', err));
    }
  },

  addRecipe: (recipeData, onError) => {
    const localId = `rec-${generateId()}`;
    const now = new Date().toISOString();
    set((state) => ({
      recipes: [...state.recipes, { ...recipeData, id: localId, createdAt: now, updatedAt: now }],
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbAddRecipe }) =>
        dbAddRecipe(recipeData).then(({ data, error }) => {
          if (error) {
            console.error('[addRecipe] insert failed, rolling back', error);
            set((s) => ({ recipes: s.recipes.filter((r) => r.id !== localId) }));
            onError?.();
            return;
          }
          if (data?.id && data.id !== localId) {
            set((s) => ({ recipes: s.recipes.map((r) => r.id === localId ? { ...r, id: data.id } : r) }));
          }
        })
      ).catch((err) => {
        console.error('[addRecipe] sync error, rolling back', err);
        set((s) => ({ recipes: s.recipes.filter((r) => r.id !== localId) }));
        onError?.();
      });
    }
  },

  updateRecipe: (id, data, onError) => {
    const now = new Date().toISOString();
    const previous = get().recipes.find((r) => r.id === id);
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...data, id, updatedAt: now } : r
      ),
    }));
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      import('@/lib/supabase/db').then(({ dbUpdateRecipe }) =>
        dbUpdateRecipe(id, data).then(({ error }) => {
          if (error) {
            console.error('[updateRecipe] update failed, rolling back', error);
            if (previous) {
              set((s) => ({ recipes: s.recipes.map((r) => r.id === id ? previous : r) }));
            }
            onError?.();
          }
        })
      ).catch((err) => { console.error('[updateRecipe] sync error', err); onError?.(); });
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
      ).catch((err) => {
        console.error('[confirmAnnouncement] sync failed, rolling back', err);
        set((s) => ({
          announcements: s.announcements.map((a) =>
            a.id === annId
              ? { ...a, confirmedBy: a.confirmedBy.filter((m) => m !== memberId) }
              : a
          ),
        }));
      });
    }
  },
}), {
  name: 'ezz-app-store-v2',
  partialize: (state) => ({
    currentUserId:        state.currentUserId,
    currentFamilyGroupId: state.currentFamilyGroupId,
    familyGroups:  state.familyGroups,
    members:       state.members,
    tasks:         state.tasks,
    requests:      state.requests,
    homeItems:     state.homeItems,
    documents:     state.documents,
    maintenance:   state.maintenance,
    shortages:     state.shortages,
    // Strip raw data URLs from recipes — images live in Supabase Storage (https URLs are fine)
    recipes: state.recipes.map((r) => ({
      ...r,
      imageUrl: r.imageUrl?.startsWith('data:') ? undefined : r.imageUrl,
    })),
    mealPlans:     state.mealPlans,
    wishItems:     state.wishItems,
    wallets:       state.wallets,
    expenses:      state.expenses,
    announcements: state.announcements,
  }),
}));
