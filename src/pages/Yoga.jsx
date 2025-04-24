import React, { useState, useRef } from 'react';
import relaxAudio from '../assets/soothing.mp3';
import energizeAudio from '../assets/suryanamaskar.mp3';

const weeklyYogaRoutine = {
    Sunday: {
        theme: "Gentle Flow & Grounding",
        suryanamaskar: { rounds: 5, benefits: ["Warms the body", "Improves flexibility"] },
        asanas: [
            { name: "Tadasana (Mountain Pose)", Sanskrit: "तडासन", duration: "5 mins", benefits: ["Improves posture", "Grounding"] },
            { name: "Vrikshasana (Tree Pose)", Sanskrit: "वृक्षासन", duration: "5 mins", benefits: ["Balance", "Focus"] },
            { name: "Shavasana (Corpse Pose)", Sanskrit: "शवासन", duration: "10 mins", benefits: ["Relaxation", "Stress reduction"] },
        ],
        focus: "Grounding and setting intentions for the week",
    },
    Monday: {
        theme: "Energizing Flow",
        suryanamaskar: { rounds: 7, benefits: ["Increases energy", "Strengthens muscles"] },
        asanas: [
            { name: "Surya Namaskar (Sun Salutation)", Sanskrit: "सूर्य नमस्कार", duration: "10 mins", benefits: ["Full body workout", "Improves circulation"] },
            { name: "Adho Mukha Svanasana (Downward-Facing Dog)", Sanskrit: "अधो मुख श्वानासन", duration: "5 mins", benefits: ["Stretches hamstrings", "Calms the mind"] },
            { name: "Uttanasana (Standing Forward Bend)", Sanskrit: "उत्तानासन", duration: "3 mins", benefits: ["Stretches spine", "Relieves stress"] },
        ],
        focus: "Building energy and focus for the week ahead",
    },
    Tuesday: {
        theme: "Core Strength",
        suryanamaskar: { rounds: 5, benefits: ["Strengthens core", "Improves digestion"] },
        asanas: [
            { name: "Phalakasana (Plank Pose)", Sanskrit: "फलकासन", duration: "3 mins", benefits: ["Strengthens core", "Improves posture"] },
            { name: "Bhujangasana (Cobra Pose)", Sanskrit: "भुजंगासन", duration: "3 mins", benefits: ["Strengthens spine", "Opens chest"] },
            { name: "Navasana (Boat Pose)", Sanskrit: "नावासन", duration: "5 mins", benefits: ["Strengthens core", "Improves digestion"] },
        ],
        focus: "Strengthening core muscles and improving stability",
    },
    Wednesday: {
        theme: "Flexibility & Flow",
        suryanamaskar: { rounds: 7, benefits: ["Improves flexibility", "Increases blood flow"] },
        asanas: [
            { name: "Trikonasana (Triangle Pose)", Sanskrit: "त्रिकोणासन", duration: "5 mins", benefits: ["Stretches hamstrings", "Improves balance"] },
            { name: "Parivrtta Trikonasana (Revolved Triangle Pose)", Sanskrit: "परिवृत्त त्रिकोणासन", duration: "5 mins", benefits: ["Improves digestion", "Detoxifies spine"] },
            { name: "Balasana (Child's Pose)", Sanskrit: "बालासन", duration: "5 mins", benefits: ["Calms the mind", "Relieves stress"] },
        ],
        focus: "Enhancing flexibility and promoting smooth transitions",
    },
    Thursday: {
        theme: "Balancing Practice",
        suryanamaskar: { rounds: 5, benefits: ["Improves balance", "Strengthens legs"] },
        asanas: [
            { name: "Vrikshasana (Tree Pose)", Sanskrit: "वृक्षासन", duration: "5 mins", benefits: ["Improves balance", "Focus"] },
            { name: "Garudasana (Eagle Pose)", Sanskrit: "गरुडासन", duration: "5 mins", benefits: ["Improves concentration", "Stretches shoulders"] },
            { name: "Natarajasana (Dancer Pose)", Sanskrit: "नटराजासन", duration: "3 mins per side", benefits: ["Improves balance", "Strengthens legs"] },
        ],
        focus: "Cultivating balance, focus, and grace",
    },
    Friday: {
        theme: "Deep Stretch & Release",
        suryanamaskar: { rounds: 5, benefits: ["Releases tension", "Improves circulation"] },
        asanas: [
            { name: "Paschimottanasana (Seated Forward Bend)", Sanskrit: "पश्चिमोट्टानासन", duration: "7 mins", benefits: ["Calms the brain", "Stretches spine"] },
            { name: "Janu Sirsasana (Head-to-Knee Pose)", Sanskrit: "जानु शीर्षासन", duration: "5 mins per side", benefits: ["Stretches hamstrings", "Improves flexibility"] },
            { name: "Baddha Konasana (Bound Angle Pose)", Sanskrit: "बद्ध कोणासन", duration: "5 mins", benefits: ["Opens hips", "Stimulates abdominal organs"] },
        ],
        focus: "Releasing tension and promoting deep relaxation",
    },
    Saturday: {
        theme: "Relaxation & Mindfulness",
        suryanamaskar: { rounds: 3, benefits: ["Gentle movement", "Prepares for relaxation"] },
        asanas: [
            { name: "Supta Baddha Konasana (Reclined Bound Angle Pose)", Sanskrit: "सुप्त बद्ध कोणासन", duration: "7 mins", benefits: ["Calms the mind", "Opens hips"] },
            { name: "Viparita Karani (Legs-up-the-Wall Pose)", Sanskrit: "विपरीत करणी", duration: "10 mins", benefits: ["Relieves tired legs", "Calms the nervous system"] },
            { name: "Shavasana (Corpse Pose)", Sanskrit: "शवासन", duration: "15 mins", benefits: ["Deep relaxation", "Reduces stress"] },
        ],
        focus: "Promoting deep relaxation, mindfulness, and rejuvenation",
    },
};

