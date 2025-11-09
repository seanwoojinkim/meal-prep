import React, { useState } from 'react';
import { MealPlan } from '../types';
import { OverviewTab } from './tabs/OverviewTab';
import { ShoppingListTab } from './tabs/ShoppingListTab';
import { SundayPrepTab } from './tabs/SundayPrepTab';
import { ThisWeekTab } from './tabs/ThisWeekTab';
import { NotesTab } from './tabs/NotesTab';

interface MealPlanViewProps {
  plan: MealPlan;
}

type TabId = 'overview' | 'shopping' | 'prep' | 'week' | 'notes';

const tabs: { id: TabId; label: string; icon: React.JSX.Element }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="14" height="14" rx="2" />
        <path d="M2 7h14M7 2v14" />
      </svg>
    )
  },
  {
    id: 'shopping',
    label: 'Shopping',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h2l1 9h8l1-7H5" />
        <circle cx="8" cy="15" r="1" />
        <circle cx="14" cy="15" r="1" />
      </svg>
    )
  },
  {
    id: 'prep',
    label: 'Sunday Prep',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="9" r="7" />
        <path d="M9 5v4l3 3" />
      </svg>
    )
  },
  {
    id: 'week',
    label: 'This Week',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="14" height="12" rx="2" />
        <path d="M6 3V2M12 3V2M2 7h14" />
      </svg>
    )
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3h9l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z" />
        <path d="M12 3v3h3" />
      </svg>
    )
  }
];

export function MealPlanView({ plan }: MealPlanViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <span className={activeTab === tab.id ? 'opacity-100' : 'opacity-60'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[calc(100vh-64px)]">
        {activeTab === 'overview' && <OverviewTab plan={plan} />}
        {activeTab === 'shopping' && <ShoppingListTab items={plan.shoppingList} />}
        {activeTab === 'prep' && <SundayPrepTab steps={plan.prepSteps} />}
        {activeTab === 'week' && <ThisWeekTab meals={plan.weekMeals} />}
        {activeTab === 'notes' && <NotesTab notes={plan.notes} />}
      </div>

      {/* Hide scrollbar on tab navigation */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
