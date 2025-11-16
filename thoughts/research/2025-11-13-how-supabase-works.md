# How Supabase Works

## What is Supabase?

Supabase is an **open-source Firebase alternative** that provides a complete backend-as-a-service (BaaS) built on top of PostgreSQL. It auto-generates a RESTful API and real-time subscriptions from your database schema.

**Key Philosophy**: "Database is the API"
- You define your schema (tables, columns, relationships)
- Supabase automatically creates API endpoints for CRUD operations
- No backend code needed for basic operations

## Core Architecture

```
Your React App
      ↓
Supabase Client Library (JavaScript)
      ↓
Supabase Cloud (or self-hosted)
      ├── PostgREST (Auto-generated REST API)
      ├── PostgreSQL Database (Your data)
      ├── GoTrue (Authentication)
      ├── Realtime (WebSocket subscriptions)
      ├── Storage (File uploads)
      └── Edge Functions (Serverless functions)
```

## How It Works: Step by Step

### 1. Database Schema Definition

You create tables using SQL migrations or the Supabase Dashboard UI:

```sql
-- Create a table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID REFERENCES households(id),
  title TEXT NOT NULL,
  source_type TEXT,
  parsed_content JSONB,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index
CREATE INDEX idx_recipes_household ON recipes(household_id);
```

### 2. Auto-Generated API

**Instantly** after creating the table, you get REST endpoints:

```javascript
// No backend code needed!

// SELECT * FROM recipes WHERE household_id = '123'
const { data } = await supabase
  .from('recipes')
  .select('*')
  .eq('household_id', '123');

// INSERT INTO recipes (title, source_type) VALUES (...)
const { data } = await supabase
  .from('recipes')
  .insert({ title: 'Pasta', source_type: 'text' });

// UPDATE recipes SET is_favorite = true WHERE id = '456'
const { data } = await supabase
  .from('recipes')
  .update({ is_favorite: true })
  .eq('id', '456');

// DELETE FROM recipes WHERE id = '456'
const { data } = await supabase
  .from('recipes')
  .delete()
  .eq('id', '456');
```

**Under the hood**: Supabase uses [PostgREST](https://postgrest.org/) to translate JavaScript queries into SQL.

### 3. Row-Level Security (RLS)

PostgreSQL's built-in security mechanism - you write SQL policies to control who can access what:

```sql
-- Only allow users to see recipes from their household
CREATE POLICY "Users can view their household recipes"
  ON recipes
  FOR SELECT
  USING (household_id = auth.uid());

-- Only allow authenticated users to insert recipes
CREATE POLICY "Users can create recipes"
  ON recipes
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

**How it works**:
- Every request includes a JWT token (from Supabase Auth)
- PostgreSQL checks the token's `user_id` against your policies
- Database enforces security (not your application code)

### 4. Real-time Subscriptions

Supabase uses PostgreSQL's `LISTEN/NOTIFY` feature to broadcast changes:

```javascript
// Subscribe to shopping list changes
const subscription = supabase
  .channel('shopping_list_changes')
  .on(
    'postgres_changes',
    {
      event: '*', // INSERT, UPDATE, DELETE
      schema: 'public',
      table: 'shopping_list_items',
      filter: 'generated_plan_id=eq.123'
    },
    (payload) => {
      console.log('Change received!', payload);
      // Update UI automatically
    }
  )
  .subscribe();
```

**Under the hood**:
- PostgreSQL triggers fire on INSERT/UPDATE/DELETE
- Supabase Realtime server broadcasts changes via WebSockets
- All subscribed clients receive updates instantly

### 5. Authentication

Supabase Auth (powered by GoTrue) handles:

```javascript
// Magic link login
const { data } = await supabase.auth.signInWithOtp({
  email: 'user@example.com'
});

// User clicks link in email → automatically logged in
// JWT token stored in localStorage

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

**Supported methods**:
- Email/password
- Magic links (passwordless)
- OAuth (Google, GitHub, etc.)
- Phone/SMS

**How it works**:
- GoTrue generates JWT tokens
- Token includes `user_id` and metadata
- Token is automatically sent with every database request
- Row-Level Security policies use `auth.uid()` to check permissions

### 6. File Storage

Upload files (like PDFs) to Supabase Storage:

```javascript
// Upload PDF
const { data } = await supabase.storage
  .from('recipe-pdfs') // bucket name
  .upload('recipes/pasta.pdf', pdfFile);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('recipe-pdfs')
  .getPublicUrl('recipes/pasta.pdf');

// Download file
const { data } = await supabase.storage
  .from('recipe-pdfs')
  .download('recipes/pasta.pdf');
```

**Under the hood**:
- Files stored in S3-compatible object storage
- RLS policies control access
- Can generate signed URLs for temporary access

### 7. Edge Functions (Serverless)

For custom backend logic (like calling Claude API):

```typescript
// supabase/functions/parse-recipe/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Anthropic from 'npm:@anthropic-ai/sdk';

serve(async (req) => {
  const { recipeText } = await req.json();

  const anthropic = new Anthropic({
    apiKey: Deno.env.get('CLAUDE_API_KEY'),
  });

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Parse this recipe: ${recipeText}`
      }
    ]
  });

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**Call from frontend**:

