---
doc_type: plan
date: 2025-11-14T02:48:25+00:00
title: "Rails Backend & Frontend Integration Implementation"
_generated: true
_script_version: "1.0"
_generated_at: "2025-11-14T02:48:25+00:00"
feature: "rails-backend-integration"

# Update phase status as implementation progresses
phases:
  - name: "Phase 1: Rails API Setup & Database Schema"
    status: pending
    estimated_days: 2
  - name: "Phase 2: Core Backend Infrastructure"
    status: pending
    estimated_days: 3
  - name: "Phase 3: Claude Integration Services"
    status: pending
    estimated_days: 4
  - name: "Phase 4: Frontend API Integration"
    status: pending
    estimated_days: 3
  - name: "Phase 5: Plan Builder UI"
    status: pending
    estimated_days: 8
  - name: "Phase 6: Testing & Deployment"
    status: pending
    estimated_days: 3

git_commit: 139bcdcee8515a1bdcdc1edfbb77de9b38e232e7
branch: main
repository: meal-prep-app

created_by: Sean Kim
last_updated: 2025-11-13
last_updated_by: Sean Kim

tags:
  - backend
  - rails
  - postgresql
  - architecture
  - claude-integration
  - frontend-integration
status: draft

related_docs:
  - thoughts/plans/v1-spec.md
  - thoughts/plans/v1-spec-rails-backend.md
  - thoughts/research/2025-11-13-frontend-implementation-vs-v1-spec-analysis.md
---

# Implementation Plan: Rails Backend & Frontend Integration

## Executive Summary

This plan provides a comprehensive, step-by-step guide for implementing a Rails API backend for the Modular Meal Prep Web App and integrating it with the existing React frontend. The implementation progresses from database setup through Claude AI integration to full frontend connectivity, culminating in a production-ready application.

**Current State**: React prototype with mock data (~40% UI complete)
**Target State**: Full-stack application with Rails API, PostgreSQL, Claude integration, and production deployment
**Total Estimated Time**: 23 days (4.6 weeks)

### Key Deliverables

1. Rails 7.1+ API-only application with PostgreSQL
2. Complete data model with 8 core tables and associations
3. Claude API integration for recipe parsing and plan generation
4. Action Cable real-time updates for shopping/prep tracking
5. React frontend integration with API client and React Query
6. Plan Builder UI for recipe input and plan generation
7. Production deployment on Render/Fly.io (backend) and Vercel (frontend)

## Overview

### Problem Statement

The meal prep app currently has a polished React frontend with extensive UI components for viewing and interacting with meal plans (shopping lists, prep timelines, week meals). However, it's entirely powered by static mock data with no backend, authentication, or ability to create new plans. The core value proposition—AI-generated modular meal prep plans using Claude—is not implemented.

### Solution

Build a Rails API backend that:
- Persists meal plans, recipes, and user data in PostgreSQL
- Integrates with Claude API for recipe parsing and intelligent plan generation
- Provides RESTful endpoints for frontend data operations
- Supports real-time updates via Action Cable for collaborative features
- Enables plan creation, refinement, and iteration workflows

### Success Criteria

**Phase 1 Success**: Rails app runs locally with database schema matching spec
**Phase 2 Success**: API endpoints return data, CORS configured, error handling in place
**Phase 3 Success**: Claude successfully parses recipes and generates plans
**Phase 4 Success**: Frontend fetches and displays real data from backend
**Phase 5 Success**: Users can create plans from recipes end-to-end
**Phase 6 Success**: Application deployed to production and accessible via web

## Current State Analysis

### Frontend (Existing)

**Location**: `/Users/seankim/dev/meal-prep-app/src/`

**What Exists**:
- React 18 + TypeScript + Vite setup
- Tailwind CSS + 45+ shadcn/ui components
- Plan View UI: Shopping list, Sunday prep timeline, week meals, overview, notes
- Interactive features: Persistent checkboxes (localStorage), search, collapsible sections
- Mock data: Single hardcoded plan in `src/data/mockPlan.ts` (567 lines)
- TypeScript types aligned with spec data model

**What's Missing**:
- Plan Builder UI (recipe input, constraints form, generation button)
- Recipe Library (favorites, search, management)
- Chat Refinement panel
- Routing (React Router)
- API client (fetch/axios)
- Authentication
- Real-time subscriptions

**Tech Stack**:
```json
{
  "framework": "React 18 + TypeScript + Vite",
  "ui": "Radix UI primitives + Tailwind CSS",
  "state": "React useState + localStorage",
  "routing": "None (conditional rendering only)",
  "data-fetching": "None (static imports)"
}
```

### Backend (To Build)

**Location**: `/Users/seankim/dev/meal-prep-app/rails-api/` (new)

**Architecture Decision**: Rails API-only mode (not full Rails with views)

**Rationale**:
- Frontend already exists and is deployed separately
- API-only reduces complexity and bundle size
- Easier to deploy frontend (Vercel) and backend (Render) independently
- Follows modern separation of concerns

## Requirements Analysis

### Functional Requirements

**Must Have (v1 MVP)**:
1. Recipe parsing from text/URL/PDF via Claude API
2. Meal plan generation with modular component system via Claude
3. Shopping list with categorization and checkbox persistence
4. Sunday prep timeline with step-by-step instructions
5. Week assembly with meal cards and instructions
6. User authentication via magic links
7. Real-time checkbox sync across devices

**Should Have (v1 Enhanced)**:
8. Recipe library with favorites and usage tracking
9. Chat-based plan refinement
10. Recipe suggestions based on existing plan
11. Drag-and-drop reordering for meals and prep steps
12. Timer integration for prep steps

**Could Have (v2 Future)**:
13. Multi-user households
14. Plan templates and favorites
15. Nutritional information
16. Export/print shopping lists
17. Mobile-optimized native app

**Won't Have (Out of Scope)**:
- Recipe database or scraping (user provides recipes)
- Meal planning algorithm (Claude handles logic)
- Payment/subscription system (free to use)
- Social features or recipe sharing

### Technical Requirements

**Backend**:
- Ruby 3.2+ and Rails 7.1+ (API mode)
- PostgreSQL 14+ with UUID primary keys
- Redis for Action Cable and Sidekiq
- Sidekiq for background jobs
- Active Storage for PDF uploads (local disk in dev, S3 in production)
- CORS configuration for React frontend
- API versioning (namespace `/api/v1`)

**Frontend**:
- React Query or SWR for data fetching
- Action Cable client (`@rails/actioncable`) for WebSocket connections
- React Router for navigation
- Environment variables for API URLs

**Infrastructure**:
- Backend: Render or Fly.io (Rails app + PostgreSQL + Redis)
- Frontend: Vercel (static build)
- Claude API: Anthropic API key in Rails credentials

**Performance**:
- Recipe parsing: < 5 seconds
- Plan generation: < 30 seconds (background job)
- API response time: < 200ms for reads
- Real-time updates: < 1 second latency

**Security**:
- Magic link token expiration (15 minutes)
- Row-level security via household_id scoping
- Claude API key stored in Rails credentials (encrypted)
- HTTPS only in production
- CORS restricted to frontend domain

### Out of Scope (Explicitly Excluded)

**Not in v1**:
- Multi-tenancy with separate database instances
- Payment processing
- Admin dashboard
- Recipe scraping or OCR beyond Claude parsing
- Offline mode or PWA features
- Native mobile apps (web-responsive only)

## Architecture & Design

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Vercel)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (Vite)                                     │  │
│  │  - Plan Builder (Recipe Input, Constraints)           │  │
│  │  - Plan View (Shopping, Prep, Week)                   │  │
│  │  - Recipe Library                                     │  │
│  │  - Chat Refinement                                    │  │
│  └──────────────┬───────────────────────┬────────────────┘  │
│                 │ HTTP (REST API)       │ WebSocket         │
│                 │                       │ (Action Cable)     │
└─────────────────┼───────────────────────┼────────────────────┘
                  │                       │
                  ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Render/Fly.io)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rails API (API Mode)                                 │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Controllers (API::V1::*)                       │  │  │
│  │  │  - RecipesController                            │  │  │
│  │  │  - MealPlansController                          │  │  │
│  │  │  - ShoppingListItemsController                  │  │  │
│  │  │  - ChatController                               │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Services (Claude Integration)                  │  │  │
│  │  │  - Claude::RecipeParser                         │  │  │
│  │  │  - Claude::PlanGenerator                        │  │  │
│  │  │  - Claude::PlanRefiner                          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Background Jobs (Sidekiq)                      │  │  │
│  │  │  - ParseRecipeJob                               │  │  │
│  │  │  - GeneratePlanJob                              │  │  │
│  │  │  - RefinePlanJob                                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Models (ActiveRecord)                          │  │  │
│  │  │  - Household, Recipe, MealPlan                  │  │  │
│  │  │  - GeneratedPlan, ShoppingListItem              │  │  │
│  │  │  - PrepStep, Component, WeekMeal                │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Action Cable (Real-time)                       │  │  │
│  │  │  - MealPlanChannel                              │  │  │
│  │  │  - ShoppingListChannel                          │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────┬──────────────┬────────────────────┘  │
│                     │              │                        │
└─────────────────────┼──────────────┼────────────────────────┘
                      │              │
                      ▼              ▼
          ┌──────────────────┐  ┌─────────────┐
          │   PostgreSQL     │  │   Redis     │
          │   (Database)     │  │  (Cache +   │
          │                  │  │  Sidekiq)   │
          └──────────────────┘  └─────────────┘

                      ▲
                      │ HTTPS (JSON API)
                      ▼
          ┌──────────────────────┐
          │   Claude API         │
          │   (Anthropic)        │
          │   - Recipe Parsing   │
          │   - Plan Generation  │
          │   - Refinement       │
          └──────────────────────┘
