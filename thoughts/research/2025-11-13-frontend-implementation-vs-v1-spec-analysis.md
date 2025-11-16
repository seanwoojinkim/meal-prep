---
doc_type: research
date: 2025-11-14T02:08:40+00:00
title: "Frontend Implementation vs V1 Spec Analysis"
_generated: true
_script_version: "1.0"
_generated_at: "2025-11-14T02:08:40+00:00"
research_question: "Analyze the current frontend implementation of the meal prep app and compare it against the v1 specification document to identify what's implemented, what's missing, and what needs backend integration"
research_type: codebase_research
researcher: Sean Kim

git_commit: 139bcdcee8515a1bdcdc1edfbb77de9b38e232e7
branch: main
repository: meal-prep-app

created_by: Sean Kim
last_updated: 2025-11-13
last_updated_by: Sean Kim

tags:
  - frontend
  - implementation-status
  - gap-analysis
  - v1-spec
status: complete

related_docs:
  - thoughts/plans/v1-spec.md
---

# Research: Frontend Implementation vs V1 Spec Analysis

**Date**: 2025-11-14T02:08:40+00:00
**Researcher**: Sean Kim
**Git Commit**: 139bcdcee8515a1bdcdc1edfbb77de9b38e232e7
**Branch**: main
**Repository**: meal-prep-app

## Research Question

Analyze the current frontend implementation of the meal prep app and compare it against the v1 specification document to identify what's implemented, what's missing, and what needs backend integration.

## Executive Summary

The current frontend is a **UX prototype** built with static mock data. It implements the **Plan View experience** (viewing an existing meal plan) but is **completely missing the Plan Builder flow** (creating new plans). The app demonstrates roughly **30-40% of the v1 spec**, focused entirely on the consumption/execution side (shopping, prep, week view) rather than the creation side (recipe input, generation, chat refinement).

### High-Level Status
- **✅ Plan View UI**: Shopping list, Sunday prep timeline, week meals, overview, notes tabs
- **✅ Interactive Features**: Persistent checkboxes (localStorage), collapsible sections, search
- **❌ Plan Builder**: Recipe input, constraints form, generation button - completely missing
- **❌ Recipe Library**: No saved recipes, favorites, or recipe management
- **❌ Chat Refinement**: No chat panel or plan editing capabilities
- **❌ Backend Integration**: 100% mock data, no API calls, no authentication
- **❌ Routing**: Single-page app with no navigation beyond landing → plan view

## Architecture Overview

### Current Structure

```
src/
├── App.tsx                    # Main app with landing page + toggle to plan view
├── main.tsx                   # Vite entry point
├── types/index.ts             # TypeScript interfaces (aligned with spec data model)
├── data/mockPlan.ts          # Static mock meal plan data
├── components/
│   ├── MealPlanView.tsx      # Tab navigation container
│   ├── tabs/
│   │   ├── OverviewTab.tsx   # Week philosophy, spotlight dish, components
│   │   ├── ShoppingListTab.tsx # Categorized shopping list with checkboxes
│   │   ├── SundayPrepTab.tsx # 13-step prep timeline with progress tracking
│   │   ├── ThisWeekTab.tsx   # 7 meals with assembly instructions
│   │   └── NotesTab.tsx      # Storage tips, leftover strategy, flexibility
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # Image component (not actively used)
│   └── ui/                   # 45+ shadcn/ui components (unused in app)
```

### Technology Stack
- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Radix UI primitives (via shadcn/ui)
- **Styling**: Tailwind CSS
- **State**: React useState + localStorage (no global state management)
- **Routing**: None (conditional rendering only)
- **Data Fetching**: None (static mock data)

## Detailed Feature Analysis

### 1. Recipe Input Interface

**Spec Requirements** (v1-spec.md:96-106):
- Multi-modal input: text area, URL input, PDF upload
- "Load from My Recipes" for favorited recipes
- Constraint form (num dinners, num people, prep time budget)
- Generate button triggering Claude API

**Current Implementation**: ❌ **UI Missing**

**Status**: Not started

**What Would Need to Be Built**:
1. `PlanBuilder.tsx` component with recipe input tabs
2. `RecipeInput/TextInput.tsx` - Textarea for pasting recipes
3. `RecipeInput/URLInput.tsx` - URL field with validation
4. `RecipeInput/PDFUpload.tsx` - File upload with drag-and-drop
5. `RecipeInput/FavoriteRecipePicker.tsx` - Grid/list of saved recipes
6. `ConstraintForm.tsx` - Number of dinners, people, prep time
7. Backend: Recipe parsing API endpoint (Claude integration)
8. Backend: Recipe storage (Supabase `recipes` table)

