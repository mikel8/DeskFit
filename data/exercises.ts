import { Exercise } from '@/types';

export const exercises: Exercise[] = [
  {
    id: 'neck-rolls',
    name: 'Neck Rolls',
    duration: 30,
    description: 'Gentle circular motion to relieve neck tension',
    targetMuscles: ['neck', 'upper trapezius'],
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Sit or stand with your spine straight',
      'Slowly drop your chin to your chest',
      'Gently roll your head to the right',
      'Continue the circle, bringing your head back',
      'Complete the circle to the left',
      'Return to starting position'
    ],
    benefits: ['Reduces neck stiffness', 'Improves circulation', 'Relieves tension headaches'],
    category: 'stretch',
    imageUrl: 'https://images.pexels.com/photos/6110659/pexels-photo-6110659.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'shoulder-shrugs',
    name: 'Shoulder Shrugs',
    duration: 20,
    description: 'Simple movement to release shoulder tension',
    targetMuscles: ['shoulders', 'upper back'],
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Sit or stand with arms at your sides',
      'Lift your shoulders towards your ears',
      'Hold for 2-3 seconds',
      'Slowly lower your shoulders',
      'Repeat the movement smoothly'
    ],
    benefits: ['Releases shoulder tension', 'Improves posture', 'Reduces stress'],
    category: 'stretch',
    imageUrl: 'https://images.pexels.com/photos/6111367/pexels-photo-6111367.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    duration: 45,
    description: 'Gentle twist to mobilize the spine',
    targetMuscles: ['spine', 'obliques', 'lower back'],
    difficulty: 'beginner',
    equipment: ['chair'],
    instructions: [
      'Sit tall in your chair with feet flat on floor',
      'Place your right hand on the back of your chair',
      'Place your left hand on your right knee',
      'Gently twist your torso to the right',
      'Hold and breathe deeply',
      'Return to center and repeat on the other side'
    ],
    benefits: ['Improves spinal mobility', 'Reduces lower back pain', 'Aids digestion'],
    category: 'stretch',
    imageUrl: 'https://images.pexels.com/photos/6111021/pexels-photo-6111021.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'cat-cow-stretch',
    name: 'Cat-Cow Stretch',
    duration: 40,
    description: 'Dynamic movement for spinal flexibility',
    targetMuscles: ['spine', 'core', 'shoulders'],
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Start on hands and knees in tabletop position',
      'Arch your back and look up (Cow position)',
      'Round your spine and tuck your chin (Cat position)',
      'Move slowly between positions',
      'Focus on your breathing'
    ],
    benefits: ['Improves spinal flexibility', 'Strengthens core', 'Reduces back pain'],
    category: 'mobility',
    imageUrl: 'https://images.pexels.com/photos/6111024/pexels-photo-6111024.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    duration: 30,
    description: 'Circular movements to loosen tight hips',
    targetMuscles: ['hips', 'glutes', 'core'],
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Stand with feet hip-width apart',
      'Place hands on your hips',
      'Make large circles with your hips',
      'Complete 5 circles in each direction',
      'Keep your core engaged'
    ],
    benefits: ['Improves hip mobility', 'Reduces hip flexor tightness', 'Enhances balance'],
    category: 'mobility',
    imageUrl: 'https://images.pexels.com/photos/6111712/pexels-photo-6111712.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'desk-push-ups',
    name: 'Desk Push-ups',
    duration: 30,
    description: 'Modified push-ups using your desk',
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    difficulty: 'beginner',
    equipment: ['desk'],
    instructions: [
      'Stand arm\'s length from your desk',
      'Place hands on edge of desk, shoulder-width apart',
      'Keep your body in a straight line',
      'Lower your chest toward the desk',
      'Push back to starting position'
    ],
    benefits: ['Builds upper body strength', 'Improves posture', 'Convenient desk exercise'],
    category: 'strength',
    imageUrl: 'https://images.pexels.com/photos/6111490/pexels-photo-6111490.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'ankle-rolls',
    name: 'Ankle Rolls',
    duration: 20,
    description: 'Circular movements to improve ankle mobility',
    targetMuscles: ['ankles', 'calves'],
    difficulty: 'beginner',
    equipment: [],
    instructions: [
      'Sit in your chair with one foot lifted',
      'Make slow circles with your ankle',
      'Complete 5 circles in each direction',
      'Switch to the other foot',
      'Keep movements controlled'
    ],
    benefits: ['Improves circulation', 'Reduces ankle stiffness', 'Prevents swelling'],
    category: 'mobility',
    imageUrl: 'https://images.pexels.com/photos/6111553/pexels-photo-6111553.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'chest-stretch',
    name: 'Doorway Chest Stretch',
    duration: 30,
    description: 'Open up tight chest muscles from computer work',
    targetMuscles: ['chest', 'shoulders'],
    difficulty: 'beginner',
    equipment: ['doorway'],
    instructions: [
      'Stand in a doorway with your arm against the frame',
      'Step forward with one foot',
      'Feel the stretch across your chest',
      'Hold for 15 seconds on each side',
      'Breathe deeply during the stretch'
    ],
    benefits: ['Counteracts forward head posture', 'Opens chest muscles', 'Improves breathing'],
    category: 'stretch',
    imageUrl: 'https://images.pexels.com/photos/6111718/pexels-photo-6111718.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'wall-slides',
    name: 'Wall Slides',
    duration: 45,
    description: 'Strengthen upper back and improve posture',
    targetMuscles: ['upper back', 'shoulders', 'core'],
    difficulty: 'beginner',
    equipment: ['wall'],
    instructions: [
      'Stand with your back against a wall',
      'Raise your arms to form a \'W\' shape',
      'Slide your arms up the wall',
      'Lower back to starting position',
      'Keep your back pressed to the wall'
    ],
    benefits: ['Strengthens upper back', 'Improves posture', 'Reduces shoulder pain'],
    category: 'strength',
    imageUrl: 'https://images.pexels.com/photos/6111025/pexels-photo-6111025.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 'leg-extensions',
    name: 'Seated Leg Extensions',
    duration: 30,
    description: 'Strengthen legs while seated at your desk',
    targetMuscles: ['quadriceps', 'core'],
    difficulty: 'beginner',
    equipment: ['chair'],
    instructions: [
      'Sit tall in your chair',
      'Extend one leg straight out',
      'Hold for 2-3 seconds',
      'Lower slowly without touching the ground',
      'Complete 8-10 reps per leg'
    ],
    benefits: ['Strengthens leg muscles', 'Improves circulation', 'Combats sitting effects'],
    category: 'strength',
    imageUrl: 'https://images.pexels.com/photos/6111712/pexels-photo-6111712.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];