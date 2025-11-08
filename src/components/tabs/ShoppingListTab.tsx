import { useState, useEffect } from 'react';
import { ShoppingItem } from '../../types';

interface ShoppingListTabProps {
  items: ShoppingItem[];
}

// Category icon mapping
const categoryIcons: Record<string, JSX.Element> = {
  'Produce': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 3v4M10 3c-1.5 0-2 1-2 2h4c0-1-0.5-2-2-2z" />
      <path d="M6 7c0 2.76 1.79 5 4 5s4-2.24 4-5" />
      <path d="M10 12v5" />
    </svg>
  ),
  'Pantry': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="3" width="12" height="14" rx="1" />
      <path d="M8 7h4M8 10h4M8 13h4" />
    </svg>
  ),
  'Dairy': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h8l2 14H4l2-14z" />
      <path d="M6 3v4h8V3" />
    </svg>
  ),
  'Broth': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 3h6v11a3 3 0 01-6 0V3z" />
      <path d="M7 7h6" />
    </svg>
  ),
  'Meat': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="4" />
      <circle cx="13" cy="13" r="4" />
      <path d="M10.5 10.5l-1-1" />
    </svg>
  ),
  'Seafood': (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 10h16M10 2v16" />
      <path d="M5 6c2-2 8-2 10 0M5 14c2 2 8 2 10 0" />
    </svg>
  )
};

export function ShoppingListTab({ items: initialItems }: ShoppingListTabProps) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shoppingList');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      } catch (e) {
        console.error('Failed to parse shopping list from localStorage');
      }
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Filter items based on search
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group items by category
  const categorizedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const categories = Object.keys(categorizedItems);
  const totalItems = items.length;
  const checkedItems = items.filter(i => i.checked).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1>Shopping List</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span>{checkedItems}/{totalItems}</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-6">
          Everything you need for this week's meal prep. Check items off as you shop.
        </p>

        {/* Search Bar */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width="18" 
            height="18" 
            viewBox="0 0 18 18" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="8" cy="8" r="5" />
            <path d="M12 12l4 4" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Category Sections */}
      <div className="space-y-8">
        {categories.map(category => {
          const categoryItems = categorizedItems[category];
          const categoryChecked = categoryItems.filter(item => item.checked).length;

          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">
                    {categoryIcons[category]}
                  </div>
                  <h3>{category}</h3>
                  <span className="text-muted-foreground">
                    {categoryChecked}/{categoryItems.length}
                  </span>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid gap-3">
                {categoryItems.map(item => (
                  <label
                    key={item.id}
                    className={`group flex items-center gap-4 p-4 bg-card border border-border rounded-lg cursor-pointer transition-all hover:shadow-sm hover:border-primary/20 ${
                      item.checked ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleItem(item.id)}
                        className="peer w-5 h-5 rounded border-2 border-muted-foreground/30 bg-background appearance-none cursor-pointer transition-all checked:bg-primary checked:border-primary"
                      />
                      <svg
                        className="absolute inset-0 w-5 h-5 text-primary-foreground opacity-0 peer-checked:opacity-100 pointer-events-none"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="M5 10l3 3 7-7" />
                      </svg>
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`transition-all ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                        {item.name}
                      </div>
                    </div>

                    {/* Quantity Badge */}
                    <div className="flex-shrink-0 px-3 py-1 bg-accent/50 rounded-full text-muted-foreground">
                      {item.quantity}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <h3 className="mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or clear filters
          </p>
        </div>
      )}

      {/* Progress Summary */}
      {filteredItems.length > 0 && (
        <div className="mt-8 p-5 bg-card border border-border rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Shopping Progress</span>
            <span>{Math.round((checkedItems / totalItems) * 100)}%</span>
          </div>
          <div className="h-2 bg-accent rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(checkedItems / totalItems) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
