# Implementation Spec: Modular Meal Prep Web App v1 (Rails Backend)

## Overview
This specification defines the v1 implementation of a modular meal prep web application using a **Rails API backend** with React frontend. The backend handles Claude AI integration, data persistence, and real-time updates.

## Architecture

### Technology Stack

**Frontend**
- React 18 + TypeScript + Vite (existing)
- Tailwind CSS + shadcn/ui (existing)
- React Query for data fetching
- Action Cable client for real-time updates

**Backend**
- Ruby on Rails 7.1+ (API mode)
- PostgreSQL database
- Action Cable for WebSocket real-time updates
- Active Storage for PDF uploads
- Sidekiq for background jobs
- Anthropic Ruby SDK for Claude integration

**Deployment**
- Frontend: Vercel/Netlify (static build)
- Backend: Heroku/Render/Fly.io (Rails app)
- Database: Managed PostgreSQL (Heroku Postgres/Neon)
- Redis: For Action Cable and Sidekiq

## Rails Backend Structure

```
rails-api/
├── app/
│   ├── models/
│   │   ├── household.rb
│   │   ├── recipe.rb
│   │   ├── meal_plan.rb
│   │   ├── generated_plan.rb
│   │   ├── shopping_list_item.rb
│   │   ├── prep_step.rb
│   │   ├── component.rb
│   │   └── week_meal.rb
│   ├── controllers/
│   │   ├── api/v1/
│   │   │   ├── recipes_controller.rb
│   │   │   ├── meal_plans_controller.rb
│   │   │   ├── shopping_list_items_controller.rb
│   │   │   ├── prep_steps_controller.rb
│   │   │   ├── week_meals_controller.rb
│   │   │   └── chat_controller.rb
│   │   └── authentication/
│   │       └── magic_links_controller.rb
│   ├── jobs/
│   │   ├── parse_recipe_job.rb
│   │   ├── generate_plan_job.rb
│   │   └── refine_plan_job.rb
│   ├── services/
│   │   ├── claude/
│   │   │   ├── recipe_parser.rb
│   │   │   ├── plan_generator.rb
│   │   │   ├── plan_refiner.rb
│   │   │   └── recipe_suggester.rb
│   │   ├── recipe_fetcher.rb (URL/PDF extraction)
│   │   └── plan_serializer.rb
│   ├── channels/
│   │   ├── meal_plan_channel.rb
│   │   └── shopping_list_channel.rb
│   └── serializers/ (or use Blueprinter/JBuilder)
│       ├── meal_plan_serializer.rb
│       ├── recipe_serializer.rb
│       └── generated_plan_serializer.rb
├── db/
│   ├── migrate/
│   └── schema.rb
├── config/
│   ├── routes.rb
│   ├── cable.yml (Action Cable config)
│   └── credentials.yml.enc (Claude API key)
└── Gemfile
```

## Data Model (Rails ActiveRecord)

### Models

