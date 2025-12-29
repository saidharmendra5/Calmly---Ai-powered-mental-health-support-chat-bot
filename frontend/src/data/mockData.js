export const recentChats = [
  { id: 1, title: 'Feeling anxious today', timestamp: '2 hours ago' },
  { id: 2, title: 'Help with stress management', timestamp: 'Yesterday' },
  { id: 3, title: 'Sleep problems', timestamp: '2 days ago' },
  { id: 4, title: 'Work-life balance', timestamp: '3 days ago' },
  { id: 5, title: 'Coping with change', timestamp: '1 week ago' },
];

export const breathingExercises = [
  {
    id: 1,
    name: '4-7-8 Breathing',
    description: 'A calming technique to reduce anxiety and promote relaxation',
    duration: '5 minutes',
    steps: ['Breathe in for 4 seconds', 'Hold for 7 seconds', 'Exhale for 8 seconds', 'Repeat 4 times'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 2,
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to stay calm under pressure',
    duration: '4 minutes',
    steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Exhale for 4 seconds', 'Hold for 4 seconds'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    name: 'Deep Belly Breathing',
    description: 'Activates the relaxation response in your body',
    duration: '3 minutes',
    steps: ['Place hand on belly', 'Breathe deeply into belly', 'Feel belly expand', 'Exhale slowly'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 4,
    name: 'Alternate Nostril',
    description: 'Balances the left and right hemispheres of the brain',
    duration: '5 minutes',
    steps: ['Close right nostril', 'Breathe in left', 'Close left nostril', 'Breathe out right'],
    color: 'from-orange-500 to-red-500'
  },
];

export const bookRecommendations = [
  {
    id: 1,
    title: 'The Body Keeps the Score',
    author: 'Bessel van der Kolk',
    description: 'Understanding how trauma affects the body and mind, with paths to recovery.',
    cover: 'https://images.pexels.com/photos/4132935/pexels-photo-4132935.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Trauma & Healing'
  },
  {
    id: 2,
    title: 'The Mindful Way Through Depression',
    author: 'Mark Williams',
    description: 'Learn to break free from unhappiness using mindfulness techniques.',
    cover: 'https://images.pexels.com/photos/4132936/pexels-photo-4132936.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Depression & Mindfulness'
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'Build better habits and break bad ones for lasting positive change.',
    cover: 'https://images.pexels.com/photos/4132938/pexels-photo-4132938.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Self-Improvement'
  },
  {
    id: 4,
    title: 'The Anxiety and Phobia Workbook',
    author: 'Edmund Bourne',
    description: 'Practical strategies to overcome anxiety, panic, and fears.',
    cover: 'https://images.pexels.com/photos/4132940/pexels-photo-4132940.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Anxiety Management'
  },
  {
    id: 5,
    title: 'Feeling Good',
    author: 'David Burns',
    description: 'The new mood therapy backed by cognitive behavioral techniques.',
    cover: 'https://images.pexels.com/photos/4132944/pexels-photo-4132944.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Cognitive Therapy'
  },
  {
    id: 6,
    title: 'Self-Compassion',
    author: 'Kristin Neff',
    description: 'Learn to be kind to yourself and stop beating yourself up.',
    cover: 'https://images.pexels.com/photos/4132945/pexels-photo-4132945.jpeg?auto=compress&cs=tinysrgb&w=300',
    category: 'Self-Care'
  },
];

export const mockChatMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hello! I\'m here to support you. How are you feeling today?',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    role: 'user',
    content: 'I\'ve been feeling a bit overwhelmed with work lately.',
    timestamp: new Date(Date.now() - 3500000)
  },
  {
    id: 3,
    role: 'assistant',
    content: 'I understand that work stress can be really challenging. Would you like to talk about what specifically is making you feel overwhelmed?',
    timestamp: new Date(Date.now() - 3400000)
  },
];
