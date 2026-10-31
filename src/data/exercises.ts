// ── ไฟล์นี้ copy มาจาก web version โดยตรง ไม่ต้องแก้อะไรเลย ──

export interface Exercise {
  id: string;
  name: string;
  nameTh: string;
  muscleId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  sets: string;
  reps: string;
  calories: number;
  muscles: string[];
  description: string;
  steps: string[];
  tips: string[];
  image: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  nameTh: string;
  exerciseCount: number;
  image: string;
  color: string;
}

export const muscleGroups: MuscleGroup[] = [
  {
    id: 'chest', name: 'Chest', nameTh: 'อก', exerciseCount: 3,
    image: 'https://images.unsplash.com/photo-1710746904729-f3ad9f682bb9?w=800&q=80',
    color: '#3a3a3a',
  },
  {
    id: 'back', name: 'Back', nameTh: 'หลัง', exerciseCount: 2,
    image: 'https://images.unsplash.com/photo-1630415188550-9e454489ce3a?w=800&q=80',
    color: '#2a2a2a',
  },
  {
    id: 'legs', name: 'Legs', nameTh: 'ขา', exerciseCount: 2,
    image: 'https://images.unsplash.com/photo-1675910518330-1843b4d03de1?w=800&q=80',
    color: '#1a1a1a',
  },
  {
    id: 'shoulders', name: 'Shoulders', nameTh: 'ไหล่', exerciseCount: 2,
    image: 'https://images.unsplash.com/photo-1597452329152-52f9eee96576?w=800&q=80',
    color: '#252525',
  },
  {
    id: 'arms', name: 'Arms', nameTh: 'แขน', exerciseCount: 2,
    image: 'https://images.unsplash.com/photo-1590723267709-afa6a4cae55a?w=800&q=80',
    color: '#303030',
  },
  {
    id: 'core', name: 'Core', nameTh: 'แกนกลาง', exerciseCount: 2,
    image: 'https://images.unsplash.com/photo-1630225760711-ac8eaa0c8947?w=800&q=80',
    color: '#1e1e1e',
  },
];

