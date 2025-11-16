---
doc_type: research
date: 2025-11-09T11:32:39+00:00
title: "Meal Prep App Refactoring and Backend Integration Analysis"
_generated: true
_script_version: "1.0"
_generated_at: "2025-11-09T11:32:39+00:00"
research_question: "Conduct a comprehensive analysis of the meal prep application codebase to identify refactoring and improvement opportunities in preparation for backend integration"
research_type: codebase_research
researcher: Sean Kim

git_commit: 20a062fe4479bf71594de3031632722710da608b
branch: main
repository: meal-prep-app

created_by: Sean Kim
last_updated: 2025-11-09
last_updated_by: Sean Kim

tags:
  - refactoring
  - backend-integration
  - architecture
  - state-management
  - code-quality
status: complete

related_docs: []
---

# Research: Meal Prep App Refactoring and Backend Integration Analysis

**Date**: 2025-11-09T11:32:39+00:00
**Researcher**: Sean Kim
**Git Commit**: 20a062fe4479bf71594de3031632722710da608b
**Branch**: main
**Repository**: meal-prep-app

## Research Question
Conduct a comprehensive analysis of the meal prep application codebase to identify refactoring and improvement opportunities in preparation for backend integration.

## Executive Summary

The meal prep application is currently a well-structured frontend prototype with hardcoded mock data. The codebase demonstrates good UI/UX design patterns, uses modern React practices, and has a solid component library foundation (Radix UI + shadcn/ui). However, it requires significant refactoring to prepare for backend integration, particularly around state management, data fetching, error handling, and separation of concerns.

**Key Findings:**
- State is managed entirely with React's `useState` and `localStorage`
- Data layer is tightly coupled to UI components
- No error handling or loading states for async operations
- Type definitions are well-structured but lack API response types
- Component logic mixes UI rendering with data manipulation
- No service layer or API client infrastructure exists

**Recommendation:** Prioritize introducing a state management solution (React Query), creating a service layer, and separating business logic from UI components BEFORE attempting backend integration.

---

## 1. Architecture and Structure

### Current Organization

```
src/
├── App.tsx                    # Root component with simple routing logic
├── main.tsx                   # Entry point
├── components/
│   ├── MealPlanView.tsx       # Main container with tab navigation
│   ├── tabs/                  # Feature-specific tab components
│   │   ├── OverviewTab.tsx
│   │   ├── ShoppingListTab.tsx
│   │   ├── SundayPrepTab.tsx
│   │   ├── ThisWeekTab.tsx
│   │   └── NotesTab.tsx
│   ├── ui/                    # Reusable UI primitives (48 components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (Radix-based components)
│   └── figma/
│       └── ImageWithFallback.tsx
├── data/
│   └── mockPlan.ts            # Hardcoded meal plan data (567 lines)
├── types/
│   └── index.ts               # TypeScript interfaces
└── styles/
    └── index.css              # Tailwind + custom styles
```

**Strengths:**
- Clear separation between UI primitives and feature components ([src/components/ui/](src/components/ui/))
- Tab-based architecture is logical and extensible ([src/components/tabs/](src/components/tabs/))
- TypeScript types are well-defined in centralized location ([src/types/index.ts:1-66](src/types/index.ts))
- Path aliases configured for clean imports ([tsconfig.json:24-27](tsconfig.json))

**Weaknesses:**
- No separation between data layer and presentation layer
- Mock data directly imported into components ([App.tsx:3](App.tsx))
- No hooks/, services/, or api/ directories for business logic
- All feature logic embedded within tab components
- No layout components or shared containers

**Impact on Backend Integration:**
- HIGH - Will require significant restructuring to introduce API calls
- Components will need major refactoring to accept loading/error states
- Data fetching logic has nowhere clean to live currently

---

## 2. State Management Patterns

### Current Implementation

The application uses three state management approaches:

#### 2.1 Local Component State (`useState`)

**Location:** [App.tsx:6](App.tsx), [MealPlanView.tsx:70](MealPlanView.tsx)

```typescript
// App.tsx:6
const [showPlan, setShowPlan] = useState(false);

// MealPlanView.tsx:70
const [activeTab, setActiveTab] = useState<TabId>('overview');
```

**Usage:** Simple UI state like tab selection and view toggling.

**Assessment:** ✅ Appropriate for local UI state

#### 2.2 Prop Drilling

**Location:** [App.tsx:9](App.tsx) → [MealPlanView.tsx:69-107](MealPlanView.tsx) → [OverviewTab.tsx:3-7](src/components/tabs/OverviewTab.tsx)

```typescript
// App.tsx passes entire plan object down
<MealPlanView plan={mockPlan} />

// MealPlanView destructures and passes subsets to children
{activeTab === 'overview' && <OverviewTab plan={plan} />}
{activeTab === 'shopping' && <ShoppingListTab items={plan.shoppingList} />}
{activeTab === 'prep' && <SundayPrepTab steps={plan.prepSteps} />}
```

**Assessment:** ⚠️ Currently manageable but will become problematic with:
- User-specific data
- Multiple meal plans
- Shopping list shared across views
- Real-time updates

#### 2.3 LocalStorage for Persistence

**Location:** [ShoppingListTab.tsx:54-70](src/components/tabs/ShoppingListTab.tsx), [SundayPrepTab.tsx:12-28](src/components/tabs/SundayPrepTab.tsx)

```typescript
// ShoppingListTab.tsx:54-70
useEffect(() => {
  const stored = localStorage.getItem('shoppingList');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      setItems(parsed);
    } catch (e) {
      console.error('Failed to parse shopping list from localStorage');
    }
  }
}, []);

useEffect(() => {
  localStorage.setItem('shoppingList', JSON.stringify(items));
}, [items]);
```

**Issues:**
- ❌ No synchronization between tabs
- ❌ Data stored separately in different components (shopping list vs prep steps)
- ❌ Will conflict with server-side data
- ❌ No versioning or migration strategy
- ❌ Ignores `initialItems` prop after first load ([ShoppingListTab.tsx:50](src/components/tabs/ShoppingListTab.tsx))

**Critical Problem:** Each tab independently manages localStorage, creating potential for:
- Stale data when plan updates
- Loss of user progress when switching plans
- No way to sync with backend state

---

### State Management Assessment

| Requirement | Current Solution | Backend-Ready? |
|------------|------------------|----------------|
| UI state (tabs, modals) | `useState` | ✅ Yes |
| Data fetching | N/A (hardcoded) | ❌ No |
| Loading states | None | ❌ No |
| Error handling | None | ❌ No |
| Cache management | localStorage | ❌ No |
| Optimistic updates | None | ❌ No |
| Data synchronization | None | ❌ No |
| Multi-user support | N/A | ❌ No |

**Recommendation Priority: CRITICAL**

Must implement before backend integration:
1. **React Query** (or similar) for server state management
2. **Context API** for sharing user/plan data across components
3. **Custom hooks** to encapsulate data fetching logic
4. Remove localStorage or use it only for draft/offline mode

---

## 3. Data Flow and Prop Drilling

### Current Data Flow

```
mockPlan (data/mockPlan.ts)
    ↓
App.tsx (imports directly)
    ↓ plan={mockPlan}
MealPlanView.tsx
    ↓ destructures and passes subsets
├→ OverviewTab (plan.components, plan.philosophy, etc.)
├→ ShoppingListTab (plan.shoppingList)
├→ SundayPrepTab (plan.prepSteps)
├→ ThisWeekTab (plan.weekMeals)
└→ NotesTab (plan.notes)
```

### Problems Identified

#### 3.1 Tight Coupling to Data Structure

**Location:** [MealPlanView.tsx:101-105](src/components/tabs/OverviewTab.tsx)

```typescript
// Components expect exact shape of mock data
{activeTab === 'overview' && <OverviewTab plan={plan} />}
```

If API returns different structure, ALL tab components break simultaneously.

#### 3.2 No Data Normalization

**Example:** Shopping items reference categories by string literal:

```typescript
// types/index.ts:32
category: 'Produce' | 'Pantry' | 'Dairy' | 'Broth' | 'Meat' | 'Seafood';
```

**Issues:**
- Categories hardcoded in type definition
- Cannot dynamically add/remove categories from backend
- Icons mapped by string matching ([ShoppingListTab.tsx:9-48](src/components/tabs/ShoppingListTab.tsx))

#### 3.3 State Mutations Without Coordination

**Location:** [ShoppingListTab.tsx:72-76](src/components/tabs/ShoppingListTab.tsx)