```ruby
# app/models/household.rb
class Household < ApplicationRecord
  has_many :recipes, dependent: :destroy
  has_many :meal_plans, dependent: :destroy
  has_many :users, dependent: :destroy

  validates :name, length: { maximum: 100 }
end

# app/models/recipe.rb
class Recipe < ApplicationRecord
  belongs_to :household
  has_many :meal_plan_recipes, dependent: :destroy
  has_many :meal_plans, through: :meal_plan_recipes

  enum source_type: { text: 0, url: 1, pdf: 2 }

  has_one_attached :pdf_file # Active Storage

  validates :title, presence: true
  validates :source_type, presence: true

  scope :favorites, -> { where(is_favorite: true) }
  scope :recent, -> { order(last_used_at: :desc).limit(10) }
end

# app/models/meal_plan.rb
class MealPlan < ApplicationRecord
  belongs_to :household
  has_one :generated_plan, dependent: :destroy
  has_many :meal_plan_recipes, dependent: :destroy
  has_many :recipes, through: :meal_plan_recipes

  enum status: { generating: 0, ready: 1, in_progress: 2, completed: 3 }

  validates :num_dinners, presence: true, numericality: { greater_than: 0 }
  validates :num_people, presence: true, numericality: { greater_than: 0 }

  after_create :enqueue_generation

  private

  def enqueue_generation
    GeneratePlanJob.perform_later(id)
  end
end

# app/models/generated_plan.rb
class GeneratedPlan < ApplicationRecord
  belongs_to :meal_plan
  has_many :shopping_list_items, dependent: :destroy
  has_many :prep_steps, dependent: :destroy
  has_many :components, dependent: :destroy
  has_many :week_meals, dependent: :destroy

  # JSONB columns for complex data
  # - overview (summary, total_prep_time, philosophy)
  # - notes (leftover_strategy, flexibility, etc.)

  validates :overview, presence: true
end

# app/models/shopping_list_item.rb
class ShoppingListItem < ApplicationRecord
  belongs_to :generated_plan

  validates :category, :item, :quantity, presence: true

  scope :checked, -> { where(checked_off: true) }
  scope :unchecked, -> { where(checked_off: false) }
  scope :by_category, -> { order(:category, :item) }

  after_update_commit -> { broadcast_update }

  private

  def broadcast_update
    ActionCable.server.broadcast(
      "meal_plan_#{generated_plan.meal_plan_id}",
      { type: 'shopping_item_updated', item: self.as_json }
    )
  end
end

# app/models/prep_step.rb
class PrepStep < ApplicationRecord
  belongs_to :generated_plan

  validates :order_index, :time_label, :description, presence: true

  scope :ordered, -> { order(:order_index) }
  scope :completed, -> { where(completed: true) }

  after_update_commit -> { broadcast_update }

  private

  def broadcast_update
    ActionCable.server.broadcast(
      "meal_plan_#{generated_plan.meal_plan_id}",
      { type: 'prep_step_updated', step: self.as_json }
    )
  end
end

# app/models/component.rb
class Component < ApplicationRecord
  belongs_to :generated_plan

  enum component_type: {
    grain: 0, protein: 1, vegetable: 2,
    aromatic: 3, sauce: 4, broth: 5
  }

  validates :name, :component_type, presence: true
end

# app/models/week_meal.rb
class WeekMeal < ApplicationRecord
  belongs_to :generated_plan

  validates :day_index, :title, :instructions, presence: true
  validates :day_index, uniqueness: { scope: :generated_plan_id }

  scope :ordered, -> { order(:day_index) }

  # components_used is an array of component IDs
end

# app/models/meal_plan_recipe.rb (join table)
class MealPlanRecipe < ApplicationRecord
  belongs_to :meal_plan
  belongs_to :recipe

  enum added_by: { user: 0, generated: 1 }
end
```

### Database Migrations