```

### Database Schema

**Entity Relationship Diagram**:

```
┌─────────────────┐
│   Household     │
│─────────────────│
│ id (uuid) PK    │
│ name (string)   │
│ created_at      │
└────────┬────────┘
         │
         │ has_many
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────┐
│     Recipe      │          │    MealPlan     │
│─────────────────│          │─────────────────│
│ id (uuid) PK    │          │ id (uuid) PK    │
│ household_id FK │──┐       │ household_id FK │
│ title           │  │       │ num_dinners     │
│ source_type     │  │       │ num_people      │
│ source_content  │  │       │ prep_time_min   │
│ parsed_content  │  │       │ status (enum)   │
│ is_favorite     │  │       │ created_at      │
│ times_used      │  │       └────────┬────────┘
│ last_used_at    │  │                │
└─────────────────┘  │                │ has_one
                     │                ▼
                     │       ┌─────────────────────┐
                     │       │  GeneratedPlan      │
                     │       │─────────────────────│
                     │       │ id (uuid) PK        │
                     │       │ meal_plan_id FK     │
                     │       │ overview (jsonb)    │
                     │       │ notes (jsonb)       │
                     │       │ created_at          │
                     │       └──────────┬──────────┘
                     │                  │
                     │                  │ has_many
     ┌───────────────┴──────────────────┼──────────────┬────────────────┐
     │ MealPlanRecipe (join)            │              │                │
     │────────────────                  ▼              ▼                ▼
     │ meal_plan_id FK         ┌────────────┐  ┌───────────┐  ┌──────────────┐
     │ recipe_id FK            │ Shopping   │  │ PrepStep  │  │  Component   │
     │ added_by (enum)         │ ListItem   │  │───────────│  │──────────────│
     └─────────────────        │────────────│  │ id        │  │ id           │
                               │ id         │  │ gen_pln_id│  │ gen_plan_id  │
                               │ gen_pln_id │  │ order_idx │  │ name         │
                               │ category   │  │ time_label│  │ type (enum)  │
                               │ item       │  │ descript. │  │ storage_note │
                               │ quantity   │  │ est_min   │  │ shelf_life   │
                               │ already_hv │  │ actual_min│  │ prepped      │
                               │ checked_off│  │ completed │  └──────────────┘
                               └────────────┘  └───────────┘
                                      │
                                      ├─────────────┐
                                      ▼             ▼
                               ┌──────────────────────┐
                               │     WeekMeal         │
                               │──────────────────────│
                               │ id (uuid) PK         │
                               │ generated_plan_id FK │
                               │ day_index (0-6)      │
                               │ title                │
                               │ assembly_time_min    │
                               │ instructions         │
                               │ serves               │
                               │ components_used      │
                               │ is_spotlight         │
                               └──────────────────────┘
```

**Key Design Decisions**:

1. **UUID Primary Keys**: Better for distributed systems, prevents enumeration attacks
2. **JSONB for Complex Data**: `overview` and `notes` fields use JSONB for flexibility
3. **Separate GeneratedPlan**: One-to-one with MealPlan, keeps plan generation data isolated
4. **Enum Types**: `source_type`, `status`, `component_type`, `added_by` for type safety
5. **Normalized Shopping/Prep**: Separate tables for better querying and real-time updates
6. **Array for components_used**: PostgreSQL array type for component IDs in WeekMeal

### API Endpoint Structure

**RESTful Routes** (namespace: `/api/v1`):

```ruby
# Recipes
GET    /api/v1/recipes                    # List recipes for household
POST   /api/v1/recipes                    # Create recipe (triggers parsing)
GET    /api/v1/recipes/:id                # Show recipe
PATCH  /api/v1/recipes/:id                # Update recipe
DELETE /api/v1/recipes/:id                # Delete recipe
POST   /api/v1/recipes/parse_text         # Parse recipe from text
POST   /api/v1/recipes/parse_url          # Parse recipe from URL
POST   /api/v1/recipes/parse_pdf          # Parse recipe from PDF upload
PATCH  /api/v1/recipes/:id/toggle_favorite # Toggle favorite status

# Meal Plans
GET    /api/v1/meal_plans                 # List meal plans for household
POST   /api/v1/meal_plans                 # Create meal plan (triggers generation)
GET    /api/v1/meal_plans/:id             # Show meal plan (basic)
GET    /api/v1/meal_plans/:id/full_plan   # Show meal plan with all nested data
PATCH  /api/v1/meal_plans/:id             # Update meal plan
DELETE /api/v1/meal_plans/:id             # Delete meal plan

# Shopping List Items (nested under meal plan)
GET    /api/v1/meal_plans/:meal_plan_id/shopping_list_items
PATCH  /api/v1/meal_plans/:meal_plan_id/shopping_list_items/:id

# Prep Steps (nested under meal plan)
GET    /api/v1/meal_plans/:meal_plan_id/prep_steps
PATCH  /api/v1/meal_plans/:meal_plan_id/prep_steps/:id

# Week Meals (nested under meal plan)
GET    /api/v1/meal_plans/:meal_plan_id/week_meals
PATCH  /api/v1/meal_plans/:meal_plan_id/week_meals/:id

# Chat Refinement
POST   /api/v1/meal_plans/:meal_plan_id/refine         # Chat-based refinement
POST   /api/v1/meal_plans/:meal_plan_id/suggest_recipes # Suggest complementary recipes

# Households
GET    /api/v1/households/:id             # Show household
PATCH  /api/v1/households/:id             # Update household

# Authentication
POST   /authentication/magic_link/send    # Send magic link email
GET    /authentication/magic_link/verify/:token # Verify token and create session

