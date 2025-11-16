---
doc_type: research
date: 2025-11-08T22:53:36+00:00
title: "Meal Prep App Codebase Analysis - Current Tailwind v4 State and Configuration Needs"
_generated: true
_script_version: "1.0"
_generated_at: "2025-11-08T22:53:36+00:00"
research_question: "What is the current state of the meal-prep-app codebase including build tooling, Tailwind v4 setup, styling patterns, Figma-generated content, and what needs to be configured for proper Tailwind v3 setup?"
research_type: codebase_research
researcher: Sean Kim

git_commit: 46ae5f8267a86d3b25ad5a1421827ef1e2f3db7a
branch: main
repository: meal-prep-app

created_by: Sean Kim
last_updated: 2025-11-08
last_updated_by: Sean Kim

tags:
  - tailwind
  - vite
  - react
  - figma
  - css
status: complete

related_docs:
  - thoughts/research/2025-11-08-modern-web-application-styling-best-practices-2023-2025.md
  - thoughts/research/2025-11-08-modern-web-layout-typography-and-spacing-systems-2023-2025.md
---

# Research: Meal Prep App Codebase Analysis

**Date**: 2025-11-08T22:53:36+00:00
**Researcher**: Sean Kim
**Git Commit**: 46ae5f8267a86d3b25ad5a1421827ef1e2f3db7a
**Branch**: main
**Repository**: meal-prep-app

## Research Question

What is the current state of the meal-prep-app codebase including build tooling, Tailwind v4 setup, styling patterns, Figma-generated content, and what needs to be configured for proper Tailwind v3 setup?

## Summary

This codebase is a **Figma-generated React application** that was exported with **Tailwind CSS v4.1.3** already pre-compiled and embedded as a static CSS file. The current state reveals a **mismatch between what exists and what's needed** for a properly configured Tailwind v3 development environment.

**Critical Finding**: The application currently has:
- ✅ **Compiled Tailwind v4.1.3 output** embedded in `src/index.css` (35,201 bytes)
- ✅ **Tailwind utility classes** used throughout components
- ✅ **shadcn/ui component pattern** (Radix UI + Tailwind utilities)
- ❌ **NO Tailwind CSS package** installed in `node_modules`
- ❌ **NO Tailwind configuration file** (`tailwind.config.js`/`tailwind.config.ts`)
- ❌ **NO PostCSS configuration** for Tailwind directives
- ❌ **NO `@tailwind` directives** in source CSS (using pre-compiled output instead)

**What This Means**: The app will render correctly if dependencies are installed, but developers cannot modify Tailwind configuration, add custom utilities, or customize the design system. The CSS is frozen at the Figma export state.

## Detailed Findings

### 1. Build Tooling and Project Structure

