import relaxAudio from "../../assets/sounds/soothing.mp3";
import energizeAudio from "../../assets/sounds/suryanamaskar.mp3";
import forest from "../../assets/sounds/forest.mp3";
import ocean from "../../assets/sounds/ocean.mp3";
import rain from "../../assets/sounds/rain.mp3";
import tibetan from "../../assets/sounds/tibetan.mp3";
import flute from "../../assets/sounds/flute.mp3";
import mantra from "../../assets/sounds/mantra.mp3";

// Difficulty levels for progression
export const difficultyLevels = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced"
};

// Enhanced weekly yoga routine with difficulty progression
export const weeklyYogaRoutine = {
  Sunday: {
    theme: "Gentle Foundation & Grounding",
    difficulty: difficultyLevels.BEGINNER,
    totalDuration: "45-60 mins",
    suryanamaskar: {
      rounds: 3,
      benefits: ["Warms the body", "Improves flexibility", "Sets intention for the week"],
      modifications: {
        beginner: "Hold each pose for 3-5 breaths",
        intermediate: "Flow with breath, 1 breath per movement",
        advanced: "Add variations like jump-backs and jump-forwards"
      }
    },
    asanas: [{
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Relieves stress", "Gentle hip opener", "Restorative"],
      contraindications: ["Knee injuries", "Pregnancy (wide knees)"],
      modifications: {
        beginner: "Pillow between thighs and calves",
        intermediate: "Arms extended, side variations",
        advanced: "Deeper hip opening, prayer twist"
      },
      howTo: "Kneel on the floor, big toes touching. Separate your knees wide or keep them together. Sit back on your heels. Fold your torso forward, resting your forehead on the mat. Extend your arms forward or rest them alongside your body, palms facing back.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
      alignmentCues: ["Surrender and let go", "Breathe into back ribs", "Rest and restore"]
    }, {
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Spine mobility", "Warm-up", "Mind-body connection"],
      contraindications: ["Recent back surgery", "Severe neck issues"],
      modifications: {
        beginner: "Move slowly, small range of motion",
        intermediate: "Coordinate with breath",
        advanced: "Add side movements, circular motions"
      },
      howTo: "Start on hands and knees. Inhale, arch your back, lift chest and tailbone (Cow). Exhale, round your spine, tuck chin to chest (Cat). Repeat with breath awareness.",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
      alignmentCues: ["Move from your core", "Keep shoulders over wrists", "Breathe deeply"]
    }, {
      name: "Tadasana (Mountain Pose)",
      Sanskrit: "ताड़ासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Improves posture", "Grounding", "Centering", "Body awareness"],
      contraindications: ["Low blood pressure (if arms raised overhead)"],
      modifications: {
        beginner: "Keep arms at sides, focus on breath",
        intermediate: "Raise arms overhead, close eyes",
        advanced: "Single-leg variations, micro-movements awareness"
      },
      howTo: "Stand tall with feet together or hip-width apart. Ensure weight is balanced evenly on both feet. Engage your thighs and lift your kneecaps. Tuck your tailbone slightly. Reach your arms alongside your body, palms facing forward, or overhead.",
      youtubeLink: "https://www.youtube.com/watch?v=2HTc_2M22yM",
      alignmentCues: ["Ground through all four corners of feet", "Lengthen crown of head toward ceiling", "Soften shoulders away from ears"]
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches spine", "Relieves stress", "Calms nervous system", "Improves digestion"],
      contraindications: ["Low back injuries", "High blood pressure", "Eye problems"],
      modifications: {
        beginner: "Bend knees, hold opposite elbows",
        intermediate: "Straighten legs, grab big toes",
        advanced: "Bind hands behind back, deeper variations"
      },
      howTo: "From Tadasana, exhale and hinge at the hips, folding forward. Keep your spine long as you fold. Allow your head and neck to relax. Place hands on the floor, blocks, or shins.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
      alignmentCues: ["Hinge from hips", "Keep spine long", "Shift weight forward"]
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches hamstrings", "Calms the mind", "Strengthens arms", "Mild inversion"],
      contraindications: ["Wrist injuries", "High blood pressure", "Late pregnancy"],
      modifications: {
        beginner: "Bend knees, use blocks under hands",
        intermediate: "Pedal feet, three-legged dog",
        advanced: "Forearm dog, one-handed variations"
      },
      howTo: "Start on hands and knees, tuck your toes and lift your hips up and back, forming an inverted V shape. Press firmly through your palms. Reach your heels towards the mat.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
      alignmentCues: ["External rotation of arms", "Ground through hands", "Lengthen spine"]
    }, {
      name: "Bhujangasana (Cobra Pose)",
      Sanskrit: "भुजङ्गासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Strengthens spine", "Opens chest", "Improves posture", "Energizes"],
      contraindications: ["Recent back surgery", "Pregnancy", "Wrist issues"],
      modifications: {
        beginner: "Keep forearms down (Sphinx pose)",
        intermediate: "Lift chest, hands under shoulders",
        advanced: "Deeper backbend, King Cobra variations"
      },
      howTo: "Lie face down, place hands under shoulders. On an inhale, press through your hands and lift your chest off the floor. Keep a slight bend in your elbows.",
      youtubeLink: "https://www.youtube.com/watch?v=JUP_YdYyfQM",
      alignmentCues: ["Lift from the heart", "Keep shoulders away from ears", "Engage legs"]
    }, {
      name: "Vrikshasana (Tree Pose)",
      Sanskrit: "वृक्षासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balance", "Focus", "Hip flexibility", "Ankle strength"],
      contraindications: ["Recent ankle or knee injury"],
      modifications: {
        beginner: "Keep toe on floor, heel on ankle",
        intermediate: "Foot on inner calf or thigh",
        advanced: "Close eyes, change arm positions"
      },
      howTo: "From Tadasana, shift weight to one foot. Bend the other knee and place the sole of the foot on the inner thigh, calf, or ankle of the standing leg. Bring hands together at the chest.",
      youtubeLink: "https://www.youtube.com/watch?v=XvjR4_pVa5o",
      alignmentCues: ["Find your drishti (focused gaze)", "Press foot into leg, leg into foot", "Breathe steadily"]
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "5-10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation", "Stress reduction", "Integration", "Nervous system reset"],
      contraindications: ["Pregnancy (after first trimester - use side-lying)"],
      modifications: {
        beginner: "Use bolster under knees, eye pillow",
        intermediate: "Body scan meditation",
        advanced: "Yoga nidra practice"
      },
      howTo: "Lie flat on your back, legs slightly apart, toes falling outwards. Let your arms rest alongside your body, palms facing up. Gently close your eyes. Relax your entire body.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
      alignmentCues: ["Let gravity do the work", "Soften everything", "Observe without changing"]
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress", "Improves concentration", "Creates vibration"],
      howTo: ["Sit comfortably. Take a deep inhale. On the exhale, chant the sound 'Om', feeling the vibration throughout your body."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses respiratory tract", "Builds internal heat"],
      contraindications: ["Pregnancy", "High blood pressure", "Heart conditions"],
      howTo: ["Sit tall. Take a normal inhale. Forcefully exhale through the nose with a sharp contraction of the abs. The inhale is passive. Perform 30 rapid exhales, then rest."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind", "Harmonizes nervous system"],
      howTo: ["Sit comfortably. Close right nostril with thumb, inhale through left. Close left nostril with ring finger, exhale through right. Inhale through right. Close right, exhale left. This is one round."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind", "Reduces stress", "Calms emotions"],
      contraindications: ["Respiratory conditions", "Cold weather"],
      howTo: ["Sit comfortably. Curl your tongue lengthwise. Inhale slowly through the curled tongue. Close your mouth and exhale slowly through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension and anxiety", "Improves concentration"],
      contraindications: ["Ear infections"],
      howTo: ["Sit comfortably. Close eyes. Place index fingers on the cartilage of your ears. Inhale deeply. Exhale slowly, making a low-pitched humming sound like a bee."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, ],
    focus: "Grounding and setting intentions for the week",
    chakraFocus: "Root Chakra (Muladhara)",
    affirmation: "I am grounded, centered, and ready to embrace the week ahead."
  },

  Monday: {
    theme: "Energizing Flow & Strength",
    difficulty: difficultyLevels.INTERMEDIATE,
    totalDuration: "50-65 mins",
    suryanamaskar: {
      rounds: 7,
      benefits: ["Increases energy", "Strengthens muscles", "Builds heat", "Improves circulation"],
      modifications: {
        beginner: "Step back/forward instead of jumping",
        intermediate: "Flow with breath, hold Down Dog for 5 breaths",
        advanced: "Add arm balances, jump through to seated"
      }
    },
    asanas: [{
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Spine mobility", "Warm-up", "Mind-body connection"],
      howTo: "Start on hands and knees. Inhale, arch your back (Cow). Exhale, round your spine (Cat).",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
      alignmentCues: ["Move from your core", "Breathe deeply"]
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Full-body stretch", "Strengthens arms", "Mild inversion"],
      howTo: "From hands and knees, lift hips up and back into an inverted V.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
      alignmentCues: ["Lengthen spine", "Press through palms"]
    }, {
      name: "Phalakasana (Plank Pose)",
      Sanskrit: "फलकासन",
      duration: "1 min",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Strengthens core", "Improves posture", "Builds arm strength"],
      howTo: "From hands and knees, step feet back to form a straight line from head to heels.",
      youtubeLink: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      alignmentCues: ["Strong straight line", "Engage deep abdominals"]
    }, {
      name: "Bhujangasana (Cobra Pose)",
      Sanskrit: "भुजङ्गासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Strengthens spine", "Opens chest", "Improves posture"],
      howTo: "Lie face down, hands under shoulders, lift chest.",
      youtubeLink: "https://www.youtube.com/watch?v=JUP_YdYyfQM",
      alignmentCues: ["Lift from the heart", "Shoulders away from ears"]
    }, {
      name: "Virabhadrasana I (Warrior I)",
      Sanskrit: "वीरभद्रासन १",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Builds leg strength", "Hip flexibility", "Boosts confidence"],
      howTo: "From standing, step one foot back, turning the back foot out. Bend the front knee over the ankle. Raise arms overhead.",
      youtubeLink: "https://www.youtube.com/watch?v=8AakYeM23sl",
      alignmentCues: ["Front knee over ankle", "Square hips forward"]
    }, {
      name: "Trikonasana (Triangle Pose)",
      Sanskrit: "त्रिकोणासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches hamstrings", "Improves balance", "Side body stretch"],
      howTo: "Step feet wide. Turn right foot out. Hinge at the right hip, reaching right hand towards shin and left arm to the ceiling.",
      youtubeLink: "https://www.youtube.com/watch?v=3p6Q6_sed2U",
      alignmentCues: ["Long spine", "Both sides of waist long"]
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches spine and hamstrings", "Calms nervous system"],
      howTo: "From standing, hinge at the hips and fold forward, relaxing head and neck.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
      alignmentCues: ["Hinge from hips", "Keep spine long"]
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calming and restorative", "Gentle hip opener"],
      howTo: "Kneel and fold your torso forward, resting your forehead on the mat.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
      alignmentCues: ["Surrender and let go", "Breathe into back ribs"]
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "5-10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation", "Integration of practice"],
      howTo: "Lie flat on your back, completely relaxed.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
      alignmentCues: ["Let gravity do the work", "Soften everything"]
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress", "Improves concentration"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses respiratory tract", "Builds internal heat"],
      contraindications: ["Pregnancy", "High blood pressure"],
      howTo: ["Forceful exhales through the nose, passive inhales. 30-50 breaths per round."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind", "Harmonizes nervous system"],
      howTo: ["Alternate breathing between left and right nostrils using your hand."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind", "Reduces stress"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension and anxiety"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, ],
    focus: "Building energy and focus for the week ahead",
    chakraFocus: "Solar Plexus Chakra (Manipura)",
    affirmation: "I am energized, focused, and ready to take on any challenge."
  },

  Tuesday: {
    theme: "Core Strength & Stability",
    difficulty: difficultyLevels.INTERMEDIATE,
    totalDuration: "45-55 mins",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Strengthens core", "Improves digestion", "Builds stability"],
      modifications: {
        beginner: "Hold plank for 30 seconds",
        intermediate: "Add knee-to-elbow in plank",
        advanced: "Chaturanga to side plank variations"
      }
    },
    asanas: [{
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Spine mobility", "Warm-up"],
      howTo: "Start on hands and knees. Inhale, arch your back (Cow). Exhale, round your spine (Cat).",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
      alignmentCues: ["Move from your core", "Breathe deeply"]
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Full-body stretch", "Strengthens arms"],
      howTo: "From hands and knees, lift hips up and back.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
      alignmentCues: ["Lengthen spine", "Press through palms"]
    }, {
      name: "Phalakasana (Plank Pose)",
      Sanskrit: "फलकासन",
      duration: "3-5 mins (in intervals)",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Strengthens core", "Improves posture", "Builds arm strength"],
      howTo: "Form a straight line from head to heels, holding the body rigid.",
      youtubeLink: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      alignmentCues: ["Strong straight line", "Engage deep abdominals"]
    }, {
      name: "Vasisthasana (Side Plank)",
      Sanskrit: "वशिष्ठासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Core strength", "Arm strength", "Balance"],
      howTo: "From plank pose, shift weight to one hand and roll to the outer edge of the foot.",
      youtubeLink: "https://www.youtube.com/watch?v=XeN4pEZZJNE",
      alignmentCues: ["One straight line", "Lift from core"]
    }, {
      name: "Bhujangasana (Cobra Pose)",
      Sanskrit: "भुजङ्गासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Strengthens spine", "Opens chest"],
      howTo: "Lie face down, hands under shoulders, lift chest.",
      youtubeLink: "https://www.youtube.com/watch?v=JUP_YdYyfQM",
      alignmentCues: ["Lift from the heart", "Shoulders away from ears"]
    }, {
      name: "Navasana (Boat Pose)",
      Sanskrit: "नावासन",
      duration: "3 mins (multiple sets)",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Strengthens core", "Improves digestion", "Builds confidence"],
      howTo: "Sit with knees bent, lean back slightly, and lift your feet off the floor.",
      youtubeLink: "https://www.youtube.com/watch?v=l-gEM8NK2eY",
      alignmentCues: ["Lift through crown of head", "Strong core engagement"]
    }, {
      name: "Tadasana (Mountain Pose)",
      Sanskrit: "ताड़ासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Improves posture", "Grounding"],
      howTo: "Stand tall with feet together, balancing weight evenly.",
      youtubeLink: "https://www.youtube.com/watch?v=2HTc_2M22yM",
      alignmentCues: ["Ground through all four corners of feet"]
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches spine and hamstrings", "Calms mind"],
      howTo: "From standing, hinge at the hips and fold forward.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
      alignmentCues: ["Hinge from hips", "Keep spine long"]
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Restorative", "Gentle hip opener"],
      howTo: "Kneel and fold your torso forward, resting.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
      alignmentCues: ["Surrender and let go", "Breathe into back ribs"]
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "5-10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation", "Integration"],
      howTo: "Lie flat on your back, completely relaxed.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
      alignmentCues: ["Let gravity do the work", "Soften everything"]
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses"],
      contraindications: ["Pregnancy", "High blood pressure"],
      howTo: ["Forceful exhales, passive inhales. 30-50 breaths per round."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind"],
      howTo: ["Alternate breathing between left and right nostrils."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Ujjayi Breath (Victorious Breath)",
      Sanskrit: "उज्जायी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Builds internal heat", "Calming", "Increases focus"],
      howTo: ["Breathe through the nose with a gentle constriction at the back of the throat, creating an ocean-like sound."],
      youtubeLink: "https://www.youtube.com/watch?v=bZ6k7AE-2cE",
    }, ],
    focus: "Strengthening core muscles and improving stability",
    chakraFocus: "Solar Plexus Chakra (Manipura)",
    affirmation: "I am strong, stable, and capable of handling life's challenges."
  },

  Wednesday: {
    theme: "Flexibility & Flow",
    difficulty: difficultyLevels.INTERMEDIATE,
    totalDuration: "55-70 mins",
    suryanamaskar: {
      rounds: 7,
      benefits: ["Improves flexibility", "Increases blood flow", "Creates fluid movement"],
      modifications: {
        beginner: "Hold poses longer for deeper stretches",
        intermediate: "Flow smoothly between poses",
        advanced: "Add binds and deeper variations"
      }
    },
    asanas: [{
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Spine mobility", "Warm-up"],
      howTo: "Sync breath with movement: inhale to arch, exhale to round.",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Full-body stretch"],
      howTo: "Lift hips up and back, pressing heels toward the floor.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
    }, {
      name: "Trikonasana (Triangle Pose)",
      Sanskrit: "त्रिकोणासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Side body stretch", "Hamstring flexibility"],
      howTo: "Feet wide, hinge at the hip to create a triangle shape with the body.",
      youtubeLink: "https://www.youtube.com/watch?v=3p6Q6_sed2U",
    }, {
      name: "Virabhadrasana I (Warrior I)",
      Sanskrit: "वीरभद्रासन १",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Hip flexor stretch", "Leg strength"],
      howTo: "Lunge with back foot grounded, arms overhead.",
      youtubeLink: "https://www.youtube.com/watch?v=8AakYeM23sl",
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep hamstring stretch", "Spinal release"],
      howTo: "Fold forward from the hips, letting the head hang heavy.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    }, {
      name: "Paschimottanasana (Seated Forward Bend)",
      Sanskrit: "पश्चिमोत्तानासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the brain", "Stretches spine and hamstrings"],
      howTo: "Sit with legs extended, hinge at the hips and fold forward over your legs.",
      youtubeLink: "https://www.youtube.com/watch?v=g5rk2V8Vt7g",
    }, {
      name: "Baddha Konasana (Bound Angle Pose)",
      Sanskrit: "बद्ध कोणासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Opens hips", "Stretches inner thighs"],
      howTo: "Sit tall, bring soles of feet together, and let knees fall out to the sides.",
      youtubeLink: "https://www.youtube.com/watch?v=7cyHCZXM0Pc",
    }, {
      name: "Bhujangasana (Cobra Pose)",
      Sanskrit: "भुजङ्गासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Gentle backbend", "Opens chest"],
      howTo: "Lie face down and lift the chest, keeping hips on the floor.",
      youtubeLink: "https://www.youtube.com/watch?v=JUP_YdYyfQM",
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Restorative", "Counter-pose for backbends"],
      howTo: "Kneel and fold forward to rest.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "5-10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation", "Integration"],
      howTo: "Lie on your back in complete stillness.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses"],
      contraindications: ["Pregnancy", "High blood pressure"],
      howTo: ["Forceful exhales, passive inhales. 30-50 breaths per round."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind"],
      howTo: ["Alternate breathing between left and right nostrils."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, ],
    focus: "Enhancing flexibility and promoting smooth transitions",
    chakraFocus: "Heart Chakra (Anahata)",
    affirmation: "I flow with grace and ease, adapting to life's changes."
  },

  Thursday: {
    theme: "Balance & Focus",
    difficulty: difficultyLevels.INTERMEDIATE,
    totalDuration: "50-60 mins",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Improves balance", "Strengthens legs", "Enhances concentration"],
      modifications: {
        beginner: "Use wall support during standing poses",
        intermediate: "Hold balancing poses longer",
        advanced: "Close eyes during balance poses"
      }
    },
    asanas: [{
      name: "Tadasana (Mountain Pose)",
      Sanskrit: "ताड़ासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Grounding", "Posture awareness"],
      howTo: "Stand tall, feet grounded.",
      youtubeLink: "https://www.youtube.com/watch?v=2HTc_2M22yM",
    }, {
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Warm-up for the spine"],
      howTo: "Flow between an arched and rounded spine.",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Full-body stretch"],
      howTo: "Lift hips up and back into an inverted V.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
    }, {
      name: "Vrikshasana (Tree Pose)",
      Sanskrit: "वृक्षासन",
      duration: "2 mins each side",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Improves balance", "Focus", "Ankle strength"],
      howTo: "Balance on one leg, placing the other foot on the inner thigh or calf.",
      youtubeLink: "https://www.youtube.com/watch?v=XvjR4_pVa5o",
    }, {
      name: "Garudasana (Eagle Pose)",
      Sanskrit: "गरुडासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Improves concentration", "Stretches shoulders and hips"],
      howTo: "Wrap one leg around the other and one arm under the other, sinking the hips.",
      youtubeLink: "https://www.youtube.com/watch?v=3BeqcbKof_8",
    }, {
      name: "Natarajasana (Dancer Pose)",
      Sanskrit: "नटराजासन",
      duration: "1 min each side",
      difficulty: difficultyLevels.ADVANCED,
      benefits: ["Improves balance", "Opens chest", "Builds confidence"],
      howTo: "Balance on one leg, kicking the other leg back and up while holding the ankle.",
      youtubeLink: "https://www.youtube.com/watch?v=JnqXq4Db82k",
    }, {
      name: "Virabhadrasana I (Warrior I)",
      Sanskrit: "वीरभद्रासन १",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Builds stability and strength"],
      howTo: "Hold a lunge with the back foot grounded and arms raised.",
      youtubeLink: "https://www.youtube.com/watch?v=8AakYeM23sl",
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calming forward fold"],
      howTo: "Fold forward from the hips.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Restorative break"],
      howTo: "Kneel and fold forward.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "5-10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation"],
      howTo: "Lie on your back in complete stillness.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses"],
      contraindications: ["Pregnancy", "High blood pressure"],
      howTo: ["Forceful exhales, passive inhales. 30-50 breaths per round."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind"],
      howTo: ["Alternate breathing between left and right nostrils."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, ],
    focus: "Cultivating balance, focus, and grace",
    chakraFocus: "Third Eye Chakra (Ajna)",
    affirmation: "I am balanced, focused, and gracefully navigate life's challenges."
  },

  Friday: {
    theme: "Deep Stretch & Release",
    difficulty: difficultyLevels.BEGINNER,
    totalDuration: "60-75 mins",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Releases tension", "Improves circulation", "Prepares for deeper stretches"],
      modifications: {
        beginner: "Hold poses longer, gentle movements",
        intermediate: "Add deeper variations",
        advanced: "Combine with backbends and hip openers"
      }
    },
    asanas: [{
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Gentle spine warm-up"],
      howTo: "Flow between arching and rounding the spine.",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
    }, {
      name: "Adho Mukha Svanasana (Downward-Facing Dog)",
      Sanskrit: "अधो मुख श्वानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches hamstrings and spine"],
      howTo: "Lift hips into an inverted V.",
      youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep hamstring release"],
      howTo: "Fold forward from the hips.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    }, {
      name: "Paschimottanasana (Seated Forward Bend)",
      Sanskrit: "पश्चिमोत्तानासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the brain", "Stretches spine and hamstrings"],
      howTo: "Sit with legs extended, hinge at the hips and fold forward.",
      youtubeLink: "https://www.youtube.com/watch?v=g5rk2V8Vt7g",
    }, {
      name: "Janu Sirsasana (Head-to-Knee Pose)",
      Sanskrit: "जानु शीर्षासन",
      duration: "2 mins each side",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Stretches hamstrings", "Calms mind"],
      howTo: "Sit with one leg extended, the other foot to the inner thigh, and fold over the extended leg.",
      youtubeLink: "https://www.youtube.com/watch?v=YQB8rOM-zL0",
    }, {
      name: "Baddha Konasana (Bound Angle Pose)",
      Sanskrit: "बद्ध कोणासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Opens hips", "Stretches inner thighs"],
      howTo: "Sit with soles of feet together, letting knees drop open.",
      youtubeLink: "https://www.youtube.com/watch?v=7cyHCZXM0Pc",
    }, {
      name: "Marichyasana C (Marichi's Pose C)",
      Sanskrit: "मरीच्यासन ग",
      duration: "1 min each side",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Spinal twist", "Aids digestion"],
      howTo: "Sit with one leg extended, the other knee bent. Twist toward the bent knee.",
      youtubeLink: "https://www.youtube.com/watch?v=XXXXX",
    }, {
      name: "Bhujangasana (Cobra Pose)",
      Sanskrit: "भुजङ्गासन",
      duration: "1 min",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Gentle backbend"],
      howTo: "Lie on belly and lift the chest.",
      youtubeLink: "https://www.youtube.com/watch?v=JUP_YdYyfQM",
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deeply restorative"],
      howTo: "Kneel and fold forward.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "10-15 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Complete release and integration"],
      howTo: "Lie flat and still.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Kapalabhati (Skull Shining Breath)",
      Sanskrit: "कपालभाति",
      duration: "3 rounds",
      difficulty: difficultyLevels.INTERMEDIATE,
      benefits: ["Energizing", "Cleanses"],
      contraindications: ["Pregnancy", "High blood pressure"],
      howTo: ["Forceful exhales, passive inhales. 30-50 breaths per round."],
      youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind"],
      howTo: ["Alternate breathing between left and right nostrils."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, ],
    focus: "Releasing tension and promoting deep relaxation",
    chakraFocus: "Sacral Chakra (Svadhisthana)",
    affirmation: "I release what no longer serves me and embrace flexibility in all areas of life."
  },

  Saturday: {
    theme: "Restoration & Integration",
    difficulty: difficultyLevels.BEGINNER,
    totalDuration: "75-90 mins",
    suryanamaskar: {
      rounds: 3,
      benefits: ["Gentle movement", "Prepares for relaxation", "Mindful transitions"],
      modifications: {
        beginner: "Very slow, meditative movements",
        intermediate: "Focus on breath awareness",
        advanced: "Add meditation between poses"
      }
    },
    asanas: [{
      name: "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      Sanskrit: "मार्जार्यासन-बितिलासन",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Gentle spine mobilization"],
      howTo: "Slow, mindful movements with the breath.",
      youtubeLink: "https://www.youtube.com/watch?v=kqnua4rHVVA",
    }, {
      name: "Balasana (Child's Pose)",
      Sanskrit: "बालासन",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deeply calming and restorative"],
      howTo: "Kneel and fold forward, supported by props if needed.",
      youtubeLink: "https://www.youtube.com/watch?v=2Y4hpwmMRbU",
    }, {
      name: "Supta Baddha Konasana (Reclined Bound Angle Pose)",
      Sanskrit: "सुप्त बद्ध कोणासन",
      duration: "10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Opens hips", "Gentle heart opener"],
      howTo: "Lie on your back with the soles of your feet together, supported by bolsters.",
      youtubeLink: "https://www.youtube.com/watch?v=q0Lht7DMAFQ",
    }, {
      name: "Supported Fish Pose (Matsyasana variation)",
      Sanskrit: "मत्स्यासन",
      duration: "10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Opens chest", "Counters forward postures"],
      howTo: "Lie back over a bolster or folded blanket to open the chest.",
      youtubeLink: "https://www.youtube.com/watch?v=XXXXX",
    }, {
      name: "Viparita Karani (Legs-up-the-Wall Pose)",
      Sanskrit: "विपरीत करणी",
      duration: "15 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Relieves tired legs", "Calms the nervous system"],
      howTo: "Sit sideways next to a wall and swing your legs up.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
    }, {
      name: "Uttanasana (Standing Forward Bend)",
      Sanskrit: "उत्तानासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Gentle hamstring stretch"],
      howTo: "Fold forward with knees generously bent.",
      youtubeLink: "https://www.youtube.com/watch?v=g_tea8ZNk5A",
    }, {
      name: "Tadasana (Mountain Pose)",
      Sanskrit: "ताड़ासन",
      duration: "2 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Mindful standing and grounding"],
      howTo: "Stand tall and feel the connection to the earth.",
      youtubeLink: "https://www.youtube.com/watch?v=2HTc_2M22yM",
    }, {
      name: "Shavasana (Corpse Pose)",
      Sanskrit: "शवासन",
      duration: "20-30 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Deep relaxation and integration"],
      howTo: "Lie completely still, supported by blankets and bolsters for maximum comfort.",
      youtubeLink: "https://www.youtube.com/watch?v=1VYlOKUdylM",
    }, ],
    pranayama: [{
      name: "Om Chanting",
      Sanskrit: "ॐ जप",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the mind", "Reduces stress"],
      howTo: ["Sit comfortably. Inhale deeply. Exhale with the sound 'Om'."],
      youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
    }, {
      name: "Anulom Vilom (Alternate Nostril Breathing)",
      Sanskrit: "अनुलोम विलोम",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Balances energy", "Calms the mind"],
      howTo: ["Alternate breathing between left and right nostrils."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Sheetali (Cooling Breath)",
      Sanskrit: "शीतली",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Cools the body and mind"],
      howTo: ["Inhale through a curled tongue, exhale through the nose."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Bhramari (Humming Bee Breath)",
      Sanskrit: "भ्रामरी",
      duration: "3 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Calms the nervous system", "Relieves tension"],
      howTo: ["Close ears, inhale, and exhale with a humming sound."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "Deep Diaphragmatic Breathing",
      Sanskrit: "धीर्घ श्वास",
      duration: "5 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Promotes deep relaxation", "Reduces heart rate"],
      howTo: ["Lie down and place one hand on your belly. Inhale slowly, feeling your belly rise, and exhale feeling it fall."],
      youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
    }, {
      name: "So Hum Meditation",
      Sanskrit: "सो हं ध्यान",
      duration: "10 mins",
      difficulty: difficultyLevels.BEGINNER,
      benefits: ["Self-awareness", "Inner peace", "Reduces mental chatter"],
      howTo: ["Sit or lie comfortably. On the inhale, silently repeat 'So'. On the exhale, silently repeat 'Hum'."],
      youtubeLink: "https://www.youtube.com/watch?v=XXXXX",
    }, ],
    focus: "Promoting deep relaxation, mindfulness, and integration of the week's practice",
    chakraFocus: "Crown Chakra (Sahasrara)",
    affirmation: "I am complete, whole, and connected to the infinite wisdom within."
  },
};

