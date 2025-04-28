import React, { useState, useRef, useEffect } from 'react';
import relaxAudio from '../assets/soothing.mp3'; // Ensure these paths are correct
import energizeAudio from '../assets/suryanamaskar.mp3'; // Ensure these paths are correct

// --- Data Structure Update: 'howTo' is now an array of steps ---
const weeklyYogaRoutine = {
    Sunday: {
        theme: "Gentle Flow & Grounding",
        suryanamaskar: { rounds: 5, benefits: ["Warms the body", "Improves flexibility"] },
        asanas: [
            { name: "Tadasana (Mountain Pose)", Sanskrit: "ताड़ासन", duration: "5 mins", benefits: ["Improves posture", "Grounding"], howTo: "Stand tall with feet together or hip-width apart...\nEnsure weight is balanced evenly on both feet.\nEngage your thighs and lift your kneecaps.\nTuck your tailbone slightly.\nReach your arms alongside your body, palms facing forward, or overhead.\nShoulders should be relaxed, away from the ears.\nLook straight ahead or gently close your eyes.", youtubeLink: "http://www.youtube.com/watch?v=2HTvZp5rPrg" },
            { name: "Vrikshasana (Tree Pose)", Sanskrit: "वृक्षासन", duration: "5 mins", benefits: ["Balance", "Focus"], howTo: "From Tadasana, shift weight to one foot.\nBend the other knee and place the sole of the foot on the inner thigh, calf, or ankle of the standing leg.\nAvoid pressing the foot directly onto the knee joint.\nBring your hands together in Anjali Mudra (prayer position) at the chest or extend them overhead.\nFind a steady point of gaze (drishti).\nKeep the standing leg strong and the hips level.\nHold for several breaths, then switch sides.", youtubeLink: null }, // Placeholder
            { name: "Shavasana (Corpse Pose)", Sanskrit: "शवासन", duration: "10 mins", benefits: ["Relaxation", "Stress reduction"], howTo: "Lie flat on your back, legs slightly apart, toes falling outwards.\nLet your arms rest alongside your body, palms facing up.\nGently close your eyes.\nRelax your entire body, starting from the toes up to the crown of your head.\nRelease any tension in your jaw, forehead, and shoulders.\nAllow your breath to be natural and effortless.\nStay in this pose for at least 5-15 minutes.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Anulom Vilom (Alternate Nostril Breathing)",
                Sanskrit: "अनुलोम विलोम",
                duration: "5 mins",
                benefits: ["Balances energy", "Calms the mind", "Improves respiratory function"],
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
                    "Maintain a smooth and steady breath."
                ],
                youtubeLink: "http://www.youtube.com/watch?v=Nhw92icsQ1A"
            },
            {
                name: "Om Chanting",
                Sanskrit: "ॐ जप",
                duration: "5-10 mins",
                benefits: ["Calms the mind", "Reduces stress", "Improves concentration", "Creates vibration"],
                howTo: [
                    "Sit comfortably with a straight spine.",
                    "Close your eyes or soften your gaze.",
                    "Take a deep inhale.",
                    "On the exhale, chant the sound 'Om'. The sound is often broken down into A-U-M.",
                    "Let the 'A' sound originate from the belly, the 'U' sound move up into the chest and throat, and the 'M' sound resonate in the head, fading out.",
                    "Feel the vibration throughout your body.",
                    "Repeat for the desired duration, focusing on the sound and sensation."
                ],
                youtubeLink:"https://youtu.be/nBFyrKYI6TU?si=GsluZX8NafvUjiEo" // Add a YouTube link if you have one for guided chanting
            }
            
        ],
        
        focus: "Grounding and setting intentions for the week",
    },
    Monday: {
        theme: "Energizing Flow",
        suryanamaskar: { rounds: 7, benefits: ["Increases energy", "Strengthens muscles"] },
        asanas: [
            { name: "Surya Namaskar Sequence Focus", Sanskrit: "सूर्य नमस्कार", duration: "10 mins", benefits: ["Full body warm-up", "Improves circulation"], howTo: "Perform the 12 steps of Sun Salutation A or B with awareness of breath and movement.\nStart in Tadasana, inhale arms up.\nExhale forward fold (Uttanasana).\nInhale halfway lift (Ardha Uttanasana).\nExhale step or jump back to Plank (Phalakasana).\nLower to Chaturanga Dandasana (or knees, chest, chin).\nInhale Cobra (Bhujangasana) or Upward-Facing Dog (Urdhva Mukha Svanasana).\nExhale Downward-Facing Dog (Adho Mukha Svanasana).\nHold for several breaths.\nInhale step or jump forward.\nExhale forward fold.\nInhale rise up with a flat back, arms overhead.\nExhale to Tadasana. Repeat.", youtubeLink: null }, // Placeholder
            { name: "Adho Mukha Svanasana (Downward-Facing Dog)", Sanskrit: "अधो मुख श्वानासन", duration: "5 mins", benefits: ["Stretches hamstrings", "Calms the mind"], howTo: "Start on hands and knees, wrists under shoulders, knees under hips.\nTuck your toes and lift your hips up and back, forming an inverted V shape.\nPress firmly through your palms and distribute weight evenly through hands and feet.\nReach your heels towards the mat (they don't have to touch).\nStraighten your legs as much as comfortable.\nLet your head hang gently between your arms.\nHold for several breaths, lengthening the spine.", youtubeLink: "http://www.youtube.com/watch?v=EC7RGJ975iM" },
            { name: "Uttanasana (Standing Forward Bend)", Sanskrit: "उत्तानासन", duration: "3 mins", benefits: ["Stretches spine", "Relieves stress"], howTo: "From Tadasana, exhale and hinge at the hips, folding forward.\nKeep your spine long as you fold.\nAllow your head and neck to relax.\nPlace hands on the floor, blocks, or shins.\nKeep knees slightly bent if hamstrings are tight.\nInhale to lengthen the spine, exhale to fold deeper.\nHold for several breaths.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Kapalabhati (Skull Shining Breath)",
                Sanskrit: "कपालभाति",
                duration: "3 rounds (20-30 breaths each)",
                benefits: ["Energizing", "Cleanses respiratory tract", "Improves focus"],
                howTo: [
                    "Sit tall with a straight spine.",
                    "Take a normal inhale.",
                    "Forcefully exhale through the nose with a sharp contraction of the abdominal muscles.",
                    "The inhale is passive and happens automatically.",
                    "Focus on the exhale.",
                    "Perform 20-30 rapid exhales, then take a deep inhale and exhale slowly.",
                    "Rest and repeat for 2-3 rounds.",
                    "Avoid if pregnant, have high blood pressure, or heart conditions."
                ],
                youtubeLink: "http://www.youtube.com/watch?v=52TOhE94fEg"
            }
        ],
        focus: "Building energy and focus for the week ahead",
    },
    Tuesday: {
        theme: "Core Strength",
        suryanamaskar: { rounds: 5, benefits: ["Strengthens core", "Improves digestion"] },
        asanas: [
            { name: "Phalakasana (Plank Pose)", Sanskrit: "फलकासन", duration: "3 mins", benefits: ["Strengthens core", "Improves posture"], howTo: "From hands and knees, step feet back so your body forms a straight line from head to heels.\nEnsure wrists are directly under shoulders.\nEngage your core, glutes, and quads.\nKeep your neck in a neutral position, looking slightly forward.\nAvoid letting your hips sag or pike up.\nHold for the desired duration, maintaining a steady breath.", youtubeLink: null },
            { name: "Bhujangasana (Cobra Pose)", Sanskrit: "भुजंगासन", duration: "3 mins", benefits: ["Strengthens spine", "Opens chest"], howTo: "Lie face down on the mat, legs extended, tops of feet on the floor.\nPlace hands under shoulders, fingers pointing forward.\nPress your pubic bone into the mat.\nOn an inhale, press through your hands and lift your chest off the floor.\nKeep a slight bend in your elbows, hugging them towards your body.\nRoll your shoulders back and down.\nKeep your neck long, looking slightly forward.\nExhale to lower back down.", youtubeLink: null },
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
                   "If needed, keep hands on the floor behind you for support."
                ],
                youtubeLink: "http://www.youtube.com/watch?v=lgzt416ROSY"
            },
        ],
        pranayama: [
            {
                name: "Ujjayi Breath (Victorious Breath)",
                Sanskrit: "उज्जायी",
                duration: "5 mins",
                benefits: ["Builds internal heat", "Calming", "Increases focus during practice"],
                howTo: [
                    "Breathe in and out through the nose.",
                    "Gently constrict the back of your throat, as if whispering or fogging a mirror.",
                    "This creates a soft ocean-like sound.",
                    "Keep the breath smooth, deep, and rhythmic.",
                    "Inhale and exhale should be of equal length.",
                    "Practice this breath throughout your physical yoga practice."
                ],
                youtubeLink:"https://youtu.be/CF3U-4igCVk?si=70411mZ3QBpjwFS8"
            } // Placeholder
        ],
        focus: "Strengthening core muscles and improving stability",
    },
    Wednesday: {
        theme: "Flexibility & Flow",
        suryanamaskar: { rounds: 7, benefits: ["Improves flexibility", "Increases blood flow"] },
        asanas: [
            { name: "Trikonasana (Triangle Pose)", Sanskrit: "त्रिकोणासन", duration: "5 mins", benefits: ["Stretches hamstrings", "Improves balance"], howTo: "Step feet wide apart (about 3-4 feet).\nTurn the right foot out 90 degrees and the left foot slightly in.\nExtend arms parallel to the floor.\nHinge at the right hip, reaching your right hand towards your right shin, ankle, or the floor.\nExtend your left arm towards the ceiling, stacking it over your right arm.\nKeep both legs straight.\nLook up towards the left hand or straight ahead.\nHold for several breaths, then repeat on the other side.", youtubeLink: null }, // Placeholder
            { name: "Parivrtta Trikonasana (Revolved Triangle Pose)", Sanskrit: "परिवृत्त त्रिकोणासन", duration: "5 mins", benefits: ["Improves digestion", "Detoxifies spine"], howTo: "Similar stance to Trikonasana, with feet slightly closer.\nTurn your hips to face the front foot.\nInhale and extend your left arm up.\nExhale and hinge forward, bringing your left hand to the outside of your right foot (or on a block).\nExtend your right arm towards the ceiling.\nKeep both legs straight.\nTwist your torso towards the right, looking up at the right hand.\nHold for several breaths, then repeat on the other side.", youtubeLink: null }, // Placeholder
            { name: "Balasana (Child's Pose)", Sanskrit: "बालासन", duration: "5 mins", benefits: ["Calms the mind", "Relieves stress"], howTo: "Kneel on the floor, big toes touching.\nSeparate your knees wide or keep them together.\nSit back on your heels.\nFold your torso forward, resting your forehead on the mat.\nExtend your arms forward or rest them alongside your body, palms facing back.\nRelax your shoulders and allow your back to soften.\nBreathe deeply and release tension.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Nadi Shodhana (Channel Cleaning Breath)",
                Sanskrit: "नाडी शोधन",
                duration: "7 mins",
                benefits: ["Purifies energy channels", "Promotes mental clarity", "Reduces anxiety"],
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
                    "(Note: This technique is very similar to Anulom Vilom, often used interchangeably or with slightly different retention timings)."
                ],
                youtubeLink: "http://www.youtube.com/watch?v=Nhw92icsQ1A"
            } // Re-using Anulom Vilom link
        ],
        focus: "Enhancing flexibility and promoting smooth transitions",
    },
    Thursday: {
        theme: "Balancing Practice",
        suryanamaskar: { rounds: 5, benefits: ["Improves balance", "Strengthens legs"] },
        asanas: [
            { name: "Vrikshasana (Tree Pose)", Sanskrit: "वृक्षासन", duration: "5 mins", benefits: ["Improves balance", "Focus"], howTo: "From Tadasana, shift weight to one foot.\nBend the other knee and place the sole of the foot on the inner thigh, calf, or ankle of the standing leg.\nAvoid pressing the foot directly onto the knee joint.\nBring your hands together in Anjali Mudra (prayer position) at the chest or extend them overhead.\nFind a steady point of gaze (drishti).\nKeep the standing leg strong and the hips level.\nHold for several breaths, then switch sides.", youtubeLink: null }, // Placeholder
            { name: "Garudasana (Eagle Pose)", Sanskrit: "गरुडासन", duration: "5 mins", benefits: ["Improves concentration", "Stretches shoulders"], howTo: "Stand, slightly bend knees.\nLift your right foot and wrap it over your left thigh, hooking the right foot around the left calf (if possible).\nExtend your arms forward.\nCross your left arm over your right, bending elbows and bringing palms together (or backs of hands if palms don't touch).\nLift elbows up and away from the face.\nSit hips back and down.\nKeep spine straight.\nHold for several breaths, then switch sides.", youtubeLink: null }, // Placeholder
            { name: "Natarajasana (Dancer Pose)", Sanskrit: "नटराजासन", duration: "3 mins per side", benefits: ["Improves balance", "Strengthens legs"], howTo: "Stand tall.\nBend one knee and grasp the ankle or foot with the hand of the same side.\nExtend the opposite arm forward or up.\nKick the lifted leg back and up, simultaneously leaning your torso forward.\nKeep the standing leg strong.\nMaintain a steady gaze.\nHold for several breaths, then switch sides.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Bhramari (Humming Bee Breath)",
                Sanskrit: "भ्रामरी",
                duration: "5 mins",
                benefits: ["Calms the nervous system", "Relieves tension and anxiety", "Improves concentration"],
                howTo: [
                    "Sit comfortably.",
                    "Close your eyes.",
                    "Place your index fingers on the cartilage between your cheek and ear (tragus).",
                    "Close your ears gently.",
                    "Inhale deeply through the nose.",
                    "Exhale slowly through the nose, making a low-pitched humming sound (like a bee).",
                    "Repeat for several rounds, feeling the vibration in your head."
                ],
                youtubeLink: "http://www.youtube.com/watch?v=KkurfEQrg94"
            }
        ],
        focus: "Cultivating balance, focus, and grace",
    },
    Friday: {
        theme: "Deep Stretch & Release",
        suryanamaskar: { rounds: 5, benefits: ["Releases tension", "Improves circulation"] },
        asanas: [
            { name: "Paschimottanasana (Seated Forward Bend)", Sanskrit: "पश्चिमोत्तानासन", duration: "7 mins", benefits: ["Calms the brain", "Stretches spine"], howTo: "Sit with legs extended forward, feet flexed.\nInhale and lengthen your spine.\nExhale and hinge at the hips, folding forward over your legs.\nReach for your feet, ankles, or shins.\nKeep your spine long, avoiding rounding the back.\nRelax your neck and shoulders.\nHold for several breaths, deepening the stretch on exhales.", youtubeLink: null }, // Placeholder
            { name: "Janu Sirsasana (Head-to-Knee Pose)", Sanskrit: "जानु शीर्षासन", duration: "5 mins per side", benefits: ["Stretches hamstrings", "Improves flexibility"], howTo: "Sit with one leg extended forward.\nBend the other knee and bring the sole of that foot to the inner thigh of the extended leg.\nInhale and lengthen your spine.\nExhale and hinge at the hips, folding forward over the extended leg.\nReach for the foot, ankle, or shin.\nKeep the spine long.\nHold for several breaths, then repeat on the other side.", youtubeLink: null }, // Placeholder
            { name: "Baddha Konasana (Bound Angle Pose)", Sanskrit: "बद्ध कोणासन", duration: "5 mins", benefits: ["Opens hips", "Stimulates abdominal organs"], howTo: "Sit tall, bring soles of feet together.\nLet your knees fall out to the sides.\nGrasp your feet with your hands.\nKeep your spine long.\nFor a deeper stretch, gently press knees towards the floor.\nOption to fold forward from the hips, keeping the spine long.\nHold for several breaths.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Sheetali (Cooling Breath - tongue curled)",
                Sanskrit: "शीतली",
                duration: "5 mins",
                benefits: ["Cools the body and mind", "Reduces stress", "Calms emotions"],
                howTo: [
                    "Sit comfortably.",
                    "Curl your tongue lengthwise, forming a tube.",
                    "Inhale slowly through the curled tongue.",
                    "Close your mouth and exhale slowly through the nose.",
                    "If you cannot curl your tongue, use Sheetkari (sip air through clenched teeth).",
                    "Repeat for several rounds."
                ],
                youtubeLink:"https://youtu.be/Kqa3l49jij8?si=UenpadJHqIAYkuU-"
            } // Placeholder
        ],
        focus: "Releasing tension and promoting deep relaxation",
    },
    Saturday: {
        theme: "Relaxation & Mindfulness",
        suryanamaskar: { rounds: 3, benefits: ["Gentle movement", "Prepares for relaxation"] },
        asanas: [
            { name: "Supta Baddha Konasana (Reclined Bound Angle Pose)", Sanskrit: "सुप्त बद्ध कोणासन", duration: "7 mins", benefits: ["Calms the mind", "Opens hips"], howTo: "Lie on your back.\nBring the soles of your feet together, letting your knees fall out to the sides.\nPlace hands on your belly, alongside your body, or overhead.\nAllow your body to relax and gravity to open the hips.\nBreathe deeply and release tension.\nHold for several minutes.", youtubeLink: null },
            { name: "Viparita Karani (Legs-up-the-Wall Pose)", Sanskrit: "विपरीत करणी", duration: "10 mins", benefits: ["Relieves tired legs", "Calms the nervous system"], howTo: "Sit sideways next to a wall.\nSwing your legs up the wall as you lie back on the floor.\nAdjust your distance from the wall so your hips are either touching the wall or slightly away.\nRest your arms comfortably alongside your body or on your belly.\nAllow your legs to be supported by the wall.\nRelax and breathe deeply.\nHold for 5-15 minutes.", youtubeLink: null },
            { name: "Shavasana (Corpse Pose)", Sanskrit: "शवासन", duration: "15 mins", benefits: ["Deep relaxation", "Reduces stress"], howTo: "Lie flat on your back, legs slightly apart, toes falling outwards.\nLet your arms rest alongside your body, palms facing up.\nGently close your eyes.\nRelax your entire body, starting from the toes up to the crown of your head.\nRelease any tension in your jaw, forehead, and shoulders.\nAllow your breath to be natural and effortless.\nStay in this pose for at least 5-15 minutes.", youtubeLink: null },
        ],
        pranayama: [
            {
                name: "Deep Diaphragmatic Breathing",
                Sanskrit: "धीर्घ श्वास",
                duration: "10 mins",
                benefits: ["Promotes deep relaxation", "Reduces heart rate", "Oxygenates blood"],
                howTo: [
                    "Lie down or sit comfortably.",
                    "Place one hand on your chest and the other on your belly.",
                    "Inhale slowly through the nose, feeling your belly rise.",
                    "Keep your chest relatively still.",
                    "Exhale slowly through the nose or mouth, feeling your belly fall.",
                    "Draw the navel slightly towards the spine to expel all air.",
                    "Focus on the gentle rise and fall of your belly.",
                    "Breathe deeply and rhythmically."
                ],
                youtubeLink: "https://youtu.be/qhcBjSirMss?si=VZE9flZ2Mgv9dRnz"
            } // Placeholder
        ],
        focus: "Promoting deep relaxation, mindfulness, and rejuvenation",
    },
};