**Data Integration Gaps**:
- No API call to parse recipes with Claude
- No Supabase storage for recipes
- No household context or authentication
- No real-time recipe parsing status

**Code References**: None (feature not implemented)

---

### 2. Plan Generation ("Generate from Favorites")

**Spec Requirements** (v1-spec.md:109-116):
- One-click generation from favorite recipes
- Auto-select recipes based on dinners count
- Show selected recipes for confirmation
- "Find complementary recipes" option (Claude search)
- Generate plan with loading state

**Current Implementation**: ❌ **UI Missing**

**Status**: Not started

**What Would Need to Be Built**:
1. "Generate from Favorites" button on landing page or recipe library
2. Recipe selection modal with checkboxes
3. Confirmation screen showing selected recipes
4. "Find complementary recipes" button (web search integration)
5. Loading state during generation (2-10 seconds)
6. Error handling for generation failures
7. Backend: Plan generation API endpoint (Claude with skill)
8. Backend: Store generated plan to Supabase `meal_plans` table

**Data Integration Gaps**:
- No Claude API integration for plan generation
- No JSON schema validation for plan output
- No recipe rotation tracking
- No "times_used" increment on recipes

**Code References**: None (feature not implemented)

---

### 3. Plan View (Overview Tab)

**Spec Requirements** (v1-spec.md:175-176):
- Plan header with name, dates, actions
- Overview with philosophy
- Spotlight dish showcase
- Core components list
- Recipe drawer (collapsible)

**Current Implementation**: 🟡 **UI Partial**

**Status**: Partially complete - overview tab exists but missing header actions and recipe drawer

**What Exists**:
- `src/components/tabs/OverviewTab.tsx` (111 lines)
  - Week date range display (OverviewTab.tsx:8-14)
  - Philosophy text (OverviewTab.tsx:33)
  - Spotlight dish card (OverviewTab.tsx:38-54)
  - Core components grid (OverviewTab.tsx:56-87)
  - Sunday Prep Philosophy section (OverviewTab.tsx:90-108)

**What's Missing**:
1. Plan header with name, actions (share, export, edit)
2. Recipe drawer showing input recipes
3. Edit plan button
4. Delete plan confirmation
5. Plan metadata (created date, last modified)

**Data Integration Gaps**:
- Plan data hardcoded in `src/data/mockPlan.ts:3-567`
- No API call to fetch plan by ID
- No household association
- Philosophy text stored as single string, not AI-generated structure

**Code References**:
- `src/components/tabs/OverviewTab.tsx:1-111`
- `src/types/index.ts:3-14` (MealPlan interface)

---

### 4. Shopping List

**Spec Requirements** (v1-spec.md:137-143):
- Grouped by category
- "Already Have" checkboxes
- "In Cart" checkboxes while shopping
- Export/share list (print, text)
- Search/filter functionality

**Current Implementation**: ✅ **UI Complete** (just needs backend hookup)

**Status**: UI fully implemented with localStorage persistence

**What Exists**:
- `src/components/tabs/ShoppingListTab.tsx` (239 lines)
  - Category grouping with custom icons (ShoppingListTab.tsx:9-48)
  - Search bar (ShoppingListTab.tsx:128-151)
  - Checkbox state management (ShoppingListTab.tsx:72-76)
  - Progress bar (ShoppingListTab.tsx:119-125)
  - localStorage persistence (ShoppingListTab.tsx:54-70)
  - Empty state (ShoppingListTab.tsx:221-235)

**What's Missing**:
1. "Already Have" vs "In Cart" distinction (currently single checkbox)
2. Export/share functionality (print, SMS, email)
3. Real-time sync across devices
4. Undo functionality

**Data Integration Gaps**:
- Checkbox state stored in localStorage, not Supabase
- No real-time subscriptions for multi-user updates
- Shopping list hardcoded in mock data (mockPlan.ts:45-103)
- Would need to replace with API call to `shopping_list_items` table

**Code References**:
- `src/components/tabs/ShoppingListTab.tsx:1-239`
- `src/types/index.ts:28-34` (ShoppingItem interface)
- localStorage keys: `shoppingList` (line 56, 69)

---

### 5. Sunday Prep Timeline

**Spec Requirements** (v1-spec.md:128-134):
- Checklist view of prep steps
- Timer integration (start, track actual time)
- Drag-and-drop reordering
- Dependency validation
- Component completion tracking
- Collapsible steps

