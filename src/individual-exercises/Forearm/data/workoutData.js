// src/components/ForearmWorkout/data/workoutData.js

// IMAGE IMPORTS (replace with your own images as needed)
import wrist_curl from '../images/wrist_curl.gif';
import reverse_wrist_curl from '../images/reverse_wrist_curl.gif';
import static_hold from '../images/static_hold.webp';
import dead_hang from '../images/dead_hang.gif';
import towel_squeeze from '../images/towel_squeeze.gif';
import finger_extension from '../images/finger_extension.jpg';
import hammer_curl from '../images/hammer_curl.gif';
import farmer_walk from '../images/farmer_walk.gif';
import plate_pinch from '../images/plate_pinch.webp';
import thick_bar_hold from '../images/thick_bar_hold.webp';
import reverse_grip_curl from '../images/reverse_grip_curl.gif';
import zottman_curl from '../images/zottman_curl.gif';
import cable_reverse_curl from '../images/cable_reverse_curl.gif';
import fingertip_pushup from '../images/fingertip_pushup.gif';
import behind_back_wrist_curl from '../images/behind_back_wrist_curl.webp';
import cable_variation from '../images/cable_variation.gif';
import single_arm_wrist_curl from '../images/single_arm_wrist_curl.webp';
import jumping_jack from '../images/jumping_jack.gif';
// import cluster_set from '../images/cluster_set.gif';
import pinch_grip from '../images/pinch_grip.gif';
// WARMUP/COOLDOWN (reuse from Abs or your own)
import Wrist_Flexor_Stretch from '../images/Wrist Flexor Stretch.jpg'
import Prayer_Stretch from '../images/Prayer_Stretch.jpg';
import Self_Massage from '../images/Self-Massage.png';
import wrist_circle from '../images/wrist_circle.gif';

//arm sizes
import small from '../images/small.jpg';
import medium from '../images/medium.webp';
import large from '../images/large.webp'

const warmupExercises = [
  { name: "Warm-up: Jumping Jacks", img: jumping_jack, duration: "60 seconds", difficulty: 1, instructions: "Get heart rate up and increase blood flow.", targetMuscles: ["Full Body"] },
  { name: "Warm-up: Wrist Circles", img: wrist_circle, duration: "60 seconds", difficulty: 1, instructions: "Make slow, controlled wrist circles in both directions.", targetMuscles: ["Wrists", "Forearms"] },
];

const cooldownStretches = [
{ name: "Wrist Flexor Stretch", img: Wrist_Flexor_Stretch, duration: "30-45 seconds each side", difficulty: 1, instructions: "Extend arm with palm up and gently pull the fingers back with the other hand until you feel a stretch in the forearm.", targetMuscles: ["Wrist Flexors", "Forearm"], tips: "Keep the elbow straight and breathe slowly." },
{ name: "Prayer Stretch", img: Prayer_Stretch, duration: "30-45 seconds", difficulty: 1, instructions: "Place palms together in front of your chest and lower your hands toward your waist while keeping palms pressed until you feel a stretch.", targetMuscles: ["Wrist Flexors", "Forearm"], tips: "Move slowly and stop if you feel pain." },
{ name: "Self-Massage (Forearm)", img: Self_Massage, duration: "60 seconds per arm", difficulty: 1, instructions: "Use the thumb and fingers to knead and glide along the forearm from wrist to elbow to relieve tension.", targetMuscles: ["Forearm Flexors", "Forearm Extensors"], tips: "Use moderate pressure and avoid painful spots." },
{ name: "Wrist Circles (Cool-down)", img: wrist_circle, duration: "30-60 seconds", difficulty: 1, instructions: "Make slow, controlled wrist circles in both directions to restore mobility and reduce stiffness.", targetMuscles: ["Wrists", "Forearms"], tips: "Start with small circles and increase range as comfortable." }
];