// Enhanced meditation tracks with more variety
export const meditationTracks = [{
  name: "Forest Sounds",
  url: forest,
  duration: "10 mins",
  emoji: "🌲",
  description: "Peaceful forest ambiance with bird songs",
  mood: "grounding"
}, {
  name: "Ocean Waves",
  url: ocean,
  duration: "15 mins",
  emoji: "🌊",
  description: "Rhythmic ocean waves for deep relaxation",
  mood: "calming"
}, {
  name: "Rain & Thunder",
  url: rain,
  duration: "20 mins",
  emoji: "🌧️",
  description: "Gentle rain with distant thunder",
  mood: "soothing"
}, {
  name: "Tibetan Bowls",
  url: tibetan,
  duration: "12 mins",
  emoji: "🎵",
  description: "Sacred Tibetan singing bowls",
  mood: "spiritual"
}, {
  name: "Flute Meditation",
  url: flute,
  duration: "18 mins",
  emoji: "🎶",
  description: "Melodic flute for heart-opening meditation",
  mood: "uplifting"
}, {
  name: "Mantra Chanting",
  url: mantra,
  duration: "25 mins",
  emoji: "🕉️",
  description: "Traditional Sanskrit mantras",
  mood: "devotional"
}, ];

// Expanded yoga quotes with categories
export const yogaQuotes = [{
  quote: "Yoga is a journey of the self, through the self, to the self.",
  author: "The Bhagavad Gita",
  category: "philosophy"
}, {
  quote: "The body benefits from movement, and the mind benefits from stillness.",
  author: "Sakyong Mipham",
  category: "balance"
}, {
  quote: "Yoga is not about touching your toes. It is what you learn on the way down.",
  author: "Judith Hanson Lasater",
  category: "journey"
}, {
  quote: "Peace comes from within. Do not seek it without.",
  author: "Buddha",
  category: "inner peace"
}, {
  quote: "The pose begins when you want to leave it.",
  author: "Baron Baptiste",
  category: "perseverance"
}, {
  quote: "Inhale the future, exhale the past.",
  author: "Anonymous",
  category: "presence"
}, {
  quote: "Yoga is the perfect opportunity to be curious about who you are.",
  author: "Jason Crandell",
  category: "self-discovery"
}, {
  quote: "The success of yoga does not lie in the ability to attain the perfect posture but in how it enhances one's well-being.",
  author: "T.K.V. Desikachar",
  category: "wellness"
}, {
  quote: "Yoga is not a work-out, it is a work-in.",
  author: "Rolf Gates",
  category: "inner work"
}, {
  quote: "The rhythm of the body, the melody of the mind, and the harmony of the soul is the dance of life.",
  author: "B.K.S. Iyengar",
  category: "harmony"
}, {
  quote: "Yoga is a light, which once lit will never dim. The better your practice, the brighter your flame.",
  author: "B.K.S. Iyengar",
  category: "practice"
}, {
  quote: "Change is not only possible, it's inevitable when you practice yoga regularly.",
  author: "Baron Baptiste",
  category: "transformation"
}];

