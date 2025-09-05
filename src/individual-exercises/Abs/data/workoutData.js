
// phase-1
import plank from '../../../assets/images/abs/plank.webp';
import deadbug from '../../../assets/images/abs/dead-bug.gif';
import glute_bridge from '../../../assets/images/abs/glute_bridge.gif';
import basic_crunches from '../../../assets/images/abs/basic_crunches.gif';
// phase-2
import bicycle_crunches from '../../../assets/images/Abs/bicycle_crunches.gif';
import leg_raises from '../../../assets/images/Abs/leg_raises.gif';
import russian_twist from '../../../assets/images/Abs/russian_twist.gif';
import side_plank from '../../../assets/images/Abs/side_plank.avif';
// phase-3
import hanging_knee_raises from '../../../assets/images/Abs/hanging_knee_raises.webp';
import weighted_crunches from '../../../assets/images/Abs/weighted-situps.webp';
import cable_high_to_low from '../../../assets/images/Abs/cable_high_to_low.webp';
import weighted_plank from '../../../assets/images/Abs/plank_weighted.avif';
//phase-4
import HangingLegRaises from '../../../assets/images/Abs/Hanging Leg Raises.gif';
import abwheelrollout from '../../../assets/images/Abs/ab-wheel-rollout.gif';
import dragon_flang from '../../../assets/images/Abs/dragon-flangs.webp';
import l_sit from '../../../assets/images/Abs/l-sit.webp';
// Cooldown
import child_pose from '../../../assets/images/abs/child_pose.gif';
import cobra_stretch from '../../../assets/images/abs/cobra_stretch.jpg';
import knees_to_chest from '../../../assets/images/abs/knees_to_chest_stretch.png';
// warmup
import jumping_jack from '../../../assets/images/Abs/jumping_jack.gif';
import torso_twist from '../../../assets/images/Abs/torso_twist.gif';
import cat_cow from '../../../assets/images/Abs/cat-cow.webp';

const warmupExercises = [
    { name: "Warm-up: Jumping Jacks", img: jumping_jack, duration: "60 seconds", difficulty: 2, instructions: "Stand upright with feet together, arms at sides. Jump while spreading legs shoulder-width apart and raising arms overhead. Return to starting position.", targetMuscles: ["Full Body", "Cardio"] },
    { name: "Warm-up: Torso Twists", img: torso_twist, duration: "30 seconds", difficulty: 2, instructions: "Stand with feet shoulder-width apart, hands on hips. Rotate torso left and right while keeping hips stable.", targetMuscles: ["Core", "Back"] },
    { name: "Warm-up: Cat-Cow Stretch", img: cat_cow, duration: "30 seconds", difficulty: 1, instructions: "On hands and knees, alternate between arching back (cow) and rounding spine (cat).", targetMuscles: ["Back", "Core"] },
];

const cooldownStretches = [
    { name: "Cooldown: Child's Pose", img: child_pose, duration: "30 seconds", difficulty: 1, instructions: "Kneel on floor, sit back on heels, then fold forward extending arms in front.", targetMuscles: ["Back", "Shoulders"] },
    { name: "Cooldown: Cobra Stretch", img: cobra_stretch, duration: "30 seconds", difficulty: 2, instructions: "Lie face down, place palms under shoulders, slowly push up arching your back.", targetMuscles: ["Chest", "Abdominals"] },
    { name: "Cooldown: Knees-to-Chest Stretch", img: knees_to_chest, duration: "30 seconds", difficulty: 1, instructions: "Lie on back, pull both knees toward chest and hold gently.", targetMuscles: ["Lower Back", "Hips"] },
];