**Technology Stack** ([package.json:2-59](/Users/seankim/dev/meal-prep-app/package.json#L2-L59)):
- **Framework**: React 18.3.1 with React DOM
- **Build Tool**: Vite 6.3.5
- **TypeScript**: Implicit (`.tsx` files, no explicit `typescript` in devDependencies)
- **Development Server**: Vite dev server on port 3000
- **React Compiler**: `@vitejs/plugin-react-swc` (SWC for faster builds)

**Project Structure**:
```
meal-prep-app/
├── src/
│   ├── components/
│   │   ├── figma/              # Figma-generated utilities
│   │   ├── tabs/               # Main application tabs
│   │   └── ui/                 # shadcn/ui components (48 files)
│   ├── data/                   # Mock data
│   ├── styles/
│   │   └── globals.css         # Tailwind v4 source directives
│   ├── index.css               # Pre-compiled Tailwind v4.1.3 output
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Entry point
├── index.html                  # Vite HTML template
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies
```

**Vite Configuration** ([vite.config.ts:2-60](/Users/seankim/dev/meal-prep-app/vite.config.ts#L2-L60)):
- React plugin with SWC enabled
- Path aliases configured for all dependencies (extensive list)
- `@` alias pointing to `./src` directory
- Build target: `esnext`
- Output directory: `build/`
- Dev server: port 3000, opens browser automatically

**Missing Files**:
- ❌ No `tsconfig.json` (TypeScript configuration)
- ❌ No `tailwind.config.js` or `tailwind.config.ts`
- ❌ No `postcss.config.js` or `postcss.config.cjs`
- ❌ No `.env` files
- ❌ No `node_modules/` (dependencies not installed)

### 2. Current CSS/Styling Setup

#### **A. Pre-Compiled Tailwind v4.1.3 Output**

**File**: `src/index.css` ([src/index.css:1-1700](/Users/seankim/dev/meal-prep-app/src/index.css#L1-L1700))

This is the **critical discovery**. The file contains:

**Line 1**:
```css
/*! tailwindcss v4.1.3 | MIT License | https://tailwindcss.com */
```

This is **fully compiled Tailwind CSS v4 output**, not source directives. The file includes:

1. **@layer properties** (lines 2-64): CSS custom property defaults
2. **@layer theme** (lines 66-103): Design tokens (fonts, colors, spacing)
3. **@layer base** (lines 106-414): Base styles and resets
4. **@layer utilities** (lines 416-1306): All Tailwind utility classes
5. **Custom CSS variables** (lines 1308-1384): Design system tokens
6. **Dark mode theme** (lines 1349-1384): Dark theme variables
7. **@property declarations** (lines 1390-1699): CSS Houdini properties

**Design Tokens Found** ([src/index.css:1308-1347](/Users/seankim/dev/meal-prep-app/src/index.css#L1308-L1347)):
```css
:root {
  --font-size: 16px;
  --background: #fff;
  --foreground: oklch(.145 0 0);
  --card: #fff;
  --card-foreground: oklch(.145 0 0);
  --primary: #030213;
  --primary-foreground: oklch(1 0 0);
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #e9ebef;
  --border: #0000001a;
  --radius: 0.625rem;
  /* ... 20+ more tokens */
}
```

**Utility Classes Generated**: The file contains ~1300 lines of utility classes covering:
- Layout (flex, grid, positioning)
- Sizing (width, height, spacing)
- Typography (text sizes, line heights)
- Colors (background, text, border)
- Effects (shadows, opacity, filters)
- Responsive modifiers (`@media (width >= 48rem)`)
- State modifiers (`:hover`, `:focus`, `:checked`)
- Dark mode (`.dark`)

#### **B. Tailwind v4 Source Directives**

**File**: `src/styles/globals.css` ([src/styles/globals.css:1-190](/Users/seankim/dev/meal-prep-app/src/styles/globals.css#L1-L190))

This file contains **what should be the source**, but it's **never imported or used**:

```css
@custom-variant dark (&:is(.dark *));

:root {
  /* Same CSS variables as index.css */
}

.dark {
  /* Dark theme overrides */
}

@theme inline {
  /* Tailwind v4 theme configuration */
  --color-background: var(--background);
  /* ... maps custom vars to Tailwind theme */
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* Typography base styles */
@layer base {
  :where(:not(:has([class*=' text-']))) {
    h1 { font-size: var(--text-2xl); /* ... */ }
    /* ... h2-h4, p, label, button, input */
  }
}
```

**Key Observations**:
- Uses Tailwind v4 syntax (`@theme inline`, `@custom-variant`)
- Contains `@apply` directives (requires Tailwind to process)
- **This file is NOT imported** in `main.tsx` - only `index.css` is imported
- Would require Tailwind v4 to compile (incompatible with v3 goal)

#### **C. No Tailwind Dependencies**

**Finding** ([package.json:6-48](/Users/seankim/dev/meal-prep-app/package.json#L6-L48)):

The `package.json` contains:
- ✅ `tailwind-merge: "*"` - Utility for merging Tailwind classes
- ✅ `clsx: "*"` - Conditional class name utility
- ❌ NO `tailwindcss` package
- ❌ NO `postcss` or `autoprefixer`
- ❌ NO PostCSS plugins

**Implication**: Developers cannot:
- Customize Tailwind configuration
- Add custom utilities or components
- Modify design tokens beyond CSS variables
- Use JIT (Just-In-Time) compilation
- Tree-shake unused utilities

### 3. Component Patterns and Architecture

#### **A. shadcn/ui Component Library**

The codebase contains **48 shadcn/ui components** in `src/components/ui/`:

**Example: Button Component** ([src/components/ui/button.tsx:1-59](/Users/seankim/dev/meal-prep-app/src/components/ui/button.tsx#L1-L59)):

```tsx
import { cva, type VariantProps } from "class-variance-authority@0.7.1";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90...",
        outline: "border bg-background text-foreground hover:bg-accent...",
        // ... more variants
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3...",
        // ... more sizes
      }
    }
  }
);

function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
```

**Pattern Analysis**:
- Uses `class-variance-authority` for variant management
- Tailwind utility classes in variant definitions
- `cn()` utility for class merging ([src/components/ui/utils.ts:1-6](/Users/seankim/dev/meal-prep-app/src/components/ui/utils.ts#L1-L6))
- Radix UI primitives for accessibility (`@radix-ui/react-slot`)
- Copy-paste component model (not npm package)

**All shadcn/ui Components Present**:
- Form elements: Button, Input, Textarea, Checkbox, Radio, Select, Switch
- Layout: Card, Separator, Tabs, Accordion, Collapsible
- Overlays: Dialog, Sheet, Drawer, Popover, Tooltip
- Navigation: Navigation Menu, Menubar, Breadcrumb
- Data display: Table, Badge, Avatar, Calendar
- Feedback: Alert, Alert Dialog, Toast (Sonner), Progress
- Advanced: Command, Chart (Recharts), Carousel, Sidebar

#### **B. Application Components**

**Main App Structure** ([src/App.tsx:1-94](/Users/seankim/dev/meal-prep-app/src/App.tsx#L1-L94)):

```tsx
export default function App() {
  const [showPlan, setShowPlan] = useState(false);

  if (showPlan) {
    return <MealPlanView plan={mockPlan} />;
  }

  // Landing page with Tailwind utilities
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-background via-background
                    to-accent/10 px-4">
      {/* SVG icons inline */}
      <h1 className="mb-4">Sunday Meal Prep</h1>
      <button className="inline-flex items-center gap-2 px-6 py-3
                         bg-primary text-primary-foreground rounded-lg
                         hover:bg-primary/90 transition-colors">
        View Mock Plan
      </button>
      {/* Feature grid with responsive classes */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
        {/* ... */}
      </div>
    </div>
  );
}
```

**Styling Patterns Used**:
- Utility-first Tailwind classes directly in JSX
- Responsive modifiers (`md:grid-cols-3`)
- State modifiers (`hover:bg-primary/90`)
- Color opacity syntax (`to-accent/10`)
- Design token references (`bg-primary`, `text-muted-foreground`)
- Inline SVG icons (no icon library)

**Tab-Based Navigation** ([src/components/MealPlanView.tsx:1-119](/Users/seankim/dev/meal-prep-app/src/components/MealPlanView.tsx#L1-L119)):

```tsx
export function MealPlanView({ plan }: MealPlanViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br
                    from-background via-background to-accent/10">
      {/* Sticky navigation */}
      <div className="sticky top-0 z-10 bg-background/80
                      backdrop-blur-lg border-b border-border">
        {/* Tab buttons */}
      </div>

      {/* Tab content panels */}
      <div className="min-h-[calc(100vh-64px)]">
        {activeTab === 'overview' && <OverviewTab plan={plan} />}
        {/* ... other tabs */}
      </div>

      {/* Custom scrollbar hiding */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
```

**Notable Patterns**:
- Template string classes (readability over single-line)
- Custom `<style>` tag for browser-specific CSS (scrollbar hiding)
- Conditional rendering for tabs (not router-based)
- Backdrop blur effects (`backdrop-blur-lg`, `backdrop-blur-sm`)
- Calculated heights (`calc(100vh-64px)`)

**Overview Tab Example** ([src/components/tabs/OverviewTab.tsx:1-100](/Users/seankim/dev/meal-prep-app/src/components/tabs/OverviewTab.tsx#L1-L100)):

```tsx
export function OverviewTab({ plan }: OverviewTabProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Glass-morphism cards */}
      <div className="p-6 md:p-8 bg-card/50 backdrop-blur-sm
                      rounded-xl border border-border">
        {/* Badge component */}
        <div className="inline-block px-3 py-1 bg-primary/10
                        text-primary rounded-full mb-4">
          Sunday Spotlight
        </div>
        {/* Typography using semantic HTML + auto-styling */}
        <h2 className="mb-3">{plan.spotlightDish.name}</h2>
        <p className="text-muted-foreground mb-4">
          {plan.spotlightDish.description}
        </p>
      </div>

      {/* Responsive grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {plan.components.map((component, index) => (
          <div className="p-5 bg-card/30 backdrop-blur-sm
                          rounded-lg border border-border">
            {/* ... */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Design Patterns Identified**:
- Glass-morphism (`bg-card/50`, `backdrop-blur-sm`)
- Semantic HTML (h1-h4, p) with auto-applied typography
- Responsive spacing (`px-4 md:px-6`, `py-8 md:py-12`)
- Consistent border radius (`rounded-lg`, `rounded-xl`)
- Opacity variants for layering (`bg-card/30`, `bg-primary/10`)

### 4. Figma-Generated Content Analysis

#### **A. Evidence of Figma Export**

**README Confirmation** ([README.md:1-11](/Users/seankim/dev/meal-prep-app/README.md#L1-L11)):
```markdown
# Modular Meal Prep App

This is a code bundle for Modular Meal Prep App.
The original project is available at:
https://www.figma.com/design/wwRBmTWeskCcJiJCPrP8GN/Modular-Meal-Prep-App
```

**Figma-Specific Components** ([src/components/figma/ImageWithFallback.tsx:1-28](/Users/seankim/dev/meal-prep-app/src/components/figma/ImageWithFallback.tsx#L1-L28)):

```tsx
const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOD...'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  return didError ? (
    <div className={`inline-block bg-gray-100 text-center
                     align-middle ${className ?? ''}`}>
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} onError={handleError} />
  )
}
```

**Figma Export Characteristics**:
- Base64-encoded SVG fallback image
- Generic error handling for missing images
- Inline class concatenation (not using `cn()` utility)
- Legacy `bg-gray-100` class (not using design tokens)

#### **B. Styling Patterns from Figma**

**Inline SVG Icons**: All icons are inline SVG, not from icon libraries
```tsx
// Example from App.tsx
<svg width="32" height="32" viewBox="0 0 32 32"
     fill="none" stroke="currentColor" strokeWidth="2">
  <rect x="4" y="6" width="24" height="20" rx="2" />
  <path d="M4 12h24M12 6v6M20 6v6" />
</svg>
```

**Design Token Usage**: Figma exported with custom CSS variables, then mapped to Tailwind theme

**Color System** (OKLCH color space):
- Uses modern OKLCH for perceptually uniform colors
- Example: `--foreground: oklch(0.145 0 0)` (near black)
- Dark mode: `--foreground: oklch(0.985 0 0)` (near white)
- Semantic naming (`--primary`, `--accent`, `--muted`)

**Typography Defaults** ([src/styles/globals.css:136-185](/Users/seankim/dev/mal-prep-app/src/styles/globals.css#L136-L185)):
```css
:where(:not(:has([class*=' text-']))) {
  h1 {
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }
  /* ... h2-h4, p, label, button, input */
}
```

This pattern means:
- Headings get automatic sizing **unless** they have a Tailwind text class
- Prevents need for explicit text classes on every heading
- Figma-friendly (design tokens define typography scale)

### 5. What's Broken or Non-Functional

#### **Critical Issues**

**1. No Tailwind CSS Build Process**
- **Problem**: `src/index.css` contains pre-compiled Tailwind v4 output
- **Impact**: Cannot customize configuration, add utilities, or tree-shake
- **Evidence**: No `tailwindcss` in dependencies, no config file

**2. Dependencies Not Installed**
- **Problem**: `node_modules/` does not exist
- **Impact**: App will not run until `npm install` is executed
- **Evidence**: Directory check shows no `node_modules/`

**3. Tailwind v4 vs v3 Mismatch**
- **Problem**: Codebase has v4 output, user wants v3 setup
- **Impact**:
  - `globals.css` uses v4 syntax (`@theme inline`, `@custom-variant`)
  - v3 requires different configuration approach
  - Migration needed to align with v3 architecture

**4. Missing TypeScript Configuration**
- **Problem**: `.tsx` files but no `tsconfig.json`
- **Impact**: No type checking, IDE features degraded
- **Evidence**: Vite supports TypeScript without config, but best practices require it

**5. Unused Source CSS File**
- **Problem**: `src/styles/globals.css` exists but is never imported
- **Impact**: Confusing for developers (which file is authoritative?)
- **Evidence**: Only `src/index.css` is imported in `main.tsx`

#### **Non-Critical Issues**

**1. Version Wildcards in Dependencies**
- **Problem**: `"clsx": "*"`, `"tailwind-merge": "*"`
- **Impact**: Unpredictable versions, potential breaking changes
- **Recommendation**: Pin to specific versions

**2. Extensive Vite Alias Configuration**
- **Problem**: 48 package aliases in `vite.config.ts` (lines 11-50)
- **Impact**: Maintenance overhead, fragile if package names change
- **Rationale**: Likely auto-generated by Figma export tool

**3. No Environment Configuration**
- **Problem**: No `.env` or environment variable support
- **Impact**: Cannot configure API endpoints, feature flags
- **Note**: May be intentional for static prototype

**4. Inline Styles in Components**
- **Problem**: Custom `<style>` tag in `MealPlanView.tsx` for scrollbar hiding
- **Impact**: Breaks colocation, harder to maintain
- **Alternative**: Should use Tailwind plugin or global CSS

### 6. Recommendations for Tailwind v3 Setup

Based on the analysis and best practices from [thoughts/research/2025-11-08-modern-web-application-styling-best-practices-2023-2025.md](/Users/seankim/dev/meal-prep-app/thoughts/research/2025-11-08-modern-web-application-styling-best-practices-2023-2025.md), here are recommendations:

#### **Phase 1: Install Core Dependencies**

**Required Packages**:
```bash
npm install -D tailwindcss@^3.4.0 postcss autoprefixer
npm install clsx@^2.1.0 tailwind-merge@^2.2.0  # Pin versions
```

**Rationale**:
- Tailwind v3.4.x is latest stable v3 release
- PostCSS and Autoprefixer required for Tailwind to process directives
- Pin utility libraries to avoid breaking changes

#### **Phase 2: Configuration Files**

**A. Create `tailwind.config.ts`**:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other design tokens
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

**B. Create `postcss.config.cjs`**:
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**C. Create `tsconfig.json`**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **Phase 3: Refactor CSS Files**

**A. Replace `src/index.css`** with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.625rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode tokens */
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }

  /* Typography defaults */
  :where(:not(:has([class*=' text-']))) h1 {
    @apply text-2xl font-medium;
  }
  :where(:not(:has([class*=' text-']))) h2 {
    @apply text-xl font-medium;
  }
  /* ... h3, h4, p, etc. */
}
```

**B. Delete or Archive**:
- `src/styles/globals.css` (v4 syntax, not needed)
- Old compiled `src/index.css` (save as `index.css.backup` for reference)

**Rationale**:
- Convert OKLCH to HSL (Tailwind v3 standard)
- Use `@tailwind` directives for JIT compilation
- Preserve typography auto-styling pattern
- Keep design token architecture

#### **Phase 4: Verify Component Compatibility**

**Check shadcn/ui components**:
- All components use standard Tailwind v3 syntax ✅
- No v4-specific features detected ✅
- `cn()` utility works with both v3 and v4 ✅

**Application components**:
- Utility classes are v3-compatible ✅
- No breaking changes needed ✅

#### **Phase 5: Add Development Scripts**

Update `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

### 7. Migration Strategy

#### **Option A: Clean Slate (Recommended)**

**Steps**:
1. Install dependencies (Phase 1)
2. Create configuration files (Phase 2)
3. Replace CSS with v3 directives (Phase 3)
4. Run `npm run dev` and test
5. Verify all components render correctly
6. Commit changes

**Pros**:
- Clean v3 setup aligned with best practices
- Full control over configuration
- Tree-shaking and JIT compilation enabled
- Can customize design system

**Cons**:
- Requires manual color token conversion (OKLCH → HSL)
- Initial setup time (~30-60 minutes)

#### **Option B: Minimal Disruption**

**Steps**:
1. Install Tailwind v3 dependencies
2. Create minimal config pointing to existing classes
3. Keep pre-compiled CSS as fallback
4. Gradually migrate to source directives

**Pros**:
- App works immediately
- Lower risk
- Incremental migration

**Cons**:
- Mixed architecture (compiled + source)
- Confusing for new developers
- Doesn't solve core issues

**Recommendation**: **Option A** is better long-term investment.

### 8. Potential Issues and Solutions

#### **Issue 1: OKLCH Color Space**

**Problem**: Figma exported with OKLCH, Tailwind v3 uses HSL

**Solution**:
- Convert OKLCH values to HSL using online converter
- Example: `oklch(0.145 0 0)` → `hsl(0, 0%, 14.5%)`
- Or use CSS custom properties as-is (browser support good)

**Browser Support**: OKLCH supported in Safari 15.4+, Chrome 111+, Firefox 113+

#### **Issue 2: Typography Auto-Styling**

**Problem**: Pattern `  :where(:not(:has([class*=' text-'])))` won't work with Tailwind v3 directives

**Solution**:
```css
@layer base {
  h1:not([class*='text-']) {
    @apply text-2xl font-medium;
  }
  /* Simpler selector, same effect */
}
```

#### **Issue 3: Dependency Version Conflicts**

**Problem**: `class-variance-authority@0.7.1` in imports vs actual version

**Solution**:
- Remove version suffixes from imports
- Change `from "class-variance-authority@0.7.1"` to `from "class-variance-authority"`
- Let package manager handle versioning

#### **Issue 4: Dark Mode**

**Problem**: Figma export uses `.dark` class, need to ensure Tailwind v3 config matches

**Solution**:
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // Use class-based dark mode
  // ...
}
```

### 9. Files That Need Modification

#### **To Create**:
- ✏️ `tailwind.config.ts` - Tailwind v3 configuration
- ✏️ `postcss.config.cjs` - PostCSS with Tailwind plugin
- ✏️ `tsconfig.json` - TypeScript configuration
- ✏️ `tsconfig.node.json` - TypeScript for Vite config

#### **To Modify**:
- ✏️ `src/index.css` - Replace with `@tailwind` directives + design tokens
- ✏️ `package.json` - Add Tailwind dependencies, update scripts
- ✏️ `src/components/ui/*.tsx` - Remove version suffixes from imports (48 files)

#### **To Delete/Archive**:
- 🗑️ `src/styles/globals.css` - v4 syntax, not needed for v3
- 🗑️ Old `src/index.css` (rename to `.backup` before replacing)

#### **To Leave As-Is**:
- ✅ `vite.config.ts` - Works with Tailwind v3
- ✅ `index.html` - No changes needed
- ✅ `src/main.tsx` - Already imports `index.css`
- ✅ `src/App.tsx` and all application components - v3 compatible
- ✅ `src/components/ui/*` - shadcn/ui components are v3 compatible

## Code References

### Build Configuration
- [package.json:2-59](/Users/seankim/dev/meal-prep-app/package.json#L2-L59) - Dependencies and scripts
- [vite.config.ts:2-60](/Users/seankim/dev/meal-prep-app/vite.config.ts#L2-L60) - Vite configuration with aliases
- [index.html:2-15](/Users/seankim/dev/meal-prep-app/index.html#L2-L15) - HTML entry point

### CSS and Styling
- [src/index.css:1](/Users/seankim/dev/meal-prep-app/src/index.css#L1) - Tailwind v4.1.3 compiled output header
- [src/index.css:1308-1347](/Users/seankim/dev/meal-prep-app/src/index.css#L1308-L1347) - Design tokens (CSS variables)
- [src/styles/globals.css:1-190](/Users/seankim/dev/meal-prep-app/src/styles/globals.css#L1-L190) - Unused v4 source directives
- [src/components/ui/utils.ts:1-6](/Users/seankim/dev/meal-prep-app/src/components/ui/utils.ts#L1-L6) - `cn()` utility for class merging

### Components
- [src/App.tsx:1-94](/Users/seankim/dev/meal-prep-app/src/App.tsx#L1-L94) - Main application component
- [src/main.tsx:2-6](/Users/seankim/dev/meal-prep-app/src/main.tsx#L2-L6) - React entry point
- [src/components/MealPlanView.tsx:1-119](/Users/seankim/dev/meal-prep-app/src/components/MealPlanView.tsx#L1-L119) - Tab navigation
- [src/components/tabs/OverviewTab.tsx:1-100](/Users/seankim/dev/meal-prep-app/src/components/tabs/OverviewTab.tsx#L1-L100) - Overview tab
- [src/components/ui/button.tsx:1-59](/Users/seankim/dev/meal-prep-app/src/components/ui/button.tsx#L1-L59) - shadcn/ui Button
- [src/components/figma/ImageWithFallback.tsx:1-28](/Users/seankim/dev/meal-prep-app/src/components/figma/ImageWithFallback.tsx#L1-L28) - Figma image utility

### Data
- [src/data/mockPlan.ts:1-50](/Users/seankim/dev/meal-prep-app/src/data/mockPlan.ts#L1-L50) - Mock meal plan data

## Architecture Documentation

### Current Architecture

**Layer 1: Build Tooling**
```
Vite 6.3.5
├── React 18.3.1 (via @vitejs/plugin-react-swc)
├── TypeScript (implicit, no config)
└── Dev Server (port 3000)
```

**Layer 2: Styling (Broken)**
```
Pre-compiled Tailwind v4.1.3 CSS
├── src/index.css (35KB compiled output)
├── src/styles/globals.css (unused v4 source)
└── NO build process ❌
```

**Layer 3: Component Architecture**
```
React Components
├── Application Layer
│   ├── App.tsx (landing + routing)
│   ├── MealPlanView.tsx (tab container)
│   └── tabs/*.tsx (5 tab panels)
├── UI Component Library (shadcn/ui)
│   ├── 48 components
│   ├── Radix UI primitives
│   └── Tailwind styling
└── Figma Utilities
    └── ImageWithFallback.tsx
```

**Layer 4: Data**
```
Mock Data (Static)
└── mockPlan.ts (TypeScript object)
```

### Target Architecture (Post-Migration)

**Layer 1: Build Tooling** _(No change)_
```
Vite 6.3.5 + TypeScript
```

**Layer 2: Styling** _(Fixed)_
```
Tailwind CSS v3.4.x
├── tailwind.config.ts (configuration)
├── postcss.config.cjs (PostCSS + Autoprefixer)
├── src/index.css (@tailwind directives + design tokens)
└── JIT compilation ✅
```

**Layer 3: Components** _(Minimal changes)_
```
React Components
├── Same structure
└── Import fixes (remove version suffixes)
```

## Related Documentation

- [Modern Web Application Styling Best Practices 2023-2025](/Users/seankim/dev/meal-prep-app/thoughts/research/2025-11-08-modern-web-application-styling-best-practices-2023-2025.md) - Industry research on Tailwind v3 vs v4, shadcn/ui patterns, performance benchmarks
- [Modern Web Layout Typography and Spacing Systems 2023-2025](/Users/seankim/dev/meal-prep-app/thoughts/research/2025-11-08-modern-web-layout-typography-and-spacing-systems-2023-2025.md) - Typography scale, spacing system best practices

## Open Questions

1. **Should we preserve OKLCH colors or convert to HSL?**
   - OKLCH is more modern and perceptually uniform
   - HSL is Tailwind v3 standard
   - Browser support for OKLCH is good (2023+)
   - **Recommendation**: Keep OKLCH via CSS variables, add HSL fallbacks

2. **How to handle the 48 versioned imports in UI components?**
   - Manual find/replace across all files
   - Or codemod script
   - **Recommendation**: Automated find/replace script

3. **Should we keep the typography auto-styling pattern?**
   - Unique pattern from Figma export
   - Reduces boilerplate in components
   - Slightly non-standard for Tailwind
   - **Recommendation**: Keep it, documents well, works great

4. **TypeScript strict mode enabled or gradual?**
   - Figma export may have type issues
   - Strict mode best practice
   - **Recommendation**: Start strict, relax if needed