// Enhanced asana images with more poses
export const asanaImages = {
  "Tadasana (Mountain Pose)": "https://media.istockphoto.com/id/1366703229/vector/palm-tree-pose-urdhva-hastasana-upward-hand-stretch-pose-upward-salute-raised-hands-pose.jpg?s=612x612&w=0&k=20&c=rY1lIudAf5GTFGFQq1FP_aIMOSXDuwBgTp5ipngSu5E=",
  "Shavasana (Corpse Pose)": "https://www.keralatourism.org/images/yoga/static-banner/large/Savasana_-_The_Corpse_Pose-07032020145736.jpg",
  "Paschimottanasana (Seated Forward Bend)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLuSptm7cxCe84Beq-t_b8y_uoqL-FuijTg&s",
  "Janu Sirsasana (Head-to-Knee Pose)": "https://www.gaia.com/wp-content/uploads/JanuSirsasana-NicoLuce.jpg",
  "Baddha Konasana (Bound Angle Pose)": "https://cdn.yogajournal.com/wp-content/uploads/2022/10/Bound-Angle-Pose_Mod-1_Andrew-Clark_2400x1350.jpeg",
  "Supta Baddha Konasana (Reclined Bound Angle Pose)": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDqAMO8WE998Ylj-mWg36EIHxsbNl7MIYU2A&s",
  "Viparita Karani (Legs-up-the-Wall Pose)": "https://cdn.yogaeasy.de/production/uploads/article/picture/5853/large_legs-up-the-wall-pose.jpg",
  "Vrikshasana (Tree Pose)": "https://www.arhantayoga.org/wp-content/uploads/2022/03/Tree-Pose-%E2%80%93-Vrikshasana.jpg",
  "Surya Namaskar Sequence Focus": "https://harithayogshala.com/upload/blog/steps-of-surya-namaskar_1650126696.jpg",
  "Adho Mukha Svanasana (Downward-Facing Dog)": "https://cdn.yogaeasy.de/production/uploads/article/picture/6282/large_article_Downward-Facing-Dog-Pose-Adho-Mukha-Svanasana.jpg",
  "Uttanasana (Standing Forward Bend)": "https://cdn.yogajournal.com/wp-content/uploads/2021/11/Uttanasana-Pose_Andrew-Clark_2400x1350.jpeg",
  "Phalakasana (Plank Pose)": "https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3eb6d_Untitled-design-24.jpg",
  "Bhujangasana (Cobra Pose)": "https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg",
  "Navasana (Boat Pose)": "https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3ea9b_boat-pose-yoga.jpeg",
  "Trikonasana (Triangle Pose)": "https://yogapractice.com/wp-content/uploads/2019/08/Triangle-Pose-Yoga.jpg",
  "Parivrtta Trikonasana (Revolved Triangle Pose)": "https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg",
  "Balasana (Child's Pose)": "https://karunayoga.in/wp-content/uploads/2020/03/balasana.jpg",
  "Garudasana (Eagle Pose)": "https://www.vinyasayogaashram.com/blog/wp-content/uploads/2021/06/Garudasana-Eagle-Pose-2.jpg",
  "Natarajasana (Dancer Pose)": "https://omstars.com/blog/wp-content/uploads/2023/02/how-to-do-Natarajasana-Dancer-Pose.png",
  "Vasisthasana (Side Plank)": "https://www.yogajournal.com/wp-content/uploads/2018/04/sideplankcrop.jpg",
  "Utthita Parsvakonasana (Extended Side Angle)": "https://www.yogajournal.com/wp-content/uploads/2021/11/Extended-Side-Angle-Pose_Andrew-Clark.jpg",
  "Marjaryasana-Bitilasana (Cat-Cow Stretch)": "https://www.yogajournal.com/wp-content/uploads/2021/11/Cat-Cow-Pose_Andrew-Clark.jpg",
  "Supported Fish Pose (Matsyasana variation)": "https://www.doyogawithme.com/sites/default/files/content/blog-images/supported-fish-pose-restorative-yoga.jpg",
  "Marichyasana C (Marichi's Pose C)": "https://www.yogajournal.com/wp-content/uploads/2018/04/marichyasana-c.png",
  "Utthita Hasta Padangusthasana (Extended Hand-to-Big-Toe Pose)": "https://www.yogajournal.com/wp-content/uploads/2021/11/Extended-Hand-to-Big-Toe-Pose_Andrew-Clark.jpg"
};