export const workoutsByPhase = {
  1: {
    title: "Foundation Building",
    exercises: [
      ...warmupExercises,
      { name: "Wrist Curl", img: wrist_curl, reps: "3 sets × 15-20 reps", difficulty: 1, instructions: "Palms up, curl wrists up holding dumbbells.", targetMuscles: ["Wrist Flexors"], restTime: 45, tips: "Keep elbows supported. Start light for perfect form." },
      { name: "Reverse Wrist Curl", img: reverse_wrist_curl, reps: "3 sets × 15-20 reps", difficulty: 1, instructions: "Palms down, curl wrists up holding dumbbells.", targetMuscles: ["Wrist Extensors"], restTime: 45, tips: "Go slow, full range of motion." },
      { name: "Static Hold", img: static_hold, reps: "3 sets × 20-45 seconds", difficulty: 1, instructions: "Hold a light dumbbell with a tight grip for time.", targetMuscles: ["Grip", "Flexors", "Extensors"], restTime: 45, tips: "Squeeze the weight without straining your wrist." },
      ...cooldownStretches
    ]
  },
  2: {
    title: "Strength & Endurance",
    exercises: [
      ...warmupExercises,
      { name: "Hammer Curl", img: hammer_curl, reps: "3 sets × 12-16 reps", difficulty: 2, instructions: "Curl with thumbs facing up, elbows by side.", targetMuscles: ["Brachioradialis", "Wrist Flexors"], restTime: 60, tips: "Don’t swing. Use strict form." },
      { name: "Farmer Walk", img: farmer_walk, reps: "3 sets × 30-60 sec", difficulty: 2, instructions: "Hold heavy weights, walk for time or distance.", targetMuscles: ["Grip", "Forearm Mass"], restTime: 60, tips: "Walk tall, let arms hang naturally." },
      { name: "Squeeze Ball", img: towel_squeeze, reps: "3 sets × 20 reps squeeze", difficulty: 1, instructions: "Squeeze a stress ball or towel hard.", targetMuscles: ["Finger Flexors"], restTime: 45, tips: "Maximize the squeeze each rep." },
      { name: "Finger Extensions", img: finger_extension, reps: "2 sets × 15-20 reps", difficulty: 1, instructions: "Spread fingers against resistance (band).", targetMuscles: ["Finger Extensors"], restTime: 45, tips: "Balance flexor/extensor work." },
      ...cooldownStretches
    ]
  },
  3: {
    title: "Intermediate Gains",
    exercises: [
      ...warmupExercises,
      { name: "Behind-the-Back Wrist Curl", img: behind_back_wrist_curl, reps: "3 sets × 12-16 reps", difficulty: 3, instructions: "Hold barbell behind your back, curl up.", targetMuscles: ["Wrist Flexors"], restTime: 60, tips: "Full stretch and squeeze; don't cheat reps." },
      { name: "Plate Pinch", img: plate_pinch, reps: "4 sets × 20-40 sec (heavy plates!)", difficulty: 3, instructions: "Pinch two plates together and hold.", targetMuscles: ["Grip – Pinch Strength"], restTime: 60, tips: "Thumb position is key here." },
      { name: "Thick Bar Hold", img: thick_bar_hold, reps: "3 sets × 20-45 sec hold", difficulty: 3, instructions: "Hold a thick bar/dumbbell for time.", targetMuscles: ["Crushing Grip"], restTime: 60, tips: "Use a towel/grip sleeve if thick bar isn’t available." },
      { name: "Hammer Curl (Heavy)", img: hammer_curl, reps: "3 sets × 10 reps", difficulty: 3, instructions: "Move up in weight, maintain form.", targetMuscles: ["Brachioradialis"], restTime: 75, tips: "Control the negative like a pro." },
      ...cooldownStretches
    ]
  },
  4: {
    title: "Advanced & Expert",
    exercises: [
      ...warmupExercises,
      { name: "Cluster Set Dead Hang", img: dead_hang, reps: "3 sets × cluster (max hold/rest 15 sec × 3)", difficulty: 5, instructions: "Hang from pull-up bar as long as possible, rest <20 sec, repeat 3× per set.", targetMuscles: ["Grip Endurance", "Total Forearm"], restTime: 90, tips: "Can add weight for extra challenge." },
      { name: "Fingertip Push-Ups", img: fingertip_pushup, reps: "3 sets × 8-15 reps", difficulty: 5, instructions: "On toes and fingertips, lower with control.", targetMuscles: ["Finger Flexors", "Wrist Stability"], restTime: 90, tips: "If too hard, do on knees." },
      { name: "Pinch Grip Plate Hold", img: pinch_grip, reps: "3 sets × 20-60 sec", difficulty: 5, instructions: "Pinch two heavy plates and hold for max time.", targetMuscles: ["Thumb, Fingers, Total Grip"], restTime: 90, tips: "Squeeze hard, don’t drop before time’s up." },
      { name: "Reverse Grip Curl", img: reverse_grip_curl, reps: "3 sets × 12-15 reps", difficulty: 4, instructions: "Hold barbell palms down, curl up.", targetMuscles: ["Wrist Extensors", "Brachioradialis"], restTime: 90, tips: "Strict form for max brachioradialis hit." },
      ...cooldownStretches
    ]
  }
};

// Synthetic/suggested ranges, images can be tailored or omitted.
export const armSizeData = [
  { size: "Small", image: small, goal: "Baseline foundation (8+ months)" },
  { size: "Medium", image: medium, goal: "Noticeable gains (6-12 months)" },
  { size: "Large", image: large, goal: "Peak strength/specialization (12-18+ months)" },
];

// Achievements: progressive phase and consistency (customize icons as you wish)
export const achievements = [
  { id: 1, name: "Forearm Foundation", description: "Complete your first Phase 1 workout", icon: "🦾", unlocked: false, phase: 1 },
  { id: 2, name: "Grip Builder", description: "Complete a Phase 2 workout", icon: "✊", unlocked: false, phase: 2 },
  { id: 3, name: "Crush Zone", description: "Complete a Phase 3 workout", icon: "🧱", unlocked: false, phase: 3 },
  { id: 4, name: "Iron Grip", description: "Complete a Phase 4 workout", icon: "🏆", unlocked: false, phase: 4 },
  { id: 5, name: "Consistency King", description: "Complete 10 total forearm workouts", icon: "🔟", unlocked: false, count: 10 },
  { id: 6, name: "Legendary Grip", description: "Complete 25 total forearm workouts", icon: "👑", unlocked: false, count: 25 },
];

