// Core data model types

export interface MealPlan {
  id: string;
  weekStart: string; // ISO date
  weekEnd: string;
  philosophy: string;
  spotlightDish: SpotlightDish;
  components: Component[];
  shoppingList: ShoppingItem[];
  prepSteps: PrepStep[];
  weekMeals: WeekMeal[];
  notes: Note[];
}

export interface SpotlightDish {
  name: string;
  description: string;
  cookTime: string;
}

export interface Component {
  name: string;
  description: string;
  storage: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: 'Produce' | 'Pantry' | 'Dairy' | 'Broth' | 'Meat' | 'Seafood';
  checked: boolean;
}

export interface PrepStep {
  id: string;
  stepNumber: number;
  title: string;
  duration: string;
  parallelTasks?: string[];
  ingredients: string[];
  equipment: string[];
  instructions: string[];
  notes?: string[];
  completed: boolean;
}

export interface WeekMeal {
  id: string;
  day: string;
  name: string;
  assemblyTime: string;
  cookingMethod: string;
  components: string[];
  freshIngredients: string[];
  instructions: string[];
  expanded: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string[];
}