// Enhanced audio tracks
export const audioTracks = {
  relax: relaxAudio,
  energize: energizeAudio,
  forest: forest,
  ocean: ocean,
  rain: rain,
  tibetan: tibetan,
  flute: flute,
  mantra: mantra
};

// Chakra information for enhanced practice
export const chakraInfo = {
  "Root Chakra (Muladhara)": {
    Sanskrit: "मूलाधार",
    color: "red",
    element: "earth",
    location: "base of spine",
    qualities: ["grounding", "stability", "security", "survival"],
    poses: ["Tadasana", "Vrikshasana", "Balasana"],
    affirmation: "I am safe, secure, and grounded."
  },
  "Sacral Chakra (Svadhisthana)": {
    Sanskrit: "स्वाधिष्ठान",
    color: "orange",
    element: "water",
    location: "below navel",
    qualities: ["creativity", "sexuality", "emotions", "pleasure"],
    poses: ["Baddha Konasana", "hip openers", "flowing movements"],
    affirmation: "I embrace my creativity and honor my emotions."
  },
  "Solar Plexus Chakra (Manipura)": {
    Sanskrit: "मणिपूर",
    color: "yellow",
    element: "fire",
    location: "upper abdomen",
    qualities: ["personal power", "confidence", "transformation", "will"],
    poses: ["Navasana", "Phalakasana", "core strengthening poses"],
    affirmation: "I am confident, powerful, and worthy of respect."
  },
  "Heart Chakra (Anahata)": {
    Sanskrit: "अनाहत",
    color: "green",
    element: "air",
    location: "center of chest",
    qualities: ["love", "compassion", "connection", "healing"],
    poses: ["backbends", "arm opening", "Bhujangasana"],
    affirmation: "I give and receive love freely and unconditionally."
  },
  "Throat Chakra (Vishuddha)": {
    Sanskrit: "विशुद्ध",
    color: "blue",
    element: "space",
    location: "throat",
    qualities: ["communication", "truth", "expression", "authenticity"],
    poses: ["neck releases", "fish pose", "shoulder stand"],
    affirmation: "I speak my truth with confidence and clarity."
  },
  "Third Eye Chakra (Ajna)": {
    Sanskrit: "आज्ञा",
    color: "indigo",
    element: "light",
    location: "between eyebrows",
    qualities: ["intuition", "wisdom", "insight", "psychic abilities"],
    poses: ["balancing poses", "meditation", "pranayama"],
    affirmation: "I trust my inner wisdom and intuitive guidance."
  },
  "Crown Chakra (Sahasrara)": {
    Sanskrit: "सहस्रार",
    color: "violet/white",
    element: "thought",
    location: "top of head",
    qualities: ["spirituality", "enlightenment", "connection to divine", "pure consciousness"],
    poses: ["meditation", "Shavasana", "inversions"],
    affirmation: "I am connected to the divine wisdom of the universe."
  }
};