```javascript
const { data } = await supabase.functions.invoke('parse-recipe', {
  body: { recipeText: 'Pasta with tomato sauce...' }
});
```

**Under the hood**:
- Runs on Deno (JavaScript/TypeScript runtime)
- Deployed to edge locations (low latency)
- Auto-scales
- Can access Supabase database directly

## How You'd Use Supabase for Meal Prep App

### Setup (5 minutes)

1. **Create project** at supabase.com
2. **Run SQL migrations** in Supabase Dashboard or CLI
3. **Install client** in React:
   ```bash
   npm install @supabase/supabase-js
   ```

4. **Initialize client**:
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';

   export const supabase = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY
   );
   ```

### Example: Shopping List Feature

**1. Create table** (one time):

```sql
CREATE TABLE shopping_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generated_plan_id UUID REFERENCES generated_plans(id),
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity TEXT NOT NULL,
  checked_off BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_list_items;
```

**2. Fetch shopping list** (React component):

```typescript
function ShoppingListTab({ planId }) {
  const [items, setItems] = useState([]);

  // Fetch initial data
  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('generated_plan_id', planId)
        .order('category');

      setItems(data);
    }
    fetchItems();
  }, [planId]);

  // Subscribe to real-time updates
  useEffect(() => {
    const subscription = supabase
      .channel('shopping_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_list_items',
          filter: `generated_plan_id=eq.${planId}`
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setItems(items =>
              items.map(item =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [planId]);

  // Toggle checkbox
  async function toggleItem(itemId, checked) {
    // Optimistic update
    setItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, checked_off: checked } : item
      )
    );

    // Save to database
    await supabase
      .from('shopping_list_items')
      .update({ checked_off: checked })
      .eq('id', itemId);
  }

  return (
    <div>
      {items.map(item => (
        <Checkbox
          key={item.id}
          checked={item.checked_off}
          onCheckedChange={(checked) => toggleItem(item.id, checked)}
        >
          {item.item} - {item.quantity}
        </Checkbox>
      ))}
    </div>
  );
}
```

**That's it!** No backend code, no API routes, no controllers.

### Example: Generate Meal Plan with Claude

**1. Create Edge Function**:

```typescript
// supabase/functions/generate-plan/index.ts
import Anthropic from 'npm:@anthropic-ai/sdk';
import { createClient } from 'npm:@supabase/supabase-js';

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') // Admin access
  );

  const { mealPlanId } = await req.json();

  // Fetch recipes for this plan
  const { data: recipes } = await supabaseClient
    .from('meal_plan_recipes')
    .select(`
      recipe:recipes (
        title,
        parsed_content
      )
    `)
    .eq('meal_plan_id', mealPlanId);

  // Call Claude
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('CLAUDE_API_KEY'),
  });

  const skillContent = await Deno.readTextFile('./meal_prep_skill.txt');

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 16000,
    messages: [
      {
        role: 'user',
        content: `${skillContent}\n\nGenerate plan for: ${JSON.stringify(recipes)}`
      }
    ],
    // ... JSON schema for structured output
  });

  const planData = JSON.parse(response.content[0].text);

  // Save generated plan to database
  const { data: generatedPlan } = await supabaseClient
    .from('generated_plans')
    .insert({
      meal_plan_id: mealPlanId,
      overview: planData.overview,
      notes: planData.notes
    })
    .select()
    .single();

  // Insert shopping list items
  const shoppingItems = planData.shopping_list.categories.flatMap(cat =>
    cat.items.map(item => ({
      generated_plan_id: generatedPlan.id,
      category: cat.name,
      item: item.item,
      quantity: item.quantity
    }))
  );

  await supabaseClient
    .from('shopping_list_items')
    .insert(shoppingItems);

  // ... insert prep steps, components, week meals

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

**2. Call from React**:

```typescript
async function generatePlan(mealPlanId) {
  setLoading(true);

  const { data, error } = await supabase.functions.invoke('generate-plan', {
    body: { mealPlanId }
  });

  if (error) {
    console.error('Generation failed:', error);
  } else {
    // Plan generated! Navigate to plan view
    navigate(`/plans/${mealPlanId}`);
  }

  setLoading(false);
}
```

## Key Differences vs Traditional Backend

