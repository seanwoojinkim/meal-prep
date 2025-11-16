# Implementation Spec: Modular Meal Prep Web App v1

## Overview
This specification defines the v1 implementation of a modular meal prep web application that uses Claude to generate intelligent weekly meal plans optimized for Sunday batch cooking and quick weeknight assembly.

## Data Model

```typescript
Household
- id (uuid)
- name (string, optional)
- created_at

Recipe
- id (uuid)
- household_id (foreign key)
- title (string)
- source_type (enum: 'text', 'url', 'pdf')
- source_content (text/url/base64)
- parsed_content (text) // Claude's interpretation
- is_favorite (boolean)
- times_used (integer)
- last_used_at (timestamp)
- created_at

MealPlan
- id (uuid)
- household_id (foreign key)
- created_at
- num_dinners (integer, default 5-6)
- num_people (integer, default 2)
- prep_time_minutes (integer, optional)
- status (enum: 'generating', 'ready', 'in_progress', 'completed')

MealPlanRecipe (join table)
- meal_plan_id
- recipe_id
- added_by (enum: 'user', 'generated') // user-provided vs Claude-suggested

GeneratedPlan
- id (uuid)
- meal_plan_id (foreign key, unique) // one per meal plan for now
- overview (text)
- shopping_list (jsonb) // structured categories
- sunday_timeline (jsonb) // steps with estimated times
- component_inventory (jsonb) // components with storage notes
- week_assembly (jsonb) // ordered meals with instructions
- notes (text)
- created_at

ShoppingListItem
- id (uuid)
- generated_plan_id (foreign key)
- category (string)
- item (string)
- quantity (string)
- already_have (boolean, default false)
- checked_off (boolean, default false)

PrepStep
- id (uuid)
- generated_plan_id (foreign key)
- order_index (integer)
- time_label (string) // "2:00 PM - START"
- description (text)
- estimated_minutes (integer, optional)
- actual_minutes (integer, optional)
- completed (boolean, default false)

Component
- id (uuid)
- generated_plan_id (foreign key)
- name (string)
- type (enum: 'grain', 'protein', 'vegetable', 'aromatic', 'sauce', 'broth')
- storage_note (string)
- shelf_life_days (integer)
- prepped (boolean, default false)

WeekMeal
- id (uuid)
- generated_plan_id (foreign key)
- day_index (integer, 0-6) // user can reorder
- title (string)
- assembly_time_minutes (integer)
- instructions (text)
- serves (integer)
- components_used (array of component ids)
- is_spotlight (boolean)
```

## User Flows

### 1. Create New Plan
```
Landing → "New Plan"
→ Recipe Input Interface (multi-modal)
   - Text area (paste recipes)
   - URL input (fetch and parse)
   - PDF upload
   - "Load from My Recipes" (favorited recipes)
→ Constraint Form
   - Number of dinners (default 5-6)
   - Number of people (default 2)
   - Optional: Prep time budget
→ Generate (Claude API call with skill)
→ Plan View
```

### 2. Generate from Favorites ("Lazy Mode")
```
"Generate from Favorites"
→ Select number of recipes (or auto-select based on dinners)
→ Show selected recipes for confirmation
→ Option: "Find complementary recipes" (Claude searches)
→ Generate plan
```

### 3. Refine Plan via Chat
```
Plan View → Chat panel (collapsible)
→ User: "Make the timeline shorter" or "Suggest a recipe with white beans"
→ Claude responds with refined section or suggestions
→ User can accept and regenerate that section
```

### 4. Sunday Prep
```
Plan View → "Sunday Prep" tab
→ Checklist view of PrepSteps
→ Optional: Start timer, track actual time
→ User can reorder steps (drag-and-drop)
→ System validates dependencies and warns if needed
→ Check off components as prepped
```

### 5. Shopping
```
Plan View → "Shopping List" tab
→ Grouped by category
→ Check off "Already Have"
→ Check off "In Cart" while shopping
→ Export/share list (print, text, etc.)
```

### 6. Weeknight Assembly
```
Plan View → "This Week" tab
→ Ordered list of meals (drag to reorder days)
→ Click meal → Opens assembly instructions
→ Shows which components needed (with prep status)
→ Optional: Check off steps as you assemble
```

## UI Component Hierarchy