**Current Implementation**: 🟡 **UI Partial**

**Status**: Core UI exists but missing advanced features (timers, drag-and-drop, validation)

**What Exists**:
- `src/components/tabs/SundayPrepTab.tsx` (330 lines)
  - 13-step timeline with checkboxes (SundayPrepTab.tsx:104-302)
  - Collapsible step sections (SundayPrepTab.tsx:36-46)
  - Progress tracking (SundayPrepTab.tsx:69, 93-98)
  - Ingredient and equipment lists (SundayPrepTab.tsx:198-239)
  - Instructions with syntax highlighting (SundayPrepTab.tsx:48-67, 242-264)
  - Parallel task indicators (SundayPrepTab.tsx:149-157)
  - Pro tips section (SundayPrepTab.tsx:266-294)
  - localStorage persistence (SundayPrepTab.tsx:12-28)

**What's Missing**:
1. Timer integration (countdown, elapsed time)
2. Actual time tracking vs estimated
3. Drag-and-drop reordering (React DnD)
4. Dependency validation on reorder
5. Component completion tracking (separate from step completion)

**Data Integration Gaps**:
- Checkbox state in localStorage, not Supabase `prep_steps` table
- No real-time sync for multi-cook scenarios
- No actual_minutes field being updated
- Prep steps hardcoded in mock data (mockPlan.ts:104-366)

**Code References**:
- `src/components/tabs/SundayPrepTab.tsx:1-330`
- `src/types/index.ts:36-47` (PrepStep interface)
- localStorage key: `sundayPrepSteps` (line 14, 27)

---

### 6. Week Assembly (This Week Tab)

**Spec Requirements** (v1-spec.md:146-152):
- Ordered list of meals (7 days)
- Drag to reorder days
- Assembly instructions per meal
- Component status indicators
- Optional step checkboxes during assembly

**Current Implementation**: 🟡 **UI Partial**

**Status**: Basic meal cards exist but missing reordering and component status

**What Exists**:
- `src/components/tabs/ThisWeekTab.tsx` (226 lines)
  - 7 meal cards (Sunday-Saturday) (ThisWeekTab.tsx:49-197)
  - Collapsible meal details (ThisWeekTab.tsx:12-22)
  - Day badges (ThisWeekTab.tsx:62-64)
  - Components from Sunday Prep section (ThisWeekTab.tsx:124-141)
  - Fresh ingredients list (ThisWeekTab.tsx:143-163)
  - Assembly instructions (ThisWeekTab.tsx:166-189)
  - Assembly time and cooking method metadata (ThisWeekTab.tsx:73-83)

**What's Missing**:
1. Drag-and-drop meal reordering
2. Component prep status indicators (checkmark if prepped)
3. Per-meal completion tracking
4. Assembly step checkboxes
5. Freshness priority sorting (early/mid/late week)

**Data Integration Gaps**:
- No state persistence for meal order
- No link to component prep status from Sunday Prep tab
- Week meals hardcoded in mock data (mockPlan.ts:367-498)
- Components array is just strings, not linked to Component table

**Code References**:
- `src/components/tabs/ThisWeekTab.tsx:1-226`
- `src/types/index.ts:49-59` (WeekMeal interface)

---

### 7. Chat Refinement Panel

**Spec Requirements** (v1-spec.md:119-124):
- Collapsible chat panel
- Message history with user/assistant roles
- Context-aware refinement suggestions
- Section regeneration (shopping list, timeline, specific meals)
- Accept/reject changes
- "Suggest a recipe with white beans" type queries

**Current Implementation**: ❌ **UI Missing**

**Status**: Not started

**What Would Need to Be Built**:
1. `ChatPanel.tsx` component (collapsible sidebar/modal)
2. Message list with user/assistant bubbles
3. Text input with send button
4. "Regenerate this section" buttons on tabs
5. Diff view for proposed changes
6. Accept/reject buttons
7. Loading states during Claude processing
8. Backend: Chat refinement API endpoint
9. Backend: Store chat history in Supabase

**Data Integration Gaps**:
- No Claude API integration for refinement
- No prompt templates for section regeneration
- No plan versioning or change history
- No context injection (current plan state)

**Code References**: None (feature not implemented)

---

### 8. Recipe Library

**Spec Requirements** (v1-spec.md:187-193):
- Recipe grid showing all saved recipes
- Filters (favorites, recently used)
- Recipe cards with favorite button
- Usage stats (times used, last used)
- Recipe detail view
- Edit/delete recipe

