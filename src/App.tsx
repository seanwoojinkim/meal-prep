import { useState } from 'react';
import { MealPlanView } from './components/MealPlanView';
import { mockPlan } from './data/mockPlan';

export default function App() {
  const [showPlan, setShowPlan] = useState(false);

  if (showPlan) {
    return <MealPlanView plan={mockPlan} />;
  }

  // Landing page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="/lp.png"
              alt="Meal prep illustration"
              className="w-32 h-32 md:w-40 md:h-40 rounded-2xl"
            />
          </div>
          <h1 className="mb-4">Sunday Meal Prep</h1>
          <p className="text-muted-foreground mb-8">
            A modular meal prep system that helps you plan and execute Sunday batch cooking 
            sessions. Front-load 2 hours of work on Sunday, reduce weeknight cooking to 
            10-20 minute assembly.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setShowPlan(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Mock Plan
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" />
            </svg>
          </button>
          
          <div className="pt-4">
            <p className="text-muted-foreground">
              This is a UX prototype with static mock data. Backend integration coming soon.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border">
            <div className="w-10 h-10 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="8" />
                <path d="M10 6v4l3 3" />
              </svg>
            </div>
            <h3 className="mb-2">Sunday Prep</h3>
            <p className="text-muted-foreground">
              Follow a detailed 12-step timeline with ingredients, equipment, and pro tips.
            </p>
          </div>

          <div className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border">
            <div className="w-10 h-10 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h3l2 10h7l2-8H7" />
                <circle cx="9" cy="17" r="1" />
                <circle cx="16" cy="17" r="1" />
              </svg>
            </div>
            <h3 className="mb-2">Smart Shopping</h3>
            <p className="text-muted-foreground">
              Categorized shopping list with persistent checkboxes—never forget an ingredient.
            </p>
          </div>

          <div className="p-6 bg-card/30 backdrop-blur-sm rounded-xl border border-border">
            <div className="w-10 h-10 mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="14" height="12" rx="2" />
                <path d="M7 5V4M13 5V4M3 9h14" />
              </svg>
            </div>
            <h3 className="mb-2">Week of Meals</h3>
            <p className="text-muted-foreground">
              Seven meals from Sunday to Saturday using the same components—variety without repetition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}