# Action Cable
WS     /cable                             # WebSocket connection
```

**Serialization Strategy**: Use Blueprinter gem for fast JSON serialization

**Error Response Format**:
```json
{
  "error": "Resource not found",
  "status": 404,
  "details": {}
}
```

### Component Breakdown

**Backend Components**:

1. **Models** (`app/models/`):
   - `Household`: User account container
   - `Recipe`: Parsed recipe with source tracking
   - `MealPlan`: Plan metadata and constraints
   - `GeneratedPlan`: AI-generated plan data
   - `ShoppingListItem`: Individual shopping items
   - `PrepStep`: Sunday prep timeline steps
   - `Component`: Meal prep components
   - `WeekMeal`: Daily meal assembly instructions
   - `MealPlanRecipe`: Join table

2. **Controllers** (`app/controllers/api/v1/`):
   - `RecipesController`: CRUD for recipes
   - `MealPlansController`: CRUD for plans
   - `ShoppingListItemsController`: Update shopping items
   - `PrepStepsController`: Update prep steps
   - `WeekMealsController`: Update week meals
   - `ChatController`: Handle refinement requests
   - `HouseholdsController`: Manage household settings

3. **Services** (`app/services/claude/`):
   - `RecipeParser`: Parse recipe text/URL/PDF with Claude
   - `PlanGenerator`: Generate full meal plan with skill
   - `PlanRefiner`: Chat-based plan refinement
   - `RecipeSuggester`: Suggest complementary recipes

4. **Jobs** (`app/jobs/`):
   - `ParseRecipeJob`: Async recipe parsing
   - `GeneratePlanJob`: Async plan generation
   - `RefinePlanJob`: Async plan refinement

5. **Channels** (`app/channels/`):
   - `MealPlanChannel`: Real-time plan updates
   - `ShoppingListChannel`: Real-time shopping sync

**Frontend Components** (to build):

6. **API Client** (`src/lib/api/`):
   - `client.ts`: Base API client with auth
   - `recipes.ts`: Recipe endpoints
   - `mealPlans.ts`: Meal plan endpoints
   - `actionCable.ts`: WebSocket setup

7. **React Query Hooks** (`src/hooks/`):
   - `useRecipes()`: Fetch and cache recipes
   - `useMealPlan(id)`: Fetch meal plan
   - `useUpdateShoppingItem()`: Mutation for checkboxes
   - `useCreateMealPlan()`: Mutation for plan creation

8. **New Pages** (`src/pages/`):
   - `PlanBuilder.tsx`: Recipe input + constraints
   - `RecipeLibrary.tsx`: Recipe grid with favorites
   - `ChatRefinementPanel.tsx`: Collapsible chat sidebar

### Integration Points

**1. Frontend ↔ Backend (HTTP)**:
- React Query fetches data via REST API
- Optimistic updates for immediate UI feedback
- Error boundaries handle API failures
- Loading states during async operations

**2. Frontend ↔ Backend (WebSocket)**:
- Action Cable for real-time checkbox sync
- Subscribe on mount, unsubscribe on unmount
- Broadcast updates from Rails after model changes

**3. Backend ↔ Claude API**:
- Service objects wrap Anthropic SDK
- JSON mode for structured outputs
- Error handling and retries
- Background jobs for long-running tasks (plan generation)

**4. Backend ↔ PostgreSQL**:
- ActiveRecord ORM for queries
- Migrations for schema changes
- Database indexes for performance
- JSONB for flexible schema sections

**5. Backend ↔ Redis**:
- Action Cable message broker
- Sidekiq job queue
- Session storage (optional)

## Implementation Phases

---

## Phase 1: Rails API Setup & Database Schema

### Overview

Initialize the Rails API application, configure PostgreSQL with UUID primary keys, create all database migrations matching the spec, and set up the development environment with Redis and Sidekiq.

### Prerequisites

- Ruby 3.2+ installed via rbenv or rvm
- PostgreSQL 14+ installed and running
- Redis installed and running
- Node.js 18+ (for frontend integration testing)

### Detailed Tasks

#### Task 1.1: Initialize Rails API Application

**Goal**: Create new Rails 7.1+ API-only app in `rails-api/` subdirectory

**Steps**:

1. Navigate to project root:
   ```bash
   cd /Users/seankim/dev/meal-prep-app
   ```

2. Create Rails API app:
   ```bash
   rails new rails-api --api --database=postgresql --skip-test
   cd rails-api
   ```

3. Configure UUID primary keys in `config/application.rb`:
   ```ruby
   # config/application.rb
   module RailsApi
     class Application < Rails::Application
       config.generators do |g|
         g.orm :active_record, primary_key_type: :uuid
       end
     end
   end
   ```

4. Enable UUID extension in database:
   ```bash
   rails generate migration EnableUuidExtension
   ```

   Edit migration:
   ```ruby
   # db/migrate/XXXXXX_enable_uuid_extension.rb
   class EnableUuidExtension < ActiveRecord::Migration[7.1]
     def change
       enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')
     end
   end
   ```

5. Create database:
   ```bash
   rails db:create
   rails db:migrate
   ```

**Files Modified**:
- `rails-api/config/application.rb`
- `rails-api/db/migrate/XXXXXX_enable_uuid_extension.rb`

**Verification**:
```bash
rails console
# Should connect without errors
ActiveRecord::Base.connection.extension_enabled?('pgcrypto')
# => true
```

#### Task 1.2: Add Required Gems

**Goal**: Install gems for API development, Claude integration, CORS, serialization, background jobs

**Steps**:

1. Edit `Gemfile`:
   ```ruby
   # Gemfile
   source 'https://rubygems.org'
   ruby '3.2.2'

   gem 'rails', '~> 7.1.0'
   gem 'pg', '~> 1.5'
   gem 'puma', '>= 5.0'

   # API & CORS
   gem 'rack-cors'
   gem 'blueprinter' # Fast JSON serialization

   # Background Jobs
   gem 'redis', '>= 4.0'
   gem 'sidekiq', '~> 7.0'

   # Claude API
   gem 'anthropic', '~> 0.1.0' # Check for latest version

   # Authentication
   gem 'devise'
   gem 'devise-api' # For token-based auth

   # Utilities
   gem 'dotenv-rails', groups: [:development, :test]

   group :development do
     gem 'pry-rails'
     gem 'bullet' # N+1 query detection
     gem 'annotate' # Model annotations
   end
   ```

2. Install gems:
   ```bash
   bundle install
   ```

3. Generate Devise install:
   ```bash
   rails generate devise:install
   ```

**Files Modified**:
- `rails-api/Gemfile`
- `rails-api/Gemfile.lock`

**Verification**:
```bash
bundle list | grep anthropic
# Should show anthropic gem version
```

#### Task 1.3: Configure CORS

**Goal**: Allow React frontend to make API requests from different origin

**Steps**:

1. Edit `config/initializers/cors.rb`:
   ```ruby
   # config/initializers/cors.rb
   Rails.application.config.middleware.insert_before 0, Rack::Cors do
     allow do
       origins 'http://localhost:5173', # Vite dev server
               'http://localhost:3001', # Alternative local
               'https://meal-prep-app.vercel.app' # Production frontend

       resource '*',
         headers: :any,
         methods: [:get, :post, :put, :patch, :delete, :options, :head],
         credentials: true,
         expose: ['Authorization']
     end
   end
   ```

2. Add to `config/application.rb`:
   ```ruby
   # config/application.rb
   config.middleware.use ActionDispatch::Cookies
   config.middleware.use ActionDispatch::Session::CookieStore
   config.api_only = true # Keep API-only mode
   ```

**Files Modified**:
- `rails-api/config/initializers/cors.rb`
- `rails-api/config/application.rb`

**Verification**:
```bash
rails middleware | grep Cors
# Should show Rack::Cors
```

#### Task 1.4: Create Database Migrations

**Goal**: Create all 9 tables matching the v1 spec schema

**Steps**:

1. Generate migration files:
   ```bash
   rails generate migration CreateHouseholds
   rails generate migration CreateRecipes
   rails generate migration CreateMealPlans
   rails generate migration CreateGeneratedPlans
   rails generate migration CreateShoppingListItems
   rails generate migration CreatePrepSteps
   rails generate migration CreateComponents
   rails generate migration CreateWeekMeals
   rails generate migration CreateMealPlanRecipes
   ```

2. Edit each migration (see full migration code in spec):

   **Households**:
   ```ruby
   # db/migrate/XXXXXX_create_households.rb
   class CreateHouseholds < ActiveRecord::Migration[7.1]
     def change
       create_table :households, id: :uuid do |t|
         t.string :name
         t.timestamps
       end
     end
   end
   ```

   **Recipes**:
   ```ruby
   # db/migrate/XXXXXX_create_recipes.rb
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
   ```

   **MealPlans**:
   ```ruby
   # db/migrate/XXXXXX_create_meal_plans.rb
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
   ```

   **GeneratedPlans**:
   ```ruby
   # db/migrate/XXXXXX_create_generated_plans.rb
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
   ```

   **ShoppingListItems**:
   ```ruby
   # db/migrate/XXXXXX_create_shopping_list_items.rb
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
   ```

   **PrepSteps**:
   ```ruby
   # db/migrate/XXXXXX_create_prep_steps.rb
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
   ```

   **Components**:
   ```ruby
   # db/migrate/XXXXXX_create_components.rb
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
   ```

   **WeekMeals**:
   ```ruby
   # db/migrate/XXXXXX_create_week_meals.rb
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
   ```

   **MealPlanRecipes** (join table):
   ```ruby
   # db/migrate/XXXXXX_create_meal_plan_recipes.rb
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

3. Run migrations:
   ```bash
   rails db:migrate
   ```

4. Verify schema:
   ```bash
   rails db:schema:dump
   cat db/schema.rb
   ```

**Files Created**:
- `rails-api/db/migrate/XXXXXX_create_households.rb`
- `rails-api/db/migrate/XXXXXX_create_recipes.rb`
- `rails-api/db/migrate/XXXXXX_create_meal_plans.rb`
- `rails-api/db/migrate/XXXXXX_create_generated_plans.rb`
- `rails-api/db/migrate/XXXXXX_create_shopping_list_items.rb`
- `rails-api/db/migrate/XXXXXX_create_prep_steps.rb`
- `rails-api/db/migrate/XXXXXX_create_components.rb`
- `rails-api/db/migrate/XXXXXX_create_week_meals.rb`
- `rails-api/db/migrate/XXXXXX_create_meal_plan_recipes.rb`

**Files Modified**:
- `rails-api/db/schema.rb` (auto-generated)

**Verification**:
```bash
rails console
ActiveRecord::Base.connection.tables
# Should show all 9 tables
```

#### Task 1.5: Create ActiveRecord Models

**Goal**: Define models with associations, validations, and enums

**Steps**:

1. Generate model files:
   ```bash
   rails generate model Household --skip-migration
   rails generate model Recipe --skip-migration
   rails generate model MealPlan --skip-migration
   rails generate model GeneratedPlan --skip-migration
   rails generate model ShoppingListItem --skip-migration
   rails generate model PrepStep --skip-migration
   rails generate model Component --skip-migration
   rails generate model WeekMeal --skip-migration
   rails generate model MealPlanRecipe --skip-migration
   ```

2. Edit model files:

   **Household**:
   ```ruby
   # app/models/household.rb
   class Household < ApplicationRecord
     has_many :recipes, dependent: :destroy
     has_many :meal_plans, dependent: :destroy

     validates :name, length: { maximum: 100 }
   end
   ```

   **Recipe**:
   ```ruby
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
   ```

   **MealPlan**:
   ```ruby
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
   ```

   **GeneratedPlan**:
   ```ruby
   # app/models/generated_plan.rb
   class GeneratedPlan < ApplicationRecord
     belongs_to :meal_plan
     has_many :shopping_list_items, dependent: :destroy
     has_many :prep_steps, dependent: :destroy
     has_many :components, dependent: :destroy
     has_many :week_meals, dependent: :destroy

     validates :overview, presence: true
   end
   ```

   **ShoppingListItem**:
   ```ruby
   # app/models/shopping_list_item.rb
   class ShoppingListItem < ApplicationRecord
     belongs_to :generated_plan

     validates :category, :item, :quantity, presence: true

     scope :checked, -> { where(checked_off: true) }
     scope :unchecked, -> { where(checked_off: false) }
     scope :by_category, -> { order(:category, :item) }

     after_update_commit :broadcast_update

     private

     def broadcast_update
       ActionCable.server.broadcast(
         "meal_plan_#{generated_plan.meal_plan_id}",
         { type: 'shopping_item_updated', item: self.as_json }
       )
     end
   end
   ```

   **PrepStep**:
   ```ruby
   # app/models/prep_step.rb
   class PrepStep < ApplicationRecord
     belongs_to :generated_plan

     validates :order_index, :time_label, :description, presence: true

     scope :ordered, -> { order(:order_index) }
     scope :completed, -> { where(completed: true) }

     after_update_commit :broadcast_update

     private

     def broadcast_update
       ActionCable.server.broadcast(
         "meal_plan_#{generated_plan.meal_plan_id}",
         { type: 'prep_step_updated', step: self.as_json }
       )
     end
   end
   ```

   **Component**:
   ```ruby
   # app/models/component.rb
   class Component < ApplicationRecord
     belongs_to :generated_plan

     enum component_type: {
       grain: 0, protein: 1, vegetable: 2,
       aromatic: 3, sauce: 4, broth: 5
     }

     validates :name, :component_type, presence: true
   end
   ```

   **WeekMeal**:
   ```ruby
   # app/models/week_meal.rb
   class WeekMeal < ApplicationRecord
     belongs_to :generated_plan

     validates :day_index, :title, :instructions, presence: true
     validates :day_index, uniqueness: { scope: :generated_plan_id }

     scope :ordered, -> { order(:day_index) }
   end
   ```

   **MealPlanRecipe**:
   ```ruby
   # app/models/meal_plan_recipe.rb
   class MealPlanRecipe < ApplicationRecord
     belongs_to :meal_plan
     belongs_to :recipe

     enum added_by: { user: 0, generated: 1 }
   end
   ```

3. Verify models in console:
   ```bash
   rails console
   Household.create(name: "Test Household")
   Recipe.column_names
   MealPlan.statuses
   # => {"generating"=>0, "ready"=>1, "in_progress"=>2, "completed"=>3}
   ```