```ruby
# db/migrate/20250113_create_households.rb
class CreateHouseholds < ActiveRecord::Migration[7.1]
  def change
    create_table :households, id: :uuid do |t|
      t.string :name
      t.timestamps
    end
  end
end

# db/migrate/20250113_create_recipes.rb
class CreateRecipes < ActiveRecord::Migration[7.1]
  def change
    create_table :recipes, id: :uuid do |t|
      t.references :household, type: :uuid, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :source_type, null: false, default: 0
      t.text :source_content
      t.text :parsed_content
      t.boolean :is_favorite, default: false
      t.integer :times_used, default: 0
      t.datetime :last_used_at
      t.timestamps
    end

    add_index :recipes, [:household_id, :is_favorite]
    add_index :recipes, [:household_id, :last_used_at]
  end
end

# db/migrate/20250113_create_meal_plans.rb
class CreateMealPlans < ActiveRecord::Migration[7.1]
  def change
    create_table :meal_plans, id: :uuid do |t|
      t.references :household, type: :uuid, null: false, foreign_key: true
      t.integer :num_dinners, default: 5
      t.integer :num_people, default: 2
      t.integer :prep_time_minutes
      t.integer :status, default: 0
      t.timestamps
    end

    add_index :meal_plans, [:household_id, :created_at]
  end
end

# db/migrate/20250113_create_generated_plans.rb
class CreateGeneratedPlans < ActiveRecord::Migration[7.1]
  def change
    create_table :generated_plans, id: :uuid do |t|
      t.references :meal_plan, type: :uuid, null: false, foreign_key: true
      t.jsonb :overview, default: {}
      t.jsonb :notes, default: {}
      t.timestamps
    end

    add_index :generated_plans, :meal_plan_id, unique: true
  end
end

# db/migrate/20250113_create_shopping_list_items.rb
class CreateShoppingListItems < ActiveRecord::Migration[7.1]
  def change
    create_table :shopping_list_items, id: :uuid do |t|
      t.references :generated_plan, type: :uuid, null: false, foreign_key: true
      t.string :category, null: false
      t.string :item, null: false
      t.string :quantity, null: false
      t.boolean :already_have, default: false
      t.boolean :checked_off, default: false
      t.timestamps
    end

    add_index :shopping_list_items, [:generated_plan_id, :category]
  end
end

# db/migrate/20250113_create_prep_steps.rb
class CreatePrepSteps < ActiveRecord::Migration[7.1]
  def change
    create_table :prep_steps, id: :uuid do |t|
      t.references :generated_plan, type: :uuid, null: false, foreign_key: true
      t.integer :order_index, null: false
      t.string :time_label, null: false
      t.text :description, null: false
      t.integer :estimated_minutes
      t.integer :actual_minutes
      t.boolean :completed, default: false
      t.timestamps
    end

    add_index :prep_steps, [:generated_plan_id, :order_index]
  end
end

# db/migrate/20250113_create_components.rb
class CreateComponents < ActiveRecord::Migration[7.1]
  def change
    create_table :components, id: :uuid do |t|
      t.references :generated_plan, type: :uuid, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :component_type, null: false
      t.string :storage_note
      t.integer :shelf_life_days
      t.boolean :prepped, default: false
      t.timestamps
    end
  end
end

# db/migrate/20250113_create_week_meals.rb
class CreateWeekMeals < ActiveRecord::Migration[7.1]
  def change
    create_table :week_meals, id: :uuid do |t|
      t.references :generated_plan, type: :uuid, null: false, foreign_key: true
      t.integer :day_index, null: false
      t.string :title, null: false
      t.integer :assembly_time_minutes
      t.text :instructions, null: false
      t.integer :serves
      t.uuid :components_used, array: true, default: []
      t.boolean :is_spotlight, default: false
      t.timestamps
    end

    add_index :week_meals, [:generated_plan_id, :day_index], unique: true
  end
end

# db/migrate/20250113_create_meal_plan_recipes.rb
class CreateMealPlanRecipes < ActiveRecord::Migration[7.1]
  def change
    create_table :meal_plan_recipes, id: :uuid do |t|
      t.references :meal_plan, type: :uuid, null: false, foreign_key: true
      t.references :recipe, type: :uuid, null: false, foreign_key: true
      t.integer :added_by, default: 0
      t.timestamps
    end

    add_index :meal_plan_recipes, [:meal_plan_id, :recipe_id], unique: true
  end
end
```

## API Endpoints (Rails Routes)

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :recipes do
        collection do
          post :parse_text
          post :parse_url
          post :parse_pdf
        end
        member do
          patch :toggle_favorite
        end
      end

      resources :meal_plans do
        member do
          get :full_plan # includes all nested data
        end

        resources :shopping_list_items, only: [:index, :update]
        resources :prep_steps, only: [:index, :update]
        resources :week_meals, only: [:index, :update]

        post :refine, to: 'chat#refine' # chat refinement
        post :suggest_recipes, to: 'chat#suggest_recipes'
      end

      resources :households, only: [:show, :update]
    end
  end

  namespace :authentication do
    post 'magic_link/send', to: 'magic_links#create'
    get 'magic_link/verify/:token', to: 'magic_links#verify'
  end

  mount ActionCable.server => '/cable'
end
```

## Claude Integration (Rails Services)

### Recipe Parser Service

```ruby
# app/services/claude/recipe_parser.rb
module Claude
  class RecipeParser
    def initialize(content, source_type)
      @content = content
      @source_type = source_type
      @client = Anthropic::Client.new(api_key: Rails.application.credentials.claude_api_key)
    end

    def parse
      response = @client.messages(
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: build_prompt
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: recipe_parse_schema
        }
      )

      JSON.parse(response.dig("content", 0, "text"))
    rescue => e
      Rails.logger.error("Recipe parsing failed: #{e.message}")
      { error: e.message }
    end

    private

    def build_prompt
      <<~PROMPT
        You are helping parse a recipe for a modular meal prep system. Extract the key information and identify components that can be scaled up for use across multiple meals throughout the week.

        Recipe content:
        #{@content}

        Analyze this recipe and return a structured JSON object with:
        - title
        - source
        - servings
        - prep_time_minutes and cook_time_minutes
        - ingredients (with item, quantity, category)
        - instructions (array of strings)
        - potential_components (name, type, scalable)
        - is_spotlight_candidate (boolean)
        - dietary_tags (array)

        Focus on:
        1. Identifying ingredients that can become meal prep components
        2. Noting if this works better as a "spotlight dish" (complete one-time meal) or "component builder"
        3. Categorizing ingredients for shopping organization
        4. Estimating realistic prep and cook times
      PROMPT
    end

    def recipe_parse_schema
      {
        type: "object",
        properties: {
          title: { type: "string" },
          source: { type: "string" },
          servings: { type: "integer" },
          prep_time_minutes: { type: "integer" },
          cook_time_minutes: { type: "integer" },
          ingredients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                item: { type: "string" },
                quantity: { type: "string" },
                category: {
                  type: "string",
                  enum: ["produce", "protein", "grain", "dairy", "pantry", "spice", "other"]
                }
              },
              required: ["item", "quantity", "category"]
            }
          },
          instructions: {
            type: "array",
            items: { type: "string" }
          },
          potential_components: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: {
                  type: "string",
                  enum: ["grain", "protein", "vegetable", "aromatic", "sauce", "broth"]
                },
                scalable: { type: "boolean" }
              },
              required: ["name", "type", "scalable"]
            }
          },
          is_spotlight_candidate: { type: "boolean" },
          dietary_tags: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["title", "ingredients", "instructions"]
      }
    end
  end
