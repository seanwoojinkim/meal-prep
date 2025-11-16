# Supabase vs Rails: Decision Analysis for Meal Prep App

## Current Features + Future Complexity

### Feature: Recipe Flags/Metadata

**What you might want:**
- Custom tags (vegetarian, quick, batch-friendly, etc.)
- Dietary restrictions (gluten-free, dairy-free, etc.)
- User notes on recipes
- Difficulty level
- Prep complexity flags
- Season/time of year preferences
- Custom user-defined categories

#### Supabase Approach

```sql
-- Database schema
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id),
  title TEXT NOT NULL,
  source_type TEXT,
  parsed_content JSONB,
  is_favorite BOOLEAN DEFAULT false,

  -- Flexible metadata as JSONB
  tags TEXT[] DEFAULT '{}',  -- Array: ['vegetarian', 'quick', 'batch-friendly']
  dietary_restrictions TEXT[] DEFAULT '{}',
  difficulty_level TEXT,  -- 'easy', 'medium', 'hard'
  prep_complexity INTEGER,  -- 1-5 scale
  user_notes TEXT,
  metadata JSONB DEFAULT '{}',  -- Catch-all for future fields

  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Efficient querying with GIN index
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_dietary ON recipes USING GIN(dietary_restrictions);
CREATE INDEX idx_recipes_metadata ON recipes USING GIN(metadata);
```

**Frontend usage:**
```typescript
// Filter by tags (using Supabase's array operators)
const { data } = await supabase
  .from('recipes')
  .select('*')
  .contains('tags', ['vegetarian'])
  .eq('household_id', householdId);

// Filter by multiple criteria
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('difficulty_level', 'easy')
  .gte('prep_complexity', 3)
  .contains('dietary_restrictions', ['gluten-free']);

// Update flags
await supabase
  .from('recipes')
  .update({
    tags: ['vegetarian', 'quick'],
    user_notes: 'Great for weeknights'
  })
  .eq('id', recipeId);
```

**Pros:**
- ✅ Direct database queries from frontend
- ✅ PostgreSQL arrays and JSONB are powerful
- ✅ No backend code needed
- ✅ GIN indexes make queries fast

**Cons:**
- ❌ Complex validation logic goes in Edge Functions
- ❌ No type safety on JSONB fields (unless using TypeScript carefully)

#### Rails Approach

```ruby
# app/models/recipe.rb
class Recipe < ApplicationRecord
  belongs_to :household

  # Enums for structured data
  enum difficulty_level: { easy: 0, medium: 1, hard: 2 }
  enum source_type: { text: 0, url: 1, pdf: 2 }

  # Validations
  validates :title, presence: true
  validates :prep_complexity, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 5
  }, allow_nil: true

  # Scopes for common queries
  scope :vegetarian, -> { where("'vegetarian' = ANY(tags)") }
  scope :quick_prep, -> { where('prep_complexity <= ?', 2) }
  scope :gluten_free, -> { where("'gluten-free' = ANY(dietary_restrictions)") }
  scope :favorites, -> { where(is_favorite: true) }
  scope :recent, -> { order(last_used_at: :desc) }

  # Custom methods for business logic
  def suitable_for_batch_prep?
    tags.include?('batch-friendly') && prep_complexity >= 3
  end

  def increment_usage!
    update!(
      times_used: times_used + 1,
      last_used_at: Time.current
    )
  end

  def mark_as_used_in_plan(meal_plan)
    increment_usage!
    RecipeUsageLogger.log(self, meal_plan) # Custom tracking
  end
end

# app/controllers/api/v1/recipes_controller.rb
class Api::V1::RecipesController < ApplicationController
  def index
    recipes = current_household.recipes

    # Filter by params
    recipes = recipes.vegetarian if params[:vegetarian]
    recipes = recipes.quick_prep if params[:quick_prep]
    recipes = recipes.where(difficulty_level: params[:difficulty]) if params[:difficulty]

    render json: recipes
  end

  def update
    recipe = current_household.recipes.find(params[:id])

    if recipe.update(recipe_params)
      render json: recipe
    else
      render json: { errors: recipe.errors }, status: :unprocessable_entity
    end
  end

  private

  def recipe_params
    params.require(:recipe).permit(
      :title, :difficulty_level, :prep_complexity, :user_notes,
      tags: [], dietary_restrictions: []
    )
  end
end
```