**Current Implementation**: ❌ **UI Missing**

**Status**: Not started

**What Would Need to Be Built**:
1. `RecipeLibrary.tsx` page component
2. `RecipeGrid.tsx` with masonry/grid layout
3. `RecipeCard.tsx` with image, title, favorite button
4. Filters component (favorites, date range, tags)
5. Recipe detail modal/page
6. Edit recipe form
7. Delete confirmation dialog
8. Backend: Fetch recipes from Supabase `recipes` table
9. Backend: Update favorite status, usage stats

**Data Integration Gaps**:
- No recipes table being queried
- No household_id filtering
- No favorite toggle API
- No times_used increment on plan generation

**Code References**: None (feature not implemented)

---

### 9. Landing Page & Navigation

**Spec Requirements** (v1-spec.md:95, 159-161):
- "New Plan" button
- Recent plans carousel
- Navigation to plan builder
- Navigation to recipe library
- Plan list/history

**Current Implementation**: 🟡 **UI Partial**

**Status**: Basic landing page exists but missing most navigation

**What Exists**:
- `src/App.tsx` (95 lines)
  - Landing page with hero section (App.tsx:13-49)
  - "View Mock Plan" button (App.tsx:33-41)
  - Feature grid (3 cards) (App.tsx:50-91)
  - Single state toggle between landing and plan view (App.tsx:6-10)

**What's Missing**:
1. "Create New Plan" button (goes to plan builder)
2. Recent plans carousel
3. Navigation menu (Recipe Library, Settings)
4. Plan history/list view
5. Proper routing (React Router)
6. Authentication/household context

**Data Integration Gaps**:
- No API call to fetch recent plans
- No routing library installed
- No authentication context
- Hardcoded mock plan reference (App.tsx:9)

**Code References**:
- `src/App.tsx:1-95`

---

### 10. Notes Tab

**Spec Requirements** (v1-spec.md:184):
- General notes about the plan
- Storage tips
- Leftover strategies
- Flexibility suggestions

**Current Implementation**: ✅ **UI Complete** (just needs backend hookup)

**Status**: UI fully implemented

**What Exists**:
- `src/components/tabs/NotesTab.tsx` (74 lines)
  - Notes list with cards (NotesTab.tsx:27-56)
  - Title and content sections (NotesTab.tsx:33-52)
  - Additional resources section (NotesTab.tsx:58-71)

**What's Missing**:
- Nothing major (UI is complete)

**Data Integration Gaps**:
- Notes hardcoded in mock data (mockPlan.ts:499-566)
- Would need to fetch from `generated_plan.notes` JSON field
- No ability to edit or add custom notes

**Code References**:
- `src/components/tabs/NotesTab.tsx:1-74`
- `src/types/index.ts:61-65` (Note interface)

---

## Data Model Alignment

### TypeScript Interfaces vs Spec Schema

The `src/types/index.ts` file defines interfaces that **loosely align** with the spec but are **simplified** for the frontend prototype.

#### What's Aligned

```typescript
// src/types/index.ts:3-14
interface MealPlan {
  id: string;              // ✅ Matches spec
  weekStart: string;       // ✅ Matches date range concept
  weekEnd: string;         // ✅ Matches date range concept
  philosophy: string;      // ✅ Matches generated_plan.overview
  spotlightDish: SpotlightDish;  // ✅ Matches concept
  components: Component[]; // ✅ Matches spec Component table
  shoppingList: ShoppingItem[]; // ✅ Matches spec ShoppingListItem
  prepSteps: PrepStep[];   // ✅ Matches spec PrepStep
  weekMeals: WeekMeal[];   // ✅ Matches spec WeekMeal
  notes: Note[];           // ✅ Matches generated_plan.notes
}
```

#### What's Missing or Different

**Missing from TypeScript interfaces**:
1. `household_id` (foreign key) - No household concept yet
2. `num_dinners`, `num_people`, `prep_time_minutes` (constraints)
3. `status` enum (generating, ready, in_progress, completed)
4. `MealPlanRecipe` join table (linking recipes to plans)
5. `Recipe` entity entirely (only referenced as strings)
6. Separate `GeneratedPlan` entity (currently flattened into MealPlan)

