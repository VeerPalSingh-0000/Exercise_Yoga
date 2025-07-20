import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import relaxAudio from "../assets/soothing.mp3";
import energizeAudio from "../assets/suryanamaskar.mp3";
import forest from "../assets/sounds/forest.mp3";
import ocean from "../assets/sounds/ocean.mp3";
import rain from "../assets/sounds/rain.mp3";
import tibetan from "../assets/sounds/tibetan.mp3";

// ======================== DATA & CONFIGURATION ========================
const weeklyYogaRoutine = {
  Sunday: {
    theme: "Gentle Flow & Grounding",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Warms the body", "Improves flexibility"],
    },
    asanas: [
      {
        name: "Tadasana (Mountain Pose)",
        Sanskrit: "ताड़ासन",
        duration: "5 mins",
        benefits: ["Improves posture", "Grounding"],
        howTo:
          "Stand tall with feet together or hip-width apart...\nEnsure weight is balanced evenly on both feet.\nEngage your thighs and lift your kneecaps.\nTuck your tailbone slightly.\nReach your arms alongside your body, palms facing forward, or overhead.\nShoulders should be relaxed, away from the ears.\nLook straight ahead or gently close your eyes.",
        youtubeLink: "http://www.youtube.com/watch?v=2HTvZp5rPrg",
      },
      {
        name: "Vrikshasana (Tree Pose)",
        Sanskrit: "वृक्षासन",
        duration: "5 mins",
        benefits: ["Balance", "Focus"],
        howTo:
          "From Tadasana, shift weight to one foot.\nBend the other knee and place the sole of the foot on the inner thigh, calf, or ankle of the standing leg.\nAvoid pressing the foot directly onto the knee joint.\nBring your hands together in Anjali Mudra (prayer position) at the chest or extend them overhead.\nFind a steady point of gaze (drishti).\nKeep the standing leg strong and the hips level.\nHold for several breaths, then switch sides.",
        youtubeLink: null,
      },
      {
        name: "Shavasana (Corpse Pose)",
        Sanskrit: "शवासन",
        duration: "10 mins",
        benefits: ["Relaxation", "Stress reduction"],
        howTo:
          "Lie flat on your back, legs slightly apart, toes falling outwards.\nLet your arms rest alongside your body, palms facing up.\nGently close your eyes.\nRelax your entire body, starting from the toes up to the crown of your head.\nRelease any tension in your jaw, forehead, and shoulders.\nAllow your breath to be natural and effortless.\nStay in this pose for at least 5-15 minutes.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Anulom Vilom (Alternate Nostril Breathing)",
        Sanskrit: "अनुलोम विलोम",
        duration: "5 mins",
        benefits: [
          "Balances energy",
          "Calms the mind",
          "Improves respiratory function",
        ],
        howTo: [
          "Sit comfortably with a straight spine.",
          "Close your right nostril with your right thumb.",
          "Inhale slowly and deeply through the left nostril.",
          "Close the left nostril with your right ring and little fingers.",
          "Release the thumb and exhale completely through the right nostril.",
          "Inhale through the right nostril.",
          "Close the right nostril with your thumb.",
          "Release the ring and little fingers and exhale completely through the left nostril.",
          "This completes one round. Repeat for the desired duration.",
          "Maintain a smooth and steady breath.",
        ],
        youtubeLink: "http://www.youtube.com/watch?v=Nhw92icsQ1A",
      },
      {
        name: "Om Chanting",
        Sanskrit: "ॐ जप",
        duration: "5-10 mins",
        benefits: [
          "Calms the mind",
          "Reduces stress",
          "Improves concentration",
          "Creates vibration",
        ],
        howTo: [
          "Sit comfortably with a straight spine.",
          "Close your eyes or soften your gaze.",
          "Take a deep inhale.",
          "On the exhale, chant the sound 'Om'. The sound is often broken down into A-U-M.",
          "Let the 'A' sound originate from the belly, the 'U' sound move up into the chest and throat, and the 'M' sound resonate in the head, fading out.",
          "Feel the vibration throughout your body.",
          "Repeat for the desired duration, focusing on the sound and sensation.",
        ],
        youtubeLink: "https://youtu.be/nBFyrKYI6TU?si=GsluZX8NafvUjiEo",
      },
    ],
    focus: "Grounding and setting intentions for the week",
  },
  Monday: {
    theme: "Energizing Flow",
    suryanamaskar: {
      rounds: 7,
      benefits: ["Increases energy", "Strengthens muscles"],
    },
    asanas: [
      {
        name: "Surya Namaskar Sequence Focus",
        Sanskrit: "सूर्य नमस्कार",
        duration: "10 mins",
        benefits: ["Full body warm-up", "Improves circulation"],
        howTo:
          "Perform the 12 steps of Sun Salutation A or B with awareness of breath and movement.\nStart in Tadasana, inhale arms up.\nExhale forward fold (Uttanasana).\nInhale halfway lift (Ardha Uttanasana).\nExhale step or jump back to Plank (Phalakasana).\nLower to Chaturanga Dandasana (or knees, chest, chin).\nInhale Cobra (Bhujangasana) or Upward-Facing Dog (Urdhva Mukha Svanasana).\nExhale Downward-Facing Dog (Adho Mukha Svanasana).\nHold for several breaths.\nInhale step or jump forward.\nExhale forward fold.\nInhale rise up with a flat back, arms overhead.\nExhale to Tadasana.\nRepeat.",
        youtubeLink: null,
      },
      {
        name: "Adho Mukha Svanasana (Downward-Facing Dog)",
        Sanskrit: "अधो मुख श्वानासन",
        duration: "5 mins",
        benefits: ["Stretches hamstrings", "Calms the mind"],
        howTo:
          "Start on hands and knees, wrists under shoulders, knees under hips.\nTuck your toes and lift your hips up and back, forming an inverted V shape.\nPress firmly through your palms and distribute weight evenly through hands and feet.\nReach your heels towards the mat (they don't have to touch).\nStraighten your legs as much as comfortable.\nLet your head hang gently between your arms.\nHold for several breaths, lengthening the spine.",
        youtubeLink: "http://www.youtube.com/watch?v=EC7RGJ975iM",
      },
      {
        name: "Uttanasana (Standing Forward Bend)",
        Sanskrit: "उत्तानासन",
        duration: "3 mins",
        benefits: ["Stretches spine", "Relieves stress"],
        howTo:
          "From Tadasana, exhale and hinge at the hips, folding forward.\nKeep your spine long as you fold.\nAllow your head and neck to relax.\nPlace hands on the floor, blocks, or shins.\nKeep knees slightly bent if hamstrings are tight.\nInhale to lengthen the spine, exhale to fold deeper.\nHold for several breaths.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Kapalabhati (Skull Shining Breath)",
        Sanskrit: "कपालभाति",
        duration: "3 rounds (20-30 breaths each)",
        benefits: [
          "Energizing",
          "Cleanses respiratory tract",
          "Improves focus",
        ],
        howTo: [
          "Sit tall with a straight spine.",
          "Take a normal inhale.",
          "Forcefully exhale through the nose with a sharp contraction of the abdominal muscles.",
          "The inhale is passive and happens automatically.",
          "Focus on the exhale.",
          "Perform 20-30 rapid exhales, then take a deep inhale and exhale slowly.",
          "Rest and repeat for 2-3 rounds.",
          "Avoid if pregnant, have high blood pressure, or heart conditions.",
        ],
        youtubeLink: "http://www.youtube.com/watch?v=52TOhE94fEg",
      },
    ],
    focus: "Building energy and focus for the week ahead",
  },
  Tuesday: {
    theme: "Core Strength",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Strengthens core", "Improves digestion"],
    },
    asanas: [
      {
        name: "Phalakasana (Plank Pose)",
        Sanskrit: "फलकासन",
        duration: "3 mins",
        benefits: ["Strengthens core", "Improves posture"],
        howTo:
          "From hands and knees, step feet back so your body forms a straight line from head to heels.\nEnsure wrists are directly under shoulders.\nEngage your core, glutes, and quads.\nKeep your neck in a neutral position, looking slightly forward.\nAvoid letting your hips sag or pike up.\nHold for the desired duration, maintaining a steady breath.",
        youtubeLink: null,
      },
      {
        name: "Bhujangasana (Cobra Pose)",
        Sanskrit: "भुजङ्गासन",
        duration: "3 mins",
        benefits: ["Strengthens spine", "Opens chest"],
        howTo:
          "Lie face down on the mat, legs extended, tops of feet on the floor.\nPlace hands under shoulders, fingers pointing forward.\nPress your pubic bone into the mat.\nOn an inhale, press through your hands and lift your chest off the floor.\nKeep a slight bend in your elbows, hugging them towards your body.\nRoll your shoulders back and down.\nKeep your neck long, looking slightly forward.\nExhale to lower back down.",
        youtubeLink: null,
      },
      {
        name: "Navasana (Boat Pose)",
        Sanskrit: "नावासन",
        duration: "5 mins",
        benefits: ["Strengthens core", "Improves digestion"],
        howTo: [
          "Sit with knees bent, feet flat on the floor.",
          "Lean back slightly, keeping your spine straight.",
          "Lift your feet off the floor, bringing your shins parallel to the floor (half boat) or straightening your legs (full boat).",
          "Extend your arms forward, parallel to the floor.",
          "Keep your chest lifted and engage your core.",
          "If needed, keep hands on the floor behind you for support.",
        ],
        youtubeLink: "http://www.youtube.com/watch?v=lgzt416ROSY",
      },
    ],
    pranayama: [
      {
        name: "Ujjayi Breath (Victorious Breath)",
        Sanskrit: "उज्जायी",
        duration: "5 mins",
        benefits: [
          "Builds internal heat",
          "Calming",
          "Increases focus during practice",
        ],
        howTo: [
          "Breathe in and out through the nose.",
          "Gently constrict the back of your throat, as if whispering or fogging a mirror.",
          "This creates a soft ocean-like sound.",
          "Keep the breath smooth, deep, and rhythmic.",
          "Inhale and exhale should be of equal length.",
          "Practice this breath throughout your physical yoga practice.",
        ],
        youtubeLink: "https://youtu.be/CF3U-4igCVk?si=70411mZ3QBpjwFS8",
      },
    ],
    focus: "Strengthening core muscles and improving stability",
  },
  Wednesday: {
    theme: "Flexibility & Flow",
    suryanamaskar: {
      rounds: 7,
      benefits: ["Improves flexibility", "Increases blood flow"],
    },
    asanas: [
      {
        name: "Trikonasana (Triangle Pose)",
        Sanskrit: "त्रिकोणासन",
        duration: "5 mins",
        benefits: ["Stretches hamstrings", "Improves balance"],
        howTo:
          "Step feet wide apart (about 3-4 feet).\nTurn the right foot out 90 degrees and the left foot slightly in.\nExtend arms parallel to the floor.\nHinge at the right hip, reaching your right hand towards your right shin, ankle, or the floor.\nExtend your left arm towards the ceiling, stacking it over your right arm.\nKeep both legs straight.\nLook up towards the left hand or straight ahead.\nHold for several breaths, then repeat on the other side.",
        youtubeLink: null,
      },
      {
        name: "Parivrtta Trikonasana (Revolved Triangle Pose)",
        Sanskrit: "परिवृत्त त्रिकोणासन",
        duration: "5 mins",
        benefits: ["Improves digestion", "Detoxifies spine"],
        howTo:
          "Similar stance to Trikonasana, with feet slightly closer.\nTurn your hips to face the front foot.\nInhale and extend your left arm up.\nExhale and hinge forward, bringing your left hand to the outside of your right foot (or on a block).\nExtend your right arm towards the ceiling.\nKeep both legs straight.\nTwist your torso towards the right, looking up at the right hand.\nHold for several breaths, then repeat on the other side.",
        youtubeLink: null,
      },
      {
        name: "Balasana (Child's Pose)",
        Sanskrit: "बालासन",
        duration: "5 mins",
        benefits: ["Calms the mind", "Relieves stress"],
        howTo:
          "Kneel on the floor, big toes touching.\nSeparate your knees wide or keep them together.\nSit back on your heels.\nFold your torso forward, resting your forehead on the mat.\nExtend your arms forward or rest them alongside your body, palms facing back.\nRelax your shoulders and allow your back to soften.\nBreathe deeply and release tension.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Nadi Shodhana (Channel Cleaning Breath)",
        Sanskrit: "नाडी शोधन",
        duration: "7 mins",
        benefits: [
          "Purifies energy channels",
          "Promotes mental clarity",
          "Reduces anxiety",
        ],
        howTo: [
          "Sit comfortably with a straight spine.",
          "Close your right nostril with your right thumb.",
          "Inhale slowly and deeply through the left nostril.",
          "Close the left nostril with your right ring and little fingers.",
          "Release the thumb and exhale completely through the right nostril.",
          "Inhale through the right nostril.",
          "Close the right nostril with your thumb.",
          "Release the ring and little fingers and exhale completely through the left nostril.",
          "This completes one round. Repeat for the desired duration.",
          "Maintain a smooth and steady breath.",
          "(Note: This technique is very similar to Anulom Vilom, often used interchangeably or with slightly different retention timings).",
        ],
        youtubeLink: "http://www.youtube.com/watch?v=Nhw92icsQ1A",
      },
    ],
    focus: "Enhancing flexibility and promoting smooth transitions",
  },
  Thursday: {
    theme: "Balancing Practice",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Improves balance", "Strengthens legs"],
    },
    asanas: [
      {
        name: "Vrikshasana (Tree Pose)",
        Sanskrit: "वृक्षासन",
        duration: "5 mins",
        benefits: ["Improves balance", "Focus"],
        howTo:
          "From Tadasana, shift weight to one foot.\nBend the other knee and place the sole of the foot on the inner thigh, calf, or ankle of the standing leg.\nAvoid pressing the foot directly onto the knee joint.\nBring your hands together in Anjali Mudra (prayer position) at the chest or extend them overhead.\nFind a steady point of gaze (drishti).\nKeep the standing leg strong and the hips level.\nHold for several breaths, then switch sides.",
        youtubeLink: null,
      },
      {
        name: "Garudasana (Eagle Pose)",
        Sanskrit: "गरुडासन",
        duration: "5 mins",
        benefits: ["Improves concentration", "Stretches shoulders"],
        howTo:
          "Stand, slightly bend knees.\nLift your right foot and wrap it over your left thigh, hooking the right foot around the left calf (if possible).\nExtend your arms forward.\nCross your left arm over your right, bending elbows and bringing palms together (or backs of hands if palms don't touch).\nLift elbows up and away from the face.\nSit hips back and down.\nKeep spine straight.\nHold for several breaths, then switch sides.",
        youtubeLink: null,
      },
      {
        name: "Natarajasana (Dancer Pose)",
        Sanskrit: "नटराजासन",
        duration: "3 mins per side",
        benefits: ["Improves balance", "Strengthens legs"],
        howTo:
          "Stand tall.\nBend one knee and grasp the ankle or foot with the hand of the same side.\nExtend the opposite arm forward or up.\nKick the lifted leg back and up, simultaneously leaning your torso forward.\nKeep the standing leg strong.\nMaintain a steady gaze.\nHold for several breaths, then switch sides.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Bhramari (Humming Bee Breath)",
        Sanskrit: "भ्रामरी",
        duration: "5 mins",
        benefits: [
          "Calms the nervous system",
          "Relieves tension and anxiety",
          "Improves concentration",
        ],
        howTo: [
          "Sit comfortably.",
          "Close your eyes.",
          "Place your index fingers on the cartilage between your cheek and ear (tragus).",
          "Close your ears gently.",
          "Inhale deeply through the nose.",
          "Exhale slowly through the nose, making a low-pitched humming sound (like a bee).",
          "Repeat for several rounds, feeling the vibration in your head.",
        ],
        youtubeLink: "http://www.youtube.com/watch?v=KkurfEQrg94",
      },
    ],
    focus: "Cultivating balance, focus, and grace",
  },
  Friday: {
    theme: "Deep Stretch & Release",
    suryanamaskar: {
      rounds: 5,
      benefits: ["Releases tension", "Improves circulation"],
    },
    asanas: [
      {
        name: "Paschimottanasana (Seated Forward Bend)",
        Sanskrit: "पश्चिमोत्तानासन",
        duration: "7 mins",
        benefits: ["Calms the brain", "Stretches spine"],
        howTo:
          "Sit with legs extended forward, feet flexed.\nInhale and lengthen your spine.\nExhale and hinge at the hips, folding forward over your legs.\nReach for your feet, ankles, or shins.\nKeep your spine long, avoiding rounding the back.\nRelax your neck and shoulders.\nHold for several breaths, deepening the stretch on exhales.",
        youtubeLink: null,
      },
      {
        name: "Janu Sirsasana (Head-to-Knee Pose)",
        Sanskrit: "जानु शीर्षासन",
        duration: "5 mins per side",
        benefits: ["Stretches hamstrings", "Improves flexibility"],
        howTo:
          "Sit with one leg extended forward.\nBend the other knee and bring the sole of that foot to the inner thigh of the extended leg.\nInhale and lengthen your spine.\nExhale and hinge at the hips, folding forward over the extended leg.\nReach for the foot, ankle, or shin.\nKeep the spine long.\nHold for several breaths, then repeat on the other side.",
        youtubeLink: null,
      },
      {
        name: "Baddha Konasana (Bound Angle Pose)",
        Sanskrit: "बद्ध कोणासन",
        duration: "5 mins",
        benefits: ["Opens hips", "Stimulates abdominal organs"],
        howTo:
          "Sit tall, bring soles of feet together.\nLet your knees fall out to the sides.\nGrasp your feet with your hands.\nKeep your spine long.\nFor a deeper stretch, gently press knees towards the floor.\nOption to fold forward from the hips, keeping the spine long.\nHold for several breaths.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Sheetali (Cooling Breath - tongue curled)",
        Sanskrit: "शीतली",
        duration: "5 mins",
        benefits: [
          "Cools the body and mind",
          "Reduces stress",
          "Calms emotions",
        ],
        howTo: [
          "Sit comfortably.",
          "Curl your tongue lengthwise, forming a tube.",
          "Inhale slowly through the curled tongue.",
          "Close your mouth and exhale slowly through the nose.",
          "If you cannot curl your tongue, use Sheetkari (sip air through clenched teeth).",
          "Repeat for several rounds.",
        ],
        youtubeLink: "https://youtu.be/Kqa3l49jij8?si=UenpadJHqIAYkuU-",
      },
    ],
    focus: "Releasing tension and promoting deep relaxation",
  },
  Saturday: {
    theme: "Relaxation & Mindfulness",
    suryanamaskar: {
      rounds: 3,
      benefits: ["Gentle movement", "Prepares for relaxation"],
    },
    asanas: [
      {
        name: "Supta Baddha Konasana (Reclined Bound Angle Pose)",
        Sanskrit: "सुप्त बद्ध कोणासन",
        duration: "7 mins",
        benefits: ["Calms the mind", "Opens hips"],
        howTo:
          "Lie on your back.\nBring the soles of your feet together, letting your knees fall out to the sides.\nPlace hands on your belly, alongside your body, or overhead.\nAllow your body to relax and gravity to open the hips.\nBreathe deeply and release tension.\nHold for several minutes.",
        youtubeLink: null,
      },
      {
        name: "Viparita Karani (Legs-up-the-Wall Pose)",
        Sanskrit: "विपरीत करणी",
        duration: "10 mins",
        benefits: ["Relieves tired legs", "Calms the nervous system"],
        howTo:
          "Sit sideways next to a wall.\nSwing your legs up the wall as you lie back on the floor.\nAdjust your distance from the wall so your hips are either touching the wall or slightly away.\nRest your arms comfortably alongside your body or on your belly.\nAllow your legs to be supported by the wall.\nRelax and breathe deeply.\nHold for 5-15 minutes.",
        youtubeLink: null,
      },
      {
        name: "Shavasana (Corpse Pose)",
        Sanskrit: "शवासन",
        duration: "15 mins",
        benefits: ["Deep relaxation", "Reduces stress"],
        howTo:
          "Lie flat on your back, legs slightly apart, toes falling outwards.\nLet your arms rest alongside your body, palms facing up.\nGently close your eyes.\nRelax your entire body, starting from the toes up to the crown of your head.\nRelease any tension in your jaw, forehead, and shoulders.\nAllow your breath to be natural and effortless.\nStay in this pose for at least 5-15 minutes.",
        youtubeLink: null,
      },
    ],
    pranayama: [
      {
        name: "Deep Diaphragmatic Breathing",
        Sanskrit: "धीर्घ श्वास",
        duration: "10 mins",
        benefits: [
          "Promotes deep relaxation",
          "Reduces heart rate",
          "Oxygenates blood",
        ],
        howTo: [
          "Lie down or sit comfortably.",
          "Place one hand on your chest and the other on your belly.",
          "Inhale slowly through the nose, feeling your belly rise.",
          "Keep your chest relatively still.",
          "Exhale slowly through the nose or mouth, feeling your belly fall.",
          "Draw the navel slightly towards the spine to expel all air.",
          "Focus on the gentle rise and fall of your belly.",
          "Breathe deeply and rhythmically.",
        ],
        youtubeLink: "https://youtu.be/qhcBjSirMss?si=VZE9flZ2Mgv9dRnz",
      },
    ],
    focus: "Promoting deep relaxation, mindfulness, and rejuvenation",
  },
};

