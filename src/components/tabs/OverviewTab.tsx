import { MealPlan } from '../../types';

interface OverviewTabProps {
  plan: MealPlan;
}

export function OverviewTab({ plan }: OverviewTabProps) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Week Header */}
      <div className="mb-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="rounded-xl overflow-hidden h-full">
          <img
            src="/food.png"
            alt="Meal prep ingredients"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
            {formatDateRange(plan.weekStart, plan.weekEnd)}
          </div>
          <h1 className="mb-4">This Week's Plan</h1>
          <p className="text-muted-foreground">
            {plan.philosophy}
          </p>
        </div>
      </div>

      {/* Sunday Spotlight */}
      <div className="mb-12 p-6 md:p-8 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full mb-4">
          Sunday Spotlight
        </div>
        <h2 className="mb-3">{plan.spotlightDish.name}</h2>
        <p className="text-muted-foreground mb-4">
          {plan.spotlightDish.description}
        </p>
        <div className="inline-flex items-center gap-2 text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 4v4l2.5 2.5" />
          </svg>
          <span>{plan.spotlightDish.cookTime}</span>
        </div>
      </div>

      {/* Core Components */}
      <div className="mb-12">
        <h2 className="mb-6">Core Components</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plan.components.map((component, index) => (
            <div 
              key={index}
              className="p-5 bg-card/30 backdrop-blur-sm rounded-lg border border-border"
            >
              <h3 className="mb-2">{component.name}</h3>
              <p className="text-muted-foreground mb-3">
                {component.description}
              </p>
              <div className="text-muted-foreground">
                <svg 
                  className="inline-block mr-2" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 14 14" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                >
                  <rect x="2" y="3" width="10" height="9" rx="1" />
                  <path d="M5 3V2M9 3V2M2 6h10" />
                </svg>
                {component.storage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Philosophy */}
      <div className="p-6 md:p-8 bg-accent/30 backdrop-blur-sm rounded-xl border border-border">
        <h3 className="mb-4">The Sunday Prep Philosophy</h3>
        <div className="space-y-3 text-muted-foreground">
          <p>
            Traditional meal prep gets boring by Wednesday. This system is different: instead of 
            freezing identical containers, you're creating versatile building blocks that combine 
            into different meals.
          </p>
          <p>
            One batch of components becomes multiple meals: black beans transform into soup on Monday 
            and tacos on Wednesday. Sweet potatoes appear in both tacos and salads. Same ingredients, 
            completely different experiences.
          </p>
          <p>
            The magic is in the prep-to-payoff ratio: 2 hours of focused work on Sunday buys you 
            a week of 10-20 minute meals that taste fresh, not reheated.
          </p>
        </div>
      </div>
    </div>
  );
}