// Asana Images (no changes)
const asanaImages = {
    "Tadasana (Mountain Pose)": "https://media.istockphoto.com/id/1366703229/vector/palm-tree-pose-urdhva-hastasana-upward-hand-stretch-pose-upward-salute-raised-hands-pose.jpg?s=612x612&w=0&k=20&c=rY1lIudAf5GTFGFQq1FP_aIMOSXDuwBgTp5ipngSu5E=",
    "Shavasana (Corpse Pose)": "https://www.keralatourism.org/images/yoga/static-banner/large/Savasana_-_The_Corpse_Pose-07032020145736.jpg",
    "Paschimottanasana (Seated Forward Bend)":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLuSptm7cxCe84Beq-t_b8y_uoqL-FuijTg&s",
    "Janu Sirsasana (Head-to-Knee Pose)":"https://www.gaia.com/wp-content/uploads/JanuSirsasana-NicoLuce.jpg",
    "Baddha Konasana (Bound Angle Pose)":"https://cdn.yogajournal.com/wp-content/uploads/2022/10/Bound-Angle-Pose_Mod-1_Andrew-Clark_2400x1350.jpeg",
    "Supta Baddha Konasana (Reclined Bound Angle Pose)":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDqAMO8WE998Ylj-mWg36EIHxsbNl7MIYU2A&s",
    "Viparita Karani (Legs-up-the-Wall Pose)":"https://cdn.yogaeasy.de/production/uploads/article/picture/5853/large_legs-up-the-wall-pose.jpg",
    "Vrikshasana (Tree Pose)":"https://www.arhantayoga.org/wp-content/uploads/2022/03/Tree-Pose-%E2%80%93-Vrikshasana.jpg",
    "Surya Namaskar Sequence Focus":"https://harithayogshala.com/upload/blog/steps-of-surya-namaskar_1650126696.jpg",
    "Adho Mukha Svanasana (Downward-Facing Dog)":"https://cdn.yogaeasy.de/production/uploads/article/picture/6282/large_article_Downward-Facing-Dog-Pose-Adho-Mukha-Svanasana.jpg",
    "Uttanasana (Standing Forward Bend)":"https://cdn.yogajournal.com/wp-content/uploads/2021/11/Uttanasana-Pose_Andrew-Clark_2400x1350.jpeg",
    "Phalakasana (Plank Pose)":"https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3eb6d_Untitled-design-24.jpg",
    "Bhujangasana (Cobra Pose)":"https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg",
    "Navasana (Boat Pose)":"https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3ea9b_boat-pose-yoga.jpeg",
    "Trikonasana (Triangle Pose)":"https://yogapractice.com/wp-content/uploads/2019/08/Triangle-Pose-Yoga.jpg",
    "Parivrtta Trikonasana (Revolved Triangle Pose)":"https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg",
    "Balasana (Child's Pose)":"https://karunayoga.in/wp-content/uploads/2020/03/balasana.jpg",
    "Garudasana (Eagle Pose)":"https://www.vinyasayogaashram.com/blog/wp-content/uploads/2021/06/Garudasana-Eagle-Pose-2.jpg",
    "Natarajasana (Dancer Pose)":"https://omstars.com/blog/wp-content/uploads/2023/02/how-to-do-Natarajasana-Dancer-Pose.png",
};