const asanaImages = {
  "Tadasana (Mountain Pose)":
    "https://media.istockphoto.com/id/1366703229/vector/palm-tree-pose-urdhva-hastasana-upward-hand-stretch-pose-upward-salute-raised-hands-pose.jpg?s=612x612&w=0&k=20&c=rY1lIudAf5GTFGFQq1FP_aIMOSXDuwBgTp5ipngSu5E=",
  "Shavasana (Corpse Pose)":
    "https://www.keralatourism.org/images/yoga/static-banner/large/Savasana_-_The_Corpse_Pose-07032020145736.jpg",
  "Paschimottanasana (Seated Forward Bend)":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLuSptm7cxCe84Beq-t_b8y_uoqL-FuijTg&s",
  "Janu Sirsasana (Head-to-Knee Pose)":
    "https://www.gaia.com/wp-content/uploads/JanuSirsasana-NicoLuce.jpg",
  "Baddha Konasana (Bound Angle Pose)":
    "https://cdn.yogajournal.com/wp-content/uploads/2022/10/Bound-Angle-Pose_Mod-1_Andrew-Clark_2400x1350.jpeg",
  "Supta Baddha Konasana (Reclined Bound Angle Pose)":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDqAMO8WE998Ylj-mWg36EIHxsbNl7MIYU2A&s",
  "Viparita Karani (Legs-up-the-Wall Pose)":
    "https://cdn.yogaeasy.de/production/uploads/article/picture/5853/large_legs-up-the-wall-pose.jpg",
  "Vrikshasana (Tree Pose)":
    "https://www.arhantayoga.org/wp-content/uploads/2022/03/Tree-Pose-%E2%80%93-Vrikshasana.jpg",
  "Surya Namaskar Sequence Focus":
    "https://harithayogshala.com/upload/blog/steps-of-surya-namaskar_1650126696.jpg",
  "Adho Mukha Svanasana (Downward-Facing Dog)":
    "https://cdn.yogaeasy.de/production/uploads/article/picture/6282/large_article_Downward-Facing-Dog-Pose-Adho-Mukha-Svanasana.jpg",
  "Uttanasana (Standing Forward Bend)":
    "https://cdn.yogajournal.com/wp-content/uploads/2021/11/Uttanasana-Pose_Andrew-Clark_2400x1350.jpeg",
  "Phalakasana (Plank Pose)":
    "https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3eb6d_Untitled-design-24.jpg",
  "Bhujangasana (Cobra Pose)":
    "https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg",
  "Navasana (Boat Pose)":
    "https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3ea9b_boat-pose-yoga.jpeg",
  "Trikonasana (Triangle Pose)":
    "https://yogapractice.com/wp-content/uploads/2019/08/Triangle-Pose-Yoga.jpg",
  "Parivrtta Trikonasana (Revolved Triangle Pose)":
    "https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg",
  "Balasana (Child's Pose)":
    "https://karunayoga.in/wp-content/uploads/2020/03/balasana.jpg",
  "Garudasana (Eagle Pose)":
    "https://www.vinyasayogaashram.com/blog/wp-content/uploads/2021/06/Garudasana-Eagle-Pose-2.jpg",
  "Natarajasana (Dancer Pose)":
    "https://omstars.com/blog/wp-content/uploads/2023/02/how-to-do-Natarajasana-Dancer-Pose.png",
};

