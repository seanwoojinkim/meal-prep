import { MealPlan } from '../types';

export const mockPlan: MealPlan = {
  id: 'mock-plan-nov-2025-wk2',
  weekStart: '2025-11-18',
  weekEnd: '2025-11-24',
  philosophy: "This week centers around farro as your primary grain, creating a cohesive base for multiple meals while minimizing ingredient overlap. You'll prep three core component systems: Two farro batches - one richly flavored with mushrooms/wine (for Sunday dinner), one plain (neutral base for bowls); Marinated Tofu (from Bibimbap) - versatile protein for bowls and stir-fries; Miso Butter (from Gnocchi recipe) - flavor bomb that works with everything. The philosophy: cook both farro batches in parallel Sunday afternoon, prep vegetables and proteins, then spend 10-15 minutes assembling dinners through the week. Since asparagus is imported and expensive right now, we'll use green beans and broccolini as seasonal alternatives that work perfectly with the miso butter.",
  spotlightDish: {
    name: 'Farro with Mushrooms',
    description: 'Sunday dinner showcases earthy, rich farro cooked risotto-style with dried porcini and fresh cremini mushrooms, finished with Parmesan and fresh herbs. This is your reward for the prep work.',
    cookTime: '50 minutes'
  },
  components: [
    {
      name: 'Plain Cooked Farro',
      description: '~6 cups plain cooked farro - neutral base for bibimbap, crispy grain dish, miso butter bowls',
      storage: 'Large airtight container, refrigerate 5 days'
    },
    {
      name: 'Mushroom Cooked Farro',
      description: '~4.5 cups richly flavored farro with wine, porcini, rosemary - for Sunday dinner and Italian-style bowls',
      storage: 'Large airtight container, refrigerate 5 days'
    },
    {
      name: 'Marinated Tofu (Cooked)',
      description: '¾ lb tofu stir-fried with sesame-soy-ginger marinade',
      storage: 'Container with marinade, refrigerate 4-5 days'
    },
    {
      name: 'Miso Butter (Double Batch)',
      description: 'Butter smashed with white miso, sherry vinegar, and black pepper',
      storage: 'Small container, refrigerate 1 week+'
    },
    {
      name: 'Bibimbap Dressing',
      description: 'Rice vinegar, sesame oil, garlic, scallions, sesame seeds',
      storage: 'Jar, refrigerate 1 week+'
    },
    {
      name: 'Blanched Green Beans',
      description: '1 lb green beans, blanched and shocked',
      storage: 'Airtight container, refrigerate 4-5 days'
    },
    {
      name: 'Cucumbers with Dressing',
      description: 'Thinly sliced Persian cucumbers tossed with bibimbap dressing',
      storage: 'Container, refrigerate 3-4 days (use early week)'
    },
    {
      name: 'Dressed Carrots',
      description: 'Matchstick carrots tossed with bibimbap dressing',
      storage: 'Container, refrigerate 5 days'
    },
    {
      name: 'Cooked Spinach',
      description: 'Wilted spinach tossed with bibimbap dressing',
      storage: 'Container, refrigerate 3-4 days'
    },
    {
      name: 'Cooked Shiitakes',
      description: 'Stir-fried shiitake mushrooms',
      storage: 'Container, refrigerate 4-5 days'
    },
    {
      name: 'Washed Arugula',
      description: '2 packed cups baby arugula, washed and dried',
      storage: 'Container with paper towel, refrigerate 3-4 days'
    }
  ],
  shoppingList: [
    // Produce
    { id: 'prod-1', name: '1 lb green beans', quantity: 'substitute for asparagus', category: 'Produce', checked: false },
    { id: 'prod-2', name: '1 lb broccolini', quantity: 'for additional vegetable component', category: 'Produce', checked: false },
    { id: 'prod-3', name: '1 lb cremini mushrooms', quantity: 'for farro dish', category: 'Produce', checked: false },
    { id: 'prod-4', name: '6 fresh shiitake mushrooms', quantity: 'for bibimbap components', category: 'Produce', checked: false },
    { id: 'prod-5', name: '4 Persian cucumbers', quantity: 'for crispy grain recipe and bibimbap - buy extra', category: 'Produce', checked: false },
    { id: 'prod-6', name: '6 oz carrots', quantity: '1 large, for bibimbap', category: 'Produce', checked: false },
    { id: 'prod-7', name: '1 large bunch spinach or 1 6-oz bag baby spinach', quantity: 'for bibimbap', category: 'Produce', checked: false },
    { id: 'prod-8', name: '2 packed cups baby arugula', quantity: 'for gnocchi/bowls', category: 'Produce', checked: false },
    { id: 'prod-9', name: '½ cup finely chopped onion', quantity: 'about ½ medium onion, for farro', category: 'Produce', checked: false },
    { id: 'prod-10', name: '2 to 3 scallions', quantity: 'for bibimbap dressing', category: 'Produce', checked: false },
    { id: 'prod-11', name: 'Fresh rosemary', quantity: '2 teaspoons needed', category: 'Produce', checked: false },
    { id: 'prod-12', name: 'Fresh parsley', quantity: '¼ cup needed', category: 'Produce', checked: false },
    { id: 'prod-13', name: '½ cup cilantro, dill, or parsley', quantity: 'for cucumber salad', category: 'Produce', checked: false },
    { id: 'prod-14', name: 'Fresh ginger', quantity: '1 tablespoon minced/grated needed', category: 'Produce', checked: false },
    { id: 'prod-15', name: '4-6 garlic cloves', quantity: 'used across multiple recipes', category: 'Produce', checked: false },
    { id: 'prod-16', name: '2 limes or lemons', quantity: 'for cucumber salad', category: 'Produce', checked: false },

    // Grains & Legumes
    { id: 'grain-1', name: '3.5 cups farro total', quantity: '1.5 cups for mushroom recipe, 2 cups for plain batch - buy 1 lb bag', category: 'Pantry', checked: false },
    { id: 'grain-2', name: '1 (15-oz) can chickpeas', quantity: '', category: 'Pantry', checked: false },
    { id: 'grain-3', name: '1 (16-18 oz) package shelf-stable potato gnocchi', quantity: '', category: 'Pantry', checked: false },

    // Protein & Dairy
    { id: 'protein-1', name: '¾ lb tofu', quantity: 'for bibimbap marinade', category: 'Meat', checked: false },
    { id: 'dairy-1', name: '8-9 oz halloumi', quantity: 'or feta, for crispy grain dish', category: 'Dairy', checked: false },
    { id: 'dairy-2', name: '1-2 oz Parmesan cheese', quantity: 'for farro dish', category: 'Dairy', checked: false },
    { id: 'dairy-3', name: '4 tablespoons unsalted butter', quantity: 'for miso butter', category: 'Dairy', checked: false },
    { id: 'protein-2', name: '4 eggs', quantity: 'optional for bibimbap, but recommended', category: 'Meat', checked: false },

    // Pantry & Specialty Items
    { id: 'pant-1', name: '½ oz dried porcini mushrooms', quantity: '½ cup, for farro', category: 'Pantry', checked: false },
    { id: 'pant-2', name: '1 quart chicken or vegetable stock', quantity: 'for farro', category: 'Pantry', checked: false },
    { id: 'pant-3', name: 'Extra virgin olive oil', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-4', name: 'Vegetable or canola oil', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-5', name: 'Asian sesame oil', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-6', name: 'Soy sauce', quantity: '¼ cup + extra', category: 'Pantry', checked: false },
    { id: 'pant-7', name: 'Mirin', quantity: '2 tablespoons - sweet Japanese rice wine', category: 'Pantry', checked: false },
    { id: 'pant-8', name: 'Rice wine vinegar', quantity: '1 tablespoon + 2 tablespoons', category: 'Pantry', checked: false },
    { id: 'pant-9', name: 'White miso', quantity: '2 tablespoons', category: 'Pantry', checked: false },
    { id: 'pant-10', name: 'Sherry vinegar', quantity: '2 teaspoons', category: 'Pantry', checked: false },
    { id: 'pant-11', name: 'Dry white wine', quantity: '½ cup for farro', category: 'Pantry', checked: false },
    { id: 'pant-12', name: 'Toasted sesame seeds', quantity: '1 tablespoon + extra for garnish', category: 'Pantry', checked: false },
    { id: 'pant-13', name: 'Ground cumin or coriander', quantity: '1 teaspoon', category: 'Pantry', checked: false },
    { id: 'pant-14', name: 'Sugar', quantity: '1 teaspoon', category: 'Pantry', checked: false },
    { id: 'pant-15', name: 'Black pepper', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-16', name: 'Salt', quantity: '', category: 'Pantry', checked: false },
    { id: 'pant-17', name: 'Korean red pepper paste (kochujang)', quantity: 'optional but adds great flavor', category: 'Pantry', checked: false },
    { id: 'pant-18', name: '2 sheets nori seaweed', quantity: 'optional for bibimbap', category: 'Pantry', checked: false },
  ],
  prepSteps: [
    {
      id: 'step-1',
      stepNumber: 1,
      title: '1:45 PM - PREP START - Initial Soaking',
      duration: '5 min',
      ingredients: [
        '1.5 cups farro (for mushroom recipe)',
        '2 cups farro (for plain batch)',
        '½ oz dried porcini mushrooms (½ cup)',
        '2 cups boiling water'
      ],
      equipment: ['2 large bowls', 'Pyrex measuring cup'],
      instructions: [
        'Place 1.5 cups farro in bowl, cover with hot water by 1 inch - let soak (for mushroom recipe)',
        'Place 2 cups farro in separate bowl, cover with hot water by 1 inch - let soak (for plain batch)',
        'Place dried porcini mushrooms in Pyrex measuring cup with 2 cups boiling water - let sit 30 min'
      ],
      completed: false
    },
    {
      id: 'step-2',
      stepNumber: 2,
      title: '1:50 PM - TOFU MARINADE',
      duration: '10 min',
      ingredients: [
        '¾ lb tofu',
        '1 tbsp sesame oil',
        '¼ cup soy sauce',
        '2 tbsp mirin',
        '1 tbsp rice vinegar',
        '1 tbsp grated ginger',
        '1 tsp sugar'
      ],
      equipment: ['Whisk', 'Container'],
      instructions: [
        'Whisk together: 1 tbsp sesame oil, ¼ cup soy sauce, 2 tbsp mirin, 1 tbsp rice vinegar, 1 tbsp grated ginger, 1 tsp sugar',
        'Drain tofu, pat dry, cut into ½-inch dominoes',
        'Add tofu to marinade, toss gently, refrigerate (will marinate while you do other prep)'
      ],
      completed: false
    },
    {
      id: 'step-3',
      stepNumber: 3,
      title: '2:00 PM - START PLAIN FARRO',
      duration: '5 min active, then 30-40 min simmer',
      ingredients: [
        '2 cups soaked plain farro (drained)',
        '6 cups water or plain vegetable stock',
        '1 tsp salt'
      ],
      equipment: ['Large pot'],
      instructions: [
        'Drain the 2 cups soaked plain farro',
        'In large pot: bring 6 cups water (or plain vegetable stock) to boil',
        'Add 1 tsp salt',
        'Add drained farro, return to boil',
        'Reduce heat to gentle simmer, cover',
        'Set timer for 30 minutes (will check at 30 min, may need up to 40 min total)',
        'This batch should yield ~6 cups cooked plain farro for the week'
      ],
      completed: false
    },
    {
      id: 'step-4',
      stepNumber: 4,
      title: '2:05 PM - VEGETABLE PREP',
      duration: '25 min',
      ingredients: [
        '4-6 garlic cloves',
        '2-3 scallions',
        '½ cup onion',
        '¼ cup parsley',
        '2 tsp fresh rosemary',
        '1 lb green beans',
        '1 lb broccolini',
        'Persian cucumbers',
        '6 oz carrots',
        '6 fresh shiitake mushrooms',
        '1 lb cremini mushrooms',
        'Baby arugula'
      ],
      equipment: ['Cutting board', 'Chef\'s knife', 'Colander'],
      instructions: [
        'Mince/purée 4-6 garlic cloves total (divide: 2 for farro, 2 for bibimbap dressing)',
        'Mince 2-3 scallions (for bibimbap dressing)',
        'Finely chop ½ cup onion (for farro)',
        'Chop ¼ cup parsley (for farro)',
        'Chop 2 tsp fresh rosemary (for farro)',
        'Trim and cut 1 lb green beans into ½-inch lengths',
        'Trim broccolini (keep whole or halve lengthwise)',
        'Slice Persian cucumbers thinly (for cucumber salad component)',
        'Cut carrots into matchsticks or grate (for bibimbap)',
        'Stem and slice shiitake mushrooms',
        'Slice cremini mushrooms',
        'Wash and spin dry arugula, refrigerate',
        'Toss sliced cucumbers with salt in colander - let sit 15-30 min while you continue'
      ],
      completed: false
    },
    {
      id: 'step-5',
      stepNumber: 5,
      title: '2:30 PM - START MUSHROOM FARRO',
      duration: '15 min active, then 50 min simmer',
      ingredients: [
        '1.5 cups soaked farro (drained, for mushroom recipe)',
        'Reconstituted porcini mushrooms',
        'Mushroom liquid',
        'Stock (to make 6 cups total with mushroom liquid)',
        '2 tbsp olive oil',
        'Chopped onion',
        'Sliced cremini mushrooms',
        'Salt',
        '2 cloves garlic (minced)',
        '2 tsp rosemary',
        '½ cup white wine'
      ],
      equipment: ['Large heavy nonstick skillet', 'Saucepan', 'Strainer with cheesecloth/paper towel'],
      instructions: [
        'Strain dried porcini through cheesecloth/paper towel-lined strainer over bowl',
        'Squeeze mushrooms, rinse to remove grit, chop coarsely',
        'Add mushroom liquid to stock (should have 6 cups total)',
        'Bring stock to simmer in saucepan, season with salt',
        'Drain soaked farro',
        'Heat 2 tbsp olive oil in large heavy nonstick skillet over medium heat',
        'Add onion, cook 3 min stirring until softened',
        'Add cremini mushrooms, cook until they sweat and soften',
        'Add salt, garlic (2 cloves), rosemary - cook 5 min until mushrooms tender',
        'Add drained farro + reconstituted porcini, stir until grains crackle (2 min)',
        'Add ½ cup white wine, cook until absorbed',
        'Add 5 cups of the mushroom stock (save 1 cup for adjusting later)',
        'Bring to simmer, cover and reduce to gentle simmer - set timer for 50 minutes',
        'This batch yields ~4.5 cups cooked mushroom farro'
      ],
      notes: ['Note: Both farro batches are now cooking in parallel. Plain farro finishes around 3:00-3:10 PM, mushroom farro finishes around 3:20 PM.'],
      completed: false
    },
    {
      id: 'step-6',
      stepNumber: 6,
      title: '2:45 PM - MAKE MISO BUTTER & BIBIMBAP DRESSING',
      duration: '10 min',
      ingredients: [
        '8 tbsp softened butter',
        '4 tbsp white miso',
        '4 tsp sherry vinegar',
        'Black pepper',
        '2 tbsp rice vinegar',
        '1 tbsp sesame oil',
        '2 garlic cloves (minced)',
        '2-3 scallions (minced)',
        '1 tbsp sesame seeds',
        'Salt',
        'Korean red pepper paste (optional)'
      ],
      equipment: ['Small bowl', 'Jar'],
      instructions: [
        'Miso butter (make double batch for week): In small bowl, smash together 8 tbsp softened butter, 4 tbsp white miso, 4 tsp sherry vinegar, black pepper',
        'Store in container, refrigerate',
        'Bibimbap dressing: Mix together 2 tbsp rice vinegar, 1 tbsp sesame oil, 2 garlic cloves (minced), 2-3 scallions (minced), 1 tbsp sesame seeds, salt to taste',
        'Optional: add Korean red pepper paste to taste',
        'Store in jar, refrigerate'
      ],
      completed: false
    },
    {
      id: 'step-7',
      stepNumber: 7,
      title: '2:55 PM - PREP BIBIMBAP VEGETABLES',
      duration: '15 min',
      ingredients: [
        'Salted cucumbers',
        'Bibimbap dressing',
        'Matchstick/grated carrots',
        'Spinach',
        'Shiitake mushrooms',
        '1 tbsp canola oil'
      ],
      equipment: ['Large pan', 'Wok/skillet', 'Storage containers'],
      instructions: [
        'Cucumber salad: Rinse salted cucumbers, squeeze dry. Toss with 2 tsp of the bibimbap dressing. Store in container, refrigerate',
        'Carrots: Toss matchstick/grated carrots with 1 tbsp bibimbap dressing. Store in container, refrigerate',
        'Spinach: Wash spinach, wilt in large pan over high heat (2-3 min). Press out excess water, toss with 1 tbsp bibimbap dressing. Store in container, refrigerate',
        'Shiitakes: Heat wok/skillet with 1 tbsp canola oil over medium-high. Add shiitakes, let sit 1 min, then stir-fry 1-2 min until tender. Store in container, refrigerate'
      ],
      completed: false
    },
    {
      id: 'step-8',
      stepNumber: 8,
      title: '3:10 PM - CHECK & FINISH PLAIN FARRO',
      duration: '5 min',
      ingredients: [
        'Plain farro (cooking)'
      ],
      equipment: ['Colander', 'Large container'],
      instructions: [
        'Check at 30 min mark - farro should be tender with slight chew',
        'If not tender, continue cooking and check every 5 min (up to 40 min total)',
        'When done, drain any excess liquid',
        'Let cool slightly, then store ~6 cups plain farro in large container, refrigerate',
        'This is your neutral base for bibimbap, crispy grain dish, and various bowls throughout the week'
      ],
      completed: false
    },
    {
      id: 'step-9',
      stepNumber: 9,
      title: '3:15 PM - BLANCH GREEN BEANS',
      duration: '10 min',
      ingredients: [
        '1 lb green beans (cut into ½-inch lengths)',
        'Salt'
      ],
      equipment: ['Large pot', 'Ice water bowl', 'Colander'],
      instructions: [
        'Bring large pot of salted water to boil',
        'Blanch green beans 2-3 min until bright green and crisp-tender',
        'Drain, shock in ice water, drain again thoroughly',
        'Pat dry, store in container, refrigerate'
      ],
      completed: false
    },
    {
      id: 'step-10',
      stepNumber: 10,
      title: '3:25 PM - COOK TOFU',
      duration: '10 min',
      ingredients: [
        'Marinated tofu',
        '1 tbsp canola oil'
      ],
      equipment: ['Wok/skillet'],
      instructions: [
        'Heat wok/skillet over medium-high with 1 tbsp canola oil',
        'Remove tofu from marinade (save marinade)',
        'Stir-fry tofu 3-5 min until lightly browned',
        'Store in container with 2-3 tbsp reserved marinade, refrigerate'
      ],
      completed: false
    },
    {
      id: 'step-11',
      stepNumber: 11,
      title: '3:30 PM - FINISH MUSHROOM FARRO',
      duration: '10 min',
      ingredients: [
        'Mushroom farro (cooking)',
        'Reserved mushroom stock (1 cup if needed)',
        'Parmesan',
        'Parsley',
        'Black pepper'
      ],
      equipment: ['Large skillet'],
      instructions: [
        'After 50 min, check mushroom farro tenderness - some grains should be splaying',
        'Remove lid, stir vigorously',
        'Taste and adjust seasoning',
        'If too much liquid: raise heat and cook down to sauce consistency',
        'If too dry: add remaining 1 cup mushroom stock',
        'Stir in Parmesan, parsley, pepper',
        'Keep all ~4.5 cups of this mushroom farro for Sunday dinner and one more meal this week'
      ],
      completed: false
    },
    {
      id: 'step-12',
      stepNumber: 12,
      title: '3:40 PM - SUNDAY DINNER: FARRO WITH MUSHROOMS',
      duration: '5 min',
      ingredients: [],
      equipment: ['Serving plates'],
      instructions: [
        'Serve the mushroom farro hot. This is your spotlight Sunday dinner - the earthy, rich flavors with wine and porcini are perfect eaten immediately.',
        "You'll have enough for Sunday dinner plus leftovers for one more meal (see Thursday option in meal guide)."
      ],
      notes: ['Optional Sunday evening task (10 min): Roast broccolini - toss with olive oil, salt, pepper; roast at 425°F for 12-15 min until crispy. OR save this for a weeknight when you want fresh vegetables'],
      completed: false
    },
    {
      id: 'step-13',
      stepNumber: 13,
      title: '4:00 PM - DONE',
      duration: '0 min',
      ingredients: [],
      equipment: [],
      instructions: [
        'Your fridge now contains:',
        '- 6 cups plain farro (neutral base for multiple meals)',
        '- 4.5 cups mushroom farro (richly flavored for Italian-style dishes)',
        '- Marinated tofu (cooked)',
        '- Miso butter (double batch)',
        '- Bibimbap dressing',
        '- Blanched green beans',
        '- Cucumbers with dressing',
        '- Dressed carrots',
        '- Cooked spinach',
        '- Cooked shiitakes',
        '- Arugula (washed)'
      ],
      completed: false
    }
  ],
  weekMeals: [
    {
      id: 'meal-0',
      day: 'Sunday',
      name: 'Farro with Mushrooms',
      assemblyTime: 'Made during prep',
      cookingMethod: 'Stovetop (risotto-style)',
      components: ['Farro', 'Dried porcini mushrooms', 'Fresh cremini mushrooms'],
      freshIngredients: ['Parmesan', 'Fresh parsley', 'Fresh rosemary'],
      instructions: [
        'Served warm from the stove with Parmesan, parsley, and black pepper',
        'Serves: 4-6',
        'This is your reward for the prep work - a beautiful, earthy dish showcasing fall grains and mushrooms'
      ],
      expanded: false
    },
    {
      id: 'meal-1',
      day: 'Monday',
      name: 'Miso Butter Gnocchi Bowl',
      assemblyTime: '15 min',
      cookingMethod: 'Stovetop',
      components: ['Blanched green beans', 'Miso butter', 'Arugula'],
      freshIngredients: ['Gnocchi (shelf-stable package)'],
      instructions: [
        'Heat 1 tbsp oil in large nonstick skillet over medium-high',
        'Add gnocchi in even layer, cover, cook undisturbed 2-4 min until golden underneath',
        'Add green beans and pinch of salt, cook stirring 2-3 min',
        'Turn off heat, add half the miso butter in spoonfuls, stir until melted and glossy',
        'Stir in arugula until wilted',
        'Serve immediately',
        'Serves: 2-3'
      ],
      expanded: false
    },
    {
      id: 'meal-2',
      day: 'Tuesday',
      name: 'Bibimbap-Style Grain Bowl',
      assemblyTime: '12 min',
      cookingMethod: 'Stovetop',
      components: ['Plain farro', 'Tofu', 'Cucumbers', 'Carrots', 'Spinach', 'Shiitakes'],
      freshIngredients: ['Eggs', 'Kochujang (optional)', 'Sesame seeds'],
      instructions: [
        'Reheat 2 cups plain farro in microwave or in skillet with splash of water',
        'Fry 2 eggs in nonstick skillet until whites set, yolks runny',
        'Heat bowls, place warm farro in center',
        'Arrange around farro: tofu, cucumbers, carrots, spinach, shiitakes (can use cold or quickly warm in microwave)',
        'Top with fried egg, dollop of kochujang (optional), sesame seeds',
        'Break egg into rice, mix everything together',
        'Serves: 2'
      ],
      expanded: false
    },
    {
      id: 'meal-3',
      day: 'Wednesday',
      name: 'Crispy Grains & Halloumi with Smashed Cucumbers',
      assemblyTime: '18 min',
      cookingMethod: 'Broiler',
      components: ['Plain farro (2 cups)', 'Cucumbers'],
      freshIngredients: ['Halloumi (8-9 oz)', 'Chickpeas (canned, drained)', 'Lime/lemon', 'Cilantro/herbs', 'Cumin', 'Olive oil'],
      instructions: [
        'Heat broiler on high, rack 6 inches from heat',
        'On sheet pan: spread 2 cups plain farro, torn halloumi (8-9 oz), drained chickpeas',
        'Pat everything dry with paper towel',
        'Add 3 tbsp olive oil, 1 tsp cumin, salt, pepper - toss to coat',
        'Broil 7-10 min, shaking pan occasionally, until chickpeas pop and everything is golden',
        'Meanwhile, prepare cucumber topping: smash remaining cucumbers, chop into ½-inch pieces, add to bowl with finely grated lime/lemon zest (1 tsp), 3 tbsp citrus juice, cilantro/herbs, 1 tbsp olive oil',
        'Top crispy grain mixture with cucumber salad and juices',
        'Serves: 2-3'
      ],
      expanded: false
    },
    {
      id: 'meal-4',
      day: 'Thursday',
      name: 'Farro Bowl with Miso-Glazed Vegetables',
      assemblyTime: '15 min',
      cookingMethod: 'Stovetop + oven',
      components: ['Mushroom farro OR plain farro + tofu', 'Miso butter'],
      freshIngredients: ['Broccolini', 'Optional: fried egg, arugula, sesame seeds'],
      instructions: [
        'Option A - Use mushroom farro (Italian-style):',
        'Preheat oven to 425°F',
        'Toss broccolini with 1 tbsp oil, salt, pepper; roast 12-15 min',
        'Meanwhile, reheat 2 cups mushroom farro in skillet with splash of stock',
        'Assemble bowls: mushroom farro base, roasted broccolini',
        'Top with knob of butter or spoonful of miso butter, Parmesan, black pepper',
        'Optional: fried egg, arugula',
        '',
        'Option B - Use plain farro (Asian-style):',
        'Preheat oven to 425°F',
        'Toss broccolini with 1 tbsp oil, salt, pepper; roast 12-15 min',
        'Meanwhile, reheat 2 cups plain farro in skillet with splash of water',
        'Warm tofu in same skillet',
        'Assemble bowls: plain farro base, tofu, roasted broccolini',
        'Top with spoonful of miso butter, let melt over hot vegetables',
        'Optional: fried egg, arugula, sesame seeds',
        'Serves: 2'
      ],
      expanded: false
    },
    {
      id: 'meal-5',
      day: 'Friday',
      name: 'Quick Mushroom Farro Bowl',
      assemblyTime: '10 min',
      cookingMethod: 'Stovetop',
      components: ['Plain farro OR mushroom farro', 'Green beans', 'Miso butter or Parmesan'],
      freshIngredients: ['Extra cremini mushrooms (optional)', 'Arugula', 'Optional: fried egg'],
      instructions: [
        'Heat 1 tbsp oil in skillet over medium-high',
        'If you have extra cremini mushrooms: slice and sauté 3-4 min until golden',
        'Add 2 cups plain farro (or mushroom farro if you prefer), green beans, splash of stock or water',
        'Warm through, 3-4 min',
        'Finish with spoonful of miso butter or knob of regular butter, Parmesan, black pepper',
        'Top with arugula, optional fried egg',
        'Serves: 2'
      ],
      expanded: false
    },
    {
      id: 'meal-6',
      day: 'Saturday',
      name: 'Flex Night',
      assemblyTime: '10-15 min',
      cookingMethod: 'Freestyle',
      components: ['Any remaining components'],
      freshIngredients: ['Whatever looks good in your fridge'],
      instructions: [
        'Option 1: Gnocchi + Greens Variation - Pan-fry gnocchi, toss with any remaining vegetables, miso butter, top with fried egg',
        'Option 2: Grain Bowl Remix - Use remaining plain or mushroom farro with any leftover tofu, vegetables, and dressings - mix and match for whatever sounds good',
        'Option 3: Order in or eat out - you\'ve earned it!',
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
        'Plain cooked farro (~6 cups) - Large airtight container, 5 days - use for bibimbap, crispy grain dish, miso butter bowls',
        'Mushroom cooked farro (~4.5 cups) - Large airtight container, 5 days - use for Sunday dinner, Italian-style bowls, simple butter/Parmesan meals',
        'Marinated tofu (cooked, ¾ lb) - Container with marinade, 4-5 days',
        'Eggs (4, raw) - For fresh frying, 2+ weeks',
        'Halloumi (8-9 oz, raw) - Original packaging, 1 week+',
        'Blanched green beans (1 lb) - Airtight container, 4-5 days',
        'Cucumbers with dressing - Container, 3-4 days (best used early week)',
        'Dressed carrots - Container, 5 days',
        'Cooked spinach - Container, 3-4 days',
        'Cooked shiitakes - Container, 4-5 days',
        'Arugula (washed) - Container with paper towel, 3-4 days',
        'Raw broccolini (if not roasted Sunday) - Produce bag, 5 days',
        'Miso butter (double batch) - Small container, 1 week+',
        'Bibimbap dressing (remaining) - Jar, 1 week+',
        'Chickpeas (canned, drained) - Store in can or container, 3-4 days'
      ]
    },
    {
      id: 'note-2',
      title: 'Component Longevity Guide',
      content: [
        'Use early in week (Days 1-3): Cucumbers with dressing, Arugula, Cooked spinach',
        'Use any time (Days 1-5): Plain farro, Mushroom farro, Tofu, Green beans, Carrots, Shiitakes, Miso butter, Bibimbap dressing',
        'Pantry stable: Gnocchi, Chickpeas (canned), Halloumi (stays fresh wrapped)'
      ]
    },
    {
      id: 'note-3',
      title: 'Leftover Strategy',
      content: [
        'Lunches: Pack plain farro bowls with any combination of tofu, vegetables, and dressings. They reheat well or can be eaten cold as grain salads. The mushroom farro is perfect reheated with butter and Parmesan.',
        'Breakfast: Fry an egg, serve over warm plain farro with arugula and miso butter',
        'Snacks: Crispy chickpeas from Wednesday\'s recipe are great cold',
        'Mixing batches: While the two farro batches have distinct flavors, you can combine them if you\'re running low and don\'t mind the mixed flavor profile',
        'The miso butter is incredibly versatile - use it on any grain, vegetable, or protein combination',
        'If you get tired of farro, swap in rice or other cooked grains mid-week',
        'The bibimbap-style bowl can accommodate any vegetables you have on hand',
        'Fried eggs elevate any meal and cook in 3 minutes'
      ]
    },
    {
      id: 'note-4',
      title: 'Fresh vs. Prepped Components',
      content: [
        'Prep fresh for best results: Eggs (fry right before serving), Gnocchi (cook once, don\'t reheat), Halloumi (crisp right before eating), Delicate herbs for garnish',
        'Use prepped components: All grains, vegetables, tofu - they reheat beautifully. Sauces and dressings - flavors deepen over time. Blanched vegetables - just need quick reheating.'
      ]
    },
    {
      id: 'note-5',
      title: 'Vegetable Substitution Notes',
      content: [
        'Green beans work perfectly with miso butter - they\'re sturdy, in season, and have great texture',
        'Broccolini roasts beautifully and pairs well with Asian flavors',
        'If you want asparagus anyway: it\'ll work in any of these recipes, just know you\'re paying a premium',
        'Other great fall/winter alternatives: Brussels sprouts (halved and roasted), lacinato kale (massaged), snap peas, or even roasted delicata squash',
        'The miso butter is the real MVP here - it makes any vegetable taste incredible'
      ]
    },
    {
      id: 'note-6',
      title: 'Recipe Rotation Tracking',
      content: [
        'NEW this week: Farro with Mushrooms (Sunday spotlight dinner), Bibimbap-style bowl (Tuesday), Crispy Grains & Halloumi (Wednesday), Skillet Gnocchi with Miso Butter (Monday, adapted with green beans)',
        'Repeat/familiar: None - this is a fresh rotation'
      ]
    },
    {
      id: 'note-7',
      title: 'Time-Saving Tips for Next Time',
      content: [
        'Farro batch cooking: The two-batch approach (plain + flavored) gives you maximum flexibility without flavor conflicts. Next time you prep, consider cooking 6+ cups of plain farro and freezing half in 2-cup portions. Plain farro freezes beautifully and thaws quickly.',
        'Skip the mushroom batch: If you want to simplify further, you could skip the mushroom farro entirely and just make the plain batch, using it for all meals. You\'d lose Sunday\'s spotlight dinner but gain simplicity.',
        'Miso butter: The double batch will last beyond this week. You can keep making it in quantity.',
        'Tofu marinade: This same marinade works for tempeh, mushrooms, or even vegetables. Make extra and keep in the fridge.'
      ]
    }
  ]
};