**Files Created**:
- `rails-api/app/models/household.rb`
- `rails-api/app/models/recipe.rb`
- `rails-api/app/models/meal_plan.rb`
- `rails-api/app/models/generated_plan.rb`
- `rails-api/app/models/shopping_list_item.rb`
- `rails-api/app/models/prep_step.rb`
- `rails-api/app/models/component.rb`
- `rails-api/app/models/week_meal.rb`
- `rails-api/app/models/meal_plan_recipe.rb`

**Verification**:
```bash
rails console
MealPlan.new.valid?
# Should return false (missing required fields)
```

#### Task 1.6: Configure Redis and Sidekiq

**Goal**: Set up background job processing for async Claude API calls

**Steps**:

1. Create Sidekiq config:
   ```yaml
   # config/sidekiq.yml
   :concurrency: 5
   :queues:
     - default
     - mailers
   ```

2. Configure Redis in `config/cable.yml`:
   ```yaml
   # config/cable.yml
   development:
     adapter: redis
     url: redis://localhost:6379/1

   test:
     adapter: test

   production:
     adapter: redis
     url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
     channel_prefix: meal_prep_production
   ```

3. Add Sidekiq initializer:
   ```ruby
   # config/initializers/sidekiq.rb
   Sidekiq.configure_server do |config|
     config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
   end

   Sidekiq.configure_client do |config|
     config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
   end
   ```

4. Start Redis:
   ```bash
   redis-server
   ```

5. Start Sidekiq (in separate terminal):
   ```bash
   cd rails-api
   bundle exec sidekiq
   ```

**Files Created**:
- `rails-api/config/sidekiq.yml`
- `rails-api/config/initializers/sidekiq.rb`

**Files Modified**:
- `rails-api/config/cable.yml`

**Verification**:
```bash
redis-cli ping
# => PONG
bundle exec sidekiq
# Should start without errors
```

#### Task 1.7: Configure Claude API Credentials

**Goal**: Store Claude API key securely in Rails credentials

**Steps**:

1. Edit credentials:
   ```bash
   EDITOR="code --wait" rails credentials:edit
   # Or use vim/nano: EDITOR="vim" rails credentials:edit
   ```

2. Add Claude API key:
   ```yaml
   # config/credentials.yml.enc (after decryption)
   claude_api_key: YOUR_ANTHROPIC_API_KEY_HERE
   ```

3. Save and close editor (credentials are auto-encrypted)

4. Verify in console:
   ```bash
   rails console
   Rails.application.credentials.claude_api_key
   # Should return your API key
   ```

5. Add to `.env.development` for local override (optional):
   ```bash
   # .env.development
   CLAUDE_API_KEY=your_key_here
   ```

**Files Modified**:
- `rails-api/config/credentials.yml.enc` (encrypted)
- `rails-api/config/master.key` (DO NOT COMMIT)

**Verification**:
```bash
rails console
Rails.application.credentials.claude_api_key.present?
# => true
```

### Success Criteria

**All tasks complete when**:
- [ ] Rails API app runs: `rails server` starts on port 3000
- [ ] Database exists: `rails db:migrate:status` shows all migrations up
- [ ] 9 tables created: `rails console` → `ActiveRecord::Base.connection.tables.count >= 9`
- [ ] Models have associations: `MealPlan.new.generated_plan` doesn't raise error
- [ ] Enums work: `Recipe.source_types` returns `{"text"=>0, "url"=>1, "pdf"=>2}`
- [ ] Redis connected: `redis-cli ping` returns PONG
- [ ] Sidekiq runs: `bundle exec sidekiq` starts without errors
- [ ] Claude API key set: `Rails.application.credentials.claude_api_key.present?` returns true

### Time Estimate

**2 days** (16 hours)
- Day 1: Tasks 1.1-1.4 (Rails setup, gems, migrations) - 8 hours
- Day 2: Tasks 1.5-1.7 (Models, Redis, credentials) - 8 hours

### Risks & Mitigation

**Risk 1: PostgreSQL not installed**
- Mitigation: Install via Homebrew (`brew install postgresql@14`) or Postgres.app on macOS
- Verification: `psql --version`

**Risk 2: UUID extension fails**
- Mitigation: Ensure PostgreSQL 9.4+ installed; use `pgcrypto` extension
- Alternative: Use `gen_random_uuid()` function instead of extension

**Risk 3: Redis connection errors**
- Mitigation: Ensure Redis running (`redis-server`) before starting Sidekiq
- Verification: `redis-cli ping` should return PONG

**Risk 4: Anthropic gem version incompatible**
- Mitigation: Check latest version on RubyGems.org, update Gemfile
- Verification: Test API call in console

**Risk 5: Migration rollback needed**
- Mitigation: Test migrations in console before applying: `rails db:migrate:status`
- Backup: `rails db:rollback STEP=1` to undo last migration

### Testing Strategy

**Manual Tests**:
1. Create a household in console: `Household.create(name: "Test")`
2. Create a recipe: `Recipe.create(household_id: household.id, title: "Test Recipe", source_type: :text)`
3. Verify associations: `household.recipes.count` should return 1
4. Test enum: `recipe.text?` should return true
5. Verify indexes exist: `ActiveRecord::Base.connection.indexes(:recipes).map(&:columns)`

**Automated Tests** (optional, recommended for staff engineer review):
```bash
# Install RSpec (optional)
gem 'rspec-rails', group: [:development, :test]
bundle install
rails generate rspec:install

# Example model spec
# spec/models/meal_plan_spec.rb
require 'rails_helper'

RSpec.describe MealPlan, type: :model do
  it { should belong_to(:household) }
  it { should validate_presence_of(:num_dinners) }
  it { should define_enum_for(:status) }
end
```

### Code Review Checklist

**Before moving to Phase 2**:
- [ ] All migrations run successfully
- [ ] No pending migrations: `rails db:migrate:status`
- [ ] Models have proper associations (test in console)
- [ ] Enums defined and working
- [ ] Foreign keys exist in schema
- [ ] Indexes created for frequently queried columns
- [ ] Redis and Sidekiq configured and running
- [ ] CORS allows frontend origin
- [ ] Claude API key set in credentials
- [ ] No credentials committed to git (check `.gitignore`)

**Staff Engineer Review Points**:
- Schema design matches spec requirements
- UUID primary keys configured correctly
- JSONB columns for flexible data (overview, notes)
- Proper indexing strategy for performance
- Enum types for status fields
- After-commit callbacks for real-time updates

---

## Phase 2: Core Backend Infrastructure

### Overview

Build the API endpoint structure with RESTful routes, implement JSON serialization, add error handling middleware, and configure Action Cable channels for real-time updates.

### Dependencies

- Phase 1 complete (database and models ready)
- Rails server runs without errors
- Redis running for Action Cable

### Detailed Tasks

#### Task 2.1: Set Up API Routes

**Goal**: Define RESTful routes in `config/routes.rb` with API versioning

**Steps**:

1. Edit `config/routes.rb`:
   ```ruby
   # config/routes.rb
   Rails.application.routes.draw do
     # Health check
     get 'health', to: 'health#show'

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
             get :full_plan
             post :refine
             post :suggest_recipes
           end

           resources :shopping_list_items, only: [:index, :update]
           resources :prep_steps, only: [:index, :update]
           resources :week_meals, only: [:index, :update]
         end

         resources :households, only: [:show, :update]
       end
     end

     namespace :authentication do
       post 'magic_link/send', to: 'magic_links#create'
       get 'magic_link/verify/:token', to: 'magic_links#verify'
     end

     # Action Cable
     mount ActionCable.server => '/cable'
   end
   ```

2. Verify routes:
   ```bash
   rails routes | grep api/v1
   ```

**Files Modified**:
- `rails-api/config/routes.rb`

**Verification**:
```bash
rails routes | grep meal_plans
# Should show routes like:
# GET    /api/v1/meal_plans/:id/full_plan
# POST   /api/v1/meal_plans/:id/refine
```

#### Task 2.2: Create Base API Controller

**Goal**: Set up common controller logic for authentication, error handling, and JSON responses

**Steps**:

1. Create base controller:
   ```ruby
   # app/controllers/api/v1/base_controller.rb
   module Api
     module V1
       class BaseController < ApplicationController
         before_action :authenticate_household!

         rescue_from ActiveRecord::RecordNotFound, with: :not_found
         rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

         private

         def authenticate_household!
           # TODO: Implement authentication
           # For now, get household from header or default to first household
           @current_household = Household.first

           unless @current_household
             render json: { error: 'Unauthorized' }, status: :unauthorized
           end
         end

         def current_household
           @current_household
         end

         def not_found(exception)
           render json: {
             error: 'Resource not found',
             message: exception.message,
             status: 404
           }, status: :not_found
         end

         def unprocessable_entity(exception)
           render json: {
             error: 'Validation failed',
             message: exception.message,
             errors: exception.record.errors.full_messages,
             status: 422
           }, status: :unprocessable_entity
         end
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/controllers/api/v1/base_controller.rb`

#### Task 2.3: Create Recipes Controller

**Goal**: Implement CRUD operations for recipes with Claude parsing endpoints

**Steps**:

1. Create controller:
   ```ruby
   # app/controllers/api/v1/recipes_controller.rb
   module Api
     module V1
       class RecipesController < BaseController
         before_action :set_recipe, only: [:show, :update, :destroy, :toggle_favorite]

         def index
           @recipes = current_household.recipes.order(created_at: :desc)
           render json: RecipeBlueprint.render(@recipes)
         end

         def show
           render json: RecipeBlueprint.render(@recipe)
         end

         def create
           @recipe = current_household.recipes.build(recipe_params)

           if @recipe.save
             ParseRecipeJob.perform_later(@recipe.id) if should_parse?
             render json: RecipeBlueprint.render(@recipe), status: :created
           else
             render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
           end
         end

         def update
           if @recipe.update(recipe_params)
             render json: RecipeBlueprint.render(@recipe)
           else
             render json: { errors: @recipe.errors.full_messages }, status: :unprocessable_entity
           end
         end

         def destroy
           @recipe.destroy
           head :no_content
         end

         def parse_text
           @recipe = current_household.recipes.create!(
             title: params[:title] || 'Untitled Recipe',
             source_type: :text,
             source_content: params[:text]
           )

           ParseRecipeJob.perform_later(@recipe.id)
           render json: RecipeBlueprint.render(@recipe), status: :accepted
         end

         def parse_url
           @recipe = current_household.recipes.create!(
             title: params[:title] || 'Untitled Recipe',
             source_type: :url,
             source_content: params[:url]
           )

           ParseRecipeJob.perform_later(@recipe.id)
           render json: RecipeBlueprint.render(@recipe), status: :accepted
         end

         def parse_pdf
           @recipe = current_household.recipes.create!(
             title: params[:title] || 'Untitled Recipe',
             source_type: :pdf
           )
           @recipe.pdf_file.attach(params[:pdf])

           ParseRecipeJob.perform_later(@recipe.id)
           render json: RecipeBlueprint.render(@recipe), status: :accepted
         end

         def toggle_favorite
           @recipe.update!(is_favorite: !@recipe.is_favorite)
           render json: RecipeBlueprint.render(@recipe)
         end

         private

         def set_recipe
           @recipe = current_household.recipes.find(params[:id])
         end

         def recipe_params
           params.require(:recipe).permit(:title, :source_type, :source_content)
         end

         def should_parse?
           @recipe.source_content.present? && @recipe.parsed_content.blank?
         end
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/controllers/api/v1/recipes_controller.rb`

#### Task 2.4: Create Meal Plans Controller

**Goal**: Implement meal plan CRUD with full_plan endpoint for nested data

**Steps**:

1. Create controller:
   ```ruby
   # app/controllers/api/v1/meal_plans_controller.rb
   module Api
     module V1
       class MealPlansController < BaseController
         before_action :set_meal_plan, only: [:show, :full_plan, :update, :destroy, :refine, :suggest_recipes]

         def index
           @meal_plans = current_household.meal_plans
             .includes(:recipes, :generated_plan)
             .order(created_at: :desc)

           render json: MealPlanBlueprint.render(@meal_plans)
         end

         def show
           render json: MealPlanBlueprint.render(@meal_plan)
         end

         def full_plan
           render json: MealPlanBlueprint.render(@meal_plan, view: :full)
         end

         def create
           @meal_plan = current_household.meal_plans.build(meal_plan_params)

           # Add recipes if provided
           if params[:recipe_ids].present?
             recipes = current_household.recipes.where(id: params[:recipe_ids])
             recipes.each do |recipe|
               @meal_plan.meal_plan_recipes.build(recipe: recipe, added_by: :user)
             end
           end

           if @meal_plan.save
             # GeneratePlanJob is triggered by after_create callback
             render json: MealPlanBlueprint.render(@meal_plan), status: :created
           else
             render json: { errors: @meal_plan.errors.full_messages }, status: :unprocessable_entity
           end
         end

         def update
           if @meal_plan.update(meal_plan_params)
             render json: MealPlanBlueprint.render(@meal_plan)
           else
             render json: { errors: @meal_plan.errors.full_messages }, status: :unprocessable_entity
           end
         end

         def destroy
           @meal_plan.destroy
           head :no_content
         end

         def refine
           RefinePlanJob.perform_later(@meal_plan.id, params[:message])
           render json: { status: 'processing' }, status: :accepted
         end

         def suggest_recipes
           # TODO: Implement Claude recipe suggestion
           render json: { suggestions: [] }
         end

         private

         def set_meal_plan
           @meal_plan = current_household.meal_plans.find(params[:id])
         end

         def meal_plan_params
           params.require(:meal_plan).permit(:num_dinners, :num_people, :prep_time_minutes)
         end
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/controllers/api/v1/meal_plans_controller.rb`

#### Task 2.5: Create Nested Resource Controllers

**Goal**: Implement controllers for shopping items, prep steps, and week meals

**Steps**:

1. **Shopping List Items Controller**:
   ```ruby
   # app/controllers/api/v1/shopping_list_items_controller.rb
   module Api
     module V1
       class ShoppingListItemsController < BaseController
         before_action :set_meal_plan
         before_action :set_shopping_list_item, only: [:update]

         def index
           items = @meal_plan.generated_plan.shopping_list_items.by_category
           render json: ShoppingListItemBlueprint.render(items)
         end

         def update
           if @item.update(shopping_list_item_params)
             render json: ShoppingListItemBlueprint.render(@item)
           else
             render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
           end
         end

         private

         def set_meal_plan
           @meal_plan = current_household.meal_plans.find(params[:meal_plan_id])
         end

         def set_shopping_list_item
           @item = @meal_plan.generated_plan.shopping_list_items.find(params[:id])
         end

         def shopping_list_item_params
           params.require(:shopping_list_item).permit(:checked_off, :already_have)
         end
       end
     end
   end
   ```

2. **Prep Steps Controller**:
   ```ruby
   # app/controllers/api/v1/prep_steps_controller.rb
   module Api
     module V1
       class PrepStepsController < BaseController
         before_action :set_meal_plan
         before_action :set_prep_step, only: [:update]

         def index
           steps = @meal_plan.generated_plan.prep_steps.ordered
           render json: PrepStepBlueprint.render(steps)
         end

         def update
           if @step.update(prep_step_params)
             render json: PrepStepBlueprint.render(@step)
           else
             render json: { errors: @step.errors.full_messages }, status: :unprocessable_entity
           end
         end

         private

         def set_meal_plan
           @meal_plan = current_household.meal_plans.find(params[:meal_plan_id])
         end

         def set_prep_step
           @step = @meal_plan.generated_plan.prep_steps.find(params[:id])
         end

         def prep_step_params
           params.require(:prep_step).permit(:completed, :actual_minutes)
         end
       end
     end
   end
   ```

3. **Week Meals Controller**:
   ```ruby
   # app/controllers/api/v1/week_meals_controller.rb
   module Api
     module V1
       class WeekMealsController < BaseController
         before_action :set_meal_plan
         before_action :set_week_meal, only: [:update]

         def index
           meals = @meal_plan.generated_plan.week_meals.ordered
           render json: WeekMealBlueprint.render(meals)
         end

         def update
           if @meal.update(week_meal_params)
             render json: WeekMealBlueprint.render(@meal)
           else
             render json: { errors: @meal.errors.full_messages }, status: :unprocessable_entity
           end
         end

         private

         def set_meal_plan
           @meal_plan = current_household.meal_plans.find(params[:meal_plan_id])
         end

         def set_week_meal
           @meal = @meal_plan.generated_plan.week_meals.find(params[:id])
         end

         def week_meal_params
           params.require(:week_meal).permit(:day_index)
         end
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/controllers/api/v1/shopping_list_items_controller.rb`
- `rails-api/app/controllers/api/v1/prep_steps_controller.rb`
- `rails-api/app/controllers/api/v1/week_meals_controller.rb`

#### Task 2.6: Implement JSON Serialization with Blueprinter

**Goal**: Create serializers for consistent JSON API responses

**Steps**:

1. Create base blueprint:
   ```ruby
   # app/blueprints/base_blueprint.rb
   class BaseBlueprint < Blueprinter::Base
     # Global transformers
     transform do |object, options|
       object
     end
   end
   ```

2. **Recipe Blueprint**:
   ```ruby
   # app/blueprints/recipe_blueprint.rb
   class RecipeBlueprint < BaseBlueprint
     identifier :id

     fields :title, :source_type, :source_content, :is_favorite,
            :times_used, :last_used_at, :created_at

     field :parsed_content do |recipe|
       recipe.parsed_content.present? ? JSON.parse(recipe.parsed_content) : nil
     end

     field :pdf_url do |recipe|
       recipe.pdf_file.attached? ? Rails.application.routes.url_helpers.rails_blob_url(recipe.pdf_file, only_path: true) : nil
     end
   end
   ```

3. **Meal Plan Blueprint**:
   ```ruby
   # app/blueprints/meal_plan_blueprint.rb
   class MealPlanBlueprint < BaseBlueprint
     identifier :id

     fields :num_dinners, :num_people, :prep_time_minutes, :status, :created_at

     association :recipes, blueprint: RecipeBlueprint

     view :full do
       association :generated_plan, blueprint: GeneratedPlanBlueprint
     end
   end
   ```

4. **Generated Plan Blueprint**:
   ```ruby
   # app/blueprints/generated_plan_blueprint.rb
   class GeneratedPlanBlueprint < BaseBlueprint
     identifier :id

     fields :overview, :notes, :created_at

     association :shopping_list_items, blueprint: ShoppingListItemBlueprint
     association :prep_steps, blueprint: PrepStepBlueprint
     association :components, blueprint: ComponentBlueprint
     association :week_meals, blueprint: WeekMealBlueprint
   end
   ```

5. **Supporting Blueprints**:
   ```ruby
   # app/blueprints/shopping_list_item_blueprint.rb
   class ShoppingListItemBlueprint < BaseBlueprint
     identifier :id
     fields :category, :item, :quantity, :already_have, :checked_off
   end

   # app/blueprints/prep_step_blueprint.rb
   class PrepStepBlueprint < BaseBlueprint
     identifier :id
     fields :order_index, :time_label, :description,
            :estimated_minutes, :actual_minutes, :completed
   end

   # app/blueprints/component_blueprint.rb
   class ComponentBlueprint < BaseBlueprint
     identifier :id
     fields :name, :component_type, :storage_note, :shelf_life_days, :prepped
   end

   # app/blueprints/week_meal_blueprint.rb
   class WeekMealBlueprint < BaseBlueprint
     identifier :id
     fields :day_index, :title, :assembly_time_minutes, :instructions,
            :serves, :components_used, :is_spotlight
   end
   ```

**Files Created**:
- `rails-api/app/blueprints/base_blueprint.rb`
- `rails-api/app/blueprints/recipe_blueprint.rb`
- `rails-api/app/blueprints/meal_plan_blueprint.rb`
- `rails-api/app/blueprints/generated_plan_blueprint.rb`
- `rails-api/app/blueprints/shopping_list_item_blueprint.rb`
- `rails-api/app/blueprints/prep_step_blueprint.rb`
- `rails-api/app/blueprints/component_blueprint.rb`
- `rails-api/app/blueprints/week_meal_blueprint.rb`