**Pros:**
- ✅ Full control over validation logic
- ✅ Business logic in models (Ruby)
- ✅ Type-safe enums
- ✅ Easy to add complex methods

**Cons:**
- ❌ More boilerplate (controllers, serializers)
- ❌ Need to deploy backend changes

---

### Feature: Flexible Plan Start Dates

**What you might want:**
- Plan can start any day of week
- Calculate "this week" dynamically
- Adjust meal labels (Monday, Tuesday, etc.)
- Handle timezone differences
- Maybe recurring plans?

#### Supabase Approach

```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id),

  -- Flexible dates
  start_date DATE NOT NULL,  -- Can be any day
  end_date DATE,  -- Calculated or explicit
  num_dinners INTEGER DEFAULT 5,
  num_people INTEGER DEFAULT 2,

  -- Maybe future: recurring plans
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,  -- { "frequency": "weekly", "day": "sunday" }

  status TEXT DEFAULT 'generating',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE week_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_plan_id UUID REFERENCES generated_plans(id),

  -- Store actual date instead of day_index
  meal_date DATE NOT NULL,
  day_of_week TEXT,  -- 'monday', 'tuesday', etc. (calculated)

  title TEXT NOT NULL,
  assembly_time_minutes INTEGER,
  instructions TEXT,
  is_spotlight BOOLEAN DEFAULT false
);
```

**Frontend logic:**
```typescript
// Calculate meal dates based on start_date
function generateMealDates(startDate: Date, numDinners: number) {
  const dates = [];
  for (let i = 0; i < numDinners; i++) {
    const mealDate = addDays(startDate, i);
    dates.push({
      meal_date: mealDate,
      day_of_week: format(mealDate, 'EEEE').toLowerCase(),
    });
  }
  return dates;
}

// When generating plan, calculate dates
const mealDates = generateMealDates(new Date(plan.start_date), plan.num_dinners);

// Call Edge Function with dates
const { data } = await supabase.functions.invoke('generate-plan', {
  body: {
    mealPlanId: plan.id,
    mealDates: mealDates  // Pass calculated dates to Claude
  }
});
```

**Edge Function generates meals with actual dates:**
```typescript
// supabase/functions/generate-plan/index.ts
const planData = await generateWithClaude(recipes, mealDates);

// Insert week meals with dates
const weekMeals = planData.week_assembly.map((meal, index) => ({
  generated_plan_id: generatedPlan.id,
  meal_date: mealDates[index].meal_date,
  day_of_week: mealDates[index].day_of_week,
  title: meal.title,
  // ...
}));

await supabaseClient.from('week_meals').insert(weekMeals);
```

**Pros:**
- ✅ Flexible, can handle any start date
- ✅ Date logic in frontend/Edge Functions (TypeScript)
- ✅ Easy to display in user's timezone

**Cons:**
- ❌ Date calculations split between frontend and Edge Functions
- ❌ Timezone handling can be tricky

#### Rails Approach