```
App
├── HouseholdContext (auth/routing)
├── LandingPage
│   ├── CreatePlanButton
│   └── RecentPlansCarousel
│
├── PlanBuilder
│   ├── RecipeInput
│   │   ├── TextInput
│   │   ├── URLInput
│   │   ├── PDFUpload
│   │   └── FavoriteRecipePicker
│   ├── ConstraintForm
│   └── GenerateButton
│
├── PlanView
│   ├── PlanHeader (name, dates, actions)
│   ├── RecipeDrawer (collapsible, shows inputs)
│   ├── TabNavigation
│   │   ├── OverviewTab
│   │   ├── ShoppingTab
│   │   │   └── ShoppingList (grouped, checkable)
│   │   ├── SundayPrepTab
│   │   │   ├── Timeline (reorderable)
│   │   │   └── ComponentChecklist
│   │   ├── ThisWeekTab
│   │   │   └── MealCards (reorderable, expandable)
│   │   └── NotesTab
│   └── ChatPanel (collapsible, for refinements)
│
└── RecipeLibrary
    ├── RecipeGrid (all saved recipes)
    ├── Filters (favorites, recently used)
    └── RecipeCard
        ├── FavoriteButton
        └── UsageStats
```

## Technical Decisions

### Backend: Supabase
- Quick setup, handles auth if needed later
- Real-time subscriptions for multi-user
- Row-level security for household isolation
- Built-in storage for PDFs

### Frontend: React + TypeScript
- Existing UI component library
- React DnD for reordering
- TanStack Query for data fetching
- Zustand or Context for local state

### Claude Integration
- User provides API key (stored in localStorage or Supabase user settings)
- Include full skill content in system prompt
- Use JSON mode for structured section generation
- Immediate recipe parsing on input (background job)

### Real-time Features
- Supabase real-time subscriptions for:
  - Shopping list check-offs
  - Prep step completions
  - Component status updates
- Optimistic UI updates with conflict resolution

### PDF Processing
- Extract text with pdf.js or similar
- Send extracted text to Claude
- Store both original PDF (Supabase Storage) and extracted text

### Recipe Parsing Flow
```
User inputs recipe (text/URL/PDF)
→ Immediate Claude API call to parse
→ Extract: title, ingredients, instructions, component candidates
→ Store structured data
→ Show parsing status/progress
→ Allow editing if parsing is wrong
```

## JSON Output Schemas

### Recipe Parse Schema
```typescript
{
  title: string;
  source: string;
  servings: number;
  prep_time_minutes?: number;
  cook_time_minutes?: number;
  ingredients: Array<{
    item: string;
    quantity: string;
    category: 'produce' | 'protein' | 'grain' | 'dairy' | 'pantry' | 'spice' | 'other';
  }>;
  instructions: string[];
  potential_components: Array<{
    name: string;
    type: 'grain' | 'protein' | 'vegetable' | 'aromatic' | 'sauce' | 'broth';
    scalable: boolean; // can we make extra?
  }>;
  is_spotlight_candidate: boolean; // good for Sunday dinner?
  dietary_tags: string[]; // vegetarian, vegan, gluten-free, etc.
}
```

### Plan Generation Schema
```typescript
{
  overview: {
    summary: string;
    total_prep_time_minutes: number;
    component_philosophy: string;
  };

  shopping_list: {
    categories: Array<{
      name: string; // Produce, Pantry, Dairy, etc.
      items: Array<{
        item: string;
        quantity: string;
        scaled_for_components: boolean;
        seasonal_alternatives?: string[];
      }>;
    }>;
    pantry_reminder: string;
  };

  sunday_timeline: {
    total_time_minutes: number;
    start_time_suggestion: string; // "2:00 PM"
    steps: Array<{
      time_label: string;
      tasks: Array<{
        description: string;
        estimated_minutes: number;
        is_parallel: boolean;
        cooking_method: string; // "stovetop", "oven", "both"
        components_produced: string[];
      }>;
    }>;
  };

  component_inventory: Array<{
    name: string;
    type: 'grain' | 'protein' | 'vegetable' | 'aromatic' | 'sauce' | 'broth';
    quantity: string;
    storage_container: string;
    shelf_life_days: number;
    storage_notes: string;
  }>;

  week_assembly: Array<{
    suggested_day: string; // Monday, Tuesday, etc.
    title: string;
    assembly_time_minutes: number;
    serves: number;
    is_spotlight: boolean;
    components_used: string[];
    instructions: Array<{
      step: string;
      cooking_method: string;
    }>;
    variations: string[];
    freshness_priority: 'early' | 'mid' | 'late'; // when in week to use
  }>;

  notes: {
    leftover_strategy: string;
    flexibility_suggestions: string[];
    fresh_vs_prepped: string[];
    recipe_rotation: Array<{
      recipe_title: string;
      is_new: boolean;
      last_used?: string;
    }>;
  };
}
```