export const workoutsByPhase = {
    1: {
        title: "Foundation Building",
        exercises: [
            ...warmupExercises,
            { name: "Plank", img: plank, reps: "3 sets × 20-45 sec hold", difficulty: 2, instructions: "Hold push-up position on forearms, body in straight line. Keep your neck and head in line with your back, elbows under shoulders, and glutes squeezed.", targetMuscles: ["Core", "Stability"], restTime: 45, tips: "Focus on form, not duration. A proper 20-second hold is better than a sloppy 60-second one." },
            { name: "Dead Bug", img: deadbug, reps: "3 sets × 8-15 reps per side", difficulty: 2, instructions: "Lie on back, arms up, knees at 90 degrees. Lower opposite arm and leg, return to start.", targetMuscles: ["Core", "Coordination"], restTime: 45, tips: "Keep your lower back pressed to the floor throughout the movement." },
            { name: "Glute Bridges", img: glute_bridge, reps: "3 sets × 15 reps", difficulty: 1, instructions: "Lie on your back with knees bent, feet flat on the floor. Lift your hips off the floor until your body forms a straight line from your shoulders to your knees.", targetMuscles: ["Glutes", "Core", "Lower Back"], restTime: 45, tips: "Squeeze your glutes at the top of the movement." },
            { name: "Basic Crunches", img: basic_crunches, reps: "2 sets × 15 reps", difficulty: 1, instructions: "Lie on back, knees bent, feet flat. Place hands behind head, lift shoulders off ground using core muscles.", targetMuscles: ["Upper Abs"], restTime: 60, tips: "This builds a foundation. We'll move to more effective exercises in the next phase, as research shows crunches have limited muscle activation." },
            ...cooldownStretches
        ]
    },
    2: { 
        title: "Strength Development",
        exercises: [
            ...warmupExercises,
            { name: "Bicycle Crunches", img: bicycle_crunches, reps: "3 sets × 12-20 reps per side", difficulty: 3, instructions: "Lie on back, hands behind head. Bring knee to opposite elbow in cycling motion.", targetMuscles: ["Obliques", "Rectus Abdominis"], restTime: 60, tips: "EMG studies show this is one of the most effective ab exercises. Focus on rotation and control, not speed." },
            { name: "Leg Raises", img: leg_raises, reps: "3 sets × 15-20 reps", difficulty: 3, instructions: "Lie on back, legs straight. Lift legs to 90 degrees, lower slowly without touching ground.", targetMuscles: ["Lower Abs", "Hip Flexors"], restTime: 60, tips: "Press your lower back into the floor to protect your spine." },
            { name: "Russian Twists", img: russian_twist, reps: "3 sets × 15 reps per side", difficulty: 3, instructions: "Sit with knees bent, lean back slightly. Rotate torso side to side, touching ground alternately.", targetMuscles: ["Obliques", "Core"], restTime: 60, tips: "Incorporate rotational movements for complete core development." },
            { name: "Side Plank", img: side_plank, reps: "3 sets × 30-60 sec hold per side", difficulty: 4, instructions: "Lie on side, prop up on forearm. Lift hips creating straight line from head to feet.", targetMuscles: ["Obliques", "Core Stability"], restTime: 75, tips: "Don't let your hips sag. Keep your body rigid." },
            ...cooldownStretches
        ]
    },
    3: {
        title: "Progressive Overload",
        exercises: [
             ...warmupExercises,
            { name: "Hanging Knee Raises", img: hanging_knee_raises, difficulty: 4, instructions: "Hang from a pull-up bar, raise knees toward chest, lower with control.", targetMuscles: ["Lower Abs", "Hip Flexors"], restTime: 90, tips: "Avoid swinging. Use your core to lift your knees. This is superior to many floor exercises for lower ab activation." },
            { name: "Weighted Crunches", img: weighted_crunches, reps: "4 sets × 15-20 reps", difficulty: 4, instructions: "Hold a weight plate on your chest and perform crunches with the added resistance.", targetMuscles: ["Upper Abs"], restTime: 75, tips: "Your abs are muscles that need progressive overload to grow, just like any other muscle group." },
            { name: "Cable Wood Chops", img: cable_high_to_low, reps: "3 sets × 15 reps per side", difficulty: 4, instructions: "Stand sideways to a cable machine, pull the handle across your body from high to low in a chopping motion.", targetMuscles: ["Obliques", "Rotational Strength"], restTime: 90, tips: "Control the weight; don't let it control you. Rotate through your core." },
            { name: "Plank (Weighted)", img: weighted_plank, reps: "3 sets × 45-75 sec hold", difficulty: 5, instructions: "Perform a plank with a weight plate carefully placed on your upper back.", targetMuscles: ["Core", "Stability"], restTime: 90, tips: "Have a partner assist with placing and removing the weight for safety." },
            ...cooldownStretches
        ]
    },
    4: {
        title: "Advanced Training",
        exercises: [
             ...warmupExercises,
            { name: "Hanging Leg Raises", img: HangingLegRaises, difficulty: 5, instructions: "Hang from a bar. Keeping your legs straight, raise them until they are parallel to the floor or higher.", targetMuscles: ["Lower Abs", "Hip Flexors"], restTime: 120, tips: "This requires significant core strength. If it's too hard, stick with knee raises and focus on perfect form." },
            { name: "Ab Wheel Rollouts", img: abwheelrollout, reps: "4 sets × to failure", difficulty: 5, instructions: "Kneel holding ab wheel, roll forward maintaining a straight line, return to start without arching your back.", targetMuscles: ["Full Core", "Lats", "Shoulders"], restTime: 120, tips: "This is a high-intensity exercise. Focus on quality over quantity." },
            { name: "Dragon Flags", img: dragon_flang, reps: "3 sets × to failure", difficulty: 5, instructions: "Lie on a bench, hold it behind your head, lift your entire body keeping it straight, and lower slowly.", targetMuscles: ["Full Core", "Eccentric Strength"], restTime: 120, tips: "Extremely advanced. Start with negatives (slow lowering) only if you're new to the movement." },
            { name: "L-Sits", img: l_sit, reps: "4 sets × 30-60 sec hold", difficulty: 5, instructions: "On parallettes or the floor, support your body with your arms and hold your legs straight out in front of you, forming an 'L' shape.", targetMuscles: ["Core", "Triceps", "Shoulders"], restTime: 120, tips: "If a full L-sit is too hard, start with a tuck-sit (knees bent)." },
            ...cooldownStretches
        ]
    },
};