const meditationTracks = [
  { name: "Forest Sounds", url: forest , duration: "10 mins", emoji: "🌲" },
  { name: "Ocean Waves", url: ocean, duration: "15 mins", emoji: "🌊" },
  { name: "Rain & Thunder", url: rain, duration: "20 mins", emoji: "🌧️" },
  { name: "Tibetan Bowls", url: tibetan, duration: "12 mins", emoji: "🎵" },
];

const yogaQuotes = [
  "Yoga is a journey of the self, through the self, to the self. - The Bhagavad Gita",
  "The body benefits from movement, and the mind benefits from stillness.",
  "Yoga is not about touching your toes. It is what you learn on the way down.",
  "Peace comes from within. Do not seek it without. - Buddha",
  "The pose begins when you want to leave it.",
  "Inhale the future, exhale the past.",
  "Yoga is the perfect opportunity to be curious about who you are.",
  "The success of yoga does not lie in the ability to attain the perfect posture but in how it enhances one's well-being.",
];

// ======================== MAIN COMPONENT ========================
const Yoga = () => {
  // ======================== UTILITY FUNCTIONS ========================
  const getStorageItem = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const setStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  };

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  // ======================== STATE MANAGEMENT ========================
  const [expandedDay, setExpandedDay] = useState(() =>
    getStorageItem("expandedDay", getCurrentDay())
  );
  const [expandedAsanas, setExpandedAsanas] = useState(() =>
    getStorageItem("expandedAsanas", {})
  );
  const [expandedHowTo, setExpandedHowTo] = useState(() =>
    getStorageItem("expandedHowTo", {})
  );
  const [showAllPranayama, setShowAllPranayama] = useState(() =>
    getStorageItem("showAllPranayama", true)
  );
  const [editableRoutine, setEditableRoutine] = useState(() =>
    getStorageItem("editableRoutine", weeklyYogaRoutine)
  );
  const [completedExercises, setCompletedExercises] = useState(() =>
    getStorageItem("completedExercises", {})
  );
  const [favorites, setFavorites] = useState(() =>
    getStorageItem("favorites", {})
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showStats, setShowStats] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentView, setCurrentView] = useState("routine"); // routine, meditation, stats, settings
  const [notifications, setNotifications] = useState(() =>
    getStorageItem("notifications", { enabled: false, time: "07:00" })
  );
  const [volume, setVolume] = useState(() => getStorageItem("volume", 0.5));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("yogaAppTheme");
    if (savedTheme) return savedTheme;
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  });

  // Timer state
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerDuration, setTimerDuration] = useState(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  // Breathing exercise state
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale");
  const [breathTimeRemaining, setBreathTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [bubbleSize, setBubbleSize] = useState(100);
  const [breathTimerId, setBreathTimerId] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);
  // ADD these new states after the existing breathing states
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 1 progress
  const [animationFrameId, setAnimationFrameId] = useState(null);

  // Audio state
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  // Quote of the day
  const [dailyQuote, setDailyQuote] = useState(() => {
    const today = new Date().toDateString();
    const savedQuote = getStorageItem("dailyQuote", null);
    if (savedQuote && savedQuote.date === today) {
      return savedQuote.quote;
    }
    const randomQuote =
      yogaQuotes[Math.floor(Math.random() * yogaQuotes.length)];
    setStorageItem("dailyQuote", { date: today, quote: randomQuote });
    return randomQuote;
  });

  // ======================== EFFECTS ========================
  useEffect(() => {
    localStorage.setItem("yogaAppTheme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Auto-save states
  useEffect(() => {
    setStorageItem("expandedDay", expandedDay);
  }, [expandedDay]);
  useEffect(() => {
    setStorageItem("expandedAsanas", expandedAsanas);
  }, [expandedAsanas]);
  useEffect(() => {
    setStorageItem("expandedHowTo", expandedHowTo);
  }, [expandedHowTo]);
  useEffect(() => {
    setStorageItem("showAllPranayama", showAllPranayama);
  }, [showAllPranayama]);
  useEffect(() => {
    setStorageItem("editableRoutine", editableRoutine);
  }, [editableRoutine]);
  useEffect(() => {
    setStorageItem("completedExercises", completedExercises);
  }, [completedExercises]);
  useEffect(() => {
    setStorageItem("favorites", favorites);
  }, [favorites]);
  useEffect(() => {
    setStorageItem("notifications", notifications);
  }, [notifications]);
  useEffect(() => {
    setStorageItem("volume", volume);
  }, [volume]);

  // Audio volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const [audioLoading, setAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Audio refs - ADD these after audioRef
  const meditationAudioRef = useRef(null);
  const currentAudioRef = useRef(null);

  // ======================== HANDLER FUNCTIONS ========================
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleAsanaImage = (day, asanaIndex, event) => {
    event.stopPropagation();
    const key = `asana-${day}-${asanaIndex}`;
    setExpandedAsanas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleHowTo = (itemKey, event) => {
    event.stopPropagation();
    setExpandedHowTo((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const toggleComplete = (type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setCompletedExercises((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleFavorite = (type, day, index) => {
    const key = `${type}-${day}-${index}`;
    setFavorites((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const playMusic = (type) => {
    const selected = type === "relax" ? relaxAudio : energizeAudio;

    setAudioLoading(true);
    setAudioError(null);

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    currentAudioRef.current = audioRef.current;
    audioRef.current.src = selected;
    audioRef.current.volume = volume;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setCurrentTrack(type);
        setAudioLoading(false);
      })
      .catch((error) => {
        console.error("Background audio play failed:", error);
        setAudioError(`Failed to play ${type} music`);
        setAudioLoading(false);
      });
  };

  const playMeditationTrack = (track) => {
    setAudioLoading(true);
    setAudioError(null);

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    currentAudioRef.current = meditationAudioRef.current;
    meditationAudioRef.current.src = track.url;
    meditationAudioRef.current.volume = volume;

    meditationAudioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setCurrentTrack(track);
        setAudioLoading(false);
      })
      .catch((error) => {
        console.error("Meditation audio play failed:", error);
        setAudioError(`Failed to play ${track.name}`);
        setAudioLoading(false);
      });
  };

  const pauseMusic = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopMusic = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  // Timer functions
  const startTimer = (duration) => {
    setActiveTimer(true);
    setTimeRemaining(duration);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setActiveTimer(false);
          // Play completion sound or notification
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setActiveTimer(false);
    setTimeRemaining(0);
  };

  // Breathing exercise functions
  const breathingConfig = useMemo(
    () => ({
      inhale: 4,
      hold: 2,
      exhale: 4,
      pause: 2,
      minBubbleSize: 120,
      maxBubbleSize: 240, // Slightly larger for better visual impact
    }),
    []
  );

  const startPhase = useCallback((phase, duration) => {
    setBreathPhase(phase);
    setBreathTimeRemaining(duration);
    setTotalDuration(duration);
    setBreathProgress(0);

    // Don't set bubble size here - let it animate based on progress
  }, []);

  const startBreathingExercise = useCallback(() => {
    console.log("Starting breathing exercise"); // Debug log
    setIsBreathingActive(true);
    setCycleCount(1);
    setBreathProgress(0);
    setBreathPhase("Inhale");
    setTotalDuration(breathingConfig.inhale);
    setBreathTimeRemaining(breathingConfig.inhale);
  }, [breathingConfig]);

  const stopBreathingExercise = useCallback(() => {
    setIsBreathingActive(false);
    if (breathTimerId) {
      clearInterval(breathTimerId);
      setBreathTimerId(null);
    }
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
    // Reset all states
    setBreathPhase("Inhale");
    setBreathTimeRemaining(0);
    setTotalDuration(0);
    setBreathProgress(0);
    setBubbleSize(breathingConfig.minBubbleSize);
    setCycleCount(0);
  }, [breathTimerId, animationFrameId, breathingConfig.minBubbleSize]);

  // Enhanced smooth animation effect - REPLACE the existing one
  // Simplified animation effect that WORKS - REPLACE existing animation effect
  useEffect(() => {
    if (!isBreathingActive) return;

    let intervalId;
    let progress = 0;
    const increment = 1 / (totalDuration * 10); // Update 10 times per second

    const updateProgress = () => {
      progress += increment;

      if (progress >= 1) {
        progress = 1;
        setBreathProgress(1);
        setBreathTimeRemaining(0);
        clearInterval(intervalId);
      } else {
        setBreathProgress(progress);
        setBreathTimeRemaining(totalDuration * (1 - progress));
      }
    };

    intervalId = setInterval(updateProgress, 100); // Update every 100ms

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isBreathingActive, totalDuration, breathPhase]); // Only these dependencies

  // Get all pranayama techniques
  const allPranayama = useMemo(() => {
    const techniques = {};
    Object.values(editableRoutine).forEach((dayData) => {
      if (Array.isArray(dayData.pranayama)) {
        dayData.pranayama.forEach((pranayama) => {
          if (!techniques[pranayama.name]) {
            techniques[pranayama.name] = { ...pranayama };
          }
        });
      }
    });
    return Object.values(techniques);
  }, [editableRoutine]);

  // Filter functions
  const filteredDays = useMemo(() => {
    if (!searchTerm && activeFilter === "all")
      return Object.keys(editableRoutine);

    return Object.keys(editableRoutine).filter((day) => {
      const dayData = editableRoutine[day];
      const searchIncludes =
        day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayData.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dayData.asanas.some(
          (asana) =>
            asana.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asana.benefits.some((benefit) =>
              benefit.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

      const filterMatches =
        activeFilter === "all" ||
        (activeFilter === "favorites" &&
          Object.keys(favorites).some((key) => key.includes(day))) ||
        (activeFilter === "completed" &&
          Object.keys(completedExercises).some((key) => key.includes(day)));

      return searchIncludes && filterMatches;
    });
  }, [
    searchTerm,
    activeFilter,
    editableRoutine,
    favorites,
    completedExercises,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalCompleted =
      Object.values(completedExercises).filter(Boolean).length;
    const totalFavorites = Object.values(favorites).filter(Boolean).length;
    const completionByDay = {};

    Object.keys(editableRoutine).forEach((day) => {
      const dayAsanas = editableRoutine[day].asanas.length;
      const dayPranayama = editableRoutine[day].pranayama.length;
      const total = dayAsanas + dayPranayama;
      const completed = Object.keys(completedExercises).filter(
        (key) => key.includes(day) && completedExercises[key]
      ).length;
      completionByDay[day] = {
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      };
    });

    return { totalCompleted, totalFavorites, completionByDay };
  }, [completedExercises, favorites, editableRoutine]);

  // ======================== RENDER FUNCTIONS ========================
  const renderHeader = () => (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
              🧘‍♀️ <span className="hidden sm:inline ml-2">Yoga Se Hoga</span>
            </h1>
            <div className="hidden md:flex space-x-2">
              {["routine", "meditation", "stats", "settings"].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentView === view
                      ? "bg-blue-500 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-all duration-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            <div className="md:hidden">
              <select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
                className="bg-transparent text-sm"
              >
                <option value="routine">Routine</option>
                <option value="meditation">Meditation</option>
                <option value="stats">Stats</option>
                <option value="settings">Settings</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchAndFilters = () => (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search poses, benefits, or days..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-10 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", "favorites", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
            {filter === "favorites" && ` (${stats.totalFavorites})`}
            {filter === "completed" && ` (${stats.totalCompleted})`}
          </button>
        ))}
      </div>
    </div>
  );

  const renderAudioControls = () => (
    <div className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        🎵 Audio Controls
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => playMusic("relax")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentTrack === "relax" && isPlaying
              ? "bg-teal-600 text-white"
              : "bg-teal-500 hover:bg-teal-600 text-white"
          }`}
        >
          🌸 Relax
        </button>
        <button
          onClick={() => playMusic("energize")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentTrack === "energize" && isPlaying
              ? "bg-orange-600 text-white"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          ⚡ Energize
        </button>
        <button
          onClick={pauseMusic}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          ⏸️ Pause
        </button>
        <button
          onClick={stopMusic}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          ⏹️ Stop
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Volume:
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
          {Math.round(volume * 100)}%
        </span>
      </div>
    </div>
  );

  const renderQuoteOfTheDay = () => (
    <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
          ✨ Quote of the Day
        </h3>
        <blockquote className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base leading-relaxed">
          "{dailyQuote}"
        </blockquote>
      </div>
    </div>
  );

  const renderPoseTimer = () => (
    <div className="mb-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
      <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-300">
        ⏱️ Pose Timer
      </h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {[60, 300, 600, 900].map((duration) => (
          <button
            key={duration}
            onClick={() => startTimer(duration)}
            disabled={activeTimer}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-all"
          >
            {duration < 60 ? `${duration}s` : `${duration / 60}min`}
          </button>
        ))}
        {activeTimer && (
          <button
            onClick={stopTimer}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
          >
            Stop
          </button>
        )}
      </div>
      {activeTimer && (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {Math.floor(timeRemaining / 60)}:
            {(timeRemaining % 60).toString().padStart(2, "0")}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Time remaining
          </div>
        </div>
      )}
    </div>
  );

  // ADD this function before renderBreathingExercise
  // Simplified bubble size calculation - REPLACE existing function
  const calculateBubbleSize = () => {
    const { minBubbleSize, maxBubbleSize } = breathingConfig;
    const sizeRange = maxBubbleSize - minBubbleSize;

    // Debug: Log values to console
    console.log("Phase:", breathPhase, "Progress:", breathProgress);

    let size = minBubbleSize;

    switch (breathPhase) {
      case "Inhale":
        size = minBubbleSize + sizeRange * breathProgress;
        break;
      case "Hold":
        size = maxBubbleSize;
        break;
      case "Exhale":
        size = maxBubbleSize - sizeRange * breathProgress;
        break;
      case "Pause":
        size = minBubbleSize;
        break;
      default:
        size = minBubbleSize;
    }

    // Debug: Log final size
    console.log("Calculated size:", size);
    return size;
  };

  const renderBreathingExercise = () => {
    if (!isBreathingActive) {
      return (
        <div className="text-center mb-6">
          <button
            onClick={startBreathingExercise}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            🫁 Start 4-2-4-2 Breathing (5 Cycles)
          </button>
        </div>
      );
    }

    const displayTime =
      breathTimeRemaining > 0 ? breathTimeRemaining.toFixed(1) : "0.0";
    const currentBubbleSize = calculateBubbleSize(); // This now works properly

    // Enhanced instruction text with breathing guidance
    const getInstructionText = () => {
      switch (breathPhase) {
        case "Inhale":
          return "Breathe In Slowly 🌱";
        case "Hold":
          return "Hold Your Breath 🫸";
        case "Exhale":
          return "Breathe Out Slowly 🍃";
        case "Pause":
          return "Pause & Relax 😌";
        default:
          return breathPhase;
      }
    };

    return (
      <div className="flex flex-col items-center justify-center mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4 transition-all duration-300">
          {getInstructionText()}
        </h3>

        {/* Enhanced Progress Ring */}
        <div className="relative mb-4 flex items-center justify-center">
          <svg width="280" height="280" className="transform -rotate-90">
            <circle
              cx="140"
              cy="140"
              r="130"
              stroke="rgba(59, 130, 246, 0.15)"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="140"
              cy="140"
              r="130"
              stroke="url(#progressGradient)"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 130}`}
              strokeDashoffset={`${2 * Math.PI * 130 * (1 - breathProgress)}`}
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                <stop offset="100%" stopColor="rgb(147, 51, 234)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Smoothly Animated Bubble */}
          {/* Fixed Smoothly Animated Bubble - REPLACE the existing bubble div */}
          <div
            className="absolute rounded-full border-4 border-white/40 shadow-2xl flex items-center justify-center transition-all duration-300 ease-out"
            style={{
              top: "50%",
              left: "50%",
              width: `${currentBubbleSize}px`,
              height: `${currentBubbleSize}px`,
              transform: "translate(-50%, -50%)", // Single transform for perfect centering
              background: `radial-gradient(circle at 30% 30%, 
      ${
        breathPhase === "Inhale"
          ? "rgba(34, 197, 94, 0.9)"
          : breathPhase === "Exhale"
          ? "rgba(239, 68, 68, 0.9)"
          : "rgba(59, 130, 246, 0.9)"
      }, 
      ${
        breathPhase === "Inhale"
          ? "rgba(22, 163, 74, 1)"
          : breathPhase === "Exhale"
          ? "rgba(220, 38, 38, 1)"
          : "rgba(29, 78, 216, 1)"
      })`,
              boxShadow: `0 15px 40px ${
                breathPhase === "Inhale"
                  ? "rgba(34, 197, 94, 0.5)"
                  : breathPhase === "Exhale"
                  ? "rgba(239, 68, 68, 0.5)"
                  : "rgba(59, 130, 246, 0.5)"
              }`,
            }}
          >
            <div className="text-center text-white">
              <div className="text-2xl font-bold drop-shadow-lg filter">
                {displayTime}
              </div>
              <div className="text-xs opacity-80 font-medium">seconds</div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Display */}
        <div className="text-center">
          <p className="text-blue-700 dark:text-blue-300 font-semibold mb-3">
            Cycle: {cycleCount} of 5
          </p>
          <div className="w-64 bg-blue-200 dark:bg-blue-800 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-inner"
              style={{
                width: `${Math.min(
                  ((cycleCount - 1) / 5) * 100 + (breathProgress / 5) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={stopBreathingExercise}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          Stop Exercise
        </button>
      </div>
    );
  };

  const renderStats = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        📊 Your Progress
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalCompleted}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-300">
            Exercises Completed
          </div>
        </div>
        <div className="bg-pink-100 dark:bg-pink-900/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {stats.totalFavorites}
          </div>
          <div className="text-sm text-pink-800 dark:text-pink-300">
            Favorites
          </div>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(
              Object.values(stats.completionByDay).reduce(
                (acc, day) => acc + day.percentage,
                0
              ) / 7
            )}
            %
          </div>
          <div className="text-sm text-green-800 dark:text-green-300">
            Average Completion
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Daily Completion Progress
        </h3>
        {Object.entries(stats.completionByDay).map(([day, data]) => (
          <div key={day} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {day}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {data.completed}/{data.total} ({Math.round(data.percentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMeditation = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        🧘‍♂️ Meditation & Mindfulness
      </h2>

      {audioError && (
        <div className="mb-3 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          ⚠️ {audioError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meditationTracks.map((track, index) => (
          <div
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{track.emoji}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {track.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {track.duration}
              </p>

              {currentTrack === track && isPlaying ? (
                <button
                  onClick={pauseMusic}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  ⏸️ Pause
                </button>
              ) : (
                <button
                  onClick={() => playMeditationTrack(track)}
                  disabled={audioLoading}
                  className={`w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all ${
                    audioLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {audioLoading ? "⏳ Loading..." : "▶️ Play"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-4">
          🔔 Daily Reminder
        </h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={notifications.enabled}
              onChange={(e) =>
                setNotifications((prev) => ({
                  ...prev,
                  enabled: e.target.checked,
                }))
              }
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Enable daily yoga reminder
            </span>
          </label>
          <input
            type="time"
            value={notifications.time}
            onChange={(e) =>
              setNotifications((prev) => ({ ...prev, time: e.target.value }))
            }
            className="px-3 py-1 rounded-lg bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-sm"
            disabled={!notifications.enabled}
          />
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        ⚙️ Settings
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                theme === "dark" ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  theme === "dark" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">
              Auto-expand Today's Routine
            </span>
            <button
              onClick={() => setExpandedDay(getCurrentDay())}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
            >
              Go to Today
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Data Management
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const data = {
                routine: editableRoutine,
                completed: completedExercises,
                favorites: favorites,
                settings: { theme, notifications, volume },
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "yoga-routine-backup.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all"
          >
            📥 Export Data
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  "This will reset all your progress and favorites. Are you sure?"
                )
              ) {
                setCompletedExercises({});
                setFavorites({});
                setEditableRoutine(weeklyYogaRoutine);
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
          >
            🔄 Reset All Data
          </button>
        </div>
      </div>
    </div>
  );

  const renderYogaRoutine = () => {
    const allPranayamaArray = Object.values(allPranayama);

    return (
      <div className="space-y-6">
        {renderQuoteOfTheDay()}
        {renderAudioControls()}
        {renderPoseTimer()}
        {renderBreathingExercise()}
        {renderSearchAndFilters()}

        {/* All Pranayama Section */}
        {allPranayamaArray.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div
              className="px-6 py-4 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex justify-between items-center cursor-pointer"
              onClick={() => setShowAllPranayama(!showAllPranayama)}
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                🧘‍♀️ All Pranayama Techniques
                <span className="ml-2 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-sm">
                  {allPranayamaArray.length}
                </span>
              </h2>
              <div
                className={`transform transition-transform duration-300 ${
                  showAllPranayama ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-6 h-6 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {showAllPranayama && (
              <div className="p-6 space-y-4">
                {allPranayamaArray.map((pranayama, index) => {
                  const pranKey = `all-pranayama-${index}`;
                  const isHowToExpanded = !!expandedHowTo[pranKey];
                  const isFavorite = !!favorites[pranKey];
                  const isCompleted = !!completedExercises[pranKey];

                  return (
                    <div
                      key={pranKey}
                      className="bg-purple-50 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h5 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                            {pranayama.name}
                            <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                              ({pranayama.Sanskrit})
                            </span>
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ⏱️ {pranayama.duration} • 💫{" "}
                            {pranayama.benefits.join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              toggleComplete("pranayama", "all", index)
                            }
                            className={`p-2 rounded-full transition-all ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-800"
                            }`}
                            title="Mark as completed"
                          >
                            ✓
                          </button>

                          <button
                            onClick={() =>
                              toggleFavorite("pranayama", "all", index)
                            }
                            className={`p-2 rounded-full transition-all ${
                              isFavorite
                                ? "bg-red-500 text-white"
                                : "bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-800"
                            }`}
                            title="Add to favorites"
                          >
                            ❤️
                          </button>

                          {Array.isArray(pranayama.howTo) &&
                            pranayama.howTo.length > 0 && (
                              <button
                                onClick={(e) => toggleHowTo(pranKey, e)}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm transition-all"
                              >
                                {isHowToExpanded ? "Hide" : "How To"}
                                <span
                                  className={`ml-1 transform transition-transform ${
                                    isHowToExpanded ? "rotate-180" : ""
                                  }`}
                                >
                                  ▼
                                </span>
                              </button>
                            )}

                          {pranayama.youtubeLink && (
                            <a
                              href={pranayama.youtubeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all flex items-center"
                            >
                              📺 Video
                            </a>
                          )}
                        </div>
                      </div>

                      {isHowToExpanded && Array.isArray(pranayama.howTo) && (
                        <div className="bg-white dark:bg-slate-600 rounded-lg p-4 mt-3 border-l-4 border-purple-400">
                          <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            How to practice:
                          </h6>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                            {pranayama.howTo.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Weekly Routine */}
        {filteredDays.map((day) => {
          const dayData = editableRoutine[day];
          const isDayExpanded = expandedDay === day;
          const isToday = day === getCurrentDay();

          return (
            <div
              key={day}
              className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                isToday ? "ring-2 ring-blue-400 dark:ring-blue-600" : ""
              }`}
            >
              <div
                className={`px-6 py-4 cursor-pointer transition-all ${
                  isToday
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                    : "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-800 hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-600 dark:hover:to-slate-700"
                }`}
                onClick={() => toggleDay(day)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
                      {day}{" "}
                      {isToday && (
                        <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                          Today
                        </span>
                      )}
                    </h2>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {dayData.theme}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {dayData.asanas.length} poses • {dayData.pranayama.length}{" "}
                      breathing exercises
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-center">
                      <div className="text-lg">
                        {stats.completionByDay[day]?.percentage > 0
                          ? "🌟"
                          : "⭕"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(
                          stats.completionByDay[day]?.percentage || 0
                        )}
                        %
                      </div>
                    </div>

                    <div
                      className={`transform transition-transform duration-300 ${
                        isDayExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="w-6 h-6 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {isDayExpanded && (
                <div className="p-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      <span className="font-semibold not-italic text-gray-800 dark:text-gray-200">
                        Focus:
                      </span>{" "}
                      {dayData.focus}
                    </p>
                  </div>

                  {/* Surya Namaskar */}
                  <div className="mb-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">
                      ☀️ Surya Namaskar
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      <span className="font-medium">Rounds:</span>{" "}
                      {dayData.suryanamaskar.rounds} •
                      <span className="font-medium ml-2">Benefits:</span>{" "}
                      {dayData.suryanamaskar.benefits.join(", ")}
                    </p>
                  </div>

                  {/* Asanas */}
                  <div className="mb-6">
                    <h4
                      className="text-lg font-semibold text
-gray-800 dark:text-gray-200 mb-3"
                    >
                      🧘‍♂️ Asanas (Poses)
                    </h4>
                    <div className="space-y-4">
                      {dayData.asanas.map((asana, asanaIndex) => {
                        const asanaKey = `asana-${day}-${asanaIndex}`;
                        const isImageExpanded = !!expandedAsanas[asanaKey];
                        const isHowToExpanded = !!expandedHowTo[asanaKey];
                        const isFavorite = !!favorites[asanaKey];
                        const isCompleted = !!completedExercises[asanaKey];

                        return (
                          <div
                            key={asanaIndex}
                            className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-lg font-semibold text-blue-700 dark:text-blue-300 break-words">
                                  {asana.name}
                                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                                    ({asana.Sanskrit})
                                  </span>
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  ⏱️ {asana.duration} • 💫{" "}
                                  {asana.benefits.join(", ")}
                                </p>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                  onClick={() =>
                                    toggleComplete("asana", day, asanaIndex)
                                  }
                                  className={`p-2 rounded-full transition-all ${
                                    isCompleted
                                      ? "bg-green-500 text-white scale-110"
                                      : "bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-800"
                                  }`}
                                  title="Mark as completed"
                                >
                                  ✓
                                </button>

                                <button
                                  onClick={() =>
                                    toggleFavorite("asana", day, asanaIndex)
                                  }
                                  className={`p-2 rounded-full transition-all ${
                                    isFavorite
                                      ? "bg-red-500 text-white scale-110"
                                      : "bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-800"
                                  }`}
                                  title="Add to favorites"
                                >
                                  ❤️
                                </button>

                                {asanaImages[asana.name] && (
                                  <button
                                    onClick={(e) =>
                                      toggleAsanaImage(day, asanaIndex, e)
                                    }
                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                                  >
                                    🖼️ {isImageExpanded ? "Hide" : "Show"}
                                  </button>
                                )}

                                <button
                                  onClick={(e) => toggleHowTo(asanaKey, e)}
                                  className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm transition-all"
                                >
                                  {isHowToExpanded ? "Hide" : "How To"}
                                  <span
                                    className={`ml-1 transform transition-transform ${
                                      isHowToExpanded ? "rotate-180" : ""
                                    }`}
                                  >
                                    ▼
                                  </span>
                                </button>

                                {asana.youtubeLink && (
                                  <a
                                    href={asana.youtubeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all flex items-center"
                                  >
                                    📺
                                  </a>
                                )}
                              </div>
                            </div>

                            {isImageExpanded && asanaImages[asana.name] && (
                              <div className="mb-3 text-center">
                                <img
                                  src={asanaImages[asana.name]}
                                  alt={asana.name}
                                  className="max-w-full h-auto max-h-64 rounded-lg shadow-lg mx-auto"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display =
                                      "block";
                                  }}
                                />
                                <div className="hidden text-gray-500 dark:text-gray-400 text-sm mt-2">
                                  Image not available
                                </div>
                              </div>
                            )}

                            {isHowToExpanded && (
                              <div className="bg-white dark:bg-slate-600 rounded-lg p-4 border-l-4 border-blue-400">
                                <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                  How to practice:
                                </h6>
                                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                  {asana.howTo}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pranayama */}
                  {Array.isArray(dayData.pranayama) &&
                    dayData.pranayama.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                          🫁 Pranayama (Breathing)
                        </h4>
                        <div className="space-y-4">
                          {dayData.pranayama.map((pranayama, pranIndex) => {
                            const pranKey = `pranayama-${day}-${pranIndex}`;
                            const isHowToExpanded = !!expandedHowTo[pranKey];
                            const isFavorite = !!favorites[pranKey];
                            const isCompleted = !!completedExercises[pranKey];

                            return (
                              <div
                                key={pranIndex}
                                className="bg-purple-50 dark:bg-slate-700 rounded-lg p-4 hover:shadow-md transition-all"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-lg font-semibold text-purple-700 dark:text-purple-300 break-words">
                                      {pranayama.name}
                                      <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                                        ({pranayama.Sanskrit})
                                      </span>
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      ⏱️ {pranayama.duration} • 💫{" "}
                                      {pranayama.benefits.join(", ")}
                                    </p>
                                  </div>

                                  <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                      onClick={() =>
                                        toggleComplete(
                                          "pranayama",
                                          day,
                                          pranIndex
                                        )
                                      }
                                      className={`p-2 rounded-full transition-all ${
                                        isCompleted
                                          ? "bg-green-500 text-white scale-110"
                                          : "bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-800"
                                      }`}
                                      title="Mark as completed"
                                    >
                                      ✓
                                    </button>

                                    <button
                                      onClick={() =>
                                        toggleFavorite(
                                          "pranayama",
                                          day,
                                          pranIndex
                                        )
                                      }
                                      className={`p-2 rounded-full transition-all ${
                                        isFavorite
                                          ? "bg-red-500 text-white scale-110"
                                          : "bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-800"
                                      }`}
                                      title="Add to favorites"
                                    >
                                      ❤️
                                    </button>

                                    {Array.isArray(pranayama.howTo) &&
                                      pranayama.howTo.length > 0 && (
                                        <button
                                          onClick={(e) =>
                                            toggleHowTo(pranKey, e)
                                          }
                                          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg text-sm transition-all"
                                        >
                                          {isHowToExpanded ? "Hide" : "How To"}
                                          <span
                                            className={`ml-1 transform transition-transform ${
                                              isHowToExpanded
                                                ? "rotate-180"
                                                : ""
                                            }`}
                                          >
                                            ▼
                                          </span>
                                        </button>
                                      )}

                                    {pranayama.youtubeLink && (
                                      <a
                                        href={pranayama.youtubeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all flex items-center"
                                      >
                                        📺
                                      </a>
                                    )}
                                  </div>
                                </div>

                                {isHowToExpanded &&
                                  Array.isArray(pranayama.howTo) && (
                                    <div className="bg-white dark:bg-slate-600 rounded-lg p-4 border-l-4 border-purple-400">
                                      <h6 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                        How to practice:
                                      </h6>
                                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                        {pranayama.howTo.map(
                                          (step, stepIndex) => (
                                            <li key={stepIndex}>{step}</li>
                                          )
                                        )}
                                      </ol>
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Breathing exercise effect for phase transitions
  // Fixed phase transition effect - REPLACE the existing one
  useEffect(() => {
    if (!isBreathingActive || breathTimeRemaining > 0) {
      return;
    }

    const handlePhaseTransition = () => {
      setCycleCount((prevCount) => {
        if (breathPhase === "Pause" && prevCount >= 5) {
          // Completed 5 cycles
          stopBreathingExercise();
          return prevCount;
        }

        let nextPhase;
        let nextDuration;
        let nextCycleCount = prevCount;

        switch (breathPhase) {
          case "Inhale":
            nextPhase = "Hold";
            nextDuration = breathingConfig.hold;
            break;
          case "Hold":
            nextPhase = "Exhale";
            nextDuration = breathingConfig.exhale;
            break;
          case "Exhale":
            nextPhase = "Pause";
            nextDuration = breathingConfig.pause;
            break;
          case "Pause":
            nextPhase = "Inhale";
            nextDuration = breathingConfig.inhale;
            nextCycleCount = prevCount + 1;
            break;
          default:
            nextPhase = "Inhale";
            nextDuration = breathingConfig.inhale;
        }

        if (nextCycleCount <= 5) {
          // Add small delay for smooth transition
          setTimeout(() => {
            startPhase(nextPhase, nextDuration);
          }, 100);
        }
        return nextCycleCount;
      });
    };

    // Only trigger when time remaining reaches 0
    if (breathTimeRemaining <= 0) {
      handlePhaseTransition();
    }
  }, [
    breathTimeRemaining,
    breathPhase,
    isBreathingActive,
    breathingConfig,
    startPhase,
  ]);

  // Cleanup timers on unmount
  // UPDATE the cleanup timers effect
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
      if (breathTimerId) clearInterval(breathTimerId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [timerInterval, breathTimerId, animationFrameId]);

  // Request notification permission
  useEffect(() => {
    if (
      notifications.enabled &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }
  }, [notifications.enabled]);

  // Set up daily notifications
  useEffect(() => {
    if (!notifications.enabled || !("Notification" in window)) return;

    const scheduleNotification = () => {
      const now = new Date();
      const [hours, minutes] = notifications.time.split(":");
      const scheduledTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const timeUntilNotification = scheduledTime.getTime() - now.getTime();

      return setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("🧘‍♀️ Yoga Reminder", {
            body: "Time for your daily yoga practice! Namaste 🙏",
            icon: "/yoga-icon.png",
            badge: "/yoga-icon.png",
          });
        }
        scheduleNotification(); // Schedule next day
      }, timeUntilNotification);
    };

    const timeoutId = scheduleNotification();
    return () => clearTimeout(timeoutId);
  }, [notifications]);

  // Main render
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {renderHeader()}

      <main className="max-w-6xl mx-auto px-4 py-6 pb-20">
        {currentView === "routine" && renderYogaRoutine()}
        {currentView === "meditation" && renderMeditation()}
        {currentView === "stats" && renderStats()}
        {currentView === "settings" && renderSettings()}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-slate-700 px-4 py-2">
        <div className="flex justify-around">
          {[
            { view: "routine", icon: "🧘‍♀️", label: "Routine" },
            { view: "meditation", icon: "🧘‍♂️", label: "Meditate" },
            { view: "stats", icon: "📊", label: "Progress" },
            { view: "settings", icon: "⚙️", label: "Settings" },
          ].map(({ view, icon, label }) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                currentView === view
                  ? "bg-blue-500 text-white shadow-md scale-105"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
            >
              <span className="text-xl mb-1">{icon}</span>
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audio Element */}
      {/* Audio Elements - REPLACE entire audio section */}
      <audio
        ref={audioRef}
        loop
        onLoadStart={() => setAudioLoading(true)}
        onCanPlay={() => setAudioLoading(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
        onError={(e) => {
          console.error("Background audio error:", e);
          setAudioError("Failed to load background audio");
          setAudioLoading(false);
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
      />

      <audio
        ref={meditationAudioRef}
        loop
        onLoadStart={() => setAudioLoading(true)}
        onCanPlay={() => setAudioLoading(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
        onError={(e) => {
          console.error("Meditation audio error:", e);
          setAudioError("Failed to load meditation audio");
          setAudioLoading(false);
          setIsPlaying(false);
          setCurrentTrack(null);
        }}
      />

      {/* Floating Action Button - Breathing Exercise */}
      {currentView === "routine" && !isBreathingActive && (
        <button
          onClick={startBreathingExercise}
          className="fixed bottom-20 md:bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95"
          title="Start breathing exercise"
        >
          <span className="text-2xl">🫁</span>
        </button>
      )}

      {/* Success Messages */}
      {activeTimer && timeRemaining === 0 && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl z-50 animate-bounce">
          🎉 Timer Complete! Great job!
        </div>
      )}
    </div>
  );
};

export default Yoga;
