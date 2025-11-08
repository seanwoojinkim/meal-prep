import { useState } from 'react';
import { WeekMeal } from '../../types';

interface ThisWeekTabProps {
  meals: WeekMeal[];
}

export function ThisWeekTab({ meals: initialMeals }: ThisWeekTabProps) {
  const [meals, setMeals] = useState<WeekMeal[]>(initialMeals);
  const [collapsedMeals, setCollapsedMeals] = useState<Set<string>>(new Set());

  const toggleCollapse = (id: string) => {
    setCollapsedMeals(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Get day abbreviation
  const getDayAbbr = (day: string) => {
    return day.substring(0, 3).toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-3">This Week's Meals</h1>
        <p className="text-muted-foreground">
          Seven meals from Sunday through Saturday using your prep components. Most meals take 10-20 minutes to assemble.
        </p>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {meals.map((meal) => {
          const isCollapsed = collapsedMeals.has(meal.id);
          
          return (
            <div
              key={meal.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              {/* Meal Header - Compact */}
              <div className="p-4 bg-card/50 border-b border-border">
                <div className="flex items-center gap-3">
                  {/* Day Badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary">{getDayAbbr(meal.day)}</span>
                  </div>

                  {/* Meal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-muted-foreground mb-1">{meal.day}</div>
                    <h3>{meal.name}</h3>
                  </div>

                  {/* Metadata */}
                  <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <div className="inline-flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="6" cy="6" r="5" />
                        <path d="M6 3v3l2 2" />
                      </svg>
                      <span>{meal.assemblyTime}</span>
                    </div>
                    <span className="opacity-40">•</span>
                    <span>{meal.cookingMethod}</span>
                  </div>

                  {/* Collapse Toggle */}
                  <button
                    onClick={() => toggleCollapse(meal.id)}
                    className="flex-shrink-0 p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        isCollapsed ? '' : 'rotate-180'
                      }`}
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 7.5l5 5 5-5" />
                    </svg>
                  </button>
                </div>

                {/* Mobile Metadata */}
                <div className="flex md:hidden items-center gap-2 text-muted-foreground mt-2 ml-13">
                  <div className="inline-flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="6" cy="6" r="5" />
                      <path d="M6 3v3l2 2" />
                    </svg>
                    <span>{meal.assemblyTime}</span>
                  </div>
                  <span className="opacity-40">•</span>
                  <span>{meal.cookingMethod}</span>
                </div>
              </div>

              {/* Meal Content - Always visible unless manually collapsed */}
              {!isCollapsed && (
                <div className="p-4">
                  <div className="grid md:grid-cols-12 gap-6">
                    {/* Left Column: Components & Fresh Ingredients (4 cols) */}
                    <div className="md:col-span-4 space-y-4">
                      {/* Components from Sunday Prep */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2.5" width="10" height="9" rx="1" />
                            <path d="M5 2.5V1.5M9 2.5V1.5M2 5.5h10" />
                          </svg>
                          <h4>From Sunday Prep</h4>
                        </div>
                        <div className="space-y-1.5">
                          {meal.components.map((component, i) => (
                            <div key={i} className="flex items-start gap-2 px-3 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                              <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="flex-1">{component}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fresh Ingredients */}
                      {meal.freshIngredients.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M7 2.5v3M7 2.5c-1.2 0-1.5.8-1.5 1.5h3c0-.7-.3-1.5-1.5-1.5z" />
                              <path d="M4.5 5.5c0 1.7 1.3 3 3 3s3-1.3 3-3" />
                              <path d="M7 8.5v3" />
                            </svg>
                            <h4>Fresh Ingredients</h4>
                          </div>
                          <div className="space-y-1.5">
                            {meal.freshIngredients.map((ingredient, i) => (
                              <div key={i} className="flex items-start gap-2 text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                                <span className="flex-1">{ingredient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Assembly Instructions (8 cols) */}
                    <div className="md:col-span-8 space-y-4">
                      {/* Instructions */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 2h7l2 2v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" />
                            <path d="M9 2v2h2M4 7h5M4 9h3" />
                          </svg>
                          <h4>Assembly Instructions</h4>
                        </div>
                        <div className="space-y-3">
                          {meal.instructions.map((instruction, i) => (
                            <div key={i} className="flex gap-2.5">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                {i + 1}
                              </div>
                              <p className="flex-1 text-muted-foreground leading-relaxed">
                                {instruction}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Tip */}
      <div className="mt-6 p-4 bg-accent/30 backdrop-blur-sm rounded-xl border border-border">
        <div className="flex gap-3">
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 18 18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="flex-shrink-0 mt-0.5 text-muted-foreground"
          >
            <circle cx="9" cy="9" r="7" />
            <path d="M9 9v4M9 5v.5" />
          </svg>
          <div>
            <h4 className="mb-1">Flexible Scheduling</h4>
            <p className="text-muted-foreground">
              Cook these meals in any order throughout the week. All components stay fresh 
              for 5 days when properly stored. Click the arrow to collapse meals you've already 
              completed to reduce clutter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}