// --- Create a list of all unique Pranayama ---
const allPranayama = {};
Object.values(weeklyYogaRoutine).forEach(dayData => {
  // Ensure dayData.pranayama is an array before iterating
  if (Array.isArray(dayData.pranayama)) {
    dayData.pranayama.forEach(pranayama => {
      if (!allPranayama[pranayama.name]) {
        allPranayama[pranayama.name] = { ...pranayama };
      }
    });
  }
});
const allPranayamaArray = Object.values(allPranayama);


const Yoga = () => {
   // Function to safely get parsed JSON from localStorage
   const getStorageItem = (key, defaultValue) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
        return defaultValue; // Return default if loading fails
    }
};

const [expandedDay, setExpandedDay] = useState(() => getStorageItem('expandedDay', null));
const [expandedAsanas, setExpandedAsanas] = useState(() => getStorageItem('expandedAsanas', {}));
const [expandedHowTo, setExpandedHowTo] = useState(() => getStorageItem('expandedHowTo', {}));
const [showAllPranayama, setShowAllPranayama] = useState(() => getStorageItem('showAllPranayama', true)); // Default to true if nothing saved
// For the routine data, check if saved data exists, otherwise use the default routine
const [editableRoutine, setEditableRoutine] = useState(() => getStorageItem('editableRoutine', weeklyYogaRoutine));
// For the global pranayama list, check if saved data exists, otherwise use the generated list
const [orderableAllPranayama, setOrderableAllPranayama] = useState(() => getStorageItem('orderableAllPranayama', allPranayamaArray));

    // ... existing moveItem function for daily routines ...

    // Add this function to move items in the global pranayama list
    const moveGlobalPranayama = (index, direction) => {
        setOrderableAllPranayama(prevList => {
            const newList = [...prevList]; // Create a copy of the array
            const itemToMove = newList[index];

            if (direction === 'up' && index > 0) {
                newList.splice(index, 1); // Remove from current position
                newList.splice(index - 1, 0, itemToMove); // Insert at new position
            } else if (direction === 'down' && index < newList.length - 1) {
                newList.splice(index, 1); // Remove from current position
                newList.splice(index + 1, 0, itemToMove); // Insert at new position
            } else {
                return prevList; // No change needed
            }

            
            return newList; // Set the new state
        });
    };

    // ... rest of your functions