**Different representations**:
- `philosophy` is a single string (spec has structured `overview` with summary, total_prep_time, component_philosophy)
- `components` array is simplified (missing type enum, shelf_life_days, prepped status)
- `shoppingList` items lack `already_have` field (only single `checked` boolean)
- `prepSteps` missing `actual_minutes` field for timer tracking
- `weekMeals` missing `is_spotlight` boolean, `components_used` is string array not IDs

**Spec tables not represented**:
- `Household`
- `Recipe` (title, source_type, source_content, parsed_content, is_favorite, times_used)
- `MealPlanRecipe` join table
- `GeneratedPlan` (separate entity with JSON fields)

### JSON Schema Compliance

The spec defines detailed JSON schemas for:
1. **Recipe Parse Schema** (v1-spec.md:239-261) - Not used (no parsing implemented)
2. **Plan Generation Schema** (v1-spec.md:264-335) - Partially matches mock data structure

The mock data in `src/data/mockPlan.ts` approximates the plan generation schema but is **hand-crafted**, not AI-generated.

---

## Mock Data Analysis

### What's Mocked

**File**: `src/data/mockPlan.ts` (567 lines)

The entire app runs on a single hardcoded meal plan:

```typescript
// src/data/mockPlan.ts:3-7
export const mockPlan: MealPlan = {
  id: 'mock-plan-nov-2025',
  weekStart: '2025-11-10',
  weekEnd: '2025-11-16',
  philosophy: "This week's meal prep centers around...",
  // ... 560+ lines of static data
}
```

**What's included**:
- 1 weekly meal plan (Nov 10-16, 2025)
- 6 core components (soups, beans, sweet potatoes, pickled onions, garlic)
- 103 shopping list items across 6 categories
- 13 prep steps with full instructions
- 7 meals (Sunday-Saturday)
- 6 note sections (storage, leftover strategy, flexibility)

**What's realistic**:
- Data structure matches expected plan output from Claude
- Ingredient quantities are specific and practical
- Prep timeline is detailed and actionable
- Recipes are from real sources (NYT Cooking)

**What's not realistic**:
- Only 1 plan (real app would have many per household)
- No user-specific data (dietary preferences, past plans)
- No recipe library to draw from
- No chat history or refinement iterations

### Where Mock Data is Used

1. **App.tsx:3** - Imports mockPlan
2. **App.tsx:9** - Passes to MealPlanView
3. **All tab components** - Receive data as props from parent

To replace with real data:
1. Add API client (e.g., Supabase client initialization)
2. Create hooks: `useMealPlan(planId)`, `useShoppingList(planId)`, etc.
3. Replace static imports with API calls
4. Add loading states and error handling
5. Update components to handle empty states

---

## User Flows Analysis

### Flow 1: Create New Plan

**Spec**: Landing → Recipe Input → Constraints → Generate → Plan View

**Implementation**: ❌ Not implemented

**Status**: 0% complete

**What's missing**: Entire flow (no plan builder, no recipe input, no generation)

---

### Flow 2: Generate from Favorites

**Spec**: Button → Select recipes → Confirm → Generate

**Implementation**: ❌ Not implemented

**Status**: 0% complete

**What's missing**: No recipe library, no favorites, no generation flow

---

### Flow 3: Refine Plan via Chat

**Spec**: Plan View → Chat panel → Message → Accept changes

**Implementation**: ❌ Not implemented

**Status**: 0% complete

**What's missing**: No chat panel, no refinement API

---

### Flow 4: Sunday Prep

**Spec**: Plan View → Sunday Prep tab → Check steps → Track time

**Implementation**: ✅ Partially implemented

**Status**: 70% complete

**What exists**:
- Sunday Prep tab with step checklist
- Collapsible sections
- Progress tracking
- localStorage persistence

**What's missing**:
- Timer integration
- Actual vs estimated time tracking
- Drag-and-drop reordering
- Real-time sync

---

### Flow 5: Shopping

**Spec**: Plan View → Shopping List tab → Check items → Export

**Implementation**: ✅ Partially implemented

**Status**: 80% complete

**What exists**:
- Shopping list tab with categories
- Checkboxes with persistence
- Search functionality
- Progress bar

**What's missing**:
- "Already Have" vs "In Cart" distinction
- Export/share (print, SMS, email)
- Real-time sync

---

### Flow 6: Weeknight Assembly

**Spec**: Plan View → This Week tab → Select meal → Follow instructions

**Implementation**: ✅ Partially implemented

**Status**: 60% complete

**What exists**:
- This Week tab with 7 meals
- Assembly instructions
- Collapsible meal cards
- Component lists