export const bodyFatData = [
    { range: "30-40%", image: "https://www.ruled.me/wp-content/uploads/2013/11/40percent.jpg", timeline: "12-24+ months" },
    { range: "25%", image: "https://www.ruled.me/wp-content/uploads/2013/11/25p.png", timeline: "9-15 months" },
    { range: "20%", image: "https://manofmany.com/wp-content/uploads/2021/04/the-body-fat-percentage-men-need-to-see-abs-what-20-bf-looks-like2.jpeg", timeline: "6-9 months" },
    { range: "15%", image: "https://www.ruled.me/wp-content/uploads/2013/11/JosefAfter.jpg", timeline: "3-6 months" },
    { range: "10-12%", image: "https://www.themanual.com/wp-content/uploads/sites/9/2022/10/body-recomposition.jpeg?fit=800%2C800&p=1", timeline: "You're there!" },
];

export const achievements = [
    { id: 1, name: "Foundation Laid", description: "Complete your first Phase 1 workout", icon: "🌱", unlocked: false, phase: 1 },
    { id: 2, name: "Getting Stronger", description: "Complete a Phase 2 workout", icon: "⚡", unlocked: false, phase: 2 },
    { id: 3, name: "Overload Principle", description: "Complete a Phase 3 workout", icon: "🛡️", unlocked: false, phase: 3 },
    { id: 4, name: "Core Master", description: "Complete a Phase 4 workout", icon: "🦍", unlocked: false, phase: 4 },
    { id: 5, name: "Consistent Core", description: "Complete 10 total workouts", icon: "💪", unlocked: false, count: 10 },
    { id: 6, name: "Abs Architect", description: "Complete 25 total workouts", icon: "👑", unlocked: false, count: 25 },
];