| Feature | Traditional (Rails/Node) | Supabase |
|---------|-------------------------|----------|
| **API Endpoints** | Write controllers/routes manually | Auto-generated from schema |
| **Database Access** | ORM queries in backend | Direct from frontend (with RLS) |
| **Real-time** | WebSockets (Action Cable/Socket.io) | Built-in subscriptions |
| **Auth** | Implement yourself (Devise/Passport) | Built-in with JWT |
| **File Upload** | Active Storage/Multer → S3 | Built-in Storage API |
| **Backend Logic** | Controllers/Services | Edge Functions (for Claude calls) |
| **Security** | Application-level checks | Database-level (Row-Level Security) |
| **Deployment** | Separate frontend + backend | Single Supabase project |

## Pros and Cons

### Pros

✅ **Fast Development**
- No backend boilerplate
- Auto-generated API
- Built-in auth/storage/realtime

✅ **Type Safety**
- Can generate TypeScript types from database schema
- Frontend knows exact shape of data

✅ **Security**
- Row-Level Security enforced at database level
- Can't accidentally expose data

✅ **Scalability**
- PostgreSQL (battle-tested)
- Auto-scales
- CDN for static assets

✅ **Developer Experience**
- Great dashboard UI
- Local development (Supabase CLI)
- Migration tools

### Cons

❌ **Less Control**
- Can't customize API behavior easily
- Edge Functions have limitations (Deno, not Node)
- Locked into Supabase patterns

❌ **Complex Business Logic**
- For complex operations, need Edge Functions
- Can't use familiar backend frameworks

❌ **Vendor Lock-in**
- Harder to migrate away (though it's open-source)
- Specific to Supabase patterns

❌ **Learning Curve**
- PostgreSQL functions and RLS policies
- Different from traditional REST APIs
- Need to understand database-centric design

## For Your Meal Prep App

### What Would Be Easy with Supabase

✅ **CRUD operations** (recipes, plans, shopping lists)
- No backend code needed
- Just frontend queries

✅ **Real-time shopping list**
- Built-in subscriptions
- Instant sync across devices

✅ **Authentication**
- Magic links built-in
- No need to implement

✅ **PDF uploads**
- Storage API handles it
- No S3 configuration

### What Requires Edge Functions

🟡 **Claude API calls**
- Recipe parsing
- Plan generation
- Chat refinement

You'd write ~3-5 Edge Functions for Claude integration, but the rest is database operations.

### Example Edge Function Structure

```
supabase/functions/
├── parse-recipe/
│   ├── index.ts (text/URL parsing)
│   └── meal_prep_skill.txt
├── parse-pdf/
│   └── index.ts (PDF extraction + parsing)
├── generate-plan/
│   ├── index.ts (plan generation)
│   └── meal_prep_skill.txt
├── refine-plan/
│   └── index.ts (chat refinement)
└── suggest-recipes/
    └── index.ts (recipe suggestions)
```

## Supabase vs Rails Decision Matrix

### Choose Supabase if:
- ✅ Want fastest time to MVP
- ✅ Team is frontend-focused (TypeScript)
- ✅ Most logic is CRUD operations
- ✅ Want built-in real-time/auth/storage
- ✅ Comfortable with database-centric design

### Choose Rails if:
- ✅ Team knows Rails well
- ✅ Need complex business logic
- ✅ Want full control over backend
- ✅ Plan to add non-standard features
- ✅ Prefer traditional MVC patterns

## Local Development with Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize project
supabase init

# Start local Supabase (Docker required)
supabase start
# → Runs PostgreSQL, PostgREST, GoTrue, Storage locally

# Create migration
supabase migration new create_recipes_table

# Apply migrations
supabase db push

# Deploy edge function
supabase functions deploy generate-plan

# Link to cloud project
supabase link --project-ref your-project-id
```

**Local development URL**: `http://localhost:54321`
**Local dashboard**: `http://localhost:54323`

Everything runs locally with Docker - no cloud needed for development!

## Pricing

**Free Tier** (Generous):
- 500MB database
- 1GB file storage
- 50,000 monthly active users
- 2GB bandwidth
- Edge Functions: 500K invocations/month

**Pro Tier** ($25/month):
- 8GB database
- 100GB storage
- Unlimited MAUs
- 50GB bandwidth
- Edge Functions: 2M invocations/month

For your meal prep app, free tier is likely enough to start.

## Summary

**Supabase = PostgreSQL + Auto-Generated API + Real-time + Auth + Storage**

Instead of writing backend code for CRUD operations, you:
1. Define database schema (SQL)
2. Write Row-Level Security policies (SQL)
3. Use Supabase client in React (TypeScript)
4. Write Edge Functions only for custom logic (Claude calls)

It's **fastest path to production** for database-centric apps, but **less flexible** than custom backend for complex business logic.

For your meal prep app, I'd estimate:
- **90% of features** can use auto-generated API
- **10% of features** need Edge Functions (Claude integration)

This is a good fit for Supabase!