#### Task 2.7: Set Up Action Cable Channels

**Goal**: Create real-time channels for shopping list and prep step updates

**Steps**:

1. **Meal Plan Channel**:
   ```ruby
   # app/channels/meal_plan_channel.rb
   class MealPlanChannel < ApplicationCable::Channel
     def subscribed
       meal_plan = MealPlan.find(params[:plan_id])
       # TODO: Verify household access
       stream_for meal_plan
     end

     def unsubscribed
       stop_all_streams
     end
   end
   ```

2. **Configure Action Cable**:
   ```ruby
   # app/channels/application_cable/connection.rb
   module ApplicationCable
     class Connection < ActionCable::Connection::Base
       identified_by :current_household

       def connect
         self.current_household = find_verified_household
       end

       private

       def find_verified_household
         # TODO: Implement authentication
         # For now, use first household
         Household.first || reject_unauthorized_connection
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/channels/meal_plan_channel.rb`

**Files Modified**:
- `rails-api/app/channels/application_cable/connection.rb`

### Success Criteria

**All tasks complete when**:
- [ ] Routes defined: `rails routes | grep api/v1` shows all endpoints
- [ ] Controllers respond: `curl http://localhost:3000/api/v1/recipes` returns JSON (after creating test data)
- [ ] Serialization works: Response includes all expected fields
- [ ] Error handling: Invalid requests return proper error JSON
- [ ] Action Cable: WebSocket connects at `ws://localhost:3000/cable`
- [ ] CORS configured: Frontend origin allowed

### Time Estimate

**3 days** (24 hours)
- Day 1: Routes, base controller, recipes controller (8 hours)
- Day 2: Meal plans controller, nested controllers (8 hours)
- Day 3: Blueprints, Action Cable, testing (8 hours)

### Risks & Mitigation

**Risk 1: Blueprinter serialization too slow**
- Mitigation: Use database eager loading (`.includes()`) to avoid N+1 queries
- Alternative: Switch to JBuilder if needed

**Risk 2: Action Cable WebSocket connection fails**
- Mitigation: Ensure Redis running, check `config/cable.yml`
- Debugging: Check browser console for connection errors

**Risk 3: CORS preflight requests fail**
- Mitigation: Add OPTIONS method to CORS config
- Debugging: Check browser Network tab for CORS errors

### Testing Strategy

**Manual Tests with curl**:

1. Create household:
   ```bash
   curl -X POST http://localhost:3000/api/v1/households \
     -H "Content-Type: application/json" \
     -d '{"household": {"name": "Test"}}'
   ```

2. List recipes:
   ```bash
   curl http://localhost:3000/api/v1/recipes
   ```

3. Create meal plan:
   ```bash
   curl -X POST http://localhost:3000/api/v1/meal_plans \
     -H "Content-Type: application/json" \
     -d '{"meal_plan": {"num_dinners": 5, "num_people": 2}}'
   ```

**Action Cable Test** (in browser console after frontend setup):
```javascript
const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
const subscription = cable.subscriptions.create(
  { channel: 'MealPlanChannel', plan_id: 'PLAN_ID_HERE' },
  { received: (data) => console.log('Received:', data) }
);
```

---

## Phase 3: Claude Integration Services

### Overview

Build service objects for Claude API integration: recipe parsing, plan generation, and chat refinement. Implement background jobs for async processing and JSON schema validation.

### Dependencies

- Phase 2 complete (controllers and models ready)
- Claude API key configured in credentials
- Sidekiq running for background jobs

### Detailed Tasks

#### Task 3.1: Create Claude Base Service

**Goal**: Set up shared Claude API client and error handling

**Steps**:

1. Install Anthropic gem (if not already done):
   ```ruby
   # Gemfile
   gem 'anthropic', '~> 0.1.0'
   ```

2. Create base service:
   ```ruby
   # app/services/claude/base_service.rb
   module Claude
     class BaseService
       CLAUDE_MODEL = "claude-sonnet-4-5-20250929".freeze
       MAX_TOKENS = 16000

       private

       def client
         @client ||= Anthropic::Client.new(
           api_key: Rails.application.credentials.claude_api_key || ENV['CLAUDE_API_KEY']
         )
       end

       def call_claude(prompt:, schema: nil, max_tokens: MAX_TOKENS)
         options = {
           model: CLAUDE_MODEL,
           max_tokens: max_tokens,
           messages: [{ role: "user", content: prompt }]
         }

         if schema.present?
           options[:response_format] = {
             type: "json_schema",
             json_schema: schema
           }
         end

         response = client.messages(options)
         parse_response(response)
       rescue => e
         Rails.logger.error("Claude API error: #{e.message}")
         { error: e.message }
       end

       def parse_response(response)
         content = response.dig("content", 0, "text")
         return { error: "Empty response" } unless content

         JSON.parse(content)
       rescue JSON::ParserError => e
         Rails.logger.error("JSON parse error: #{e.message}")
         { error: "Invalid JSON response", raw: content }
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/services/claude/base_service.rb`

#### Task 3.2: Implement Recipe Parser Service

**Goal**: Parse recipe text/URL/PDF with Claude and extract structured data

**Steps**:

1. Create recipe parser:
   ```ruby
   # app/services/claude/recipe_parser.rb
   module Claude
     class RecipeParser < BaseService
       def initialize(content, source_type)
         @content = content
         @source_type = source_type
       end

       def parse
         call_claude(
           prompt: build_prompt,
           schema: recipe_parse_schema
         )
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

**Files Created**:
- `rails-api/app/services/claude/recipe_parser.rb`

#### Task 3.3: Implement Plan Generator Service

**Goal**: Generate complete meal plan with meal prep skill

**Steps**:

1. Store meal prep skill content:
   ```bash
   mkdir -p rails-api/lib/skills
   # Copy meal prep skill from spec to:
   # rails-api/lib/skills/meal_prep_skill.txt
   ```

2. Create plan generator:
   ```ruby
   # app/services/claude/plan_generator.rb
   module Claude
     class PlanGenerator < BaseService
       def initialize(meal_plan)
         @meal_plan = meal_plan
         @skill_content = File.read(Rails.root.join('lib', 'skills', 'meal_prep_skill.txt'))
       end

       def generate
         call_claude(
           prompt: build_prompt,
           schema: plan_generation_schema,
           max_tokens: 16000
         )
       end

       private

       def build_prompt
         recipes_json = @meal_plan.recipes.map do |recipe|
           {
             title: recipe.title,
             parsed_content: recipe.parsed_content.present? ? JSON.parse(recipe.parsed_content) : {}
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
         {
           type: "object",
           properties: {
             overview: {
               type: "object",
               properties: {
                 summary: { type: "string" },
                 total_prep_time_minutes: { type: "integer" },
                 component_philosophy: { type: "string" }
               },
               required: ["summary", "total_prep_time_minutes", "component_philosophy"]
             },
             shopping_list: {
               type: "object",
               properties: {
                 categories: {
                   type: "array",
                   items: {
                     type: "object",
                     properties: {
                       name: { type: "string" },
                       items: {
                         type: "array",
                         items: {
                           type: "object",
                           properties: {
                             item: { type: "string" },
                             quantity: { type: "string" },
                             scaled_for_components: { type: "boolean" }
                           },
                           required: ["item", "quantity"]
                         }
                       }
                     },
                     required: ["name", "items"]
                   }
                 },
                 pantry_reminder: { type: "string" }
               },
               required: ["categories"]
             },
             sunday_timeline: {
               type: "object",
               properties: {
                 total_time_minutes: { type: "integer" },
                 start_time_suggestion: { type: "string" },
                 steps: {
                   type: "array",
                   items: {
                     type: "object",
                     properties: {
                       time_label: { type: "string" },
                       tasks: {
                         type: "array",
                         items: {
                           type: "object",
                           properties: {
                             description: { type: "string" },
                             estimated_minutes: { type: "integer" },
                             is_parallel: { type: "boolean" },
                             cooking_method: { type: "string" },
                             components_produced: {
                               type: "array",
                               items: { type: "string" }
                             }
                           },
                           required: ["description", "estimated_minutes"]
                         }
                       }
                     },
                     required: ["time_label", "tasks"]
                   }
                 }
               },
               required: ["total_time_minutes", "start_time_suggestion", "steps"]
             },
             component_inventory: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   name: { type: "string" },
                   type: {
                     type: "string",
                     enum: ["grain", "protein", "vegetable", "aromatic", "sauce", "broth"]
                   },
                   quantity: { type: "string" },
                   storage_container: { type: "string" },
                   shelf_life_days: { type: "integer" },
                   storage_notes: { type: "string" }
                 },
                 required: ["name", "type", "quantity", "shelf_life_days"]
               }
             },
             week_assembly: {
               type: "array",
               items: {
                 type: "object",
                 properties: {
                   suggested_day: { type: "string" },
                   title: { type: "string" },
                   assembly_time_minutes: { type: "integer" },
                   serves: { type: "integer" },
                   is_spotlight: { type: "boolean" },
                   components_used: {
                     type: "array",
                     items: { type: "string" }
                   },
                   instructions: {
                     type: "array",
                     items: {
                       type: "object",
                       properties: {
                         step: { type: "string" },
                         cooking_method: { type: "string" }
                       },
                       required: ["step"]
                     }
                   },
                   variations: {
                     type: "array",
                     items: { type: "string" }
                   },
                   freshness_priority: {
                     type: "string",
                     enum: ["early", "mid", "late"]
                   }
                 },
                 required: ["title", "assembly_time_minutes", "serves", "instructions"]
               }
             },
             notes: {
               type: "object",
               properties: {
                 leftover_strategy: { type: "string" },
                 flexibility_suggestions: {
                   type: "array",
                   items: { type: "string" }
                 },
                 fresh_vs_prepped: {
                   type: "array",
                   items: { type: "string" }
                 }
               }
             }
           },
           required: ["overview", "shopping_list", "sunday_timeline", "component_inventory", "week_assembly", "notes"]
         }
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/services/claude/plan_generator.rb`
- `rails-api/lib/skills/meal_prep_skill.txt`

#### Task 3.4: Implement Plan Refiner Service

**Goal**: Handle chat-based plan refinement requests

**Steps**:

1. Create plan refiner:
   ```ruby
   # app/services/claude/plan_refiner.rb
   module Claude
     class PlanRefiner < BaseService
       def initialize(meal_plan, message)
         @meal_plan = meal_plan
         @message = message
       end

       def refine
         call_claude(
           prompt: build_prompt,
           max_tokens: 8000
         )
       end

       private

       def build_prompt
         current_plan_json = {
           overview: @meal_plan.generated_plan.overview,
           shopping_list: serialize_shopping_list,
           sunday_timeline: serialize_prep_steps,
           component_inventory: serialize_components,
           week_assembly: serialize_week_meals,
           notes: @meal_plan.generated_plan.notes
         }.to_json

         <<~PROMPT
           Current meal plan:
           #{current_plan_json}

           User request: #{@message}

           Update the relevant section(s) of the meal plan based on the user's request. Return only the updated section(s) in JSON format. Maintain consistency with other sections.

           If the user is asking to modify a specific section (like "make the timeline shorter" or "suggest a recipe with white beans"), update just that section and return it.

           If the request requires broader changes, return all affected sections.
         PROMPT
       end

       def serialize_shopping_list
         @meal_plan.generated_plan.shopping_list_items.group_by(&:category).map do |category, items|
           {
             name: category,
             items: items.map { |i| { item: i.item, quantity: i.quantity } }
           }
         end
       end

       def serialize_prep_steps
         @meal_plan.generated_plan.prep_steps.ordered.map do |step|
           {
             time_label: step.time_label,
             description: step.description,
             estimated_minutes: step.estimated_minutes
           }
         end
       end

       def serialize_components
         @meal_plan.generated_plan.components.map do |comp|
           {
             name: comp.name,
             type: comp.component_type,
             storage_note: comp.storage_note,
             shelf_life_days: comp.shelf_life_days
           }
         end
       end

       def serialize_week_meals
         @meal_plan.generated_plan.week_meals.ordered.map do |meal|
           {
             day_index: meal.day_index,
             title: meal.title,
             assembly_time_minutes: meal.assembly_time_minutes,
             instructions: meal.instructions,
             is_spotlight: meal.is_spotlight
           }
         end
       end
     end
   end
   ```

**Files Created**:
- `rails-api/app/services/claude/plan_refiner.rb`

#### Task 3.5: Create Background Jobs

**Goal**: Implement async jobs for recipe parsing and plan generation

**Steps**:

1. **Parse Recipe Job**:
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

       if parsed[:error].present?
         Rails.logger.error("Recipe parsing failed: #{parsed[:error]}")
         recipe.update!(parsed_content: parsed.to_json)
       else
         recipe.update!(
           parsed_content: parsed.to_json,
           title: parsed['title'] || recipe.title
         )
       end

       # Broadcast completion to frontend
       ActionCable.server.broadcast(
         "recipe_#{recipe_id}",
         { type: 'recipe_parsed', recipe_id: recipe_id, success: parsed[:error].blank? }
       )
     rescue => e
       Rails.logger.error("ParseRecipeJob failed: #{e.message}")
       recipe.update!(parsed_content: { error: e.message }.to_json)
     end
   end
   ```