```typescript
const toggleItem = (id: string) => {
  setItems(items.map(item =>
    item.id === id ? { ...item, checked: !item.checked } : item
  ));
};
```

- ✅ Proper immutable update
- ❌ Changes only exist in this component's state
- ❌ Parent (MealPlanView) never knows items were checked
- ❌ No way to sync with server

#### 3.4 Duplicate State Management Patterns

**Comparison:**

| Component | State Var | LocalStorage Key | Sync Issue |
|-----------|-----------|------------------|------------|
| ShoppingListTab | `items` | `'shoppingList'` | Overrides prop on mount |
| SundayPrepTab | `steps` | `'sundayPrepSteps'` | Overrides prop on mount |
| ThisWeekTab | `meals` | None | Prop-only (read-only) |

Inconsistent patterns will cause bugs during backend integration.

---

### Recommendations: Data Flow

**Priority: HIGH**

1. **Lift state to App level or Context:**
   ```typescript
   // Create MealPlanContext
   const MealPlanContext = createContext<MealPlanContextType | null>(null);

   function MealPlanProvider({ children, planId }: Props) {
     const { data: plan, isLoading, error } = useQuery(['plan', planId], fetchPlan);
     return <MealPlanContext.Provider value={{plan, isLoading, error}}>...
   }
   ```

2. **Normalize data structure:**
   - Categories should come from API
   - Use lookup tables for icons/metadata
   - Store IDs and references, not nested objects

3. **Centralize mutations:**
   ```typescript
   // Instead of local toggleItem
   const { mutate: toggleItem } = useMutation(
     (itemId: string) => api.shoppingList.toggle(itemId),
     { onSuccess: () => queryClient.invalidateQueries(['plan']) }
   );
   ```

---

## 4. Separation of Concerns

### Current Mixing of Responsibilities

#### 4.1 ShoppingListTab Component

**Location:** [ShoppingListTab.tsx:50-238](src/components/tabs/ShoppingListTab.tsx)

**Responsibilities (SHOULD BE SEPARATE):**
1. ❌ Data fetching (localStorage)
2. ❌ Data transformation (categorization, filtering)
3. ❌ State management (checked items)
4. ❌ Business logic (search, progress calculation)
5. ✅ UI rendering

**Lines of Code:** 189 lines - TOO LARGE

**What it does:**
- Manages search query state (UI)
- Filters items by search (business logic)
- Groups items by category (data transformation)
- Calculates progress (business logic)
- Renders complex UI with icons, checkboxes, progress bars (UI)

**Example of mixed concerns:**

```typescript
// Lines 78-91: Business logic embedded in component
const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  item.category.toLowerCase().includes(searchQuery.toLowerCase())
);

const categorizedItems = filteredItems.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, ShoppingItem[]>);
```

**Should be:**
```typescript
// hooks/useShoppingList.ts
export function useShoppingList(planId: string) {
  const { data, isLoading } = useQuery(['shopping', planId], fetchShoppingList);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(
    () => filterItems(data?.items || [], searchQuery),
    [data?.items, searchQuery]
  );

  const categorizedItems = useMemo(
    () => groupByCategory(filteredItems),
    [filteredItems]
  );

  return { categorizedItems, searchQuery, setSearchQuery, isLoading };
}
```

#### 4.2 SundayPrepTab Component

**Location:** [SundayPrepTab.tsx:8-330](src/components/tabs/SundayPrepTab.tsx)

**Lines:** 323 lines - EXTREMELY LARGE

**Responsibilities:**
1. ❌ Data persistence (localStorage)
2. ❌ Text highlighting logic (semantic parsing)
3. ❌ Collapse state management
4. ❌ Completion tracking
5. ✅ UI rendering

**Specific problem:** `highlightText` function ([SundayPrepTab.tsx:49-67](src/components/tabs/SundayPrepTab.tsx))

```typescript
const highlightText = (text: string) => {
  const parts = text.split(/(\d+(?:\/\d+)?\s*(?:cups?|tbsp|tsp|lbs?|oz|cloves?|inch|minutes?|hours?|°F|degrees)|\b(?:Add|Cook|Stir|...)/gi);
  // ... complex regex matching and JSX generation
};
```

**Issues:**
- Pure business logic (text parsing) inside React component
- Should be in `utils/textFormatting.ts`
- Cannot be tested independently
- Cannot be reused in other components

---

### Component Complexity Analysis

| Component | Lines | Responsibilities | Refactor Priority |
|-----------|-------|------------------|-------------------|
| ShoppingListTab | 189 | 5 | 🔴 HIGH |
| SundayPrepTab | 323 | 5 | 🔴 CRITICAL |
| ThisWeekTab | 226 | 3 | 🟡 MEDIUM |
| OverviewTab | 111 | 2 | 🟢 LOW |
| NotesTab | 74 | 1 | 🟢 LOW |
| MealPlanView | 53 | 2 | 🟢 LOW |
| App | 94 | 2 | 🟡 MEDIUM |

**Single Responsibility Principle Violations:**
- SundayPrepTab: Most severe - handles persistence, state, logic, formatting, UI
- ShoppingListTab: Handles filtering, grouping, persistence, state, UI
- ThisWeekTab: Better but still mixes collapse state with rendering

---

### Recommendations: Separation of Concerns

**Priority: HIGH - Must refactor before backend integration**

#### For SundayPrepTab:

```typescript
// 1. Create custom hook
// hooks/usePrepSteps.ts
export function usePrepSteps(planId: string) {
  const { data, isLoading, error } = useQuery(['prep-steps', planId], fetchSteps);
  const { mutate: toggleComplete } = useMutation(api.prepSteps.toggle);
  return { steps: data, isLoading, error, toggleComplete };
}

// 2. Extract formatting utility
// utils/recipeFormatting.ts
export function highlightRecipeText(text: string): React.ReactNode {
  // Move regex logic here
}

// 3. Extract collapse state to parent or context
// hooks/useCollapsibleItems.ts
export function useCollapsibleItems(defaultCollapsed: Set<string> = new Set()) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const toggle = (id: string) => { /* ... */ };
  return { collapsed, toggle };
}

// 4. Simplified component
export function SundayPrepTab({ planId }: Props) {
  const { steps, isLoading, toggleComplete } = usePrepSteps(planId);
  const { collapsed, toggle } = useCollapsibleItems();

  if (isLoading) return <Spinner />;

  return (
    <PrepStepsList
      steps={steps}
      collapsed={collapsed}
      onToggleCollapse={toggle}
      onToggleComplete={toggleComplete}
    />
  );
}
```

---

## 5. Data Management

### 5.1 Current Data Structure

**Location:** [data/mockPlan.ts:1-567](src/data/mockPlan.ts)

**Size:** 567 lines of hardcoded data

**Structure:**
```typescript
export const mockPlan: MealPlan = {
  id: 'mock-plan-nov-2025',
  weekStart: '2025-11-10',
  weekEnd: '2025-11-16',
  philosophy: "...",  // 300+ word paragraph
  spotlightDish: { /* ... */ },
  components: [ /* 6 items */ ],
  shoppingList: [ /* 58 items */ ],
  prepSteps: [ /* 13 detailed steps */ ],
  weekMeals: [ /* 7 meals */ ],
  notes: [ /* 6 note sections */ ]
}
```

**Assessment:**
- ✅ Well-structured and comprehensive
- ✅ Good example of expected data shape
- ❌ Tightly couples app to this specific structure
- ❌ No separation between display data and business data

### 5.2 Type Definitions

**Location:** [types/index.ts:1-66](src/types/index.ts)

**Quality:** ✅ Excellent - well-typed with clear interfaces

```typescript
export interface MealPlan {
  id: string;
  weekStart: string; // ISO date
  weekEnd: string;
  philosophy: string;
  spotlightDish: SpotlightDish;
  components: Component[];
  shoppingList: ShoppingItem[];
  prepSteps: PrepStep[];
  weekMeals: WeekMeal[];
  notes: Note[];
}
```

**Strengths:**
- Clear, semantic naming
- Proper use of union types (categories)
- Includes UI state (`checked`, `completed`, `expanded`)
- Comments for date formats

**Weaknesses for Backend Integration:**

#### Missing API Types

```typescript
// NEEDED: API response/request types
interface MealPlanResponse {
  data: MealPlan;
  meta: {
    createdAt: string;
    updatedAt: string;
    userId: string;
  };
}

interface CreateMealPlanRequest {
  weekStart: string;
  weekEnd: string;
  preferences?: {
    dietaryRestrictions: string[];
    servings: number;
  };
}

interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
```

