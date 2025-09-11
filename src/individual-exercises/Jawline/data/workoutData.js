// IMAGE IMPORTS (replace these with your actual asset paths)
import gentle_jaw_circles from '../images/gentle_jaw_circles.png';
import jaw_open_close from '../images/jaw_open_close.gif';
import tongue_press from '../images/tongue_press.png';
import chin_tuck from '../images/chin_tuck.gif';
import fish_face from '../images/fish_face.gif';
import jaw_clench from '../images/jaw_clench.png';
import smile_resistance from '../images/smile_resistance.png';
import lions_breath from '../images/lions_breath.png';
import jaw_lateral_slide from '../images/jaw_lateral_slide.gif';
import weighted_chin_tuck from '../images/weighted_chin_tuck.gif';
import jaw_masseter_pulse from '../images/jaw_masseter_pulse.gif';
import neck_jaw_integration from '../images/neck_jaw_integration.png';
import chewing_simulation from '../images/chewing_simulation.png';
import relaxation_massage from '../images/relaxation_massage.png';
import advanced_fish_face from '../images/advanced_fish_face.gif';
import multi_directional_jaw from '../images/multi_directional_jaw.png';
import static_jaw_hold from '../images/static_jaw_hold.png';

// Warmup/Cooldown
import jaw_warmup from '../images/jaw_warmup.png';
import gentle_massage from '../images/gentle_massage.png';

// Progress sizes (optionally for before/after or avatars)
import start_jaw from '../images/start_jaw.png';
import mid_jaw from '../images/mid_jaw.png';
import advanced_jaw from '../images/advanced_jaw.png';

// ========== Warmup/Cooldown Exercises ===========

const warmupExercises = [
  { name: "Jaw Warm-Up", img: jaw_warmup, duration: "30-45 seconds", difficulty: 1, instructions: "Move jaw gently in circles and open/close to increase blood flow.", targetMuscles: ["Full Jaw", "Neck"] }
];

const cooldownStretches = [
  { name: "Jaw Massage & Stretch", img: gentle_massage, duration: "60-90 seconds", difficulty: 1, instructions: "Massage jaw muscles using circular motions; include gentle stretching for relaxation.", targetMuscles: ["Jaw", "Neck"], tips: "Always finish with relaxation work to avoid tightness." }
];

