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