## Claude Prompts

### Recipe Parsing Prompt Template
```
You are helping parse a recipe for a modular meal prep system. Extract the key information and identify components that can be scaled up for use across multiple meals throughout the week.

Recipe content:
{recipe_content}

Analyze this recipe and return a structured JSON object following this schema:
{RecipeParseSchema}

Focus on:
1. Identifying ingredients that can become meal prep components
2. Noting if this works better as a "spotlight dish" (complete one-time meal) or "component builder"
3. Categorizing ingredients for shopping organization
4. Estimating realistic prep and cook times
```

### Plan Generation Prompt Template
```
{FULL_SKILL_CONTENT}

Generate a comprehensive weekly meal prep plan using these recipes:
{recipes_json}

Constraints:
- Number of dinners: {num_dinners}
- Serves: {num_people}
- Available Sunday prep time: {prep_time_minutes} minutes

Return a structured JSON object following this schema:
{PlanGenerationSchema}

Ensure:
1. All weeknight meals can be assembled in 10-20 minutes
2. Components are scaled appropriately for {num_people} people
3. Early-week meals use delicate components, late-week uses hearty ones
4. Sunday timeline has clear parallel tasks and cooking methods
5. Shopping list accounts for component scaling
```

### Refinement Prompt Template
```
Current meal plan:
{current_plan_json}

User request: {user_message}

Update the relevant section(s) of the meal plan based on the user's request. Return only the updated section(s) in JSON format. Maintain consistency with other sections.
```

### Recipe Suggestion Prompt Template
```
Current meal plan components:
{components_summary}

Ingredients already in plan:
{ingredients_list}

Find 2-3 recipes that:
1. Complement the existing plan
2. Share ingredients to reduce shopping
3. Fit the modular component system
4. Have 4+ star ratings from reputable sources (NYT Cooking, Serious Eats, etc.)

Search the web and return recipes with rationale for why each complements the plan.
```

## Mobile-Responsive Breakpoints

### Desktop (1024px+)
- Full multi-column layout
- Recipe drawer open by default
- Chat panel as sidebar
- Side-by-side shopping/prep views

### Tablet (768px-1023px)
- Collapsed recipe drawer
- Tabs for different sections
- Chat panel as modal

### Mobile (< 768px)
- Single column, vertical scroll
- Bottom sheet for recipe details
- Fab button for chat
- Swipe gestures for meal reordering
- Large touch targets for checkboxes
- Sticky section headers

### Mobile-Specific Features
- Shopping list: checkbox-first design, large tap areas
- Prep timeline: swipe to complete, timer shortcuts
- Week view: card-based with expand/collapse
- Voice input for checking off items (future?)

## Implementation Phases

### Phase 1: Core MVP (1-2 weeks)
- [ ] Supabase setup with schema
- [ ] Recipe input (text/URL) with parsing
- [ ] Plan generation with JSON output
- [ ] Basic plan view (all sections, read-only)
- [ ] Shopping list with checkboxes
- [ ] Magic link household setup

### Phase 2: Interaction (1 week)
- [ ] PDF upload and parsing
- [ ] Prep timeline with checkboxes
- [ ] Component tracking
- [ ] Meal reordering (drag-drop)
- [ ] Real-time sync for checkboxes

### Phase 3: Intelligence (1 week)
- [ ] Chat refinement panel
- [ ] Recipe suggestions
- [ ] Favorite recipes library
- [ ] "Generate from favorites" flow
- [ ] Recipe rotation tracking

### Phase 4: Polish (ongoing)
- [ ] Mobile optimization
- [ ] Export/print options
- [ ] Timer integration
- [ ] Prep step reordering with validation
- [ ] Usage analytics

## Open Questions

1. **Claude API Key Management**: User-provided keys stored in localStorage initially, migrate to Supabase user settings later for multi-device support

2. **Structured Output**: Use Claude's JSON mode for all generation to ensure consistent parsing

3. **Real-time Collaboration**: Supabase real-time subscriptions with optimistic UI updates

4. **Recipe Parsing**: Immediate parsing on input with visual feedback and edit capability

5. **Mobile Priority**: Desktop-first for planning, mobile-optimized for shopping/cooking flows