#### Missing Domain-Specific Types

```typescript
// NEEDED: Separate UI state from domain state
interface ShoppingItemDomain {
  id: string;
  name: string;
  quantity: string;
  categoryId: string;  // Reference to Category table
}

interface ShoppingItemWithCategory extends ShoppingItemDomain {
  category: Category;
}

interface ShoppingItemUI extends ShoppingItemWithCategory {
  checked: boolean;  // UI-only state
}
```

**Current problem:** UI state mixed with domain data
- `checked` in ShoppingItem ([types/index.ts:33](src/types/index.ts))
- `completed` in PrepStep ([types/index.ts:46](src/types/index.ts))
- `expanded` in WeekMeal ([types/index.ts:58](src/types/index.ts))

These should be managed separately from server data.

---

### 5.3 Data Patterns Assessment

| Pattern | Current State | Backend-Ready? | Priority |
|---------|---------------|----------------|----------|
| Type safety | ✅ Full TypeScript | ✅ Yes | - |
| API types | ❌ None | ❌ No | 🔴 HIGH |
| Domain/UI separation | ❌ Mixed | ❌ No | 🔴 HIGH |
| Normalization | ❌ Nested objects | ❌ No | 🟡 MEDIUM |
| Validation | ❌ None | ❌ No | 🟡 MEDIUM |
| DTOs | ❌ None | ❌ No | 🟡 MEDIUM |

---

### 5.4 Mock Data Issues

**Location:** [data/mockPlan.ts](src/data/mockPlan.ts)

**Problems:**

1. **Single source of truth conflicts:**
   ```typescript
   // App.tsx:3
   import { mockPlan } from './data/mockPlan';

   // ShoppingListTab.tsx:55
   const stored = localStorage.getItem('shoppingList');
   ```

   Which is the source of truth? Mock data or localStorage?

2. **No multi-plan support:**
   - Hardcoded single plan
   - No plan selection mechanism
   - No plan listing/browsing

3. **No user association:**
   - Plan doesn't have `userId` field
   - No concept of ownership
   - No sharing/collaboration

4. **Dates are strings:**
   ```typescript
   weekStart: '2025-11-10',  // Not a Date object
   ```

   Backend will likely return ISO timestamps, requiring transformation.

---

### Recommendations: Data Management

**Priority: HIGH**

#### 1. Create Type Hierarchy

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  meta: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
}

// types/domain.ts - Pure business entities (no UI state)
export interface MealPlanDomain {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  // ... no UI state fields
}

// types/ui.ts - UI-augmented types
export interface MealPlanUI extends MealPlanDomain {
  isExpanded: boolean;
  isDirty: boolean;
  localChanges: Partial<MealPlanDomain>;
}
```

#### 2. Create API Client Structure

```typescript
// api/client.ts
export const api = {
  mealPlans: {
    list: () => get<MealPlanDomain[]>('/api/plans'),
    get: (id: string) => get<MealPlanDomain>(`/api/plans/${id}`),
    create: (data: CreatePlanRequest) => post<MealPlanDomain>('/api/plans', data),
    update: (id: string, data: UpdatePlanRequest) => patch<MealPlanDomain>(`/api/plans/${id}`, data),
  },
  shoppingList: {
    toggle: (planId: string, itemId: string) => post(`/api/plans/${planId}/shopping/${itemId}/toggle`),
  },
  // ... other endpoints
};
```

#### 3. Data Transformation Layer

```typescript
// utils/transforms.ts
export function apiToUI(plan: MealPlanResponse): MealPlanUI {
  return {
    ...plan.data,
    weekStart: new Date(plan.data.weekStart),
    weekEnd: new Date(plan.data.weekEnd),
    // Add UI-specific defaults
    isExpanded: false,
    localChanges: {},
  };
}

export function uiToApi(plan: MealPlanUI): UpdatePlanRequest {
  return {
    weekStart: plan.weekStart.toISOString(),
    weekEnd: plan.weekEnd.toISOString(),
    // Strip UI-only fields
  };
}
```

---

## 6. Component Analysis

### 6.1 Components Requiring Major Refactoring

#### 🔴 CRITICAL: SundayPrepTab.tsx

**Current State:**
- 323 lines
- 5 distinct responsibilities
- Complex regex-based text highlighting
- localStorage management
- Collapse state management

**Refactoring Plan:**

```typescript
// BEFORE: Single massive component
export function SundayPrepTab({ steps: initialSteps }: Props) {
  const [steps, setSteps] = useState<PrepStep[]>(initialSteps);
  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = localStorage.getItem('sundayPrepSteps');
    // ... 15 lines of localStorage logic
  }, []);

  const highlightText = (text: string) => {
    // ... 18 lines of complex regex
  };

  // ... 250 more lines of JSX
}

// AFTER: Decomposed into focused components and hooks
export function SundayPrepTab({ planId }: Props) {
  const { steps, toggleComplete } = usePrepSteps(planId);
  const { collapsed, toggleCollapse } = useCollapsible();

  return (
    <PrepStepsContainer>
      <PrepStepsHeader steps={steps} />
      <PrepStepsList
        steps={steps}
        collapsed={collapsed}
        onToggle={toggleComplete}
        onCollapse={toggleCollapse}
      />
      <PrepStepsTips />
    </PrepStepsContainer>
  );
}

// Separate components:
// - PrepStepsHeader (progress bar, count)
// - PrepStepItem (single step with ingredients, equipment, instructions)
// - PrepStepInstructions (formatted instructions with highlighting)
// - PrepStepIngredients (ingredient list)
// - PrepStepEquipment (equipment list)
```

**Components to Extract:**

1. `PrepStepCard` - Individual step container ([lines 108-300](src/components/tabs/SundayPrepTab.tsx))
2. `PrepStepHeader` - Step header with checkbox and metadata ([lines 115-191](src/components/tabs/SundayPrepTab.tsx))
3. `PrepStepIngredients` - Ingredient list ([lines 200-217](src/components/tabs/SundayPrepTab.tsx))
4. `PrepStepInstructions` - Formatted instructions ([lines 244-263](src/components/tabs/SundayPrepTab.tsx))
5. `ProgressBar` - Reusable progress indicator ([lines 93-98](src/components/tabs/SundayPrepTab.tsx))

**Utilities to Extract:**

1. `recipeTextHighlighting.ts` - Text formatting logic
2. `usePrepSteps.ts` - Data fetching and state
3. `useCollapsible.ts` - Collapse state management

---

#### 🔴 HIGH: ShoppingListTab.tsx

**Current State:**
- 189 lines
- Mixes search, filtering, categorization, and rendering
- localStorage persistence
- Progress calculation

**Refactoring Plan:**

```typescript
// Extract custom hook
function useShoppingList(planId: string) {
  const { data, isLoading } = useQuery(['shopping', planId], fetchShoppingList);
  const { mutate: toggleItem } = useMutation(toggleShoppingItem);
  const [searchQuery, setSearchQuery] = useState('');

  const { filteredItems, categorizedItems, progress } = useMemo(() => {
    const filtered = filterBySearch(data?.items || [], searchQuery);
    return {
      filteredItems: filtered,
      categorizedItems: groupByCategory(filtered),
      progress: calculateProgress(data?.items || []),
    };
  }, [data?.items, searchQuery]);

  return {
    items: categorizedItems,
    searchQuery,
    setSearchQuery,
    toggleItem,
    progress,
    isLoading,
  };
}