// ------------------

    const toggleDay = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const toggleAsanaImage = (day, asanaIndex, event) => {
        event.stopPropagation();
        const key = `asana-${day}-${asanaIndex}`;
        setExpandedAsanas(prev => ({ ...prev, [key]: !prev[key] }));
    };

     // Modified toggleHowTo to accept any unique key
    const toggleHowTo = (itemKey, event) => {
        event.stopPropagation();
        setExpandedHowTo(prev => ({ ...prev, [itemKey]: !prev[itemKey] }));
    };

    // Add this new toggle function for the All Pranayama section
    const toggleAllPranayama = () => {
        setShowAllPranayama(prev => !prev);
    };

    // Add this function to move items up or down within a list
    const moveItem = (day, type, index, direction) => {
        // Use the functional update form of setEditableRoutine
        setEditableRoutine(prevRoutine => {
            // Create a deep copy of the relevant parts of the routine
            const newRoutine = {
                ...prevRoutine,
                [day]: {
                    ...prevRoutine[day],
                    [type]: [...prevRoutine[day][type]], // Copy the specific array (asanas or pranayama)
                },
            };

            const items = newRoutine[day][type]; // Get the array copy
            const itemToMove = items[index];

            if (direction === 'up' && index > 0) {
                items.splice(index, 1); // Remove the item from its current position
                items.splice(index - 1, 0, itemToMove); // Insert the item at the new position (one index lower)
            } else if (direction === 'down' && index < items.length - 1) {
                items.splice(index, 1); // Remove the item
                items.splice(index + 1, 0, itemToMove); // Insert at the new position (one index higher)
            } else {
                // If direction is invalid or item is at the boundary, return the previous state
                return prevRoutine;
            }

            // The items array within newRoutine has been modified in place
            // Return the new state object
            return newRoutine;
        });
    };


    // Audio state and functions (no changes)
    const [audioSrc, setAudioSrc] = useState(null);
    const audioRef = useRef(null);
    const playMusic = (type) => {
        const selected = type === 'relax' ? relaxAudio : energizeAudio;
        setAudioSrc(selected);
        setTimeout(() => {
            if (audioRef.current) audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }, 100);
    };
    const pauseMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