export const exercises: Exercise[] = [
  // CHEST
  {
    id: 'bench-press', name: 'Bench Press', nameTh: 'เบนช์เพรส', muscleId: 'chest',
    difficulty: 'Intermediate', duration: '45 min', sets: '4', reps: '10', calories: 180,
    muscles: ['Pectorals', 'Triceps', 'Anterior Deltoid'],
    description: 'The bench press is a compound upper-body exercise that targets the pectoral muscles while also engaging the triceps and anterior deltoids.',
    steps: [
      'Lie flat on a bench, feet firmly on the floor',
      'Grip the bar slightly wider than shoulder-width',
      'Unrack the bar and hold it directly above your chest',
      'Lower the bar slowly to your mid-chest (2-3 seconds)',
      'Drive the bar back up explosively until arms are fully extended',
      'Repeat for the desired reps',
    ],
    tips: [
      'Keep your shoulder blades retracted and depressed',
      'Maintain a slight natural arch in your lower back',
      'Breathe in on the way down, exhale on the push',
    ],
    image: 'https://images.unsplash.com/photo-1710746904729-f3ad9f682bb9?w=800&q=80',
  },
  {
    id: 'push-up', name: 'Push Up', nameTh: 'วิดพื้น', muscleId: 'chest',
    difficulty: 'Beginner', duration: '20 min', sets: '3', reps: '15', calories: 80,
    muscles: ['Pectorals', 'Triceps', 'Core'],
    description: 'Push-ups are a fundamental bodyweight exercise that builds chest, shoulder, and tricep strength with no equipment required.',
    steps: [
      'Start in a high plank with hands slightly wider than shoulders',
      'Keep your body in a straight line from head to heels',
      'Lower your chest toward the floor by bending elbows',
      'Stop when chest is about 1 inch from the ground',
      'Push back up to starting position explosively',
      'Squeeze chest at the top of each rep',
    ],
    tips: [
      'Engage your core throughout the entire movement',
      "Don't let your hips sag or pike up",
      'Look slightly forward, not straight down',
    ],
    image: 'https://images.unsplash.com/photo-1710746904729-f3ad9f682bb9?w=800&q=80',
  },
  {
    id: 'cable-flye', name: 'Cable Flye', nameTh: 'เคเบิลฟลาย', muscleId: 'chest',
    difficulty: 'Intermediate', duration: '30 min', sets: '3', reps: '12', calories: 120,
    muscles: ['Pectorals', 'Anterior Deltoid'],
    description: 'Cable flyes provide constant tension throughout the movement, excellent for chest isolation and developing the inner chest.',
    steps: [
      'Set cable pulleys to shoulder height on both sides',
      'Stand in the center, grab one handle in each hand',
      'Step forward to create tension, slight bend in elbows',
      'With a wide arc, bring hands together in front of chest',
      'Slowly return to starting position with control',
    ],
    tips: [
      'Imagine hugging a large tree throughout the movement',
      "Keep your torso stable — don't lean forward excessively",
      'The slow return builds more muscle than the push',
    ],
    image: 'https://images.unsplash.com/photo-1710746904729-f3ad9f682bb9?w=800&q=80',
  },
  // BACK
  {
    id: 'pull-up', name: 'Pull Up', nameTh: 'ดึงบาร์', muscleId: 'back',
    difficulty: 'Advanced', duration: '30 min', sets: '4', reps: '8', calories: 150,
    muscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids'],
    description: "Pull-ups are the ultimate upper-body compound exercise that builds impressive lat width and back thickness.",
    steps: [
      'Grip the bar with hands slightly wider than shoulder-width',
      'Hang at full extension (dead hang)',
      'Depress and retract your shoulder blades first',
      'Pull yourself up until chin clears the bar',
      'Hold briefly at the top, squeezing your back',
      'Lower slowly for 3 seconds back to dead hang',
    ],
    tips: [
      'Lead with your elbows, not your hands',
      'Avoid swinging or kipping for max muscle engagement',
      'Use a band for assistance if needed when starting',
    ],
    image: 'https://images.unsplash.com/photo-1630415188550-9e454489ce3a?w=800&q=80',
  },
  {
    id: 'bent-over-row', name: 'Bent-Over Row', nameTh: 'โรว์ก้มตัว', muscleId: 'back',
    difficulty: 'Intermediate', duration: '40 min', sets: '4', reps: '10', calories: 160,
    muscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoid'],
    description: 'The barbell row is a cornerstone back exercise that builds overall back thickness and strengthens the posterior chain.',
    steps: [
      'Stand with feet shoulder-width apart, barbell over mid-foot',
      'Hinge at hips to 45-degree angle, slight knee bend',
      'Grip bar just outside shoulder width',
      'Drive elbows back and up, pulling bar to lower chest',
      'Squeeze back hard at the top of the movement',
      'Lower the bar with control back to starting position',
    ],
    tips: [
      "Keep your back flat — never round under load",
      'Think "elbows back" not "hands up"',
      'Brace your core as if taking a punch',
    ],
    image: 'https://images.unsplash.com/photo-1630415188550-9e454489ce3a?w=800&q=80',
  },
  // LEGS
  {
    id: 'squat', name: 'Squat', nameTh: 'สควอท', muscleId: 'legs',
    difficulty: 'Intermediate', duration: '45 min', sets: '4', reps: '12', calories: 220,
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    description: 'The barbell back squat is king of all exercises. It builds massive lower body strength while engaging your core.',
    steps: [
      'Position barbell on upper traps, feet shoulder-width apart',
      'Keep chest tall, brace core tightly',
      'Initiate movement by pushing knees out and hinging hips back',
      'Descend until thighs are parallel to floor or below',
      'Drive through entire foot to stand up explosively',
      'Lock out hips at the top and reset for next rep',
    ],
    tips: [
      'Keep knees tracking over toes throughout the movement',
      "Don't let your heels come off the ground",
      'Take a deep breath and brace before each rep',
    ],
    image: 'https://images.unsplash.com/photo-1675910518330-1843b4d03de1?w=800&q=80',
  },
  {
    id: 'lunge', name: 'Lunge', nameTh: 'ลันจ์', muscleId: 'legs',
    difficulty: 'Beginner', duration: '25 min', sets: '3', reps: '12', calories: 140,
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'Lunges are a versatile unilateral leg exercise that build strength, improve balance, and correct muscle imbalances.',
    steps: [
      'Stand with feet hip-width apart, hands on hips or sides',
      'Step forward with right foot about 2 feet',
      "Lower back knee toward the floor (don't touch)",
      'Front thigh should be parallel to floor at bottom',
      'Drive through front heel to return to start',
      'Alternate legs or complete all reps on one side first',
    ],
    tips: [
      'Keep your torso upright throughout',
      'Front knee should not extend past your toes',
      'Use dumbbells to increase difficulty progressively',
    ],
    image: 'https://images.unsplash.com/photo-1675910518330-1843b4d03de1?w=800&q=80',
  },
  // SHOULDERS
  {
    id: 'overhead-press', name: 'Overhead Press', nameTh: 'โอเวอร์เฮดเพรส', muscleId: 'shoulders',
    difficulty: 'Intermediate', duration: '40 min', sets: '4', reps: '10', calories: 160,
    muscles: ['Anterior Deltoid', 'Lateral Deltoid', 'Triceps'],
    description: 'The overhead press is the definitive shoulder builder. It develops boulder shoulders and pressing strength.',
    steps: [
      'Stand with feet shoulder-width apart, barbell at collarbone',
      'Grip bar just outside shoulder width, elbows slightly forward',
      'Brace core and press bar directly overhead',
      'Keep bar close to face as it travels up',
      'Lock out arms fully at the top',
      'Lower bar back to collarbone with control',
    ],
    tips: [
      'Squeeze glutes and brace core for a stable base',
      "Don't hyperextend your lower back at the top",
      'The bar should travel in a vertical path',
    ],
    image: 'https://images.unsplash.com/photo-1597452329152-52f9eee96576?w=800&q=80',
  },
  {
    id: 'lateral-raise', name: 'Lateral Raise', nameTh: 'ยกข้าง', muscleId: 'shoulders',
    difficulty: 'Beginner', duration: '20 min', sets: '3', reps: '15', calories: 80,
    muscles: ['Lateral Deltoid', 'Supraspinatus'],
    description: 'Lateral raises are the best isolation exercise for building wide, capped shoulder width that creates an impressive V-taper physique.',
    steps: [
      'Stand with dumbbells at sides, palms facing in',
      'Slight bend in elbows throughout the movement',
      'Raise arms out to the sides up to shoulder height',
      'Tilt dumbbells slightly as if pouring water at top',
      'Pause briefly at the top for maximum contraction',
      'Lower slowly for full range of motion benefit',
    ],
    tips: [
      'Lead with your elbows, not your wrists',
      'Avoid shrugging — keep shoulders depressed',
      'Use lighter weights with perfect form over heavy and sloppy',
    ],
    image: 'https://images.unsplash.com/photo-1597452329152-52f9eee96576?w=800&q=80',
  },
  // ARMS
  {
    id: 'bicep-curl', name: 'Bicep Curl', nameTh: 'บิเซปเคิร์ล', muscleId: 'arms',
    difficulty: 'Beginner', duration: '25 min', sets: '3', reps: '12', calories: 90,
    muscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis'],
    description: 'The barbell curl is the most direct bicep exercise for developing arm size and peak contraction strength.',
    steps: [
      'Stand holding barbell with underhand grip at hip width',
      'Keep elbows pinned at sides throughout movement',
      'Curl the bar up toward your upper chest',
      'Squeeze biceps hard at the top — hold for 1 second',
      'Slowly lower the bar back to starting position (3 seconds)',
      "Don't swing or use momentum",
    ],
    tips: [
      'Keep your upper arms completely stationary',
      'Full range of motion matters more than weight',
      'Supinate (rotate) wrists as you curl for peak contraction',
    ],
    image: 'https://images.unsplash.com/photo-1590723267709-afa6a4cae55a?w=800&q=80',
  },
  {
    id: 'tricep-dip', name: 'Tricep Dip', nameTh: 'ทรายเซปดิป', muscleId: 'arms',
    difficulty: 'Intermediate', duration: '30 min', sets: '3', reps: '12', calories: 110,
    muscles: ['Triceps Brachii', 'Anterior Deltoid', 'Pectorals'],
    description: 'Dips are a compound bodyweight exercise that builds impressive tricep mass and overall upper body pressing strength.',
    steps: [
      'Grip parallel bars with arms fully extended',
      'Lean slightly forward to target triceps more',
      'Lower your body by bending elbows to 90 degrees',
      "Keep elbows tucked in — don't flare them out",
      'Drive back up through palms to full extension',
      'Lock out and squeeze triceps at the top',
    ],
    tips: [
      'Add weight with a dip belt as you progress',
      'Control the descent — 2-3 seconds down',
      'Keep shoulders depressed to protect rotator cuff',
    ],
    image: 'https://images.unsplash.com/photo-1590723267709-afa6a4cae55a?w=800&q=80',
  },
  // CORE
  {
    id: 'plank', name: 'Plank', nameTh: 'แพลงก์', muscleId: 'core',
    difficulty: 'Beginner', duration: '15 min', sets: '3', reps: '60s', calories: 50,
    muscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Obliques', 'Glutes'],
    description: 'The plank is the foundational core exercise that builds deep core stability and improves posture.',
    steps: [
      'Begin in forearm plank with elbows under shoulders',
      'Forearms parallel and flat on the ground',
      'Lift body so it forms a straight line head to heels',
      'Squeeze glutes and brace core as if absorbing a punch',
      "Keep hips level — don't sag or pike",
      'Hold for prescribed time while breathing steadily',
    ],
    tips: [
      'Quality over time — 20 perfect seconds beats 60 sloppy',
      'Keep your neck neutral — look at the floor',
      "Breathe continuously — don't hold your breath",
    ],
    image: 'https://images.unsplash.com/photo-1630225760711-ac8eaa0c8947?w=800&q=80',
  },
  {
    id: 'crunch', name: 'Crunch', nameTh: 'ครันซ์', muscleId: 'core',
    difficulty: 'Beginner', duration: '20 min', sets: '3', reps: '20', calories: 60,
    muscles: ['Rectus Abdominis', 'Hip Flexors'],
    description: 'The crunch is a targeted abdominal exercise that isolates the upper abs for that defined six-pack look.',
    steps: [
      'Lie on your back, knees bent, feet flat on floor',
      "Place fingertips lightly behind ears (don't pull neck)",
      'Brace core and lift shoulder blades off the ground',
      'Curl toward knees, focusing on abs contracting',
      'Pause at the top and squeeze abs',
      "Lower back down with control — don't relax at bottom",
    ],
    tips: [
      'Short range of motion is fine — quality over quantity',
      'Exhale as you crunch up for deeper contraction',
      'Keep lower back pressed to floor throughout',
    ],
    image: 'https://images.unsplash.com/photo-1630225760711-ac8eaa0c8947?w=800&q=80',
  },
];

export function getMuscleGroup(id: string): MuscleGroup | undefined {
  return muscleGroups.find(m => m.id === id);
}
export function getExercise(id: string): Exercise | undefined {
  return exercises.find(e => e.id === id);
}
export function getExercisesByMuscle(muscleId: string): Exercise[] {
  return exercises.filter(e => e.muscleId === muscleId);
}