**What's missing**:
- Drag-and-drop meal reordering
- Component prep status indicators
- Assembly step checkboxes
- Meal completion tracking

---

## Features Beyond Spec

### Implemented Features Not in V1 Spec

1. **Search functionality** on shopping list (ShoppingListTab.tsx:52, 128-151)
   - Not mentioned in spec
   - Filters items by name or category
   - Useful for large shopping lists

2. **Syntax highlighting** in prep steps (SundayPrepTab.tsx:48-67)
   - Highlights temperatures (red), times (orange), measurements (blue), action verbs (bold)
   - Not mentioned in spec
   - Improves scannability during cooking

3. **Progress bars** on shopping and prep tabs
   - Visual progress indicators (ShoppingListTab.tsx:119-125, SundayPrepTab.tsx:93-98)
   - Not explicitly called out in spec
   - Motivational and informative

4. **Collapsible sections** everywhere
   - Prep steps and meals can be collapsed after completion
   - Reduces visual clutter
   - Not in spec but aligns with mobile-first thinking

5. **localStorage persistence** for checkboxes
   - Shopping list and prep steps persist across page refreshes
   - Spec mentions real-time sync but not localStorage fallback
   - Good for offline-first approach

### Unused shadcn/ui Components

The project has **45+ UI components** installed but most are unused:

**Installed but unused**:
- Accordion, Alert Dialog, Avatar, Badge, Breadcrumb, Calendar
- Carousel, Chart, Command, Context Menu, Dialog, Drawer
- Dropdown Menu, Form, Hover Card, Input OTP, Label, Menubar
- Navigation Menu, Pagination, Popover, Radio Group, Resizable
- Select, Sheet, Sidebar, Skeleton, Slider, Sonner (toasts)
- Switch, Table, Toggle, Tooltip

**In use**:
- Button (in App.tsx buttons, implicit in tabs)
- Card (in all tab components)
- Checkbox (in shopping list and prep timeline)
- Input (in shopping list search)
- Progress (in shopping list and prep timeline progress bars)
- Tabs (could be used, currently custom implementation)

**Why so many?** Likely installed via shadcn CLI ("add all components") but only UI for Plan View was built.

---

## Implementation Readiness by Feature Area

### Recipe Input
- **Status**: ❌ UI Missing
- **Backend needed**: Recipe parsing API (Claude), Supabase recipes table
- **Effort**: 2-3 days (text input), +1 day (URL fetch), +1 day (PDF upload)

### Plan Generation
- **Status**: ❌ UI Missing
- **Backend needed**: Plan generation API (Claude with skill), Supabase meal_plans/generated_plans tables
- **Effort**: 2-3 days (UI), 3-5 days (backend with Claude integration)

### Shopping List
- **Status**: ✅ UI Complete (needs backend hookup)
- **Backend needed**: Supabase shopping_list_items table, real-time subscriptions
- **Effort**: 1 day (replace localStorage with Supabase)

### Sunday Prep
- **Status**: 🟡 UI Partial (missing timers, drag-and-drop)
- **Backend needed**: Supabase prep_steps table, real-time subscriptions
- **Effort**: 1 day (backend hookup), +2 days (timer integration), +1 day (drag-and-drop)

### Week Assembly
- **Status**: 🟡 UI Partial (missing reordering, component status)
- **Backend needed**: Supabase week_meals and components tables
- **Effort**: 1 day (backend hookup), +1 day (drag-and-drop), +1 day (component status)

### Chat Refinement
- **Status**: ❌ UI Missing
- **Backend needed**: Chat API (Claude with context), plan versioning
- **Effort**: 3-4 days (chat UI), 3-5 days (backend refinement logic)

### Recipe Library
- **Status**: ❌ UI Missing
- **Backend needed**: Supabase recipes table, favorite toggle API
- **Effort**: 2-3 days (UI), 1 day (backend)

### Landing Page & Navigation
- **Status**: 🟡 UI Partial (missing routing, plan list)
- **Backend needed**: Fetch recent plans, authentication
- **Effort**: 1 day (routing), 1 day (plan list), 2 days (auth)

---

## Backend Integration Checklist

To make this app functional, you need:

### Database (Supabase)
1. ✅ Schema matches spec (v1-spec.md:8-89)
2. Row-level security for household isolation
3. Real-time subscriptions for shopping/prep checkboxes
4. Storage bucket for PDF uploads