// Simplified component
export function ShoppingListTab({ planId }: Props) {
  const { items, searchQuery, setSearchQuery, toggleItem, progress } = useShoppingList(planId);

  return (
    <ShoppingListContainer>
      <ShoppingListHeader progress={progress} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <CategoryList items={items} onToggle={toggleItem} />
    </ShoppingListContainer>
  );
}
```

**Components to Extract:**

1. `ShoppingListHeader` - Header with image and progress ([lines 100-126](src/components/tabs/ShoppingListTab.tsx))
2. `SearchBar` - Search input (reusable) ([lines 129-151](src/components/tabs/ShoppingListTab.tsx))
3. `CategorySection` - Category group with items ([lines 160-218](src/components/tabs/ShoppingListTab.tsx))
4. `ShoppingItem` - Individual checkbox item ([lines 177-214](src/components/tabs/ShoppingListTab.tsx))
5. `ProgressBar` - Same as SundayPrepTab (should be shared)

**Utilities to Extract:**

1. `shoppingListFilters.ts` - Search and filtering logic
2. `categoryUtils.ts` - Grouping and icon mapping
3. `useShoppingList.ts` - Data hook

---

#### 🟡 MEDIUM: ThisWeekTab.tsx

**Current State:**
- 226 lines
- Simpler than other tabs
- Still mixes collapse state with rendering
- Read-only data (good - no localStorage issues)

**Refactoring Needs:**
- Extract `MealCard` component
- Extract `MealIngredients` component
- Move collapse logic to hook
- Less urgent than Shopping/Prep tabs

---

### 6.2 Reusable Components to Extract

Many UI patterns are duplicated across tabs:

#### ProgressBar Component

**Currently duplicated in:**
- [ShoppingListTab.tsx:119-124](src/components/tabs/ShoppingListTab.tsx)
- [SundayPrepTab.tsx:93-98](src/components/tabs/SundayPrepTab.tsx)

```typescript
// Create: components/ui/progress-bar.tsx
interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  variant?: 'default' | 'success' | 'warning';
}

export function ProgressBar({ current, total, label, variant = 'default' }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span>{label}</span>
          <span>{current}/{total}</span>
        </div>
      )}
      <div className="relative h-3 bg-muted rounded-full">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**Reuse in:** ShoppingListTab, SundayPrepTab, potentially OverviewTab

---

#### CollapsibleSection Component

**Pattern used in:**
- SundayPrepTab (prep steps)
- ThisWeekTab (meals)

```typescript
// Create: components/ui/collapsible-section.tsx
interface CollapsibleSectionProps {
  id: string;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
  header: React.ReactNode;
  children: React.ReactNode;
}
```

---

#### PageHeader Component

**Pattern duplicated in:**
- [ShoppingListTab.tsx:100-126](src/components/tabs/ShoppingListTab.tsx)
- [SundayPrepTab.tsx:74-100](src/components/tabs/SundayPrepTab.tsx)
- [ThisWeekTab.tsx:32-46](src/components/tabs/ThisWeekTab.tsx)

```typescript
// Create: components/shared/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description: string;
  image?: string;
  progress?: {
    current: number;
    total: number;
  };
}
```

---

#### EmptyState Component

**Location:** [ShoppingListTab.tsx:222-235](src/components/tabs/ShoppingListTab.tsx)

Should be extracted to `components/ui/empty-state.tsx` for reuse in:
- Shopping list with no results
- Week view with no meals
- Notes with no content

---

### 6.3 Component Coupling Analysis

**Tight Coupling Issues:**

1. **MealPlanView → Tab Components**
   - Direct prop passing of plan subsets
   - No abstraction layer
   - Change to plan structure breaks all tabs

2. **Tab Components → Mock Data Structure**
   - Components expect exact shape of `mockPlan`
   - No transformation or normalization
   - API changes require updating all components

3. **UI Components → Business Logic**
   - Filtering logic in ShoppingListTab
   - Text highlighting in SundayPrepTab
   - Cannot test business logic independently

**Decoupling Strategy:**

```typescript
// 1. Introduce view models
interface ShoppingListViewModel {
  categories: CategoryViewModel[];
  progress: ProgressInfo;
  totalItems: number;
}

// 2. Create adapters
function adaptShoppingListToViewModel(
  data: ShoppingListResponse
): ShoppingListViewModel {
  // Transform API response to view-friendly structure
}

// 3. Components consume view models
function ShoppingListTab({ planId }: Props) {
  const { data } = useQuery(['shopping', planId], fetchShoppingList);
  const viewModel = adaptShoppingListToViewModel(data);

  return <ShoppingListView model={viewModel} />;
}
```

---

## 7. Code Quality

### 7.1 TypeScript Usage

**Overall Assessment:** ✅ Excellent

**Strengths:**
- Strict mode enabled ([tsconfig.json:18](tsconfig.json))
- `noUnusedLocals` and `noUnusedParameters` enabled ([tsconfig.json:19-20](tsconfig.json))
- All components properly typed
- Good use of union types for categories ([types/index.ts:32](src/types/index.ts))
- Interface composition (e.g., `OverviewTabProps` extends base types)

**Weaknesses:**

#### 7.1.1 Missing Generic Types

```typescript
// Current: Hardcoded item types
const [items, setItems] = useState<ShoppingItem[]>(initialItems);

// Better: Generic list management
function useListState<T extends { id: string }>(
  initialItems: T[],
  storageKey?: string
) {
  // Reusable logic for any list
}
```

#### 7.1.2 Lack of Discriminated Unions for API States

```typescript
// Current: Separate loading/error flags
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
const [data, setData] = useState<MealPlan | null>(null);

// Better: Discriminated union
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

const [state, setState] = useState<AsyncState<MealPlan>>({ status: 'idle' });
```

#### 7.1.3 `any` Types (None Found ✅)

Good - no `any` types detected in the codebase.

#### 7.1.4 Optional Chaining Used Appropriately

```typescript
// Good defensive coding
{step.notes && step.notes.length > 0 && (
  <div className="p-3 bg-accent/30 rounded-lg">
```

---

### 7.2 Error Handling

**Current State:** ❌ **CRITICAL ISSUE - No error handling**

**Examples of missing error handling:**

#### localStorage Errors

```typescript
// ShoppingListTab.tsx:54-65
useEffect(() => {
  const stored = localStorage.getItem('shoppingList');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      setItems(parsed);
    } catch (e) {
      console.error('Failed to parse shopping list from localStorage');
      // ❌ No user feedback
      // ❌ No fallback behavior
      // ❌ No error reporting
    }
  }
}, []);
```

**Issues:**
- Silent failure - user never knows something went wrong
- No fallback to `initialItems`
- No clearing of corrupted localStorage data

**Should be:**
```typescript
try {
  const parsed = JSON.parse(stored);
  setItems(parsed);
} catch (e) {
  console.error('Failed to parse shopping list from localStorage', e);
  localStorage.removeItem('shoppingList'); // Clear corrupted data
  setItems(initialItems); // Fallback to props
  toast.error('Failed to load saved progress. Starting fresh.'); // User feedback
}
```

#### Image Loading Errors

```typescript
// OverviewTab.tsx:22-25
<img
  src="/food.png"
  alt="Meal prep ingredients"
  className="w-full h-full object-cover"
/>
```

**Missing:**
- `onError` handler
- Fallback image
- Loading state

**Note:** There's an `ImageWithFallback` component ([components/figma/ImageWithFallback.tsx](src/components/figma/ImageWithFallback.tsx)) but it's not being used.

---

### 7.3 Loading States

**Current State:** ❌ **NONE**

The app currently shows no loading states because data is synchronously imported:

```typescript
// App.tsx:3
import { mockPlan } from './data/mockPlan';

// Immediately available - no loading needed
```

**When backend is integrated:**

EVERY tab component will need loading states:

```typescript
// Required pattern
function ShoppingListTab({ planId }: Props) {
  const { data, isLoading, error } = useShoppingList(planId);

  if (isLoading) {
    return <ShoppingListSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (!data || data.items.length === 0) {
    return <EmptyState />;
  }

  return <ShoppingListView items={data.items} />;
}
```

**Missing Components:**

1. **Skeleton Loaders**
   - ShoppingListSkeleton
   - PrepStepsSkeleton
   - MealCardSkeleton

2. **Error States**
   - Generic error boundary
   - Inline error displays
   - Retry buttons

3. **Loading Spinners**
   - Full-page loader
   - Inline loaders for mutations

**Priority:** 🔴 **CRITICAL** - Must add before backend

---

### 7.4 Async Handling

**Current State:** ❌ **Not implemented** (no async operations)

**Future Requirements:**

#### Mutation Handling

```typescript
// Will need optimistic updates
const { mutate: toggleItem } = useMutation(
  (itemId: string) => api.shopping.toggle(planId, itemId),
  {
    // Optimistic update
    onMutate: async (itemId) => {
      await queryClient.cancelQueries(['shopping', planId]);
      const previous = queryClient.getQueryData(['shopping', planId]);

      queryClient.setQueryData(['shopping', planId], (old: ShoppingList) => ({
        ...old,
        items: old.items.map(item =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }));

      return { previous };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      queryClient.setQueryData(['shopping', planId], context.previous);
      toast.error('Failed to update item. Please try again.');
    },
  }
);
```

#### Debouncing/Throttling

Search inputs will need debouncing:

