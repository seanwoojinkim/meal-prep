import { useState, useEffect } from 'react';
import { PrepStep } from '../../types';

interface SundayPrepTabProps {
  steps: PrepStep[];
}

export function SundayPrepTab({ steps: initialSteps }: SundayPrepTabProps) {
  const [steps, setSteps] = useState<PrepStep[]>(initialSteps);
  const [collapsedSteps, setCollapsedSteps] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sundayPrepSteps');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSteps(parsed);
      } catch (e) {
        console.error('Failed to parse prep steps from localStorage');
      }
    }
  }, []);

  // Save to localStorage whenever steps change
  useEffect(() => {
    localStorage.setItem('sundayPrepSteps', JSON.stringify(steps));
  }, [steps]);

  const toggleStep = (id: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const toggleCollapse = (id: string) => {
    setCollapsedSteps(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Helper to highlight semantic elements in text
  const highlightText = (text: string) => {
    const parts = text.split(/(\d+(?:\/\d+)?\s*(?:cups?|tbsp|tsp|lbs?|oz|cloves?|inch|minutes?|hours?|°F|degrees)|\b(?:Add|Cook|Stir|Combine|Heat|Remove|Bring|Reduce|Cover|Roast|Preheat|Arrange|Let|Divide|Transfer|Label|Wash|Wipe|Organize|Check|Set|Ensure|Form|Fry|Top|Toss|Spread|Layer|Roll|Cut|Warm|Flip|Fold|Whisk|Toast|Rinse|Massage|Break|Peel)\b)/gi);
    
    return parts.map((part, i) => {
      if (/\d+°F|degrees/i.test(part)) {
        return <span key={i} className="text-red-500 dark:text-red-400">{part}</span>;
      }
      if (/\d+(?:-\d+)?\s*(?:minutes?|hours?|seconds?)/i.test(part)) {
        return <span key={i} className="text-orange-500 dark:text-orange-400">{part}</span>;
      }
      if (/\d+(?:\/\d+)?\s*(?:cups?|tbsp|tsp|lbs?|oz|cloves?|inch)/i.test(part)) {
        return <span key={i} className="text-blue-500 dark:text-blue-400">{part}</span>;
      }
      if (/^(Add|Cook|Stir|Combine|Heat|Remove|Bring|Reduce|Cover|Roast|Preheat|Arrange|Let|Divide|Transfer|Label|Wash|Wipe|Organize|Check|Set|Ensure|Form|Fry|Top|Toss|Spread|Layer|Roll|Cut|Warm|Flip|Fold|Whisk|Toast|Rinse|Massage|Break|Peel)$/i.test(part)) {
        return <strong key={i}>{part}</strong>;
      }
      return part;
    });
  };

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-6 grid grid-cols-[80px_1fr] md:grid-cols-[140px_1fr] gap-4 md:gap-8 items-center">
        <div className="rounded-xl overflow-hidden stagger-1">
          <img
            src="/prep.png"
            alt="Prep"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="stagger-2">
          <div className="flex items-center justify-between mb-3">
            <h1>Sunday Prep Timeline</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{completedCount}/{steps.length}</span>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Follow these {steps.length} steps to prep your week. Total time: ~2 hours 15 minutes.
          </p>
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isCollapsed = collapsedSteps.has(step.id);
          
          return (
            <div
              key={step.id}
              className={`bg-card border border-border rounded-xl overflow-hidden transition-all ${
                step.completed ? 'opacity-60' : ''
              }`}
            >
              {/* Step Header - Compact */}
              <div className="p-4 bg-card/50 border-b border-border">
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div 
                    className="relative flex-shrink-0 cursor-pointer"
                    onClick={() => toggleStep(step.id)}
                  >
                    <div className="w-5 h-5 rounded border-2 border-muted-foreground/30 bg-background flex items-center justify-center hover:border-primary transition-colors">
                      {step.completed && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M2 6l3 3 5-6" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Step Number Badge */}
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {step.stepNumber}
                  </div>

                  {/* Title and Metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`mb-1 ${step.completed ? 'line-through' : ''}`}>
                      {step.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      <div className="inline-flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="6" cy="6" r="5" />
                          <path d="M6 3v3l2 2" />
                        </svg>
                        <span>{step.duration}</span>
                      </div>
                      {step.parallelTasks && step.parallelTasks.map((task, i) => (
                        <div key={i} className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <span className="opacity-40">•</span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 3h8M2 6h8M2 9h8" />
                          </svg>
                          <span>{task}</span>
                        </div>
                      ))}
                      {step.ingredients.length > 0 && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>{step.ingredients.length} ingredients</span>
                        </>
                      )}
                      {step.equipment.length > 0 && (
                        <>
                          <span className="opacity-40">•</span>
                          <span>{step.equipment.length} tools</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Collapse Toggle */}
                  <button
                    onClick={() => toggleCollapse(step.id)}
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
              </div>

              {/* Step Content - Always visible unless manually collapsed */}
              {!isCollapsed && (
                <div className="p-4">
                  <div className="grid md:grid-cols-12 gap-6">
                    {/* Left Column: Ingredients & Equipment (4 cols) */}
                    <div className="md:col-span-4 space-y-4">
                      {/* Ingredients */}
                      {step.ingredients.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M2 2v10M4 2v10M6 7v5M8 5v7M10 3v9M12 5v7" />
                            </svg>
                            <h4>Ingredients</h4>
                          </div>
                          <div className="space-y-1.5">
                            {step.ingredients.map((ingredient, i) => (
                              <div key={i} className="flex items-start gap-2 text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                                <span className="flex-1">{ingredient}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Equipment */}
                      {step.equipment.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="2.5" y="6" width="9" height="6" rx="1" />
                              <path d="M4.5 6V3.5a2.5 2.5 0 015 0V6" />
                            </svg>
                            <h4>Equipment</h4>
                          </div>
                          <div className="space-y-1.5">
                            {step.equipment.map((item, i) => (
                              <div key={i} className="flex items-start gap-2 text-muted-foreground">
                                <div className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0" />
                                <span className="flex-1">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column: Instructions (8 cols) */}
                    <div className="md:col-span-8 space-y-4">
                      {/* Instructions */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 2h7l2 2v8a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1z" />
                            <path d="M9 2v2h2M4 7h5M4 9h3" />
                          </svg>
                          <h4>Instructions</h4>
                        </div>
                        <div className="space-y-3">
                          {step.instructions.map((instruction, i) => (
                            <div key={i} className="flex gap-2.5">
                              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                {i + 1}
                              </div>
                              <p className="flex-1 text-muted-foreground leading-relaxed">
                                {highlightText(instruction)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pro Tips */}
                      {step.notes && step.notes.length > 0 && (
                        <div className="p-3 bg-accent/30 rounded-lg border border-border">
                          <div className="flex gap-2">
                            <svg 
                              width="14" 
                              height="14" 
                              viewBox="0 0 14 14" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="1.5"
                              className="flex-shrink-0 mt-0.5"
                            >
                              <circle cx="7" cy="7" r="5.5" />
                              <path d="M7 7v3M7 4.5v.5" />
                            </svg>
                            <div className="flex-1">
                              <h4 className="mb-1.5">Pro Tips</h4>
                              <div className="space-y-1.5">
                                {step.notes.map((note, i) => (
                                  <p key={i} className="text-muted-foreground leading-relaxed">
                                    {note}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
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
            <h4 className="mb-1">Kitchen Mode</h4>
            <p className="text-muted-foreground">
              Check off steps as you complete them. Click the arrow to collapse steps you've finished 
              to reduce clutter while cooking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}