// Practice sequences for different goals
export const practiceSequences = {
  morningEnergizer: {
    name: "Morning Energizer",
    duration: "20-30 mins",
    difficulty: difficultyLevels.BEGINNER,
    poses: [
      "Marjaryasana-Bitilasana (Cat-Cow Stretch)",
      "Adho Mukha Svanasana (Downward-Facing Dog)",
      "Surya Namaskar Sequence Focus",
      "Vrikshasana (Tree Pose)",
      "Tadasana (Mountain Pose)"
    ],
    pranayama: ["Kapalabhati (Skull Shining Breath)"],
    benefits: ["Increases energy", "Improves circulation", "Mental clarity"]
  },
  stressRelief: {
    name: "Stress Relief",
    duration: "30-45 mins",
    difficulty: difficultyLevels.BEGINNER,
    poses: [
      "Balasana (Child's Pose)",
      "Supta Baddha Konasana (Reclined Bound Angle Pose)",
      "Paschimottanasana (Seated Forward Bend)",
      "Viparita Karani (Legs-up-the-Wall Pose)",
      "Shavasana (Corpse Pose)"
    ],
    pranayama: ["Anulom Vilom (Alternate Nostril Breathing)", "Deep Diaphragmatic Breathing"],
    benefits: ["Reduces stress", "Calms nervous system", "Promotes relaxation"]
  },
  coreStrength: {
    name: "Core Strength",
    duration: "25-35 mins",
    difficulty: difficultyLevels.INTERMEDIATE,
    poses: [
      "Phalakasana (Plank Pose)",
      "Navasana (Boat Pose)",
      "Vasisthasana (Side Plank)",
      "Bhujangasana (Cobra Pose)",
      "Balasana (Child's Pose)"
    ],
    pranayama: ["Ujjayi Breath (Victorious Breath)"],
    benefits: ["Strengthens core", "Improves posture", "Builds stability"]
  },
  flexibility: {
    name: "Deep Flexibility",
    duration: "45-60 mins",
    difficulty: difficultyLevels.BEGINNER,
    poses: [
      "Baddha Konasana (Bound Angle Pose)",
      "Janu Sirsasana (Head-to-Knee Pose)",
      "Paschimottanasana (Seated Forward Bend)",
      "Trikonasana (Triangle Pose)",
      "Shavasana (Corpse Pose)"
    ],
    pranayama: ["Sheetali (Cooling Breath - tongue curled)"],
    benefits: ["Increases flexibility", "Releases tension", "Calms mind"]
  }
};

// Progress tracking suggestions
export const progressTracking = {
  weekly: {
    flexibility: "Note improvements in forward folds and hip openers",
    strength: "Track how long you can hold poses like Plank and Boat",
    balance: "Record stability improvements in standing poses",
    breathing: "Monitor breath awareness and pranayama practice"
  },
  monthly: {
    goals: "Set realistic monthly goals for your practice",
    photos: "Take progress photos in key poses",
    journaling: "Reflect on mental and emotional changes",
    measurements: "Track physical improvements if desired"
  },
  milestones: [
    "First time holding Tree Pose for 1 minute",
    "Completing 5 Sun Salutations without rest",
    "Touching toes in Standing Forward Bend",
    "Meditating for 10 minutes consistently",
    "Practicing 5 days a week for a month"
  ]
};

export default weeklyYogaRoutine;