```typescript
// ShoppingListTab.tsx - search should be debounced
const [searchQuery, setSearchQuery] = useState('');

// Should be:
const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  // Only filter when debounced value changes
}, [debouncedSearch]);
```

---

### 7.5 Code Duplication

#### DRY Violations Found:

**1. Progress Bar Pattern**
- [ShoppingListTab.tsx:119-124](src/components/tabs/ShoppingListTab.tsx)
- [SundayPrepTab.tsx:93-98](src/components/tabs/SundayPrepTab.tsx)

Identical component structure, should be extracted.

**2. localStorage Pattern**
- [ShoppingListTab.tsx:54-70](src/components/tabs/ShoppingListTab.tsx)
- [SundayPrepTab.tsx:12-28](src/components/tabs/SundayPrepTab.tsx)

Same logic, different keys. Should use shared hook:

```typescript
// hooks/useLocalStorageState.ts
export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, (value: T) => void] {
  // Centralized localStorage logic with error handling
}
```

**3. Collapse State Management**
- [SundayPrepTab.tsx:36-46](src/components/tabs/SundayPrepTab.tsx)
- [ThisWeekTab.tsx:12-22](src/components/tabs/ThisWeekTab.tsx)

Identical toggle logic. Should use shared hook:

```typescript
// hooks/useCollapsible.ts
export function useCollapsible(initialCollapsed: Set<string> = new Set()) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);

  const toggle = useCallback((id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expand = useCallback((id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const collapse = useCallback((id: string) => {
    setCollapsed(prev => new Set(prev).add(id));
  }, []);

  return { collapsed, toggle, expand, collapse };
}
```

**4. Header Layout Pattern**
- [ShoppingListTab.tsx:100-126](src/components/tabs/ShoppingListTab.tsx)
- [SundayPrepTab.tsx:74-100](src/components/tabs/SundayPrepTab.tsx)
- [ThisWeekTab.tsx:32-46](src/components/tabs/ThisWeekTab.tsx)

Same grid layout, image, title, description pattern.

---

### 7.6 Code Quality Summary

| Aspect | Rating | Notes |
|--------|--------|-------|
| TypeScript Usage | ✅ Excellent | Strict mode, proper typing |
| Error Handling | ❌ Critical | None exists, must add |
| Loading States | ❌ Critical | None exists, must add |
| Async Handling | ⚠️ N/A | Not needed yet, will be critical |
| DRY Principle | ⚠️ Fair | Significant duplication |
| Code Organization | ⚠️ Fair | Logic mixed with UI |
| Comments | ✅ Good | Types are self-documenting |
| Naming | ✅ Excellent | Clear, semantic names |

**Critical Path for Backend:**
1. Add error boundaries and error states
2. Add loading skeletons
3. Extract shared hooks (localStorage, collapsible)
4. Separate business logic from components

---

## 8. Backend Integration Preparation

### 8.1 Required API Endpoints

Based on current features and data flow, the following endpoints will be needed:

#### Meal Plans

```typescript
GET    /api/plans                    // List user's meal plans
GET    /api/plans/:id                // Get single plan
POST   /api/plans                    // Create new plan
PATCH  /api/plans/:id                // Update plan
DELETE /api/plans/:id                // Delete plan
GET    /api/plans/:id/summary        // Overview data only
```

#### Shopping Lists

```typescript
GET    /api/plans/:planId/shopping                   // Get shopping list
POST   /api/plans/:planId/shopping/items             // Add custom item
PATCH  /api/plans/:planId/shopping/items/:itemId     // Update item
DELETE /api/plans/:planId/shopping/items/:itemId     // Remove item
POST   /api/plans/:planId/shopping/items/:itemId/toggle  // Toggle checked state
POST   /api/plans/:planId/shopping/bulk-toggle       // Toggle multiple items
```

#### Prep Steps

```typescript
GET    /api/plans/:planId/prep-steps                    // Get all steps
POST   /api/plans/:planId/prep-steps/:stepId/complete   // Mark step complete
POST   /api/plans/:planId/prep-steps/:stepId/uncomplete // Mark step incomplete
PATCH  /api/plans/:planId/prep-steps/:stepId            // Update custom notes
```

#### Week Meals

```typescript
GET    /api/plans/:planId/meals          // Get week's meals
PATCH  /api/plans/:planId/meals/:mealId  // Update meal (swap, customize)
```

#### Notes

```typescript
GET    /api/plans/:planId/notes          // Get all notes
POST   /api/plans/:planId/notes          // Add custom note
PATCH  /api/plans/:planId/notes/:noteId  // Update note
DELETE /api/plans/:planId/notes/:noteId  // Delete note
```

#### Categories (Reference Data)

```typescript
GET    /api/categories              // Get all shopping categories
GET    /api/categories/:id/icon     // Get category icon
```

---

### 8.2 API Client Architecture

**Recommended Structure:**

```
src/
├── api/
│   ├── client.ts           # Axios/fetch wrapper with interceptors
│   ├── endpoints/
│   │   ├── mealPlans.ts
│   │   ├── shoppingList.ts
│   │   ├── prepSteps.ts
│   │   └── meals.ts
│   ├── types/
│   │   ├── requests.ts     # Request DTOs
│   │   ├── responses.ts    # Response DTOs
│   │   └── errors.ts       # Error types
│   └── hooks/              # React Query hooks
│       ├── useMealPlans.ts
│       ├── useShoppingList.ts
│       └── usePrepSteps.ts
```

**Example Implementation:**

```typescript
// api/client.ts
import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Request interceptor for auth
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

```typescript
// api/endpoints/shoppingList.ts
import client from '../client';
import type { ShoppingListResponse, ToggleItemRequest } from '../types';

export const shoppingListApi = {
  getList: (planId: string) =>
    client.get<ShoppingListResponse>(`/plans/${planId}/shopping`),

  toggleItem: (planId: string, itemId: string) =>
    client.post(`/plans/${planId}/shopping/items/${itemId}/toggle`),

  bulkToggle: (planId: string, itemIds: string[], checked: boolean) =>
    client.post(`/plans/${planId}/shopping/bulk-toggle`, { itemIds, checked }),
};
```

```typescript
// api/hooks/useShoppingList.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingListApi } from '../endpoints/shoppingList';