end
```

### Plan Generator Service

```ruby
# app/services/claude/plan_generator.rb
module Claude
  class PlanGenerator
    def initialize(meal_plan)
      @meal_plan = meal_plan
      @client = Anthropic::Client.new(api_key: Rails.application.credentials.claude_api_key)
      @skill_content = File.read(Rails.root.join('lib', 'skills', 'meal_prep_skill.txt'))
    end

    def generate
      response = @client.messages(
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 16000,
        messages: [
          {
            role: "user",
            content: build_prompt
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: plan_generation_schema
        }
      )

      JSON.parse(response.dig("content", 0, "text"))
    rescue => e
      Rails.logger.error("Plan generation failed: #{e.message}")
      { error: e.message }
    end

    private

    def build_prompt
      recipes_json = @meal_plan.recipes.map do |recipe|
        {
          title: recipe.title,
          parsed_content: JSON.parse(recipe.parsed_content)
        }
      end.to_json

      <<~PROMPT
        #{@skill_content}

        Generate a comprehensive weekly meal prep plan using these recipes:
        #{recipes_json}

        Constraints:
        - Number of dinners: #{@meal_plan.num_dinners}
        - Serves: #{@meal_plan.num_people}
        - Available Sunday prep time: #{@meal_plan.prep_time_minutes || 'flexible'} minutes

        Return a structured JSON object with:
        - overview (summary, total_prep_time_minutes, component_philosophy)
        - shopping_list (categories with items)
        - sunday_timeline (total_time, start_time_suggestion, steps)
        - component_inventory (name, type, quantity, storage)
        - week_assembly (7 meals with instructions)
        - notes (leftover_strategy, flexibility_suggestions, etc.)

        Ensure:
        1. All weeknight meals can be assembled in 10-20 minutes
        2. Components are scaled appropriately for #{@meal_plan.num_people} people
        3. Early-week meals use delicate components, late-week uses hearty ones
        4. Sunday timeline has clear parallel tasks and cooking methods
        5. Shopping list accounts for component scaling
      PROMPT
    end

    def plan_generation_schema
      # Full schema from v1-spec.md lines 264-335
      # (truncated for brevity - see full spec)
    end
  end
end
```

### Background Jobs

```ruby
# app/jobs/parse_recipe_job.rb
class ParseRecipeJob < ApplicationJob
  queue_as :default

  def perform(recipe_id)
    recipe = Recipe.find(recipe_id)

    content = case recipe.source_type
              when 'text' then recipe.source_content
              when 'url' then RecipeFetcher.fetch_url(recipe.source_content)
              when 'pdf' then RecipeFetcher.extract_pdf(recipe.pdf_file)
              end

    parsed = Claude::RecipeParser.new(content, recipe.source_type).parse

    recipe.update!(
      parsed_content: parsed.to_json,
      title: parsed['title'] || recipe.title
    )

    # Broadcast completion to frontend
    ActionCable.server.broadcast(
      "recipe_#{recipe_id}",
      { type: 'recipe_parsed', recipe: recipe.as_json }
    )
  rescue => e
    Rails.logger.error("ParseRecipeJob failed: #{e.message}")
    recipe.update!(parsed_content: { error: e.message }.to_json)
  end
end

# app/jobs/generate_plan_job.rb
class GeneratePlanJob < ApplicationJob
  queue_as :default

  def perform(meal_plan_id)
    meal_plan = MealPlan.find(meal_plan_id)
    meal_plan.update!(status: :generating)

    plan_data = Claude::PlanGenerator.new(meal_plan).generate

    # Create generated_plan and all nested records
    generated_plan = meal_plan.create_generated_plan!(
      overview: plan_data['overview'],
      notes: plan_data['notes']
    )

    # Create shopping list items
    plan_data['shopping_list']['categories'].each do |category|
      category['items'].each do |item|
        generated_plan.shopping_list_items.create!(
          category: category['name'],
          item: item['item'],
          quantity: item['quantity']
        )
      end
    end

    # Create prep steps
    plan_data['sunday_timeline']['steps'].each_with_index do |step, index|
      step['tasks'].each do |task|
        generated_plan.prep_steps.create!(
          order_index: index,
          time_label: step['time_label'],
          description: task['description'],
          estimated_minutes: task['estimated_minutes']
        )
      end
    end

    # Create components
    plan_data['component_inventory'].each do |comp|
      generated_plan.components.create!(
        name: comp['name'],
        component_type: comp['type'],
        storage_note: comp['storage_notes'],
        shelf_life_days: comp['shelf_life_days']
      )
    end

    # Create week meals
    plan_data['week_assembly'].each_with_index do |meal, index|
      generated_plan.week_meals.create!(
        day_index: index,
        title: meal['title'],
        assembly_time_minutes: meal['assembly_time_minutes'],
        serves: meal['serves'],
        instructions: meal['instructions'].map { |i| i['step'] }.join("\n\n"),
        is_spotlight: meal['is_spotlight']
      )
    end

    meal_plan.update!(status: :ready)

    # Broadcast completion
    ActionCable.server.broadcast(
      "meal_plan_#{meal_plan_id}",
      { type: 'plan_generated', meal_plan_id: meal_plan_id }
    )
  rescue => e
    Rails.logger.error("GeneratePlanJob failed: #{e.message}")
    meal_plan.update!(status: :ready) # Or create error status
  end
end
```

## Frontend Integration Changes

### API Client Setup

```typescript
// src/lib/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Meal Plans
  async getMealPlan(id: string) {
    return this.request<MealPlan>(`/api/v1/meal_plans/${id}/full_plan`);
  }

  async createMealPlan(data: CreateMealPlanRequest) {
    return this.request<MealPlan>('/api/v1/meal_plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Shopping List
  async updateShoppingItem(planId: string, itemId: string, checked: boolean) {
    return this.request(`/api/v1/meal_plans/${planId}/shopping_list_items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ checked_off: checked }),
    });
  }

  // Recipes
  async parseRecipeText(text: string, householdId: string) {
    return this.request('/api/v1/recipes/parse_text', {
      method: 'POST',
      body: JSON.stringify({ text, household_id: householdId }),
    });
  }

  // ... more methods
}

export const apiClient = new ApiClient();
```

### Action Cable Integration

```typescript
// src/lib/actionCable.ts
import { createConsumer } from '@rails/actioncable';

const CABLE_URL = import.meta.env.VITE_CABLE_URL || 'ws://localhost:3000/cable';

export const cable = createConsumer(CABLE_URL);

// Hook for subscribing to meal plan updates
export function useMealPlanSubscription(
  planId: string,
  onUpdate: (data: any) => void
) {
  useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: 'MealPlanChannel', plan_id: planId },
      {
        received(data) {
          onUpdate(data);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [planId, onUpdate]);
}
```

### React Query Setup

```typescript
// src/lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Custom hooks
export function useMealPlan(planId: string) {
  return useQuery({
    queryKey: ['mealPlan', planId],
    queryFn: () => apiClient.getMealPlan(planId),
  });
}

export function useUpdateShoppingItem(planId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, checked }: { itemId: string; checked: boolean }) =>
      apiClient.updateShoppingItem(planId, itemId, checked),
    onMutate: async ({ itemId, checked }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['mealPlan', planId] });
      const previous = queryClient.getQueryData(['mealPlan', planId]);

      queryClient.setQueryData(['mealPlan', planId], (old: any) => {
        // Update the shopping item in the cached data
        return {
          ...old,
          shopping_list: old.shopping_list.map((item: any) =>
            item.id === itemId ? { ...item, checked_off: checked } : item
          ),
        };
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['mealPlan', planId], context.previous);
      }
    },
  });
}
```

## Deployment Architecture

### Option 1: Separate Deployments (Recommended)

```
Frontend (Vercel)
- React app build
- Environment variable: VITE_API_URL=https://api.mealprep.com
- Environment variable: VITE_CABLE_URL=wss://api.mealprep.com/cable

Backend (Render/Fly.io)
- Rails API
- PostgreSQL database
- Redis for Action Cable
- Environment: CLAUDE_API_KEY, DATABASE_URL, REDIS_URL
- CORS configured for frontend domain
```

### Option 2: Monorepo

```
meal-prep-app/
├── frontend/          # React app (existing src/)
├── backend/           # Rails API
└── docker-compose.yml # Local development
```

## Key Differences from Supabase Version

### What Changes

1. **Backend Control**
   - ✅ More control over business logic
   - ✅ Better for complex Claude integration
   - ✅ Background jobs (Sidekiq) for long-running tasks
   - ❌ More infrastructure to manage

2. **Authentication**
   - Supabase: Built-in magic links
   - Rails: Need to implement (gems: devise-passwordless, magic-link)

3. **Real-time Updates**
   - Supabase: Real-time subscriptions (built-in)
   - Rails: Action Cable (WebSockets)

4. **File Storage**
   - Supabase: Built-in storage
   - Rails: Active Storage (stores in AWS S3/GCS/local)

5. **Database**
   - Supabase: Managed PostgreSQL with instant REST API
   - Rails: Need to create API endpoints manually (more control)

6. **Deployment**
   - Supabase: One service for everything
   - Rails: Separate frontend + backend + database + Redis

7. **Cost**
   - Supabase: Generous free tier, pay-as-you-go
   - Rails: Need hosting ($7-20/month Heroku/Render) + PostgreSQL + Redis

### What Stays the Same

- Data model (same tables/relationships)
- Frontend code (React components mostly unchanged)
- Claude integration (same prompts/schemas)
- User flows (same UX)

## Updated Implementation Timeline

### Phase 1: Rails Backend Setup (8 days)
**Day 1-2**: Rails API setup
- Initialize Rails API-only app
- Database schema (migrations)
- Model validations and associations

**Day 3-4**: Claude integration
- Recipe parser service
- Plan generator service
- Background jobs setup

**Day 5-6**: API endpoints
- Recipes CRUD
- Meal plans CRUD
- Shopping list/prep steps updates

**Day 7-8**: Action Cable
- Real-time channels
- Frontend integration

### Phase 2: Frontend Integration (5 days)
**Day 9-10**: API client
- Fetch/mutation setup
- React Query hooks
- Action Cable subscriptions

**Day 11-12**: Replace mock data
- Shopping list → API
- Prep timeline → API
- Week meals → API

**Day 13**: Testing & debugging

### Phase 3: Plan Builder (10 days)
Same as Supabase version - frontend focused

### Phase 4: Intelligence & Polish (14 days)
Same as Supabase version

**Total: ~37 days** (vs 35 days for Supabase - slightly longer due to manual backend setup)

## Recommended Gems

```ruby
# Gemfile
gem 'rails', '~> 7.1'
gem 'pg'
gem 'redis'
gem 'sidekiq'
gem 'anthropic', '~> 0.1' # Claude API client
gem 'rack-cors' # CORS for frontend
gem 'blueprinter' # Fast JSON serialization
gem 'devise' # Authentication (optional)
gem 'magic-link' # Magic link auth
gem 'active_storage_validations' # PDF upload validation
gem 'aws-sdk-s3' # If using S3 for storage

group :development do
  gem 'pry-rails'
  gem 'bullet' # N+1 query detection
end
```

## Development Setup

```bash
# Backend
cd backend
bundle install
rails db:create db:migrate db:seed
rails credentials:edit # Add CLAUDE_API_KEY
redis-server # In separate terminal
bundle exec sidekiq # In separate terminal
rails server

# Frontend
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env.local
echo "VITE_CABLE_URL=ws://localhost:3000/cable" >> .env.local
npm run dev
```

## Next Steps

Would you like me to:

1. **Generate the Rails migrations** for the full schema?
2. **Create the Recipe Parser service** with Claude integration?
3. **Build the Plan Generator service** with the meal prep skill?
4. **Set up the API client** in the React frontend?
5. **Create a step-by-step Rails setup guide**?