### API Endpoints
1. `POST /recipes/parse` - Parse recipe from text/URL/PDF with Claude
2. `POST /plans/generate` - Generate meal plan from recipes with Claude
3. `POST /plans/:id/refine` - Chat-based plan refinement
4. `GET /plans/:id` - Fetch full plan with all related data
5. `GET /recipes` - List recipes for household
6. `PATCH /recipes/:id` - Update recipe (favorite, usage stats)
7. `PATCH /shopping-list/:id` - Toggle item checked status
8. `PATCH /prep-steps/:id` - Update step completion, actual time
9. `PATCH /week-meals/:id` - Update meal order, completion

### Claude Integration
1. Recipe parsing prompt (v1-spec.md:339-354)
2. Plan generation prompt with full skill (v1-spec.md:356-377)
3. Refinement prompt (v1-spec.md:379-387)
4. Recipe suggestion prompt (v1-spec.md:389-404)
5. JSON mode for structured outputs
6. Error handling for malformed responses

### Authentication
1. Magic link setup (Supabase Auth)
2. Household creation on first login
3. HouseholdContext provider
4. Protected routes

### State Management
1. Replace localStorage with Supabase queries
2. React Query or SWR for data fetching
3. Optimistic updates for checkboxes
4. Real-time subscription hooks

---

## Mobile Responsiveness

The spec defines mobile breakpoints (v1-spec.md:406-431). Current implementation has **good responsive design**:

### What's responsive
- Tab navigation scrolls horizontally on mobile (MealPlanView.tsx:77)
- Grid layouts collapse to single column (e.g., OverviewTab.tsx:59)
- Images scale appropriately (all tab headers)
- Touch-friendly checkboxes (large tap targets)
- Sticky tab navigation (MealPlanView.tsx:75)

### What's missing
- Bottom sheet for recipe details (spec mentions, not implemented)
- Fab button for chat (chat not implemented)
- Swipe gestures for meal reordering (no reordering)
- Voice input for checking items (future feature)

### Breakpoints used
- `md:` (768px+) - Two-column layouts, horizontal metadata
- Mobile-first approach throughout

The responsive design is **well-executed** for the implemented features.

---

## Next Steps: What to Build

### Phase 1: Core MVP (Backend Integration)
**Goal**: Make the existing UI functional with real data

1. **Supabase Setup** (2 days)
   - Create tables matching spec
   - Set up Row-Level Security
   - Configure real-time subscriptions

2. **Plan Fetching** (1 day)
   - Replace mockPlan with API call
   - Add loading states
   - Handle errors/empty states

3. **Shopping List Backend** (1 day)
   - Save checkbox state to Supabase
   - Real-time sync for multi-user

4. **Prep Timeline Backend** (1 day)
   - Save completion state to Supabase
   - Track actual time vs estimated

5. **Week Meals Backend** (1 day)
   - Save meal order to Supabase
   - Link to component prep status

**Estimated**: 6 days, Result: Functional read-only plan viewer

---

### Phase 2: Plan Builder
**Goal**: Let users create plans

1. **Recipe Input UI** (3 days)
   - Text area for pasted recipes
   - URL input with validation
   - PDF upload component
   - Constraint form (dinners, people, time)

2. **Recipe Parsing Backend** (2 days)
   - Claude API integration
   - Store parsed recipes to Supabase
   - Handle parsing errors

3. **Plan Generation Backend** (3 days)
   - Claude with meal prep skill
   - JSON schema validation
   - Store generated plan to Supabase

4. **Generate Button Flow** (2 days)
   - Loading state (2-10 seconds)
   - Success → Navigate to plan view
   - Error handling

**Estimated**: 10 days, Result: End-to-end plan creation flow

---

### Phase 3: Intelligence Features
**Goal**: Add chat refinement and recipe library

1. **Recipe Library UI** (2 days)
   - Grid of saved recipes
   - Favorite button
   - Filters (favorites, recent)
   - Recipe detail view

2. **Recipe Library Backend** (1 day)
   - Fetch recipes for household
   - Update favorite status
   - Track usage stats

3. **Chat Refinement UI** (3 days)
   - Collapsible chat panel
   - Message bubbles
   - "Regenerate section" buttons
   - Accept/reject changes

4. **Chat Refinement Backend** (3 days)
   - Claude with plan context
   - Section-specific regeneration
   - Plan versioning

**Estimated**: 9 days, Result: Full v1 spec feature set

---

### Phase 4: Polish
**Goal**: Production-ready

1. **Authentication** (2 days)
   - Magic link login
   - Household creation
   - Protected routes

2. **Routing** (1 day)
   - React Router setup
   - Landing → Builder → Plan View → Library