export function useShoppingList(planId: string) {
  return useQuery({
    queryKey: ['shopping-list', planId],
    queryFn: () => shoppingListApi.getList(planId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useToggleShoppingItem(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => shoppingListApi.toggleItem(planId, itemId),
    onMutate: async (itemId) => {
      // Optimistic update
      await queryClient.cancelQueries(['shopping-list', planId]);
      const previous = queryClient.getQueryData(['shopping-list', planId]);

      queryClient.setQueryData(['shopping-list', planId], (old: any) => ({
        ...old,
        items: old.items.map((item: any) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['shopping-list', planId], context.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['shopping-list', planId]);
    },
  });
}
```

---

### 8.3 Authentication & Authorization

**Currently:** No auth system

**Required for Backend:**

#### 1. Authentication Flow

```typescript
// types/auth.ts
interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

```typescript
// contexts/AuthContext.tsx
export function AuthProvider({ children }: Props) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await authApi.login(email, password);
    localStorage.setItem('authToken', token);
    setAuthState({ user, isAuthenticated: true, isLoading: false });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### 2. Protected Routes

```typescript
// components/ProtectedRoute.tsx
export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

#### 3. Authorization Checks

```typescript
// Meal plans should be user-scoped
interface MealPlanDomain {
  id: string;
  userId: string;  // ← Must add this
  // ...
}

// API should enforce ownership
GET /api/plans/:id
// Returns 404 if plan doesn't belong to current user
// Not 403, to avoid leaking existence
```

---

### 8.4 State Management Strategy

**Recommendation:** Use **React Query** (TanStack Query) for server state

**Why React Query:**
1. ✅ Built-in caching and invalidation
2. ✅ Automatic background refetching
3. ✅ Optimistic updates
4. ✅ Loading and error states
5. ✅ Request deduplication
6. ✅ Pagination and infinite scroll support
7. ✅ DevTools for debugging

**Alternative Considered:** Redux Toolkit + RTK Query
- ❌ More boilerplate
- ❌ Overkill for this app's complexity
- ✅ Good for complex global state (not needed here)

**Implementation Plan:**

```typescript
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
```

**For UI State:** Continue using `useState` and Context API where appropriate

```typescript
// contexts/UIContext.tsx - For app-wide UI state
interface UIState {
  sidebarOpen: boolean;
  activeTab: TabId;
  theme: 'light' | 'dark';
}
```

---

### 8.5 Data Synchronization Strategy

**Challenge:** User can interact with shopping list/prep steps offline or while request is in-flight.

**Solution:** Optimistic updates with rollback

```typescript
export function useToggleShoppingItem(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId }: { itemId: string }) =>
      shoppingListApi.toggleItem(planId, itemId),

    // 1. Immediately update UI
    onMutate: async ({ itemId }) => {
      await queryClient.cancelQueries(['shopping-list', planId]);

      const previous = queryClient.getQueryData(['shopping-list', planId]);

      queryClient.setQueryData(['shopping-list', planId], (old: ShoppingListResponse) => ({
        ...old,
        items: old.items.map(item =>
          item.id === itemId
            ? { ...item, checked: !item.checked }
            : item
        ),
      }));

      return { previous };
    },

    // 2. On error, rollback
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['shopping-list', planId], context.previous);
      }
      toast.error('Failed to update item. Changes reverted.');
    },

    // 3. On success, refetch to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries(['shopping-list', planId]);
    },
  });
}
```

**Conflict Resolution:**
- Use optimistic locking (ETags) if multiple devices can edit same plan
- Or: Last-write-wins with timestamp comparison

---

### 8.6 Backend Integration Checklist

**BEFORE integrating backend:**

- [ ] Install React Query: `npm install @tanstack/react-query`
- [ ] Create API client structure (axios/fetch wrapper)
- [ ] Define all request/response types
- [ ] Set up error boundary components
- [ ] Create loading skeleton components
- [ ] Implement auth context and protected routes
- [ ] Extract business logic from components
- [ ] Create custom hooks for data fetching
- [ ] Set up environment variables for API URLs
- [ ] Add toast notification system (already have `sonner`)

**DURING backend integration:**

- [ ] Replace mock data imports with API calls
- [ ] Add error handling to all data-fetching components
- [ ] Implement optimistic updates for mutations
- [ ] Add retry logic for failed requests
- [ ] Test with slow network (throttling)
- [ ] Test error states (404, 500, network offline)
- [ ] Remove localStorage persistence (or use for offline mode)
- [ ] Update types to match actual API responses

**AFTER backend integration:**

- [ ] Performance testing (React Query DevTools)
- [ ] Error logging/monitoring (Sentry, LogRocket)
- [ ] Analytics for user interactions
- [ ] E2E tests for critical flows
- [ ] Load testing on backend
- [ ] Security audit (XSS, CSRF, auth)

---

## 9. Immediate Refactoring Priorities

### 9.1 CRITICAL - Must Do Before Backend

#### Priority 1: Separate Business Logic from Components

**Timeline:** 2-3 days

**Tasks:**
1. Create `hooks/` directory
2. Extract `useShoppingList` from ShoppingListTab
3. Extract `usePrepSteps` from SundayPrepTab
4. Extract `useCollapsible` (shared)
5. Extract `useLocalStorageState` (shared)

**Impact:** Enables clean API integration without rewriting entire components

---

#### Priority 2: Add Error Handling Infrastructure

**Timeline:** 1-2 days

**Tasks:**
1. Create `ErrorBoundary` component
2. Create `ErrorState` component (for inline errors)
3. Add error handling to localStorage operations
4. Create `useErrorHandler` hook
5. Set up toast notifications (sonner already installed)

**Impact:** Prevents silent failures, improves UX

---

#### Priority 3: Create Loading State Components

**Timeline:** 1 day

**Tasks:**
1. Create skeleton loaders:
   - `ShoppingListSkeleton`
   - `PrepStepsSkeleton`
   - `MealCardSkeleton`
2. Create `LoadingSpinner` component
3. Create `SuspenseWrapper` component

**Impact:** Required for async data fetching

---

### 9.2 HIGH - Should Do Before Backend

#### Priority 4: Refactor SundayPrepTab

**Timeline:** 2 days

**Tasks:**
1. Extract `highlightText` to `utils/recipeFormatting.ts`
2. Create sub-components:
   - `PrepStepCard`
   - `PrepStepHeader`
   - `PrepStepIngredients`
   - `PrepStepInstructions`
3. Move data logic to `usePrepSteps` hook

**Impact:** Makes component maintainable, testable

---

#### Priority 5: Refactor ShoppingListTab

**Timeline:** 1-2 days

**Tasks:**
1. Extract filtering logic to `utils/shoppingListFilters.ts`
2. Create sub-components:
   - `ShoppingListHeader`
   - `CategorySection`
   - `ShoppingItem`
3. Move data logic to `useShoppingList` hook

**Impact:** Cleaner component, easier to add features

---

#### Priority 6: Extract Shared Components

**Timeline:** 1 day

**Tasks:**
1. Create `ProgressBar` component
2. Create `PageHeader` component
3. Create `SearchBar` component
4. Create `EmptyState` component

**Impact:** Reduces duplication, consistent UI

---

### 9.3 MEDIUM - Can Wait Until After Backend

#### Priority 7: Refactor ThisWeekTab

**Timeline:** 1 day

**Reason:** Simpler component, less urgent

---

#### Priority 8: Add Form Validation

**Timeline:** 1-2 days

**Tasks:**
1. Set up `react-hook-form` (already installed)
2. Add validation to plan creation
3. Add validation to custom items

**Reason:** Not needed until users can create/edit plans

---

#### Priority 9: Optimize Performance

**Timeline:** Ongoing

**Tasks:**
1. Add `React.memo` to expensive components
2. Use `useMemo` for complex calculations
3. Virtualize long lists (shopping items, prep steps)
4. Code splitting for tab components

**Reason:** App is fast enough with mock data

---

### 9.4 LOW - Nice to Have

#### Priority 10: Add Tests

**Timeline:** 3-5 days

**Tasks:**
1. Unit tests for utility functions
2. Integration tests for hooks
3. Component tests for UI components
4. E2E tests for critical flows

**Reason:** Important but not blocking backend integration

---

## 10. Refactoring Roadmap

### Phase 1: Foundation (Week 1)
**Goal:** Prepare architecture for backend integration

```
Day 1-2: Infrastructure
├── Create hooks/ directory structure
├── Set up error handling system
├── Create loading state components
└── Set up React Query

Day 3-4: Business Logic Extraction
├── Extract useShoppingList hook
├── Extract usePrepSteps hook
├── Extract useCollapsible hook
└── Extract useLocalStorageState hook

Day 5: Shared Components
├── ProgressBar component
├── PageHeader component
├── EmptyState component
└── ErrorState component
```

**Deliverables:**
- [ ] `src/hooks/` directory with 4+ hooks
- [ ] `src/components/shared/` directory with common components
- [ ] Error boundary in place
- [ ] React Query configured

---

### Phase 2: Component Refactoring (Week 2)
**Goal:** Simplify and decompose large components

```
Day 1-2: SundayPrepTab
├── Extract text highlighting to utils/
├── Create PrepStepCard sub-component
├── Create PrepStepIngredients sub-component
└── Create PrepStepInstructions sub-component

Day 3-4: ShoppingListTab
├── Extract filtering logic to utils/
├── Create CategorySection sub-component
├── Create ShoppingItem sub-component
└── Integrate useShoppingList hook

Day 5: ThisWeekTab (lighter lift)
├── Create MealCard sub-component
└── Integrate collapse hook
```

**Deliverables:**
- [ ] SundayPrepTab < 100 lines
- [ ] ShoppingListTab < 100 lines
- [ ] 6+ new sub-components

---

### Phase 3: API Integration (Week 3)
**Goal:** Connect to backend

```
Day 1: API Client Setup
├── Create api/ directory structure
├── Configure axios with interceptors
├── Define request/response types
└── Create endpoint modules

Day 2-3: Replace Mock Data
├── Remove mockPlan import from App.tsx
├── Add useQuery to MealPlanView
├── Update all tab components to handle loading/error
└── Test with loading states and errors

Day 4-5: Mutations
├── Implement toggle shopping item
├── Implement toggle prep step complete
├── Add optimistic updates
└── Test rollback on errors
```

**Deliverables:**
- [ ] No mock data imports in components
- [ ] All data fetched from API
- [ ] Loading and error states working
- [ ] Optimistic updates functional

---

### Phase 4: Authentication & Polish (Week 4)
**Goal:** Production-ready application

```
Day 1-2: Authentication
├── Create AuthContext
├── Add login/logout flows
├── Implement protected routes
└── Add user profile

Day 3-4: UX Polish
├── Add toast notifications for all actions
├── Improve loading transitions
├── Add empty states for no data
└── Responsive design fixes

Day 5: Testing & Documentation
├── Manual testing of all flows
├── Fix bugs found in testing
├── Update README with setup instructions
└── Document API integration
```

**Deliverables:**
- [ ] Working authentication
- [ ] Polished UX with feedback
- [ ] Bug-free critical flows
- [ ] Documentation updated

---

## 11. Potential Risks and Challenges

### 11.1 Technical Risks

#### Risk 1: LocalStorage Conflicts
**Description:** Current localStorage implementation will conflict with server data

**Likelihood:** 🔴 HIGH

**Impact:** 🔴 HIGH - Data loss, sync issues

**Mitigation:**
1. Remove localStorage entirely during Phase 1
2. OR: Use localStorage only for draft/offline mode with clear sync strategy
3. Add data migration for users with existing localStorage data

---

#### Risk 2: API Response Shape Mismatch
**Description:** Backend may return different structure than mock data

**Likelihood:** 🟡 MEDIUM

**Impact:** 🔴 HIGH - All components break

**Mitigation:**
1. Create transformation layer (adapters) between API and components
2. Define strict TypeScript contracts with backend team
3. Use OpenAPI/Swagger for API documentation
4. Write integration tests that validate response shapes

---

#### Risk 3: Performance with Large Data Sets
**Description:** Filtering/grouping 100+ shopping items could be slow

**Likelihood:** 🟡 MEDIUM

**Impact:** 🟡 MEDIUM - Laggy UI

**Mitigation:**
1. Use `useMemo` for expensive calculations
2. Implement virtualization for long lists (`react-window`)
3. Paginate shopping lists if needed
4. Server-side filtering for search

---

#### Risk 4: Optimistic Update Failures
**Description:** Network issues could cause state inconsistencies

**Likelihood:** 🟡 MEDIUM

**Impact:** 🟡 MEDIUM - User confusion, data loss

**Mitigation:**
1. Always implement rollback in `onError`
2. Show clear feedback when mutations fail
3. Add retry logic with exponential backoff
4. Consider queueing mutations for offline support

---

### 11.2 Architectural Challenges

#### Challenge 1: State Synchronization Across Tabs
**Current:** Each tab has independent state
**Future:** Tabs need to share shopping list completion status

**Solution:**
- Use React Query's shared cache
- All tabs query same cache key
- Mutations automatically invalidate cache

---

#### Challenge 2: Real-Time Updates
**Potential Future:** Multiple users editing same plan

**Considerations:**
- WebSockets for live updates?
- Polling with React Query's refetch intervals?
- Conflict resolution strategy

**Recommendation:** Start with polling, add WebSockets later if needed

---

#### Challenge 3: Offline Support
**User Story:** User wants to check off items while shopping (might be offline)

**Options:**
1. **Basic:** Show error when offline, require connection
2. **Better:** Queue mutations, sync when online (Service Worker)
3. **Best:** Full offline mode with local DB (IndexedDB)

**Recommendation:** Start with option 1, add option 2 in Phase 5

---

### 11.3 Migration Risks

#### Risk 5: Breaking Changes for Existing Users
**Description:** Refactoring could break user workflows

**Likelihood:** 🟢 LOW (no users yet)

**Impact:** 🔴 HIGH (if there were users)

**Mitigation:**
1. Thoroughly test before deployment
2. Feature flags for gradual rollout
3. Rollback plan
4. User communication

---

## 12. Recommended Patterns and Best Practices

### 12.1 Component Patterns

#### Smart/Dumb Component Pattern

```typescript
// Smart Component (Container)
// hooks/useShoppingListContainer.ts
export function useShoppingListContainer(planId: string) {
  const { data, isLoading, error } = useShoppingList(planId);
  const { mutate: toggle } = useToggleItem(planId);
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => filterItems(data?.items || [], search),
    [data?.items, search]
  );

  return { items: filtered, isLoading, error, toggle, search, setSearch };
}

// Dumb Component (Presentational)
// components/ShoppingListView.tsx
interface ShoppingListViewProps {
  items: ShoppingItemViewModel[];
  onToggle: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ShoppingListView({ items, onToggle, searchQuery, onSearchChange }: Props) {
  // Pure rendering, no business logic
  return (
    <div>
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <ItemList items={items} onToggle={onToggle} />
    </div>
  );
}
```

**Benefits:**
- Easy to test (presentational components)
- Easy to reuse (presentational components)
- Clear separation of concerns
- Can render different UIs with same container

---

#### Compound Component Pattern

For complex components like PrepStepCard:

```typescript
// components/PrepStepCard/index.tsx
export function PrepStepCard({ children }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <PrepStepContext.Provider value={{ isExpanded, setIsExpanded }}>
      <div className="prep-step-card">{children}</div>
    </PrepStepContext.Provider>
  );
}

PrepStepCard.Header = function PrepStepCardHeader({ children }: Props) {
  const { isExpanded, setIsExpanded } = useContext(PrepStepContext);
  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      {children}
    </div>
  );
};

PrepStepCard.Body = function PrepStepCardBody({ children }: Props) {
  const { isExpanded } = useContext(PrepStepContext);
  if (!isExpanded) return null;
  return <div>{children}</div>;
};

// Usage
<PrepStepCard>
  <PrepStepCard.Header>
    <h3>Step 1</h3>
  </PrepStepCard.Header>
  <PrepStepCard.Body>
    <Ingredients />
    <Instructions />
  </PrepStepCard.Body>
</PrepStepCard>
```

---

### 12.2 Hook Patterns

#### Custom Hook Composition

```typescript
// Low-level hooks
function useFetch<T>(url: string) { /* ... */ }
function useDebounce<T>(value: T, delay: number) { /* ... */ }
function useLocalStorage<T>(key: string, initial: T) { /* ... */ }

// Composed hook
export function useShoppingList(planId: string) {
  const { data, isLoading, error } = useFetch<ShoppingList>(`/api/plans/${planId}/shopping`);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [localChecked, setLocalChecked] = useLocalStorage('checkedItems', []);

  // Merge server data with local optimistic updates
  const mergedItems = useMemo(() => {
    return mergeCheckedState(data?.items, localChecked);
  }, [data?.items, localChecked]);

  const filtered = useMemo(
    () => filterItems(mergedItems, debouncedSearch),
    [mergedItems, debouncedSearch]
  );

  return { items: filtered, isLoading, error, search, setSearch };
}
```

---

### 12.3 Error Handling Patterns

#### Error Boundary for Entire Tab

```typescript
// components/TabErrorBoundary.tsx
export function TabErrorBoundary({ children, tabName }: Props) {
  return (
    <ErrorBoundary
      fallback={({ error, reset }) => (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2>Failed to load {tabName}</h2>
          <p>{error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

// Usage
<TabErrorBoundary tabName="Shopping List">
  <ShoppingListTab planId={planId} />
</TabErrorBoundary>
```

#### Inline Error State

```typescript
export function ShoppingListTab({ planId }: Props) {
  const { data, isLoading, error, refetch } = useShoppingList(planId);

  if (error) {
    return (
      <ErrorState
        title="Failed to load shopping list"
        message={error.message}
        action={
          <button onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  // ... rest of component
}
```

---

### 12.4 TypeScript Patterns

#### Discriminated Unions for Component States

```typescript
type ComponentState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };

export function ShoppingListTab({ planId }: Props) {
  const [state, setState] = useState<ComponentState<ShoppingList>>({ status: 'idle' });

  // TypeScript knows data exists when status is 'success'
  if (state.status === 'success') {
    return <ListView items={state.data.items} />;
  }

  if (state.status === 'error') {
    return <ErrorState error={state.error} />;
  }

  if (state.status === 'loading') {
    return <LoadingSkeleton />;
  }

  return null;
}
```

---

### 12.5 Data Fetching Patterns

#### Parallel Queries

```typescript
export function MealPlanView({ planId }: Props) {
  const plan = useQuery(['plan', planId], () => fetchPlan(planId));
  const shopping = useQuery(['shopping', planId], () => fetchShopping(planId));
  const prep = useQuery(['prep', planId], () => fetchPrep(planId));

  const isLoading = plan.isLoading || shopping.isLoading || prep.isLoading;
  const error = plan.error || shopping.error || prep.error;

  if (isLoading) return <Skeleton />;
  if (error) return <Error error={error} />;

  // All data available
  return <MealPlanContent plan={plan.data} shopping={shopping.data} prep={prep.data} />;
}
```

#### Dependent Queries

```typescript
export function MealPlanView({ planId }: Props) {
  // First, get the plan
  const { data: plan, isLoading: planLoading } = useQuery(
    ['plan', planId],
    () => fetchPlan(planId)
  );

  // Then, get shopping list (only if plan loaded)
  const { data: shopping, isLoading: shoppingLoading } = useQuery(
    ['shopping', planId],
    () => fetchShopping(planId),
    { enabled: !!plan } // Only run when plan exists
  );

  if (planLoading) return <LoadingPlan />;
  if (shoppingLoading) return <LoadingShopping />;

  return <Content plan={plan} shopping={shopping} />;
}
```

---

## 13. Conclusion

### Summary of Findings

The meal prep application has a **solid UI foundation** with good component design and TypeScript usage, but requires **significant architectural changes** before backend integration:

**Strengths:**
- ✅ Well-structured type definitions
- ✅ Clean UI component library (Radix)
- ✅ Good visual design and UX
- ✅ TypeScript strict mode
- ✅ Logical feature organization

**Critical Gaps:**
- ❌ No state management for server data
- ❌ No error handling
- ❌ No loading states
- ❌ Business logic tightly coupled to UI
- ❌ No API client infrastructure
- ❌ localStorage conflicts with future server state

### Recommended Approach

**DO NOT** attempt backend integration without refactoring first. The risk of creating technical debt and introducing bugs is too high.

**FOLLOW** the 4-phase roadmap:
1. **Phase 1** (Week 1): Foundation - Extract business logic, add error handling
2. **Phase 2** (Week 2): Component refactoring - Simplify large components
3. **Phase 3** (Week 3): API integration - Connect to backend
4. **Phase 4** (Week 4): Authentication & polish - Production-ready

**PRIORITIZE**:
1. 🔴 CRITICAL: Extract hooks for data logic
2. 🔴 CRITICAL: Add error handling infrastructure
3. 🔴 CRITICAL: Create loading state components
4. 🟡 HIGH: Refactor SundayPrepTab and ShoppingListTab
5. 🟡 HIGH: Set up React Query
6. 🟢 MEDIUM: Extract shared components

### Estimated Timeline

| Phase | Duration | Parallel Work Possible? |
|-------|----------|------------------------|
| Phase 1: Foundation | 5 days | Some |
| Phase 2: Refactoring | 5 days | Yes (different tabs) |
| Phase 3: Backend Integration | 5 days | No (sequential) |
| Phase 4: Polish | 5 days | Some |
| **TOTAL** | **4 weeks** | - |

**Accelerated Timeline:** 3 weeks with 2 developers working in parallel

### Success Criteria

The refactoring is complete when:
- [ ] All tab components are < 150 lines
- [ ] Business logic extracted to custom hooks
- [ ] Error states implemented for all data operations
- [ ] Loading states implemented for all async operations
- [ ] React Query managing all server state
- [ ] No localStorage for server-synced data
- [ ] API client structure in place
- [ ] All components pass TypeScript strict checks
- [ ] No console errors in production build

### Next Steps

1. **Get approval** for 4-week refactoring timeline
2. **Set up project board** with Phase 1 tasks
3. **Start with Priority 1** tasks (hook extraction)
4. **Daily progress check-ins** to catch issues early
5. **Code review** each phase before moving to next

---

## Appendix A: File Reference Index

| File | Purpose | Lines | Refactor Priority |
|------|---------|-------|-------------------|
| [src/App.tsx](src/App.tsx) | Root component | 94 | 🟡 Medium |
| [src/main.tsx](src/main.tsx) | Entry point | 7 | 🟢 Low |
| [src/types/index.ts](src/types/index.ts) | Type definitions | 66 | 🟢 Low |
| [src/data/mockPlan.ts](src/data/mockPlan.ts) | Mock data | 567 | 🔴 Remove |
| [src/components/MealPlanView.tsx](src/components/MealPlanView.tsx) | Main container | 122 | 🟡 Medium |
| [src/components/tabs/OverviewTab.tsx](src/components/tabs/OverviewTab.tsx) | Overview view | 111 | 🟢 Low |
| [src/components/tabs/ShoppingListTab.tsx](src/components/tabs/ShoppingListTab.tsx) | Shopping list | 239 | 🔴 High |
| [src/components/tabs/SundayPrepTab.tsx](src/components/tabs/SundayPrepTab.tsx) | Prep steps | 330 | 🔴 Critical |
| [src/components/tabs/ThisWeekTab.tsx](src/components/tabs/ThisWeekTab.tsx) | Week meals | 226 | 🟡 Medium |
| [src/components/tabs/NotesTab.tsx](src/components/tabs/NotesTab.tsx) | Notes view | 74 | 🟢 Low |

---

## Appendix B: Proposed Directory Structure After Refactoring

```
src/
├── api/                           # NEW
│   ├── client.ts
│   ├── endpoints/
│   │   ├── mealPlans.ts
│   │   ├── shoppingList.ts
│   │   ├── prepSteps.ts
│   │   └── meals.ts
│   ├── types/
│   │   ├── requests.ts
│   │   ├── responses.ts
│   │   └── errors.ts
│   └── hooks/
│       ├── useMealPlans.ts
│       ├── useShoppingList.ts
│       └── usePrepSteps.ts
├── components/
│   ├── layout/                    # NEW
│   │   ├── PageHeader.tsx
│   │   └── TabContainer.tsx
│   ├── shared/                    # NEW
│   │   ├── ProgressBar.tsx
│   │   ├── SearchBar.tsx
│   │   ├── EmptyState.tsx
│   │   └── ErrorState.tsx
│   ├── shopping/                  # NEW - Refactored from ShoppingListTab
│   │   ├── ShoppingListView.tsx
│   │   ├── CategorySection.tsx
│   │   └── ShoppingItem.tsx
│   ├── prep/                      # NEW - Refactored from SundayPrepTab
│   │   ├── PrepStepsView.tsx
│   │   ├── PrepStepCard.tsx
│   │   ├── PrepStepHeader.tsx
│   │   ├── PrepStepIngredients.tsx
│   │   └── PrepStepInstructions.tsx
│   ├── tabs/                      # SLIMMED DOWN
│   │   ├── OverviewTab.tsx
│   │   ├── ShoppingListTab.tsx   # Now < 100 lines
│   │   ├── SundayPrepTab.tsx     # Now < 100 lines
│   │   ├── ThisWeekTab.tsx
│   │   └── NotesTab.tsx
│   └── ui/                        # UNCHANGED
│       └── ... (48 shadcn components)
├── contexts/                      # NEW
│   ├── AuthContext.tsx
│   └── UIContext.tsx
├── hooks/                         # NEW
│   ├── useCollapsible.ts
│   ├── useLocalStorageState.ts
│   └── useDebounce.ts
├── utils/                         # NEW
│   ├── recipeFormatting.ts
│   ├── shoppingListFilters.ts
│   ├── categoryUtils.ts
│   └── dateUtils.ts
├── types/
│   ├── index.ts                   # Domain types
│   ├── api.ts                     # NEW - API types
│   └── ui.ts                      # NEW - UI-specific types
├── data/
│   └── mockPlan.ts                # REMOVE after backend integration
├── App.tsx
├── main.tsx
└── index.css
```

---

## Appendix C: Technology Stack Assessment

| Technology | Current Version | Status | Recommendation |
|-----------|----------------|--------|----------------|
| React | 18.3.1 | ✅ Latest | Keep |
| TypeScript | 5.7.2 | ✅ Latest | Keep |
| Vite | 6.4.1 | ✅ Latest | Keep |
| Tailwind CSS | 3.4.15 | ✅ Current | Keep |
| Radix UI | Various 1.x | ✅ Current | Keep |
| React Query | ❌ Not installed | ❌ Missing | **ADD** |
| Axios | ❌ Not installed | ❌ Missing | **ADD** |
| React Router | ❌ Not installed | ⚠️ Needed soon | **ADD in Phase 4** |
| Zod | ❌ Not installed | 🟡 Optional | Consider for validation |
| Date-fns | ❌ Not installed | 🟡 Optional | Consider for date handling |

**Recommended Additions:**
```bash
npm install @tanstack/react-query axios
npm install react-router-dom
npm install zod date-fns  # Optional
```

---

**End of Research Document**

*This analysis was conducted on codebase state at commit `20a062fe` on branch `main` on 2025-11-09.*