2. **Generate Plan Job**:
   ```ruby
   # app/jobs/generate_plan_job.rb
   class GeneratePlanJob < ApplicationJob
     queue_as :default

     def perform(meal_plan_id)
       meal_plan = MealPlan.find(meal_plan_id)
       meal_plan.update!(status: :generating)

       plan_data = Claude::PlanGenerator.new(meal_plan).generate

       if plan_data[:error].present?
         Rails.logger.error("Plan generation failed: #{plan_data[:error]}")
         meal_plan.update!(status: :ready)
         return
       end

       # Create generated_plan and all nested records
       ApplicationRecord.transaction do
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
       end

       meal_plan.update!(status: :ready)

       # Broadcast completion
       ActionCable.server.broadcast(
         "meal_plan_#{meal_plan_id}",
         { type: 'plan_generated', meal_plan_id: meal_plan_id }
       )
     rescue => e
       Rails.logger.error("GeneratePlanJob failed: #{e.message}")
       meal_plan.update!(status: :ready)
     end
   end
   ```

3. **Refine Plan Job**:
   ```ruby
   # app/jobs/refine_plan_job.rb
   class RefinePlanJob < ApplicationJob
     queue_as :default

     def perform(meal_plan_id, message)
       meal_plan = MealPlan.find(meal_plan_id)

       refinement_data = Claude::PlanRefiner.new(meal_plan, message).refine

       # TODO: Update affected sections based on refinement_data
       # For now, just broadcast completion

       ActionCable.server.broadcast(
         "meal_plan_#{meal_plan_id}",
         { type: 'plan_refined', data: refinement_data }
       )
     rescue => e
       Rails.logger.error("RefinePlanJob failed: #{e.message}")
     end
   end
   ```

**Files Created**:
- `rails-api/app/jobs/parse_recipe_job.rb`
- `rails-api/app/jobs/generate_plan_job.rb`
- `rails-api/app/jobs/refine_plan_job.rb`

#### Task 3.6: Create Recipe Fetcher Utility

**Goal**: Extract text from URLs and PDFs for parsing

**Steps**:

1. Create recipe fetcher:
   ```ruby
   # app/services/recipe_fetcher.rb
   class RecipeFetcher
     require 'open-uri'
     require 'pdf-reader' # Add to Gemfile if using PDF parsing

     def self.fetch_url(url)
       # Simple URL content fetching
       # In production, consider using a gem like Nokogiri for HTML parsing
       response = URI.open(url).read
       extract_text_from_html(response)
     rescue => e
       Rails.logger.error("URL fetch failed: #{e.message}")
       "Error fetching URL: #{e.message}"
     end

     def self.extract_pdf(pdf_file)
       # Extract text from PDF using pdf-reader gem
       reader = PDF::Reader.new(pdf_file.download)
       reader.pages.map(&:text).join("\n\n")
     rescue => e
       Rails.logger.error("PDF extraction failed: #{e.message}")
       "Error extracting PDF: #{e.message}"
     end

     private

     def self.extract_text_from_html(html)
       # Basic HTML tag stripping
       # In production, use Nokogiri for better extraction
       html.gsub(/<script.*?<\/script>/m, '')
           .gsub(/<style.*?<\/style>/m, '')
           .gsub(/<[^>]+>/, ' ')
           .gsub(/\s+/, ' ')
           .strip
     end
   end
   ```

2. Add PDF parsing gem to Gemfile:
   ```ruby
   # Gemfile
   gem 'pdf-reader'
   ```

3. Run bundle install:
   ```bash
   bundle install
   ```

**Files Created**:
- `rails-api/app/services/recipe_fetcher.rb`

**Files Modified**:
- `rails-api/Gemfile`

### Success Criteria

**All tasks complete when**:
- [ ] Recipe parsing works: Create recipe with text → ParseRecipeJob runs → `parsed_content` populated
- [ ] Plan generation works: Create meal plan → GeneratePlanJob runs → Generated plan with all nested records created
- [ ] Claude API calls succeed: Check Sidekiq logs for successful API responses
- [ ] JSON schema validation: No errors from Claude JSON mode
- [ ] Background jobs process: Sidekiq dashboard shows completed jobs
- [ ] Broadcasts work: Action Cable sends updates after job completion

### Time Estimate

**4 days** (32 hours)
- Day 1: Base service, recipe parser (8 hours)
- Day 2: Plan generator, meal prep skill integration (10 hours)
- Day 3: Plan refiner, recipe fetcher (8 hours)
- Day 4: Background jobs, testing, debugging (6 hours)

### Risks & Mitigation

**Risk 1: Claude API rate limits**
- Mitigation: Add retry logic with exponential backoff
- Monitoring: Log API usage and response times

**Risk 2: JSON schema validation fails**
- Mitigation: Start with simpler schema, gradually add fields
- Debugging: Log raw Claude responses for inspection

**Risk 3: Plan generation takes too long**
- Mitigation: Set max_tokens appropriately, optimize prompt
- Expected: 15-30 seconds for full plan generation

**Risk 4: PDF extraction fails**
- Mitigation: Fallback to text input, show clear error messages
- Alternative: Use OCR service like Tesseract for scanned PDFs

**Risk 5: Background jobs stall**
- Mitigation: Add timeout to Sidekiq jobs, monitor queue depth
- Debugging: Check Sidekiq logs and Redis queue

### Testing Strategy

**Manual Tests**:

1. **Recipe Parsing**:
   ```bash
   rails console
   recipe = Recipe.create(household: Household.first, title: "Test", source_type: :text, source_content: "Spaghetti Carbonara\n\nIngredients:\n- 1 lb pasta\n- 4 eggs\n\nInstructions:\n1. Boil pasta\n2. Mix eggs")
   # Wait for ParseRecipeJob to complete
   recipe.reload
   JSON.parse(recipe.parsed_content)
   # Should show structured recipe data
   ```

2. **Plan Generation**:
   ```bash
   rails console
   household = Household.first
   recipe1 = household.recipes.create!(title: "Grain Bowl", source_type: :text, source_content: "...")
   recipe2 = household.recipes.create!(title: "Stir Fry", source_type: :text, source_content: "...")

   plan = household.meal_plans.create!(num_dinners: 5, num_people: 2, recipe_ids: [recipe1.id, recipe2.id])
   # Wait for GeneratePlanJob to complete (30-60 seconds)
   plan.reload
   plan.generated_plan.shopping_list_items.count
   # Should show shopping items
   ```