3. **Advanced Features** (3 days)
   - Drag-and-drop (React DnD)
   - Timer integration
   - Export/print shopping list

4. **Mobile Optimization** (2 days)
   - Bottom sheets
   - Swipe gestures
   - Touch optimizations

5. **Testing & Deployment** (2 days)
   - E2E tests (Playwright)
   - Vercel/Netlify deployment
   - Environment variables

**Estimated**: 10 days, Result: Production-ready app

---

## Total Implementation Timeline

| Phase | Description | Duration | Cumulative |
|-------|-------------|----------|------------|
| **Phase 1** | Backend integration for existing UI | 6 days | 6 days |
| **Phase 2** | Plan builder and generation | 10 days | 16 days |
| **Phase 3** | Intelligence (chat, recipes) | 9 days | 25 days |
| **Phase 4** | Polish and production | 10 days | **35 days** |

**Total**: ~7 weeks (5 work weeks) for complete v1 spec implementation

**Current Progress**: ~30-40% (UI only, no backend)

---

## Architectural Recommendations

Based on this analysis, consider:

### 1. Add Routing
Install React Router to support:
- `/` - Landing page
- `/builder` - Plan builder (recipe input)
- `/plans/:id` - Plan view (current MealPlanView)
- `/recipes` - Recipe library
- `/settings` - Household settings

### 2. Add State Management
Current useState + localStorage won't scale. Consider:
- **React Query** or **SWR** for server state
- **Zustand** for client state (UI toggles, filters)
- Keep localStorage as offline fallback

### 3. Add API Client
Create `src/lib/api.ts` with:
- Supabase client initialization
- API methods (fetchPlan, updateShoppingItem, etc.)
- Error handling
- Type-safe responses

### 4. Refactor for Reusability
Extract common patterns:
- `<CollapsibleSection>` component (used in 3+ places)
- `<CheckboxList>` component (shopping + prep)
- `<ProgressBar>` component (shopping + prep)
- Custom hooks: `usePersistentState(key, defaultValue)`

### 5. Add Loading States
Every API call needs:
- Loading spinner or skeleton
- Error boundary
- Retry logic
- Empty state

### 6. Real-Time Subscriptions
For shopping/prep checkboxes:
- Subscribe to Supabase table changes
- Optimistic updates (check immediately, sync in background)
- Conflict resolution (last-write-wins)

---

## Code Quality Notes

### Strengths
- **TypeScript usage**: All components are typed
- **Consistent styling**: Tailwind classes are well-organized
- **Accessibility**: Proper semantic HTML, ARIA labels on checkboxes
- **Responsive design**: Mobile-first approach throughout
- **Code organization**: Clear separation of concerns (tabs, types, data)

### Areas for Improvement
- **No tests**: No unit or integration tests
- **Hardcoded strings**: Many UI strings should be i18n-ready
- **Prop drilling**: Plan data passed through multiple levels
- **No error boundaries**: App will crash on unhandled errors
- **Magic strings**: localStorage keys should be constants
- **No validation**: User input (search) is unvalidated

### Technical Debt
1. 45+ unused UI components (consider removing)
2. `ImageWithFallback.tsx` component not used
3. Mock data file is 567 lines (consider splitting)
4. No environment variables (hardcoded values)
5. No API client abstraction

---

## Related Research Documents

- **Spec**: [v1-spec.md](/Users/seankim/dev/meal-prep-app/thoughts/plans/v1-spec.md)
- **Current Implementation**: This document

---

## Conclusion

The current frontend is a **high-quality UX prototype** that demonstrates the Plan View experience beautifully. It successfully validates the core user flows (shopping, prep, week assembly) with realistic mock data and polished interactions.

**What's done well**:
- Shopping list is production-ready UI (just needs backend)
- Sunday prep timeline is detailed and actionable
- Week meals view clearly shows components vs fresh ingredients
- Responsive design works across devices
- TypeScript types align with spec data model

**Critical gaps**:
- **Zero plan creation flow** (biggest gap)
- No backend integration (100% mock data)
- No authentication or multi-user support
- No recipe library or favorites
- No chat refinement
- No routing (single-page only)

**Recommended path forward**:
1. Start with Phase 1 (backend integration) to make existing UI functional
2. Build Phase 2 (plan builder) for end-to-end flow
3. Add Phase 3 (intelligence) for full spec compliance
4. Polish in Phase 4 for production

The foundation is solid. The main work ahead is backend integration and filling the plan creation gaps.
