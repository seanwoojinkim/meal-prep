import { MealPlan } from '../types';

export const mockPlan: MealPlan = {
  id: 'mock-plan-nov-2025',
  weekStart: '2025-11-10',
  weekEnd: '2025-11-16',
  philosophy: "This week's meal prep centers around versatile components that can be mixed and matched for variety while minimizing daily cooking. The foundation includes batch-cooked black beans (used in both soup and tacos), roasted sweet potatoes (tacos and salad), and a quick chicken soup with pastina. We're building flavor diversity through different applications: spicy Mexican-inspired, Italian comfort food, Mediterranean roasted vegetables, and Asian-influenced tempeh salads. Front-load Sunday prep with beans, roasted vegetables, and soup base. Weeknight assembly should take 10-20 minutes max, mostly reheating and combining pre-prepped elements.",
  spotlightDish: {
    name: 'Roasted Red Cabbage with Walnuts and Feta',
    description: 'Sunday dinner showcases tender roasted red cabbage wedges with apple cider vinaigrette, crumbled feta, toasted walnuts, lemon zest, and pomegranate seeds. Simple but stunning.',
    cookTime: '40 minutes'
  },
  components: [
    {
      name: 'Chicken Soup with Pastina',
      description: '6-7 cups of Italian comfort - tender chicken, vegetables, and tiny pasta in broth',
      storage: 'Refrigerate 4-5 days'
    },
    {
      name: 'Spicy Black Bean Soup',
      description: '6-7 cups with salsa verde, cocoa powder, and cumin - partially blended',
      storage: 'Refrigerate 3-4 days'
    },
    {
      name: 'Plain Cooked Black Beans',
      description: '2-3 cups from soup batch - for tacos and grain bowls',
      storage: 'Refrigerate 4-5 days'
    },
    {
      name: 'Roasted Sweet Potato Cubes',
      description: '3-4 cups total - split between tacos and tempeh salad',
      storage: 'Refrigerate 4-5 days'
    },
    {
      name: 'Pickled Red Onions with Lime & Cilantro',
      description: '1 cup quick-pickled - adds bright acidity to everything',
      storage: 'Refrigerate 7-10 days'
    },
    {
      name: 'Sliced Garlic in Olive Oil',
      description: '6 cloves thinly sliced for pasta aglio e olio',
      storage: 'Refrigerate 3-4 days'
    }
  ],
  shoppingList: [
    // Produce
    { id: 'prod-1', name: '2 large sweet potatoes', quantity: 'for tacos and tempeh salad', category: 'Produce', checked: false },
    { id: 'prod-2', name: '1 medium red cabbage', quantity: '1¾-2 lbs', category: 'Produce', checked: false },
    { id: 'prod-3', name: '3 large carrots', quantity: 'for chicken soup', category: 'Produce', checked: false },
    { id: 'prod-4', name: '3 large celery ribs', quantity: 'for chicken soup', category: 'Produce', checked: false },
    { id: 'prod-5', name: '1 large yellow onion', quantity: 'for chicken soup', category: 'Produce', checked: false },
    { id: 'prod-6', name: '2-3 red onions', quantity: 'for pickling, garnish', category: 'Produce', checked: false },
    { id: 'prod-7', name: '6-8 garlic cloves', quantity: 'soup, pasta aglio e olio', category: 'Produce', checked: false },
    { id: 'prod-8', name: '5 oz arugula', quantity: 'about 5 packed cups, for pasta', category: 'Produce', checked: false },
    { id: 'prod-9', name: 'Large bunch cilantro', quantity: 'black bean soup, tacos, pickled onions', category: 'Produce', checked: false },
    { id: 'prod-10', name: 'Large bunch parsley', quantity: 'for chicken soup', category: 'Produce', checked: false },
    { id: 'prod-11', name: '1 small lemon', quantity: 'for pasta aglio e olio', category: 'Produce', checked: false },
    { id: 'prod-12', name: '2-3 limes', quantity: 'pickled onions, taco garnish', category: 'Produce', checked: false },
    { id: 'prod-13', name: 'Fresh herbs for salad', quantity: 'mint, parsley, or dill - optional', category: 'Produce', checked: false },
    { id: 'prod-14', name: '1 avocado', quantity: 'for taco topping - buy closer to use', category: 'Produce', checked: false },
    { id: 'prod-15', name: '1-2 radishes', quantity: 'optional, for soup/taco garnish', category: 'Produce', checked: false },
    { id: 'prod-16', name: 'Salad greens base', quantity: 'mixed greens or spinach, 4-5 cups', category: 'Produce', checked: false },

    // Pantry & Canned Goods
    { id: 'pant-1', name: '6 (15-oz) cans black beans', quantity: '4 for soup, 2 for tacos', category: 'Pantry', checked: false },
    { id: 'pant-2', name: '2 (16-oz) jars mild salsa verde', quantity: 'or 3½ cups homemade', category: 'Pantry', checked: false },
    { id: 'pant-3', name: '2 (4-oz) cans chopped green chiles', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-4', name: '2 (5-7 oz) cans/jars tuna, drained', quantity: 'oil-packed preferred', category: 'Pantry', checked: false },
    { id: 'pant-5', name: '1 lb spaghetti', quantity: 'or other long pasta', category: 'Pantry', checked: false },
    { id: 'pant-6', name: '½ cup pastina', quantity: 'Acini di Pepe or orzo, ~4 oz', category: 'Pantry', checked: false },
    { id: 'pant-7', name: '1 package smoky tempeh', quantity: '8 oz', category: 'Pantry', checked: false },
    { id: 'pant-8', name: 'Tortilla chips', quantity: 'for soup topping', category: 'Pantry', checked: false },
    { id: 'pant-9', name: 'Corn or flour tortillas', quantity: '8-12 for tacos', category: 'Pantry', checked: false },

    // Spices & Seasonings
    { id: 'spice-1', name: 'Unsweetened cocoa powder', quantity: '2 tbsp', category: 'Pantry', checked: false },
    { id: 'spice-2', name: 'Ground cumin', quantity: '2 tsp', category: 'Pantry', checked: false },
    { id: 'spice-3', name: 'Garlic powder', quantity: '2½ tsp total', category: 'Pantry', checked: false },
    { id: 'spice-4', name: 'Crushed red pepper flakes', quantity: 'for pasta', category: 'Pantry', checked: false },
    { id: 'spice-5', name: 'Black pepper', quantity: '', category: 'Pantry', checked: false },
    { id: 'spice-6', name: 'Kosher salt', quantity: 'Diamond Crystal preferred', category: 'Pantry', checked: false },
    { id: 'spice-7', name: 'Tomato paste', quantity: '2 tsp', category: 'Pantry', checked: false },
    { id: 'spice-8', name: 'Dijon mustard', quantity: '½ tsp', category: 'Pantry', checked: false },
    { id: 'spice-9', name: 'Apple cider vinegar', quantity: 'for cabbage and pickled onions', category: 'Pantry', checked: false },
    { id: 'spice-10', name: 'Extra-virgin olive oil', quantity: '¾ cup total', category: 'Pantry', checked: false },

    // Dairy & Cheese
    { id: 'dairy-1', name: '⅔ cup (3 oz) crumbled feta cheese', quantity: 'for roasted cabbage', category: 'Dairy', checked: false },
    { id: 'dairy-2', name: '6-8 oz cheddar cheese, shredded', quantity: 'for tacos', category: 'Dairy', checked: false },
    { id: 'dairy-3', name: 'Sour cream', quantity: 'for soup and taco topping', category: 'Dairy', checked: false },
    { id: 'dairy-4', name: 'Parmesan cheese, grated', quantity: 'for chicken soup', category: 'Dairy', checked: false },

    // Protein
    { id: 'meat-1', name: '2 large boneless, skinless chicken breasts', quantity: 'about 1 lb, for soup', category: 'Meat', checked: false },

    // Nuts & Garnish
    { id: 'pant-10', name: '⅓ cup walnuts', quantity: 'for roasted cabbage', category: 'Pantry', checked: false },
    { id: 'pant-11', name: '½ cup mixed nuts', quantity: 'walnuts, almonds, or pecans for tempeh salad', category: 'Pantry', checked: false },
    { id: 'prod-17', name: 'Pomegranate seeds', quantity: 'for roasted cabbage - optional', category: 'Produce', checked: false },
    { id: 'prod-18', name: 'Lemon zest', quantity: 'for roasted cabbage', category: 'Produce', checked: false },
    { id: 'prod-19', name: 'Fresh chiles', quantity: 'optional, for soup topping', category: 'Produce', checked: false },
    { id: 'prod-20', name: 'Queso fresco', quantity: 'optional, for soup topping', category: 'Dairy', checked: false },
  ],
  prepSteps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: '2:00 PM - START & PREHEAT',
      duration: '10 min',
      ingredients: [
        '2 large boneless, skinless chicken breasts (about 1 lb)',
        '10 cups water',
        '2 large sweet potatoes'
      ],
      equipment: ['Large pot', 'Sheet pan', 'Fork'],
      instructions: [
        'Preheat oven to 425°F',
        'Fill large pot with 10 cups water and place chicken breasts inside; set on high heat (for chicken soup base)',
        'Wash and scrub sweet potatoes; pierce with fork'
      ],
      completed: false
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: '2:10 PM - SWEET POTATOES & INITIAL PREP',
      duration: '15 min',
      parallelTasks: ['While sweet potatoes start'],
      ingredients: [
        'Sweet potatoes',
        'Olive oil',
        'Salt',
        '1 large yellow onion',
        '3 large carrots',
        '3 large celery ribs',
        '6-8 garlic cloves',
        '2-3 red onions'
      ],
      equipment: ['Sheet pan', 'Cutting board', 'Chef\'s knife'],
      instructions: [
        'Place sweet potatoes on sheet pan, drizzle with olive oil, season with salt',
        'Put in oven (will roast for ~45-50 minutes)',
        'While sweet potatoes start: Begin chopping vegetables',
        'Dice yellow onion (for chicken soup)',
        'Slice carrots and celery into ¼-inch half moons (for chicken soup)',
        'Mince garlic (3 cloves for soup, set aside 6 cloves for pasta)',
        'Thinly slice red onions (for pickling)'
      ],
      completed: false
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: '2:25 PM - CHICKEN SOUP CONTINUES',
      duration: '5 min',
      ingredients: [
        'Sliced onion',
        '3 tbsp olive oil',
        '2 tbsp salt',
        '½ tsp garlic powder',
        '¼ tsp black pepper'
      ],
      equipment: ['Large pot with chicken', 'Spoon'],
      instructions: [
        'By now, chicken water should be boiling; skim foam',
        'Add to soup pot: sliced onion, 3 tbsp olive oil, 2 tbsp salt, ½ tsp garlic powder, ¼ tsp black pepper',
        'Stir, let come back to boil, cover, reduce to medium-low',
        'Set timer for 10 minutes'
      ],
      completed: false
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: '2:30 PM - PICKLED ONIONS & RED CABBAGE PREP',
      duration: '10 min',
      ingredients: [
        'Sliced red onions',
        'Juice of 2 limes',
        'Pinch of salt',
        '¼ cup chopped cilantro',
        '1 medium red cabbage (1¾-2 lbs)',
        'Olive oil'
      ],
      equipment: ['Bowl', 'Second sheet pan', 'Parchment paper', 'Chef\'s knife'],
      instructions: [
        'Make pickled onions: In bowl, combine sliced red onions, juice of 2 limes, pinch of salt, ¼ cup chopped cilantro. Toss and set aside to quick-pickle',
        'Prep red cabbage: Remove tough outer leaves, halve lengthwise through core, cut into 1-1½ inch wedges',
        'Line second sheet pan with parchment, arrange cabbage wedges on sides, drizzle with olive oil, sprinkle with salt'
      ],
      completed: false
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: '2:35 PM - ADD VEGETABLES TO SOUP',
      duration: '5 min',
      ingredients: [
        'Sliced carrots',
        'Sliced celery',
        'Minced garlic (3 cloves)',
        '2 tsp tomato paste'
      ],
      equipment: ['Spoon'],
      instructions: [
        'Timer should go off - add carrots, celery, minced garlic, 2 tsp tomato paste to soup',
        'Stir well, increase heat to high until gentle boil, then cover and reduce to medium-low',
        'Set timer for 30 minutes'
      ],
      completed: false
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: '2:40 PM - CABBAGE IN OVEN & BLACK BEANS START',
      duration: '10 min',
      ingredients: [
        '4 (15-oz) cans black beans (with liquid)',
        '2 (16-oz) jars salsa verde (or 3½ cups)',
        '2 (4-oz) cans chopped green chiles',
        '2 tbsp cocoa powder',
        '2 tsp cumin',
        '2 tsp garlic powder'
      ],
      equipment: ['Large pot', 'Timer'],
      instructions: [
        'Put cabbage sheet pan in oven (on lower rack, sweet potatoes on upper)',
        'Set timer for 20 minutes (to flip cabbage)',
        'Start black bean soup: In large pot, combine 4 cans black beans (with liquid), salsa verde, chopped green chiles, 2 tbsp cocoa powder, 2 tsp cumin, 2 tsp garlic powder',
        'Bring to boil over high heat, cover, reduce to medium, simmer 7-10 minutes'
      ],
      completed: false
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: '2:50 PM - CABBAGE VINAIGRETTE & BEAN MASHING',
      duration: '10 min',
      ingredients: [
        '1 tbsp apple cider vinegar',
        '½ tsp Dijon mustard',
        '½ tsp salt',
        '3 tbsp olive oil',
        '½ cup chopped cilantro'
      ],
      equipment: ['Small bowl', 'Whisk', 'Immersion blender or potato masher'],
      instructions: [
        'Make vinaigrette: Whisk together 1 tbsp apple cider vinegar, ½ tsp Dijon, ½ tsp salt until dissolved; whisk in 3 tbsp olive oil',
        'Check black beans: Test if they flatten easily; if yes, use immersion blender or potato masher to partially blend until thickened to your preference',
        'Stir in ½ cup chopped cilantro, season with salt and pepper, turn off heat'
      ],
      completed: false
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: '3:00 PM - FLIP CABBAGE & CHECK SWEET POTATOES',
      duration: '5 min',
      ingredients: [],
      equipment: ['Tongs or spatula', 'Timer'],
      instructions: [
        'Flip cabbage wedges (timer should go off)',
        'Check sweet potatoes - should be getting tender. If not done, leave another 10 minutes',
        'Set timer for 20 more minutes for cabbage to finish'
      ],
      completed: false
    },
    {
      id: 'step-9',
      stepNumber: 9,
      title: '3:05 PM - CHICKEN SOUP FINAL STEPS',
      duration: '10 min',
      ingredients: [
        '½ cup pastina (Acini di Pepe or orzo, about 4 oz)',
        '½ cup chopped parsley'
      ],
      equipment: ['Bowl', 'Fork for shredding'],
      instructions: [
        'Timer goes off - remove chicken breasts to bowl',
        'Add ½ cup pastina to soup, increase heat to high until gentle boil',
        'Cover, reduce to medium-low, cook according to package time (usually 5-7 minutes)',
        'While pasta cooks: shred chicken with fork',
        'Add shredded chicken and ½ cup chopped parsley to soup, stir, cover, simmer 2 minutes'
      ],
      completed: false
    },
    {
      id: 'step-10',
      stepNumber: 10,
      title: '3:15 PM - SOUP COMPLETE & SWEET POTATOES OUT',
      duration: '5 min',
      ingredients: [],
      equipment: ['Knife', 'Storage containers'],
      instructions: [
        'Remove sweet potatoes from oven (should be tender by now - total ~50 minutes)',
        'Let cool, then cut into cubes/chunks - store half for tacos, half for tempeh salad'
      ],
      notes: ['Chicken soup is complete and ready to cool'],
      completed: false
    },
    {
      id: 'step-11',
      stepNumber: 11,
      title: '3:20 PM - CABBAGE FINISHES & ASSEMBLY FOR DINNER',
      duration: '10 min',
      ingredients: [
        '⅓ cup walnuts',
        '⅔ cup (3 oz) crumbled feta cheese',
        'Lemon zest',
        'Pomegranate seeds (optional)',
        'Fresh herbs (optional)'
      ],
      equipment: ['Dry pan', 'Serving platter'],
      instructions: [
        'Remove cabbage from oven (should be tender and browned - total 40 minutes)',
        'Toast walnuts briefly in dry pan (3-4 minutes)',
        'Arrange cabbage on platter, drizzle with vinaigrette, top with feta, walnuts, lemon zest, pomegranate seeds, fresh herbs',
        'Serve alongside simple grain or bread if desired'
      ],
      notes: ['Tonight\'s Spotlight Dinner: Roasted Red Cabbage with Walnuts and Feta'],
      completed: false
    },
    {
      id: 'step-12',
      stepNumber: 12,
      title: '3:30 PM - COOL & STORE COMPONENTS',
      duration: '15 min',
      ingredients: [
        'Black bean soup',
        'Chicken soup with pastina',
        'Pickled onions',
        'Sweet potato cubes',
        'Extra cilantro'
      ],
      equipment: ['Storage containers', 'Small jar', 'Damp paper towel'],
      instructions: [
        'Let black bean soup cool, then portion into containers:',
        '  - Main container: 6-7 cups (for soup dinners)',
        '  - Separate container: 2-3 cups plain black beans (drained if too liquidy) for tacos',
        'Store chicken soup (will keep 4-5 days)',
        'Store pickled onions in small jar/container',
        'Store sweet potato cubes in containers (separated for tacos vs salad)',
        'Chop extra cilantro, store in damp paper towel in container'
      ],
      completed: false
    },
    {
      id: 'step-13',
      stepNumber: 13,
      title: '3:45 PM - PREP TACO SALSA & CLEAN UP',
      duration: '30 min',
      ingredients: [
        '2 roma tomatoes (optional)',
        '¼ cup chopped cilantro',
        'Lime juice'
      ],
      equipment: ['Small container', 'Knife'],
      instructions: [
        'Simple salsa for tacos: Dice 2 roma tomatoes (if you bought them) or use ½ cup of remaining salsa verde mixed with ¼ cup chopped cilantro and lime juice',
        'Store in small container',
        'Clean up kitchen, put away groceries'
      ],
      notes: ['4:15 PM - DONE! Enjoy Sunday dinner.'],
      completed: false
    }
  ],
  weekMeals: [
    {
      id: 'meal-0',
      day: 'Sunday',
      name: 'Roasted Red Cabbage with Walnuts and Feta',
      assemblyTime: 'Made during prep',
      cookingMethod: 'Roasted',
      components: ['Red cabbage', 'Cabbage vinaigrette'],
      freshIngredients: ['Feta cheese', 'Walnuts', 'Lemon zest', 'Pomegranate seeds', 'Fresh herbs'],
      instructions: [
        'Served warm from oven with vinaigrette, feta, walnuts, pomegranate',
        'Serves: 6-8 as a side, 3-4 as a light main',
        'This is your reward for the prep work - a beautiful, simple dish showcasing fall vegetables'
      ],
      expanded: false
    },
    {
      id: 'meal-1',
      day: 'Monday',
      name: 'Black Bean Soup Bowls',
      assemblyTime: '10 min',
      cookingMethod: 'Stovetop',
      components: ['Spicy black bean soup', 'Pickled onions', 'Chopped cilantro'],
      freshIngredients: ['Sour cream', 'Tortilla chips', 'Shredded cheddar', 'Lime wedges'],
      instructions: [
        'Reheat black bean soup on stovetop (medium heat, 5-7 minutes, stirring occasionally)',
        'Ladle into bowls',
        'Top with: sour cream, pickled onions, fresh cilantro, tortilla chips, shredded cheddar, lime wedges',
        'Serves: 3-4',
        'Notes: This is the spotlight for the spicy black bean soup. Feel free to go heavy on toppings - that\'s where the fun is.'
      ],
      expanded: false
    },
    {
      id: 'meal-2',
      day: 'Tuesday',
      name: 'Pasta Aglio e Olio with Tuna',
      assemblyTime: '20 min',
      cookingMethod: 'Stovetop',
      components: ['Pre-sliced garlic in olive oil', 'Arugula'],
      freshIngredients: ['1 lb spaghetti', '2 cans tuna', '1 small lemon', 'Crushed red pepper', 'Olive oil'],
      instructions: [
        'Bring large pot of salted water to boil',
        'In small bowl: combine tuna with lemon zest and juice of 1 small lemon; set aside',
        'Cook 1 lb spaghetti (1 minute less than package directions for al dente); reserve 2 cups pasta water',
        'Meanwhile, heat ¼ cup olive oil in large skillet over medium-low',
        'Add pre-sliced garlic (6 cloves) and ½ tsp crushed red pepper; cook until fragrant and pale golden, 2-3 minutes',
        'Remove from heat, add reserved pasta water, return to medium-high and simmer until reduced by half (4-6 minutes)',
        'Add drained pasta, toss until al dente and glossy (1-2 minutes)',
        'Remove from heat, stir in tuna and arugula (add in handfuls until wilted)',
        'Season with salt, serve with olive oil drizzle and more red pepper',
        'Serves: 4-6',
        'Notes: The garlic is already sliced and stored in olive oil, so this comes together very quickly. Use oil-packed tuna if you have it.'
      ],
      expanded: false
    },
    {
      id: 'meal-3',
      day: 'Wednesday',
      name: 'Black Bean & Sweet Potato Tacos',
      assemblyTime: '15 min',
      cookingMethod: 'Stovetop',
      components: ['Plain cooked black beans', 'Roasted sweet potato cubes', 'Pickled onions', 'Taco salsa', 'Chopped cilantro'],
      freshIngredients: ['Corn or flour tortillas', 'Shredded cheddar', 'Sour cream', 'Avocado (optional)', 'Hot sauce', 'Lime wedges'],
      instructions: [
        'Warm tortillas in dry skillet or wrapped in foil in 350°F oven',
        'Reheat black beans (stovetop, 3-4 minutes over medium heat)',
        'Warm sweet potato cubes (stovetop in a bit of olive oil or microwave 1-2 minutes)',
        'Assemble tacos: black beans, sweet potato, shredded cheddar, salsa, pickled onions, cilantro, sour cream',
        'Optional: add sliced avocado, hot sauce, lime wedges',
        'Serves: 3-4 (2-3 tacos per person)',
        'Notes: These are vegetarian and filling. The sweet potato adds natural sweetness that balances the spicy beans.'
      ],
      expanded: false
    },
    {
      id: 'meal-4',
      day: 'Thursday',
      name: 'Chicken Soup with Pastina',
      assemblyTime: '8 min',
      cookingMethod: 'Stovetop',
      components: ['Chicken soup with pastina'],
      freshIngredients: ['Grated Parmesan', 'Crusty bread (optional)'],
      instructions: [
        'Reheat chicken soup in pot over medium heat until hot (5-7 minutes, stirring occasionally)',
        'Ladle into bowls',
        'Top generously with grated Parmesan',
        'Serve with crusty bread if desired',
        'Serves: 6',
        'Notes: This is Italian comfort food at its simplest. The pastina makes it incredibly satisfying. Great for when you\'re tired or feeling under the weather.'
      ],
      expanded: false
    },
    {
      id: 'meal-5',
      day: 'Friday',
      name: 'Smoky Tempeh & Roasted Sweet Potato Salad',
      assemblyTime: '20 min',
      cookingMethod: 'Stovetop for tempeh, assemble bowl',
      components: ['Roasted sweet potato cubes', 'Mixed salad greens', 'Pickled onions (optional)'],
      freshIngredients: ['1 package smoky tempeh (8 oz)', '½ cup mixed nuts', 'Apple cider vinegar', 'Dijon mustard', 'Olive oil'],
      instructions: [
        'Cut tempeh into ½-inch cubes',
        'Heat 2 tbsp olive oil in skillet over medium-high',
        'Add tempeh, cook until browned and crispy on all sides (8-10 minutes total)',
        'While tempeh cooks: toast mixed nuts in dry pan (3-4 minutes)',
        'Make quick vinaigrette: whisk 2 tbsp apple cider vinegar, 1 tsp Dijon, pinch salt, then whisk in 4 tbsp olive oil',
        'Assemble salad: bed of mixed greens, roasted sweet potato cubes (reheated in microwave 1 minute), crispy tempeh, toasted nuts',
        'Drizzle with vinaigrette, top with pickled onions if desired',
        'Serves: 2-3',
        'Notes: This is hearty enough for dinner. The smoky tempeh from the package gives great flavor with minimal effort. If you want to make it more substantial, add a grain like farro or quinoa.'
      ],
      expanded: false
    },
    {
      id: 'meal-6',
      day: 'Saturday',
      name: 'Leftover Remix Night',
      assemblyTime: '10-15 min',
      cookingMethod: 'Freestyle',
      components: ['Any remaining components'],
      freshIngredients: ['Whatever looks good in your fridge'],
      instructions: [
        'Black bean quesadillas: Use remaining black beans, cheddar, tortillas. Cook in skillet until crispy, serve with salsa and sour cream',
        'Taco salad: Layer salad greens, black beans, sweet potato, cheese, pickled onions, crush some tortilla chips on top',
        'Chicken soup over rice: If you have leftover rice or want to cook some fresh, serve the soup over it for a different texture',
        'Pasta aglio e olio remix: If you have leftover pasta, reheat and toss with any remaining chicken, vegetables, or make it a cold pasta salad',
        'Notes: This is your creative night. Mix and match components based on what you have left and what sounds good.'
      ],
      expanded: false
    }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Component Inventory After Sunday Prep',
      content: [
        'Chicken soup with pastina (6-7 cups) - Refrigerate 4-5 days',
        'Spicy black bean soup (6-7 cups) - Refrigerate 3-4 days',
        'Plain cooked black beans (2-3 cups) - Refrigerate 4-5 days',
        'Roasted sweet potato cubes (3-4 cups total, divided) - Refrigerate 4-5 days',
        'Pickled red onions with lime & cilantro (1 cup) - Refrigerate 7-10 days',
        'Chopped fresh cilantro (½ cup) - Refrigerate 3-4 days in damp paper towel',
        'Sliced garlic in olive oil (6 cloves) - Refrigerate 3-4 days',
        'Taco salsa - Refrigerate 3-4 days',
        'Cabbage vinaigrette (if extra made) - Refrigerate 7+ days'
      ]
    },
    {
      id: 'note-2',
      title: 'Storage Tips',
      content: [
        'Use larger containers (quart-sized) for soups to make reheating easier',
        'Keep pickled onions in a glass jar if possible - they\'ll last longer and won\'t absorb plastic flavors',
        'Store cilantro upright in a glass with water (like flowers) in the fridge, covered loosely with a plastic bag',
        'Sweet potatoes can dry out, so store in airtight containers',
        'Arugula - keep in original clamshell or container with paper towel (use earlier in week)'
      ]
    },
    {
      id: 'note-3',
      title: 'Leftover Strategy',
      content: [
        'Lunches: Chicken soup and black bean soup are both excellent for lunch. Portion into single-serve containers Sunday night.',
        'Grain bowls: If you want grain bowl lunches, cook a batch of rice, farro, or quinoa Monday night (takes 20-30 minutes) and use throughout the week with any combination of beans, sweet potato, pickled onions, and salad greens.',
        'Taco fixings: Extra black beans, sweet potato, and cheese can become quick quesadillas, nachos, or taco salads.',
        'Double the pickled onions: They last 7-10 days and are great on everything',
        'Toast nuts in batches: While you have the pan out, toast extra nuts for snacking or future salads'
      ]
    },
    {
      id: 'note-4',
      title: 'Flexibility Suggestions',
      content: [
        'Swap arugula: If arugula isn\'t available or you don\'t like the peppery taste, use baby spinach or mixed greens in the pasta',
        'Sweet potato alternatives: Butternut squash or regular white potatoes can substitute, though cooking times may vary',
        'Tempeh substitution: If you can\'t find smoky tempeh, use plain tempeh and add smoked paprika or liquid smoke. Or substitute with crispy tofu or chickpeas',
        'Spice level: The black bean soup is meant to be mildly spicy. Adjust with hot sauce or fresh chiles to your preference',
        'Seasonal notes: Red cabbage and sweet potatoes are fall/winter staples. If pomegranate seeds are unavailable or expensive, substitute with dried cranberries or skip.'
      ]
    },
    {
      id: 'note-5',
      title: 'What to Prep Fresh vs. Use Components',
      content: [
        'Prep fresh (day-of): Pasta (Tuesday), Tempeh frying (Friday), Avocado slicing (whenever using), Fresh herb garnishes (though some pre-chopped cilantro is fine)',
        'Use components: Everything else! That\'s the beauty of this system.',
        'Total Estimated Cooking Time Throughout Week: Sunday prep: 2 hours 15 minutes (includes Sunday dinner), Weeknight cooking: 10-20 minutes per night, Total active cooking time: ~3.5-4 hours for entire week'
      ]
    },
    {
      id: 'note-6',
      title: 'Recipe Rotation Tracking',
      content: [
        'NEW recipes this week: Spicy Black Bean Soup (Ali Slagle, NYT), Pasta Aglio e Olio with Tuna (Sheela Prakash, NYT), Red Cabbage with Walnuts and Feta (Melissa Clark, NYT), Brodo di Pollo con Pastina (Naz Deravian, NYT), Black Bean & Sweet Potato Tacos (custom), Smoky Tempeh & Sweet Potato Salad (custom)',
        'All six recipes are new this week - great variety to start your meal prep system!',
        'Component Reuse: Black beans: Used in soup (Monday) and tacos (Wednesday), Sweet potatoes: Used in tacos (Wednesday) and tempeh salad (Friday), Pickled onions: Used across multiple meals as garnish, Fresh cilantro: Used across multiple dishes throughout week'
      ]
    }
  ]
};