**Claude API Test**:
```bash
rails console
service = Claude::RecipeParser.new("Pasta with tomato sauce\n\nIngredients:\n- Pasta\n- Tomato sauce", :text)
result = service.parse
puts JSON.pretty_generate(result)
# Should show structured recipe JSON
```

---

## Phase 4: Frontend API Integration

*Due to response length limits, I'll provide the remaining phases in summary form with key highlights.*

### Overview
Replace mock data with real API calls, set up React Query, implement Action Cable WebSocket connections, and update UI components to handle loading/error states.

### Key Tasks
1. **Install Dependencies**: React Query, Action Cable client, axios
2. **Create API Client**: Base client with auth headers
3. **Replace Mock Data**: Update all tab components to fetch from API
4. **Action Cable Setup**: Real-time shopping/prep checkbox sync
5. **Loading States**: Skeleton screens for data fetching

### Time Estimate: 3 days

---

## Phase 5: Plan Builder UI

### Overview
Build the missing plan creation flow: recipe input (text/URL/PDF), constraint form, generation button, and loading states.

### Key Tasks
1. **Recipe Input Component**: Multi-tab interface for text/URL/PDF
2. **Constraint Form**: Number of dinners, people, prep time
3. **Recipe Selection**: Pick from library or input new
4. **Generate Flow**: Submit → Loading → Navigate to plan view
5. **Routing**: Add React Router for navigation

### Time Estimate: 8 days

---

## Phase 6: Testing & Deployment

### Overview
Set up automated tests, configure CI/CD, deploy backend to Render/Fly.io and frontend to Vercel.

### Key Tasks
1. **Model Tests**: RSpec for associations and validations
2. **API Tests**: Request specs for endpoints
3. **Integration Tests**: Full flow from recipe input to plan generation
4. **Deployment**: Configure production environment variables
5. **Monitoring**: Set up logging and error tracking

### Time Estimate: 3 days

---

## Risk Assessment

### Technical Risks

**High Risk**:
1. **Claude API Reliability**: API downtime or rate limits
   - Mitigation: Implement retry logic, cache parsed recipes, show clear errors
   - Contingency: Manual plan creation fallback

2. **Plan Generation Timeout**: Claude takes too long (>60s)
   - Mitigation: WebSocket updates, show progress indicator
   - Contingency: Email notification when complete

**Medium Risk**:
3. **PostgreSQL Performance**: Large JSONB queries slow
   - Mitigation: Database indexes, eager loading, pagination
   - Monitoring: APM tools like Scout or New Relic

4. **Action Cable Scaling**: WebSocket connections overwhelm server
   - Mitigation: Use managed Redis (Heroku Redis/Upstash)
   - Contingency: Polling fallback for real-time updates

**Low Risk**:
5. **CORS Issues**: Cross-origin requests blocked
   - Mitigation: Well-tested CORS config, documentation
   - Quick fix: Update CORS middleware

### Business Risks

1. **Claude API Costs**: Heavy usage could be expensive
   - Mitigation: Cache parsed recipes, rate limit requests
   - Monitoring: Track API usage per user

2. **User Onboarding**: Complex plan creation flow
   - Mitigation: Tooltips, examples, demo household
   - Iteration: User testing and feedback

## Performance Considerations

### Database Optimization

**Indexes to Add**:
```ruby
add_index :shopping_list_items, [:generated_plan_id, :checked_off]
add_index :prep_steps, [:generated_plan_id, :completed]
add_index :recipes, [:household_id, :is_favorite, :times_used]
```

**Query Optimization**:
- Use `includes()` for N+1 prevention
- Pagination for recipe library (50 per page)
- Database views for complex aggregations

### Caching Strategy

**What to Cache**:
- Parsed recipes (never re-parse same content)
- Full meal plan responses (invalidate on update)
- User household data (session-length TTL)

**Cache Invalidation**:
```ruby
# app/models/meal_plan.rb
after_update :clear_cache

def clear_cache
  Rails.cache.delete("meal_plan_#{id}_full")
end
```

### Frontend Performance

**React Query Configuration**:
```typescript
{
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false
}
```

**Optimization Techniques**:
- Code splitting by route
- Lazy load heavy components (chart libraries)
- Virtualized lists for large shopping lists
- Debounce search inputs

## Security Considerations

### Authentication

**Magic Link Flow**:
1. User enters email
2. Backend generates JWT token, sends email
3. User clicks link with token
4. Frontend validates token, stores session
5. All API requests include Authorization header

**Token Security**:
- 15-minute expiration
- One-time use (delete after verification)
- HTTPS only in production
- HttpOnly cookies (optional alternative to localStorage)

### Data Protection

**Row-Level Security**:
```ruby
# app/controllers/api/v1/base_controller.rb
def current_household
  @current_household ||= Household.find(session[:household_id])
end

# All queries scoped to household
current_household.recipes.where(...)
```

**Sensitive Data**:
- Claude API key in Rails credentials (encrypted)
- Never expose in logs or responses
- Rotate keys regularly

### CORS Security

**Production Config**:
```ruby
# config/initializers/cors.rb
origins ENV.fetch('FRONTEND_URL') # Single domain, not *
credentials: true # Required for cookies
expose: ['Authorization'] # Only necessary headers
```

## Deployment Architecture

### Infrastructure

**Backend (Render)**:
```
Service: Web Service (Puma)
Instance: Starter ($7/mo)
Database: PostgreSQL 14 ($7/mo)
Redis: Upstash (Free tier)
Environment Variables:
  - CLAUDE_API_KEY
  - DATABASE_URL (auto)
  - REDIS_URL
  - FRONTEND_URL
  - RAILS_ENV=production
```

**Frontend (Vercel)**:
```
Framework: Vite
Build Command: npm run build
Output Directory: build
Environment Variables:
  - VITE_API_URL=https://api.mealprep.com
  - VITE_CABLE_URL=wss://api.mealprep.com/cable
```

### CI/CD Pipeline

**GitHub Actions** (optional):
```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
      - name: Run tests
        run: bundle exec rspec
```

**Deployment Flow**:
1. Push to `main` branch
2. GitHub Actions runs tests
3. Render auto-deploys backend (on success)
4. Vercel auto-deploys frontend (on success)

## Monitoring & Observability

### Logging

**Backend Logging**:
```ruby
# config/environments/production.rb
config.log_level = :info
config.log_tags = [:request_id]

# Custom logging
Rails.logger.info("Plan generated for meal_plan_id=#{id}")
```

**Error Tracking**:
- Use Sentry or Rollbar for exception monitoring
- Alert on Claude API failures
- Track background job failures

### Metrics to Monitor

1. **API Performance**:
   - Response time (p50, p95, p99)
   - Error rate (4xx, 5xx)
   - Request volume

2. **Background Jobs**:
   - Queue depth
   - Job duration
   - Failure rate

3. **Claude API**:
   - API calls per hour
   - Average response time
   - Error rate

4. **Database**:
   - Query time
   - Connection pool usage
   - Disk usage

## Documentation Requirements

### API Documentation

**Generate with Swagger/OpenAPI**:
```yaml
# swagger.yml
openapi: 3.0.0
info:
  title: Meal Prep API
  version: 1.0.0
paths:
  /api/v1/recipes:
    get:
      summary: List recipes
      responses:
        200:
          description: Success
```

**Alternative**: Use RSpec request specs to generate docs with `rswag` gem

### Developer Onboarding

**README.md** should include:
1. Local setup instructions
2. Environment variable configuration
3. How to run tests
4. How to seed database
5. Architecture diagrams
6. API endpoint reference

### User Documentation

**Help Center** (future):
- How to create a plan
- Understanding the prep timeline
- Customizing recipes
- Troubleshooting common issues

## Maintenance & Support

### Backup Strategy

**Database Backups**:
- Render: Automatic daily backups (retained 7 days on free tier)
- Manual: `pg_dump` for critical milestones

**Code Backups**:
- Git repository (primary source of truth)
- GitHub: Private repository with branch protection

### Update Strategy

**Dependency Updates**:
- Monthly review of outdated gems: `bundle outdated`
- Security updates: Apply immediately
- Rails upgrades: Wait 1-2 months after major release

**Claude API Updates**:
- Monitor Anthropic changelog
- Test new models in staging before production
- Keep legacy model as fallback

## Handoff to Staff Engineer

### Review Checklist

**Before requesting code review**:
- [ ] All tests pass (`bundle exec rspec`)
- [ ] No N+1 queries (check Bullet gem output)
- [ ] Database migrations reversible (`db:rollback` works)
- [ ] API endpoints documented
- [ ] Environment variables documented in README
- [ ] Error handling in place
- [ ] Claude API key not committed

**What to Review**:
1. **Schema Design**: Is it normalized? Are indexes optimal?
2. **API Design**: RESTful? Consistent error responses?
3. **Service Objects**: Single responsibility? Testable?
4. **Background Jobs**: Idempotent? Retryable?
5. **Security**: Proper scoping? No SQL injection risk?

**Improvement Opportunities**:
- Authentication implementation (currently stubbed)
- Rate limiting for API endpoints
- Admin interface for debugging
- Automated testing coverage (aim for 80%+)

## Conclusion

This implementation plan provides a complete roadmap from current state (React prototype) to production-ready application (Rails backend + integrated frontend). The phased approach allows for:

1. **Incremental Progress**: Each phase delivers value independently
2. **Early Testing**: Backend tested before UI integration
3. **Risk Mitigation**: Claude integration isolated in Phase 3
4. **Iterative Refinement**: Frontend updated as backend evolves

**Total Timeline**: 23 days (~5 weeks)
**Total Cost** (hosting): ~$14-20/month (Render Starter + Database + Vercel free tier)

**Success Metrics**:
- Backend API deployed and accessible
- Frontend fetches real data
- Users can create meal plans from recipes
- Plans generate successfully via Claude API
- Real-time updates work across devices

**Next Steps After Phase 6**:
1. User feedback and iteration
2. Advanced features (chat refinement, recipe suggestions)
3. Mobile optimization
4. Performance tuning
5. Marketing and user acquisition

This plan is ready for execution. Proceed with Phase 1 when ready.