```ruby
# app/models/meal_plan.rb
class MealPlan < ApplicationRecord
  belongs_to :household
  has_one :generated_plan
  has_many :week_meals, through: :generated_plan

  validates :start_date, presence: true
  validates :num_dinners, presence: true

  # Business logic for dates
  def end_date
    start_date + (num_dinners - 1).days
  end

  def meal_dates
    (0...num_dinners).map do |i|
      start_date + i.days
    end
  end

  def current_week?
    Date.current.between?(start_date, end_date)
  end

  def day_label(index)
    date = start_date + index.days
    date.strftime('%A')  # "Monday", "Tuesday", etc.
  end

  def next_upcoming_meal
    week_meals.where('meal_date >= ?', Date.current).order(:meal_date).first
  end

  # For recurring plans (future)
  def generate_next_week
    MealPlan.create!(
      household: household,
      start_date: end_date + 1.day,
      num_dinners: num_dinners,
      num_people: num_people,
      # Copy recipes from this plan
      recipes: recipes
    )
  end
end

# app/models/week_meal.rb
class WeekMeal < ApplicationRecord
  belongs_to :generated_plan

  validates :meal_date, presence: true

  scope :upcoming, -> { where('meal_date >= ?', Date.current).order(:meal_date) }
  scope :this_week, -> { where(meal_date: Date.current.beginning_of_week..Date.current.end_of_week) }

  def day_of_week
    meal_date.strftime('%A')
  end

  def is_today?
    meal_date == Date.current
  end

  def days_until
    (meal_date - Date.current).to_i
  end
end

# app/jobs/generate_plan_job.rb
class GeneratePlanJob < ApplicationJob
  def perform(meal_plan_id)
    meal_plan = MealPlan.find(meal_plan_id)

    # Generate plan with Claude
    plan_data = Claude::PlanGenerator.new(meal_plan).generate

    generated_plan = meal_plan.create_generated_plan!(
      overview: plan_data['overview'],
      notes: plan_data['notes']
    )

    # Create week meals with actual dates
    meal_plan.meal_dates.each_with_index do |date, index|
      meal_data = plan_data['week_assembly'][index]

      generated_plan.week_meals.create!(
        meal_date: date,
        day_of_week: date.strftime('%A').downcase,
        title: meal_data['title'],
        # ...
      )
    end
  end
end

# API endpoint
# GET /api/v1/meal_plans/123
{
  "id": "123",
  "start_date": "2025-11-15",
  "end_date": "2025-11-21",
  "num_dinners": 7,
  "week_meals": [
    {
      "meal_date": "2025-11-15",
      "day_of_week": "Friday",
      "days_until": 2,
      "title": "Spotlight: Braised Short Ribs"
    },
    // ...
  ]
}
```

**Pros:**
- ✅ Date logic centralized in Rails
- ✅ Easy to add helper methods (days_until, is_today?, etc.)
- ✅ Backend handles timezone conversions
- ✅ Scopes for querying (upcoming, this_week)

**Cons:**
- ❌ More backend code to write
- ❌ Frontend depends on backend for date calculations

---

## Future Complexity Scenarios

### Scenario 1: Smart Recipe Recommendations

**Feature:** "Suggest recipes that complement my favorites" with ML/ranking

**Supabase:**
- Store recipe vectors (embeddings) in PostgreSQL with pgvector extension
- Edge Function calls Claude for embeddings + similarity search
- OR: Separate microservice for ML (Python/FastAPI)

**Rails:**
- Service object for recommendation logic
- Can integrate with Python ML models via API
- Or use Ruby gems for simpler ML

**Winner:** Rails (easier to integrate complex logic)

---

### Scenario 2: Admin Dashboard

**Feature:** Analytics, user management, content moderation

**Supabase:**
- Need to build separate admin app
- Edge Functions for complex queries
- Or: Use Supabase Dashboard (limited customization)

**Rails:**
- Use ActiveAdmin or RailsAdmin gem (5 minutes to full admin panel)
- Full control over admin features
- Easy to add custom actions

**Winner:** Rails (admin tools are mature)

---

### Scenario 3: Multi-User Collaboration

**Feature:** Multiple household members editing same plan simultaneously