const Yoga = () => {
    const [expandedDay, setExpandedDay] = useState(null);
    // New state to track which asanas have their images shown
    const [expandedAsanas, setExpandedAsanas] = useState({});

    const toggleDay = (day) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    // Function to toggle image visibility for a specific asana
    const toggleAsanaImage = (day, asanaIndex, event) => {
        // Prevent the click from bubbling up to the parent elements
        event.stopPropagation();
        
        const key = `${day}-${asanaIndex}`;
        setExpandedAsanas(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const [audioSrc, setAudioSrc] = useState(null);
    const audioRef = useRef(null);

    const playMusic = (type) => {
        const selected = type === 'relax' ? relaxAudio : energizeAudio;
        setAudioSrc(selected);
        setTimeout(() => {
            audioRef.current.play();
        }, 100); // Slight delay to ensure audio src is updated
    };

    const pauseMusic = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };


    const asanaImages = {
        // Asanas------------------------------
        "Tadasana (Mountain Pose)": "https://media.istockphoto.com/id/1366703229/vector/palm-tree-pose-urdhva-hastasana-upward-hand-stretch-pose-upward-salute-raised-hands-pose.jpg?s=612x612&w=0&k=20&c=rY1lIudAf5GTFGFQq1FP_aIMOSXDuwBgTp5ipngSu5E=",
        "Shavasana (Corpse Pose)": "https://www.keralatourism.org/images/yoga/static-banner/large/Savasana_-_The_Corpse_Pose-07032020145736.jpg",
        "Paschimottanasana (Seated Forward Bend)":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLuSptm7cxCe84Beq-t_b8y_uoqL-FuijTg&s",
        "Janu Sirsasana (Head-to-Knee Pose)":"https://www.gaia.com/wp-content/uploads/JanuSirsasana-NicoLuce.jpg",
        "Baddha Konasana (Bound Angle Pose)":"https://cdn.yogajournal.com/wp-content/uploads/2022/10/Bound-Angle-Pose_Mod-1_Andrew-Clark_2400x1350.jpeg",
        "Supta Baddha Konasana (Reclined Bound Angle Pose)":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDqAMO8WE998Ylj-mWg36EIHxsbNl7MIYU2A&s",
        "Viparita Karani (Legs-up-the-Wall Pose)":"https://cdn.yogaeasy.de/production/uploads/article/picture/5853/large_legs-up-the-wall-pose.jpg",
        "Vrikshasana (Tree Pose)":"https://www.arhantayoga.org/wp-content/uploads/2022/03/Tree-Pose-%E2%80%93-Vrikshasana.jpg",
        "Surya Namaskar (Sun Salutation)":"https://harithayogshala.com/upload/blog/steps-of-surya-namaskar_1650126696.jpg",
        "Adho Mukha Svanasana (Downward-Facing Dog)":"https://cdn.yogaeasy.de/production/uploads/article/picture/6282/large_article_Downward-Facing-Dog-Pose-Adho-Mukha-Svanasana.jpg",
        "Uttanasana (Standing Forward Bend)":"https://cdn.yogajournal.com/wp-content/uploads/2021/11/Uttanasana-Pose_Andrew-Clark_2400x1350.jpeg",
        "Phalakasana (Plank Pose)":"https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3eb6d_Untitled-design-24.jpg",
        "Bhujangasana (Cobra Pose)":"https://rishikeshashtangayogaschool.com/blog/wp-content/uploads/2021/11/cobra-pose_11zon.jpg",
        "Navasana (Boat Pose)":"https://cdn.prod.website-files.com/67691f03eb5bfa3289b3dae7/67691f03eb5bfa3289b3ea9b_boat-pose-yoga.jpeg",
        "Trikonasana (Triangle Pose)":"https://lh3.googleusercontent.com/1lFCiwdr0bqa_JDFaYD84M_TfvJ3RYy5mWpV0UfRTU7xWcEtRjbrG8vNowmL9pK1tWUVWng9jDML5TQJzC3i10hKS3JXMACiD_tV8sScPBGBF-Bhybv1Vw55Hvul60Z9pL09cCrP",
        "Parivrtta Trikonasana (Revolved Triangle Pose)":"https://cdn.yogajournal.com/wp-content/uploads/2021/10/Revolved-Triangle-Pose_Andrew-Clark.jpg",
        "Balasana (Child's Pose)":"https://karunayoga.in/wp-content/uploads/2020/03/balasana.jpg",
        "Garudasana (Eagle Pose)":"https://www.vinyasayogaashram.com/blog/wp-content/uploads/2021/06/Garudasana-Eagle-Pose-2.jpg",
        "Natarajasana (Dancer Pose)":"https://omstars.com/blog/wp-content/uploads/2023/02/how-to-do-Natarajasana-Dancer-Pose.png",
        
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-4 animate-pulse"
                    style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    ☀️ Weekly Yoga Routine (Sunday to Saturday)
                </h1>

                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => playMusic('relax')}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-1 px-3 rounded-l-xl shadow"
                    >
                        🎵 Relax
                    </button>
                    <button
                        onClick={() => playMusic('energize')}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 shadow"
                    >
                        ⚡ Energize
                    </button>
                    <button
                        onClick={pauseMusic}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded-r-xl shadow"
                    >
                        ⏸️ Pause
                    </button>
                </div>

                {Object.entries(weeklyYogaRoutine).map(([day, dayData]) => (
                    <div key={day}
                        className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 transition-all duration-300 hover:scale-102">
                        <div
                            className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gradient-to-r from-gray-100 to-gray-50"
                            onClick={() => toggleDay(day)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800 flex-grow">{day}</h2>
                            {expandedDay === day ? (
                                <span className="h-6 w-6 text-gray-600 inline-flex items-center justify-center">&#9650;</span>
                            ) : (
                                <span className="h-6 w-6 text-gray-600 inline-flex items-center justify-center">&#9660;</span>
                            )}
                        </div>
                        <div
                            className={`p-6 transition-all duration-300 ${expandedDay === day ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        >
                            <h3 className="text-lg font-semibold text-indigo-700 mb-2">{dayData.theme}</h3>
                            <p className="text-gray-700 mb-4">
                                <span className="font-semibold">Focus:</span> {dayData.focus}
                            </p>

                            <h4 className="text-md font-semibold text-gray-800 mb-1">Surya Namaskar (Sun Salutation):</h4>
                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">Rounds:</span> {dayData.suryanamaskar.rounds} | <span className="font-medium">Benefits:</span> {dayData.suryanamaskar.benefits.join(', ')}
                            </p>

                            <h4 className="text-md font-semibold text-gray-800 mt-2 mb-2">Other Asanas:</h4>
                            {dayData.asanas.map((asana, index) => (
                                <div key={index} className="mb-2 p-2 rounded-md bg-gray-50 border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h5 className="text-md font-medium text-blue-700">{asana.name} ({asana.Sanskrit})</h5>
                                        <button 
                                            onClick={(e) => toggleAsanaImage(day, index, e)}
                                            className="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-1 px-2 rounded flex items-center text-xs"
                                        >
                                            <span className="mr-1">{expandedAsanas[`${day}-${index}`] ? 'Hide' : 'Show'}</span>
                                            <span>{expandedAsanas[`${day}-${index}`] ? '🔼' : '🔽'}</span>
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        <span className="font-medium">Duration:</span> {asana.duration} | <span className="font-medium">Benefits:</span> {asana.benefits.join(', ')}
                                    </p>
                                    
                                    {/* Image container that shows/hides based on expandedAsanas state */}
                                    {expandedAsanas[`${day}-${index}`] && (
    <div className="mt-2 text-center rounded-lg p-2 sm:p-4">
        <img 
            src={asanaImages[asana.name] || `/api/placeholder/320/240`}  
            alt={`${asana.name} demonstration`} 
            className="mx-auto rounded shadow-sm w-full max-w-xs sm:max-w-md md:max-w-lg h-auto object-contain"
        />
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Demonstration of {asana.name}
        </p>
    </div>
)}

                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <audio ref={audioRef} src={audioSrc} loop />

                <footer
                    className="text-center mt-12 text-gray-500 text-sm"
                    style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.05)' }}
                >
                    Embrace the rhythm of the week with yoga. Find your flow.
                </footer>
            </div>
        </div>
    );
};

export default Yoga;