// ========== Main Program Data ===========
export const workoutsByPhase = {
  1: {
    title: "Foundation Building",
    exercises: [
      ...warmupExercises,
      { name: "Gentle Jaw Circles", img: gentle_jaw_circles, reps: "5 clockwise, 5 counterclockwise", difficulty: 1, instructions: "Move jaw in a slow circular motion each direction.", targetMuscles: ["Full Jaw"], tips: "Stay relaxed, do not rush." },
      { name: "Jaw Open/Close", img: jaw_open_close, reps: "5 reps", difficulty: 1, instructions: "Open and close mouth gently.", targetMuscles: ["Jaw Flexors"], tips: "Do not force open." },
      { name: "Tongue Press", img: tongue_press, reps: "3 sets × 5 reps", difficulty: 1, instructions: "Press tongue hard to roof of mouth while opening jaw.", targetMuscles: ["Tongue", "Jaw"], tips: "Keep neck relaxed." },
      { name: "Chin Tucks", img: chin_tuck, reps: "3 sets × 5 reps", difficulty: 1, instructions: "Pull chin back as if making double chin.", targetMuscles: ["Neck Flexors"], tips: "Hold 3 seconds, keep shoulders down." },
      { name: "Fish Face Hold", img: fish_face, reps: "3 sets × 5 seconds", difficulty: 1, instructions: "Suck in cheeks and lips, hold.", targetMuscles: ["Cheeks", "Jaw"] },
      { name: "Jaw Clenching (Light)", img: jaw_clench, reps: "3 sets × 5 reps", difficulty: 1, instructions: "Clench teeth gently, do not grind.", targetMuscles: ["Jaw Flexors"] },
      { name: "Smile Resistance", img: smile_resistance, reps: "3 sets × 5 reps", difficulty: 1, instructions: "Smile broadly, press fingers at corners for gentle resistance.", targetMuscles: ["Lower face"] },
      { name: "Lion's Breath", img: lions_breath, reps: "3 reps", difficulty: 1, instructions: "Open mouth wide, stick tongue out, exhale with forceful 'ha'.", targetMuscles: ["Jaw", "Tongue"] },
      ...cooldownStretches
    ]
  },
  2: {
    title: "Strength Development",
    exercises: [
      ...warmupExercises,
      { name: "Jaw Circles (Extended)", img: gentle_jaw_circles, reps: "8 each direction", difficulty: 2, instructions: "Increase circle count for greater mobility.", targetMuscles: ["Jaw"] },
      { name: "Lateral Jaw Slide", img: jaw_lateral_slide, reps: "5 each side", difficulty: 2, instructions: "Move jaw sideways against hand resistance.", targetMuscles: ["Jaw Sides"] },
      { name: "Progressive Jaw Resistance", img: jaw_clench, reps: "4 sets × 8 reps", difficulty: 2, instructions: "Increase finger resistance under chin, slow and controlled reps.", targetMuscles: ["Jaw Flexors"] },
      { name: "Tongue Press (Advanced)", img: tongue_press, reps: "4 sets × 8 reps", difficulty: 2, instructions: "Press tongue to roof as you open jaw with head slightly back.", targetMuscles: ["Tongue", "Jaw"] },
      { name: "Weighted Chin Tucks", img: weighted_chin_tuck, reps: "4 sets × 8 reps", difficulty: 2, instructions: "Place light resistance on forehead, chin tuck against it.", targetMuscles: ["Neck Flexors"] },
      { name: "Masseter Pulse", img: jaw_masseter_pulse, reps: "3 sets × 10 pulses", difficulty: 2, instructions: "Light jaw clenching, 1 second clench/release quickly.", targetMuscles: ["Jaw Flexors"] },
      { name: "Neck-Jaw Integration", img: neck_jaw_integration, reps: "3 sets × 6 reps", difficulty: 2, instructions: "Lift head from lying down while opening jaw.", targetMuscles: ["Jaw", "Neck"] },
      { name: "Chewing Simulation", img: chewing_simulation, reps: "3 sets × 15 reps", difficulty: 2, instructions: "Simulate chewing motion without food.", targetMuscles: ["Jaw", "Cheeks"] },
      { name: "Relaxation Massage", img: relaxation_massage, duration: "30-60 seconds", difficulty: 1, instructions: "Massage jaw in circles.", targetMuscles: ["Jaw"] },
      ...cooldownStretches
    ]
  },
  3: {
    title: "Advanced Sculpting",
    exercises: [
      ...warmupExercises,
      { name: "Multi-Directional Jaw Movements", img: multi_directional_jaw, reps: "Various", difficulty: 3, instructions: "Combine open, close, lateral and circular motions.", targetMuscles: ["Jaw"] },
      { name: "Coordinated Tongue & Jaw", img: tongue_press, reps: "8 reps", difficulty: 3, instructions: "Combine tongue press with varied jaw movements.", targetMuscles: ["Tongue", "Jaw"] },
      { name: "Max Jaw Open Hold", img: jaw_open_close, reps: "5 reps × 6-8 sec hold", difficulty: 3, instructions: "Open jaw as wide as safely, hold, breathe normally.", targetMuscles: ["Jaw", "Neck"] },
      { name: "Full Hand Resistance Under Chin", img: jaw_clench, reps: "8 reps", difficulty: 3, instructions: "Use full hand under chin for heavy resistance, control up/down.", targetMuscles: ["Jaw Flexors"] },
      { name: "Fish Face with Head Tilt", img: advanced_fish_face, reps: "8 reps", difficulty: 3, instructions: "Make fish face, add jaw movement and tilt head.", targetMuscles: ["Cheeks", "Jaw"] },
      { name: "Chin Tuck + Head Rotation", img: chin_tuck, reps: "8 reps", difficulty: 3, instructions: "Tuck chin, rotate head side to side, hold at end ranges.", targetMuscles: ["Neck", "Jaw"] },
      { name: "Power Lion’s Breath", img: lions_breath, reps: "4 reps", difficulty: 3, instructions: "Wide mouth, tongue out, forceful exhale.", targetMuscles: ["Jaw", "Tongue"] },
      { name: "Jaw Endurance Challenge", img: static_jaw_hold, reps: "2 sets × 30 sec continuous motion", difficulty: 3, instructions: "Perform continuous light jaw movements for max duration.", targetMuscles: ["Jaw"] },
      { name: "Recovery Self-Massage", img: gentle_massage, duration: "1-2 minutes", difficulty: 1, instructions: "Gentle self-massage as cooldown/relaxation.", targetMuscles: ["Jaw"] },
      ...cooldownStretches
    ]
  }
};

// Arm sizes analogy → Jawline Progress
export const jawlineProgressData = [
  { stage: "Starting Jawline", image: start_jaw, goal: "Weeks 1-4: Building mobility & routine" },
  { stage: "Mid-Program", image: mid_jaw, goal: "Weeks 5-8: Noticeable muscle activation & symmetry" },
  { stage: "Advanced Jawline", image: advanced_jaw, goal: "Weeks 9-12: Marked definition & strength" }
];

// Achievements: tie to phase or consistency
export const achievements = [
  { id: 1, name: "Jawline Foundation", description: "Complete first Phase 1 session", icon: "🦷", unlocked: false, phase: 1 },
  { id: 2, name: "Strength Sculptor", description: "Complete a Phase 2 session", icon: "💪", unlocked: false, phase: 2 },
  { id: 3, name: "Sculpted Definition", description: "Complete a Phase 3 session", icon: "🏅", unlocked: false, phase: 3 },
  { id: 4, name: "Consistency Champ", description: "10 total jawline sessions completed", icon: "🔟", unlocked: false, count: 10 },
  { id: 5, name: "Jawline Pro", description: "25 total jawline sessions completed", icon: "👑", unlocked: false, count: 25 }
];
