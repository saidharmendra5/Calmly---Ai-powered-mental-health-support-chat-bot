export const breathingExercises = [
  {
    id: 1,
    name: '4-7-8 Breathing',
    description: 'Dr. Andrew Weil\'s technique to act as a natural tranquilizer for the nervous system.',
    duration: '5 minutes',
    color: 'from-blue-500 to-cyan-500',
    pattern: [
      { label: 'Breathe In', duration: 4000, scale: 1.25, instruction: 'Inhale through nose' },
      { label: 'Hold', duration: 7000, scale: 1.25, instruction: 'Hold breath' },
      { label: 'Breathe Out', duration: 8000, scale: 0.85, instruction: 'Exhale forcefully' }
    ]
  },
  {
    id: 2,
    name: 'Box Breathing',
    description: 'A Navy SEAL technique for staying calm and focused under high pressure.',
    duration: '4 minutes',
    color: 'from-purple-500 to-pink-500',
    pattern: [
      { label: 'Breathe In', duration: 4000, scale: 1.25, instruction: 'Inhale slowly' },
      { label: 'Hold', duration: 4000, scale: 1.25, instruction: 'Hold' },
      { label: 'Breathe Out', duration: 4000, scale: 0.85, instruction: 'Exhale slowly' },
      { label: 'Hold', duration: 4000, scale: 0.85, instruction: 'Hold empty lungs' }
    ]
  },
  {
    id: 3,
    name: 'Physiological Sigh',
    description: 'A "double inhale" pattern to instantly pop open oxygen sacs and offload stress.',
    duration: '2 minutes',
    color: 'from-rose-500 to-pink-500',
    pattern: [
      { label: 'Breathe In', duration: 2000, scale: 1.15, instruction: 'Inhale deeply' },
      { label: 'Inhale Again', duration: 1000, scale: 1.35, instruction: 'Top up breath' },
      { label: 'Long Exhale', duration: 6000, scale: 0.85, instruction: 'Sigh it out' }
    ]
  },
  {
    id: 4,
    name: 'Coherent Breathing',
    description: 'Balances your autonomic nervous system with a smooth 6-second rhythm.',
    duration: '5 minutes',
    color: 'from-green-500 to-emerald-500',
    pattern: [
      { label: 'Breathe In', duration: 6000, scale: 1.25, instruction: 'Inhale deeply' },
      { label: 'Breathe Out', duration: 6000, scale: 0.85, instruction: 'Exhale fully' }
    ]
  },
  {
    id: 5,
    name: '4-6 Stress Relief',
    description: 'A simple method to activate the parasympathetic system by extending the exhale.',
    duration: '3 minutes',
    color: 'from-amber-500 to-orange-500',
    pattern: [
      { label: 'Breathe In', duration: 4000, scale: 1.25, instruction: 'Inhale 1-2-3-4' },
      { label: 'Breathe Out', duration: 6000, scale: 0.85, instruction: 'Exhale 1-2-3-4-5-6' }
    ]
  },
  {
    id: 6,
    name: '7-11 Breathing',
    description: 'A powerful technique often used to stop panic attacks quickly.',
    duration: '3 minutes',
    color: 'from-indigo-500 to-blue-500',
    pattern: [
      { label: 'Breathe In', duration: 7000, scale: 1.25, instruction: 'Deep belly breath' },
      { label: 'Breathe Out', duration: 11000, scale: 0.85, instruction: 'Very slow exhale' }
    ]
  },
];
export const bookRecommendations = [
  {
    id: 1,
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    description: 'A pioneering researcher transforms our understanding of trauma and offers a bold new paradigm for healing.',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    category: 'Trauma & Healing',
    rating: '4.9',
    link: 'https://www.goodreads.com/book/show/18693771-the-body-keeps-the-score'
  },
  {
    id: 2,
    title: 'Why We Sleep',
    author: 'Matthew Walker',
    description: 'Unlocking the power of sleep and dreams. A vital guide to understanding the vital importance of sleep.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    category: 'Health & Sleep',
    rating: '4.8',
    link: 'https://www.goodreads.com/book/show/34466963-why-we-sleep'
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day.',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    category: 'Self-Improvement',
    rating: '4.9',
    link: 'https://www.goodreads.com/book/show/40121378-atomic-habits'
  },
  {
    id: 4,
    title: 'Man\'s Search for Meaning',
    author: 'Viktor E. Frankl',
    description: 'Psychiatrist Viktor Frankl\'s memoir has riveted generations of readers with its descriptions of life in Nazi death camps and its lessons for spiritual survival.',
    cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800',
    category: 'Philosophy & Resilience',
    rating: '4.7',
    link: 'https://www.goodreads.com/book/show/4069.Man_s_Search_for_Meaning'
  },
  {
    id: 5,
    title: 'Breath',
    author: 'James Nestor',
    description: 'No matter what you eat, how much you exercise, how skinny or young or wise you are, none of it matters if you\'re not breathing properly.',
    cover: 'https://images.unsplash.com/photo-1593366002402-0e4d89690163?auto=format&fit=crop&q=80&w=800',
    category: 'Health & Breathing',
    rating: '4.6',
    link: 'https://www.goodreads.com/book/show/48890486-breath'
  },
  {
    id: 6,
    title: 'Self-Compassion',
    author: 'Kristin Neff',
    description: 'The transformative power of mindful self-compassion. Stop beating yourself up and leave insecurity behind.',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    category: 'Self-Care',
    rating: '4.8',
    link: 'https://www.goodreads.com/book/show/10127008-self-compassion'
  },
  {
    id: 7,
    title: 'Daring Greatly',
    author: 'Brené Brown',
    description: 'How the courage to be vulnerable transforms the way we live, love, parent, and lead.',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
    category: 'Vulnerability',
    rating: '4.7',
    link: 'https://www.goodreads.com/book/show/13588356-daring-greatly'
  },
  {
    id: 8,
    title: 'Lost Connections',
    author: 'Johann Hari',
    description: 'Uncovering the real causes of depression – and the unexpected solutions.',
    cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?auto=format&fit=crop&q=80&w=800',
    category: 'Depression & Society',
    rating: '4.6',
    link: 'https://www.goodreads.com/book/show/34921573-lost-connections'
  },
  {
    id: 9,
    title: 'Quiet',
    author: 'Susan Cain',
    description: 'The power of introverts in a world that can\'t stop talking.',
    cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800',
    category: 'Personality',
    rating: '4.5',
    link: 'https://www.goodreads.com/book/show/8520610-quiet'
  },
  {
    id: 10,
    title: 'Mindset',
    author: 'Carol S. Dweck',
    description: 'The new psychology of success. How we can learn to fulfill our potential.',
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    category: 'Self-Improvement',
    rating: '4.6',
    link: 'https://www.goodreads.com/book/show/40745.Mindset'
  },
];


