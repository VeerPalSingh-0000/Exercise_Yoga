import relaxAudio from "../../assets/sounds/soothing.mp3";
import energizeAudio from "../../assets/sounds/suryanamaskar.mp3";
import forest from "../../assets/sounds/forest.mp3";
import ocean from "../../assets/sounds/ocean.mp3";
import rain from "../../assets/sounds/rain.mp3";
import tibetan from "../../assets/sounds/tibetan.mp3";

export const weeklyYogaRoutine = {
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
        youtubeLink: "https://www.youtube.com/watch?v=2HTc_2M22yM",
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
        youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
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
        youtubeLink: "https://www.youtube.com/watch?v=lsH2a0P_41A",
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
        youtubeLink: "https://www.youtube.com/watch?v=68Iq41mW_I4",
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
        youtubeLink: "https://www.youtube.com/watch?v=xS-6432a2y4",
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
        youtubeLink: "https://www.youtube.com/watch?v=l-gEM8NK2eY",
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
        youtubeLink: "https://www.youtube.com/watch?v=bZ6k7AE-2cE",
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
        youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
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
        youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
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
        youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
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
        youtubeLink: "https://www.youtube.com/watch?v=3-S3I_Gk_V4",
      },
    ],
    focus: "Promoting deep relaxation, mindfulness, and rejuvenation",
  },
};

export const asanaImages = {
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

export const meditationTracks = [
  { name: "Forest Sounds", url: forest, duration: "10 mins", emoji: "🌲" },
  { name: "Ocean Waves", url: ocean, duration: "15 mins", emoji: "🌊" },
  { name: "Rain & Thunder", url: rain, duration: "20 mins", emoji: "🌧️" },
  { name: "Tibetan Bowls", url: tibetan, duration: "12 mins", emoji: "🎵" },
];

export const yogaQuotes = [
  "Yoga is a journey of the self, through the self, to the self. - The Bhagavad Gita",
  "The body benefits from movement, and the mind benefits from stillness.",
  "Yoga is not about touching your toes. It is what you learn on the way down.",
  "Peace comes from within. Do not seek it without. - Buddha",
  "The pose begins when you want to leave it.",
  "Inhale the future, exhale the past.",
  "Yoga is the perfect opportunity to be curious about who you are.",
  "The success of yoga does not lie in the ability to attain the perfect posture but in how it enhances one's well-being.",
];

export const audioTracks = {
  relax: relaxAudio,
  energize: energizeAudio,
};