**Supabase:**
- Real-time subscriptions built-in (this is Supabase's strength!)
- Conflict resolution in frontend or Edge Functions
- Optimistic updates with rollback

**Rails:**
- Action Cable for real-time
- More setup required
- Conflict resolution in backend

**Winner:** Supabase (real-time is native)

---

### Scenario 4: Complex Plan Generation Rules

**Feature:** Advanced constraints like "no repeat ingredients", "balance cuisines", "dietary preferences per person"

**Supabase:**
- Edge Functions with complex logic (TypeScript)
- Claude prompts with detailed constraints
- Can get messy for very complex rules

**Rails:**
- Service objects with clear separation
- Easier to test complex logic
- Can build sophisticated rule engines

**Winner:** Rails (complex business logic is clearer)

---

### Scenario 5: Third-Party Integrations

**Feature:** Import from Instacart, sync with calendar, integrate with smart devices

**Supabase:**
- Edge Functions for API calls
- Webhooks via Edge Functions
- Limited to Deno ecosystem

**Rails:**
- Full ecosystem of gems
- Background jobs for async processing
- Easier to integrate with complex APIs

**Winner:** Rails (mature integration ecosystem)

---

## Hybrid Approach: Best of Both Worlds

You don't have to choose exclusively! Consider:

### Option 1: Supabase + Rails Microservice

```
Frontend (React)
    ↓
Supabase (CRUD, Real-time, Auth)
    ↓
Rails Microservice (Complex Claude logic only)
```

**Use Supabase for:**
- All database operations (recipes, plans, shopping lists)
- Real-time updates
- Authentication
- File storage

**Use Rails for:**
- Claude API integration (recipe parsing, plan generation)
- Complex business logic
- Background jobs
- Admin dashboard

**How it works:**
```typescript
// Frontend calls Supabase for most things
const { data } = await supabase.from('recipes').select('*');

// But calls Rails for complex operations
const plan = await fetch('https://rails-api.com/generate-plan', {
  method: 'POST',
  body: JSON.stringify({ recipeIds, constraints })
});

// Rails saves generated plan back to Supabase
// Frontend gets real-time updates via Supabase subscriptions
```

**Pros:**
- ✅ Fast development for CRUD
- ✅ Rails power for complex features
- ✅ Can start with Supabase, add Rails later
- ✅ Each service focused on what it does best

**Cons:**
- ❌ Two backends to manage
- ❌ More complex architecture
- ❌ Cross-service communication

---

### Option 2: Rails + Supabase Client

```
Frontend (React)
    ↓
Rails API (All endpoints)
    ↓
Supabase (Database only, via Supabase Ruby client)
```

**Use Rails for:**
- All API endpoints
- Business logic
- Claude integration

**Use Supabase for:**
- PostgreSQL hosting (cheaper than RDS)
- Real-time subscriptions (via Supabase Ruby client)

Less common, but possible if you want Rails control + Supabase infrastructure.

---

## My Recommendation

Based on:
1. You want recipe flags/metadata (CRUD, but might get complex)
2. Flexible plan dates (moderate complexity)
3. "I can imagine there might be more complexity later"

### Start with Rails if:

✅ You're **comfortable with Rails** (sounds like you might be?)
✅ You anticipate **complex business logic** beyond CRUD
✅ You want **full control** from day 1
✅ You're okay with **slightly longer initial setup** (1 week extra)

### Start with Supabase if:

✅ You want **fastest MVP** (ship in 2 weeks vs 3 weeks)
✅ Most features are **CRUD + real-time**
✅ You can **move complex logic to Rails later** (hybrid approach)
✅ You prefer **TypeScript** over Ruby for backend logic

### My Actual Recommendation: Start with Supabase, Plan for Rails

Here's why:

1. **Ship faster**: Get MVP out in 2-3 weeks
2. **Validate the product**: See if users actually want this
3. **Real-time is easy**: Shopping list sync is built-in
4. **Keep Rails option open**: You can always add a Rails microservice later for:
   - Complex recommendation algorithms
   - Admin dashboard
   - Advanced plan generation logic

**Migration path:**
```
Week 1-3: Supabase MVP
    ↓ (Product validated, users are happy)
Week 4-6: Add Rails microservice for complex features
    ↓
Week 7+: Gradually move Claude logic from Edge Functions to Rails
```

This lets you:
- ✅ Ship fast (Supabase strength)
- ✅ Add complexity later (Rails strength)
- ✅ Keep real-time (Supabase strength)
- ✅ Avoid over-engineering early

**But if you already know Rails well and expect complex features soon**, just start with Rails and skip the migration headache.

---

## Quick Feature Comparison

| Feature | Supabase Complexity | Rails Complexity |
|---------|-------------------|-----------------|
| Recipe flags/metadata | Easy (JSONB) | Easy (models/validations) |
| Flexible plan dates | Easy (date fields) | Easy (date helpers) |
| Recipe recommendations | Medium (Edge Function + pgvector) | Easy (service + external API) |
| Admin dashboard | Hard (build custom) | Easy (ActiveAdmin) |
| Real-time sync | Easy (built-in) | Medium (Action Cable) |
| Complex validations | Medium (Edge Functions) | Easy (model validations) |
| Third-party APIs | Medium (Edge Functions) | Easy (gems/services) |
| Background jobs | Medium (Edge Functions) | Easy (Sidekiq) |
| Multi-step workflows | Hard (distributed logic) | Easy (state machines) |

## What do you think?

Given that you're thinking about future complexity, which approach feels more comfortable to you:

1. **Start fast with Supabase** (get MVP out, add Rails later if needed)?
2. **Start with Rails** (longer setup, but more control from day 1)?
3. **Hybrid from the start** (Supabase for data, Rails for Claude logic)?

I can help you build any of these! What's your gut feeling?