export const gameRecommendations = [
  {
    id: 1,
    title: 'Weave Silk',
    description: 'A mesmerizing interactive generative art experience. Draw with light and sound to create relaxing, symmetrical patterns.',
    category: 'Creativity & Art',
    image: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?auto=format&fit=crop&q=80&w=800',
    link: 'http://weavesilk.com/',
    tags: ['Visuals', 'Art', 'Calm']
  },
  {
    id: 2,
    title: '2048',
    description: 'The classic tile-sliding puzzle game. Join the numbers and get to the 2048 tile. Excellent for hyper-focus and distraction.',
    category: 'Logic & Focus',
    image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?auto=format&fit=crop&q=80&w=800',
    link: 'https://play2048.co/',
    tags: ['Puzzle', 'Numbers', 'Focus']
  },
  {
    id: 3,
    title: 'Fluid Simulation',
    description: 'A beautiful physics simulation of colorful fluids. Click and drag to swirl the colors. Incredibly satisfying and grounding.',
    category: 'Visual Therapy',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
    link: 'https://paveldogreat.github.io/WebGL-Fluid-Simulation/',
    tags: ['Physics', 'Colors', 'Satisfying']
  },
  {
    id: 4,
    title: 'Quick, Draw!',
    description: 'Can a neural network learn to recognize your doodling? A fun, low-stakes game built by Google AI.',
    category: 'Fun & Distraction',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    link: 'https://quickdraw.withgoogle.com/',
    tags: ['Drawing', 'AI', 'Fun']
  },
  {
    id: 5,
    title: 'Jigsaw Explorer',
    description: 'Premium online jigsaw puzzles. A perfect way to engage the spatial part of your brain and quiet racing thoughts.',
    category: 'Focus',
    image: 'https://images.unsplash.com/photo-1588611910295-d6023cb92f9d?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.jigsawexplorer.com/',
    tags: ['Puzzle', 'Slow', 'Patience']
  },
  {
    id: 6,
    title: 'Wordle (NYT)',
    description: 'The daily word puzzle. Guess the 5-letter word in 6 tries. A gentle daily routine to look forward to.',
    category: 'Word Puzzle',
    image: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?auto=format&fit=crop&q=80&w=800',
    link: 'https://www.nytimes.com/games/wordle/index.html',
    tags: ['Words', 'Daily', 'Routine']
  }
];