// Save expandedDay to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('expandedDay', JSON.stringify(expandedDay));
}, [expandedDay]);

// Save expandedAsanas to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('expandedAsanas', JSON.stringify(expandedAsanas));
}, [expandedAsanas]);

// Save expandedHowTo to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('expandedHowTo', JSON.stringify(expandedHowTo));
}, [expandedHowTo]);

// Save showAllPranayama to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('showAllPranayama', JSON.stringify(showAllPranayama));
}, [showAllPranayama]);

// Save editableRoutine to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('editableRoutine', JSON.stringify(editableRoutine));
}, [editableRoutine]);

// Save orderableAllPranayama to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem('orderableAllPranayama', JSON.stringify(orderableAllPranayama));
}, [orderableAllPranayama]);

// ... rest of your component's return statement (JSX)
    // --- Helper: YouTube Icon ---
    const YouTubeIcon = () => (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    );

    // Save expandedDay to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('expandedDay', JSON.stringify(expandedDay));
    }, [expandedDay]);

    // Save expandedAsanas to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('expandedAsanas', JSON.stringify(expandedAsanas));
    }, [expandedAsanas]);

    // Save expandedHowTo to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('expandedHowTo', JSON.stringify(expandedHowTo));
    }, [expandedHowTo]);

    // Save showAllPranayama to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('showAllPranayama', JSON.stringify(showAllPranayama));
    }, [showAllPranayama]);

    // Save editableRoutine to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('editableRoutine', JSON.stringify(editableRoutine));
    }, [editableRoutine]);

    // Save orderableAllPranayama to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('orderableAllPranayama', JSON.stringify(orderableAllPranayama));
    }, [orderableAllPranayama]);

    // ... rest of your component's return statement (JSX)

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* --- Header and Audio Controls (Unchanged) --- */}
                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4 animate-pulse" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    ☀️ Weekly Yoga Routine (Sunday to Saturday)
                </h1>
                <div className="flex justify-center sm:justify-end mb-6">
                    <button onClick={() => playMusic('relax')} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-1 px-3 rounded-l-xl shadow transition-colors duration-200">🎵 Relax</button>
                    <button onClick={() => playMusic('energize')} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 shadow transition-colors duration-200">⚡ Energize</button>
                    <button onClick={pauseMusic} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-r-xl shadow transition-colors duration-200">⏸️ Pause</button>
                </div>

                {/* --- New Pranayama Section (Conditional Rendering & Toggle) --- */}
                {allPranayamaArray.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-8 mb-8 bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Modified Header with Toggle */}
                        <div
                           className="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 flex justify-between items-center cursor-pointer"
                           onClick={toggleAllPranayama} // Add the click handler
                           aria-expanded={showAllPranayama} // Add ARIA attribute for accessibility
                        >
                           <h2 className="text-2xl font-extrabold text-gray-800" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)' }}>
                             🧘‍♀️ All Pranayama Techniques
                           </h2>
                           {/* Add the rotating arrow icon */}
                           <span className={`h-6 w-6 text-gray-600 inline-flex items-center justify-center transform transition-transform duration-300 ${showAllPranayama ? 'rotate-180' : ''}`}>▼</span>
                        </div>

                        {/* Conditionally render the content based on showAllPranayama state */}
                        {showAllPranayama && (
                           <div className="p-6">
                                {/* Map through the orderable list */}
                                {orderableAllPranayama.map((pranayama, index) => { // <-- Changed to orderableAllPranayama
                                   const pranKey = `all-pranayama-${index}`; // Still need a unique key for HowTo state
                                   const isHowToExpanded = !!expandedHowTo[pranKey];
                                   const hasHowTo = Array.isArray(pranayama.howTo) && pranayama.howTo.length > 0;
                                   const hasYoutubeLink = !!pranayama.youtubeLink;

                                   return (
                                     <div key={pranKey} className="mb-4 p-4 rounded-xl bg-purple-50 border border-purple-200">
                                       <div className="flex justify-between items-start mb-2 flex-wrap">
                                         <h5 className="text-lg font-semibold text-purple-700 mr-2 mb-1 sm:mb-0">{pranayama.name} ({pranayama.Sanskrit})</h5>
                                         {/* Add Reorder Buttons for the global list */}
                                         <div className="flex space-x-2 flex-shrink-0">
                                             {/* Only show reorder buttons if there's more than one item */}
                                             {orderableAllPranayama.length > 1 && (
                                                 <>
                                                     <button
                                                        onClick={(e) => { e.stopPropagation(); moveGlobalPranayama(index, 'up'); }}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={index === 0} // Disable 'Up' button for the first item
                                                        aria-label={`Move ${pranayama.name} up in list`}
                                                     >
                                                         ▲
                                                     </button>
                                                     <button
                                                        onClick={(e) => { e.stopPropagation(); moveGlobalPranayama(index, 'down'); }}
                                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        disabled={index === orderableAllPranayama.length - 1} // Disable 'Down' button for the last item
                                                        aria-label={`Move ${pranayama.name} down in list`}
                                                     >
                                                         ▼
                                                     </button>
                                                 </>
                                             )}
                                            {/* How To Toggle */}
                                            {hasHowTo && (
                                              <button onClick={(e) => toggleHowTo(pranKey, e)} className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200 ${isHowToExpanded ? 'bg-gray-300' : ''}`} aria-expanded={isHowToExpanded} aria-controls={`howto-${pranKey}-all`}>
                                                <span>How To</span><span className={`ml-1 transform transition-transform duration-200 ${isHowToExpanded ? 'rotate-180' : ''}`}>▼</span>
                                              </button>
                                            )}
                                            {hasYoutubeLink && (
                                               <a href={pranayama.youtubeLink} target="_blank" rel="noopener noreferrer" className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200" title="Watch tutorial on YouTube">
                                                   <YouTubeIcon />
                                                   <span className="ml-1">Video</span>
                                               </a>
                                            )}
                                         </div>
                                       </div>
                                       <p className="text-gray-700 text-sm mb-1">
                                         <span className="font-medium">Duration:</span> {pranayama.duration} | <span className="font-medium">Benefits:</span> {pranayama.benefits.join(', ')}
                                       </p>
                                        {/* How To Collapsible Content */}
                                       <div id={`howto-${pranKey}-all`} className={`transition-all duration-300 ease-in-out overflow-hidden ${isHowToExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`} aria-hidden={!isHowToExpanded}>
                                         {hasHowTo && (<ol className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 list-decimal list-inside space-y-1">
                                             {pranayama.howTo.map((step, stepIndex) => (
                                                 <li key={stepIndex}>{step}</li>
                                             ))}
                                         </ol>)}
                                       </div>
                                     </div>
                                   );
                                })}
                           </div>
                        )}
                    </div>
                )}


                {/* --- Days Mapping (Using editableRoutine) --- */}
                {Object.entries(editableRoutine).map(([day, dayData]) => { // <-- Using editableRoutine
                    const isDayExpanded = expandedDay === day;
                    return (
                        <div key={day} className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
                            {/* Day Header */}
                             <div className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200" onClick={() => toggleDay(day)} aria-expanded={isDayExpanded} aria-controls={`day-content-${day}`}>
                                 <h2 className="text-xl font-semibold text-gray-800 flex-grow">{day} - <span className="text-indigo-600 font-normal">{dayData.theme}</span></h2>
                                 <span className={`h-6 w-6 text-gray-600 inline-flex items-center justify-center transform transition-transform duration-300 ${isDayExpanded ? 'rotate-180' : ''}`}>▼</span>
                             </div>

                            {/* Collapsible Content Area */}
                            <div id={`day-content-${day}`} className={`transition-all duration-500 ease-in-out ${isDayExpanded ? 'max-h-[6000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}> {/* Even Larger Max Height */}
                               <div className="p-6 border-t border-gray-200">
                                    {/* --- Focus, Surya Namaskar ... */}
                                     <p className="text-gray-700 mb-4 italic"><span className="font-semibold not-italic">Focus:</span> {dayData.focus}</p>
                                     <h4 className="text-md font-semibold text-gray-800 mb-1">Surya Namaskar:</h4>
                                     <div className="mb-3 p-3 rounded-md bg-orange-50 border border-orange-200">
                                         <p className="text-gray-600 text-sm"><span className="font-medium">Rounds:</span> {dayData.suryanamaskar.rounds} | <span className="font-medium">Benefits:</span> {dayData.suryanamaskar.benefits.join(', ')}</p>
                                     </div>

                                    {/* --- Asanas Section --- */}
                                     <h4 className="text-md font-semibold text-gray-800 mt-3 mb-2">Asanas:</h4>
                                     {/* Loop through asanas from editableRoutine */}
                                     {Array.isArray(dayData.asanas) && dayData.asanas.map((asana, index) => { // <-- Using dayData from editableRoutine
                                         const asanaKey = `asana-${day}-${index}`;
                                         const isHowToExpanded = !!expandedHowTo[asanaKey];
                                         const isImageExpanded = !!expandedAsanas[asanaKey];
                                         const hasImage = !!asanaImages[asana.name];
                                         const hasHowTo = !!asana.howTo; // Keep as string or array check for asanas
                                         const hasYoutubeLink = !!asana.youtubeLink;

                                         return (
                                             <div key={asanaKey} className="mb-2 p-3 rounded-md bg-blue-50 border border-blue-200">
                                                 {/* Asana Name & Toggles */}
                                                 <div className="flex justify-between items-start mb-1 flex-wrap">
                                                     <h5 className="text-md font-medium text-blue-700 mr-2 mb-1 sm:mb-0">{asana.name} ({asana.Sanskrit})</h5>
                                                     {/* --- Grouped Buttons & NEW Reorder Buttons --- */}
                                                     <div className="flex space-x-1 flex-shrink-0">
                                                         {/* Reorder Buttons */}
                                                         {/* Only show reorder buttons if there's more than one asana */}
                                                         {dayData.asanas.length > 1 && (
                                                             <>
                                                                 <button
                                                                    onClick={(e) => { e.stopPropagation(); moveItem(day, 'asanas', index, 'up'); }}
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    disabled={index === 0} // Disable 'Up' button for the first item
                                                                    aria-label={`Move ${asana.name} up`}
                                                                 >
                                                                     ▲
                                                                 </button>
                                                                 <button
                                                                    onClick={(e) => { e.stopPropagation(); moveItem(day, 'asanas', index, 'down'); }}
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    disabled={index === dayData.asanas.length - 1} // Disable 'Down' button for the last item
                                                                     aria-label={`Move ${asana.name} down`}
                                                                 >
                                                                     ▼
                                                                 </button>
                                                             </>
                                                         )}
                                                         {/* How To Toggle */}
                                                         {hasHowTo && ( <button onClick={(e) => toggleHowTo(asanaKey, e)} className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200 ${isHowToExpanded ? 'bg-gray-300' : ''}`} aria-expanded={isHowToExpanded} aria-controls={`howto-${asanaKey}`}><span>How To</span><span className={`ml-1 transform transition-transform duration-200 ${isHowToExpanded ? 'rotate-180' : ''}`}>▼</span></button> )}
                                                         {/* Image Toggle */}
                                                         {hasImage && ( <button onClick={(e) => toggleAsanaImage(day, index, e)} className={`bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200 ${isImageExpanded ? 'bg-blue-200' : ''}`} aria-expanded={isImageExpanded} aria-controls={`image-${asanaKey}`}><span>Image</span><span className={`ml-1 transform transition-transform duration-200 ${isImageExpanded ? 'rotate-180' : ''}`}>▼</span></button> )}
                                                         {/* --- YouTube Link Button --- */}
                                                         {hasYoutubeLink && (
                                                             <a href={asana.youtubeLink} target="_blank" rel="noopener noreferrer" className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200" title="Watch tutorial on YouTube">
                                                                 <YouTubeIcon />
                                                                 <span className="ml-1">Video</span>
                                                             </a>
                                                         )}
                                                     </div>
                                                 </div>
                                                 {/* Duration & Benefits */}
                                                 <p className="text-gray-600 text-sm mb-1">
                                                     <span className="font-medium">Duration:</span> {asana.duration} | <span className="font-medium">Benefits:</span> {asana.benefits.join(', ')}
                                                 </p>

                                                 {/* --- How To / Image Collapsible Content (Unchanged) --- */}
                                                 <div id={`howto-${asanaKey}`} className={`transition-all duration-300 ease-in-out overflow-hidden ${isHowToExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`} aria-hidden={!isHowToExpanded}> {hasHowTo && (<div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 whitespace-pre-line">{asana.howTo}</div>)}</div>
                                                 <div id={`image-${asanaKey}`} className={`transition-all duration-300 ease-in-out overflow-hidden ${isImageExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`} aria-hidden={!isImageExpanded}> {hasImage && (<div className="text-center rounded-lg p-2 bg-white border border-gray-200"><img src={asanaImages[asana.name]} alt={`${asana.name} demonstration`} className="mx-auto rounded shadow-sm w-full max-w-xs sm:max-w-sm h-auto object-contain" loading="lazy"/></div>)}</div>

                                             </div>
                                         );
                                     })}


                                    {/* --- Pranayama Section (Daily) - Conditional Rendering --- */}
                                     {Array.isArray(dayData.pranayama) && dayData.pranayama.length > 0 && (
                                         <>
                                             <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2">Pranayama:</h4>
                                             {/* Loop through pranayama from editableRoutine */}
                                             {dayData.pranayama.map((pranayama, index) => { // <-- Using dayData from editableRoutine
                                                 const pranKey = `pran-${day}-${index}`;
                                                 const isHowToExpanded = !!expandedHowTo[pranKey];
                                                 const hasHowTo = Array.isArray(pranayama.howTo) && pranayama.howTo.length > 0; // Check if howTo is a non-empty array
                                                 const hasYoutubeLink = !!pranayama.youtubeLink;

                                                 return (
                                                     <div key={pranKey} className="mb-2 p-3 rounded-md bg-purple-50 border border-purple-200">
                                                         {/* Pranayama Name & Toggles */}
                                                          <div className="flex justify-between items-start mb-1 flex-wrap">
                                                              <h5 className="text-md font-medium text-purple-700 mr-2 mb-1 sm:mb-0">{pranayama.name} ({pranayama.Sanskrit})</h5>
                                                              {/* --- Grouped Buttons & NEW Reorder Buttons --- */}
                                                              <div className="flex space-x-1 flex-shrink-0">
                                                                   {/* Reorder Buttons */}
                                                                 {/* Only show reorder buttons if there's more than one pranayama */}
                                                                 {dayData.pranayama.length > 1 && (
                                                                     <>
                                                                         <button
                                                                            onClick={(e) => { e.stopPropagation(); moveItem(day, 'pranayama', index, 'up'); }}
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            disabled={index === 0} // Disable 'Up' button for the first item
                                                                            aria-label={`Move ${pranayama.name} up`}
                                                                         >
                                                                             ▲
                                                                         </button>
                                                                         <button
                                                                            onClick={(e) => { e.stopPropagation(); moveItem(day, 'pranayama', index, 'down'); }}
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-1 rounded text-xs transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            disabled={index === dayData.pranayama.length - 1} // Disable 'Down' button for the last item
                                                                            aria-label={`Move ${pranayama.name} down`}
                                                                         >
                                                                             ▼
                                                                         </button>
                                                                     </>
                                                                 )}
                                                                  {/* How To Toggle */}
                                                                  {hasHowTo && ( <button onClick={(e) => toggleHowTo(pranKey, e)} className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200 ${isHowToExpanded ? 'bg-gray-300' : ''}`} aria-expanded={isHowToExpanded} aria-controls={`howto-${pranKey}`}><span>How To</span><span className={`ml-1 transform transition-transform duration-200 ${isHowToExpanded ? 'rotate-180' : ''}`}>▼</span></button>)}
                                                                  {/* --- YouTube Link Button --- */}
                                                                  {hasYoutubeLink && (
                                                                      <a href={pranayama.youtubeLink} target="_blank" rel="noopener noreferrer" className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-1 px-2 rounded flex items-center text-xs transition-colors duration-200" title="Watch tutorial on YouTube">
                                                                          <YouTubeIcon />
                                                                          <span className="ml-1">Video</span>
                                                                      </a>
                                                                  )}
                                                              </div>
                                                          </div>
                                                          {/* Duration & Benefits */}
                                                          <p className="text-gray-600 text-sm mb-1">
                                                              <span className="font-medium">Duration:</span> {pranayama.duration} | <span className="font-medium">Benefits:</span> {pranayama.benefits.join(', ')}
                                                          </p>

                                                          {/* --- How To Collapsible Content --- */}
                                                          <div id={`howto-${pranKey}`} className={`transition-all duration-300 ease-in-out overflow-hidden ${isHowToExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`} aria-hidden={!isHowToExpanded}>
                                                               {/* Render as a numbered list */}
                                                               {hasHowTo && (<ol className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 list-decimal list-inside space-y-1">
                                                                   {pranayama.howTo.map((step, stepIndex) => (
                                                                       <li key={stepIndex}>{step}</li>
                                                                   ))}
                                                               </ol>)}
                                                          </div>
                                                      </div>
                                                  );
                                              })}
                                         </>
                                     )}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {/* --- Audio Element and Footer (Unchanged) --- */}
                <audio ref={audioRef} src={audioSrc} loop />
                 <footer className="text-center mt-12 text-gray-500 text-sm" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)' }}>Embrace the rhythm of the week with yoga. Find your flow. Namaste 🙏.</footer>
            </div>
        </div>
    );
};

export default Yoga;