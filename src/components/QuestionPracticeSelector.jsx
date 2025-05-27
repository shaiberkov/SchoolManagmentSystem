import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaLayerGroup, FaPuzzlePiece, FaPlay } from "react-icons/fa";

const topicsData = {
    מתמטיקה: [
        { name: "מספרים מרוכבים", exercises: ["חיבור מספרים מרוכבים", "הכפלת מספרים מרוכבים"] },
        { name: "משוואות", exercises: ["מישוואה עם נעלם אחד", "פתרון משוואות ריבועיות"] },
        { name: "שברים", exercises: ["חיבור שברים", "חיסור שברים"] },
        { name: "מספרים שלמים", exercises: ["חיבור מספרים שלמים", "חיסור מספרים שלמים"] },
        { name: "חשבון דיפרנציאלי ואינטגרלי", exercises: ["גזירה", "אינטגרציה"] },
        { name: "מטריצות", exercises: ["חיבור מטריצות", "כפל מטריצות"] },
        { name: "וקטורים", exercises: ["חיבור וקטורים", "כפל וקטורים"] },
        { name: "שאלות מילוליות", exercises: ["פתרון שאלות מילוליות"] }
    ],
};

function QuestionPracticeSelector() {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const navigate = useNavigate();

    const handleNavigate = () => {
        if (selectedSubject && selectedTopic && selectedExercise) {
            const path = `/exercises/${selectedSubject}/${selectedTopic.name}/${selectedExercise}`;
            navigate(path);
        }
    };

    return (


        <div className="max-w-xl mx-auto p-4 bg-white rounded-3xl shadow-md space-y-6 mb-8" dir="rtl">
            <h2 className="text-2xl font-bold text-center text-green-700 flex items-center justify-center gap-2">
                <FaPuzzlePiece
                    className="text-green-500 transition-transform transition-colors duration-300 hover:scale-110 hover:text-green-700 hover:rotate-[25deg]"
                />
                בחר תרגול
            </h2>

            {/* שלב ראשון - בחירת מקצוע */}
            <div className="space-y-1">
                <label className="font-semibold flex items-center gap-2 text-gray-700">
                    <FaBook
                        className="text-blue-500 transition-transform transition-colors duration-300 hover:scale-110 hover:text-blue-700 hover:rotate-[25deg]"
                    />
                    בחר מקצוע:
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(topicsData).map(subject => (
                        <button
                            key={subject}
                            onClick={() => {
                                setSelectedSubject(subject);
                                setSelectedTopic(null);
                                setSelectedExercise(null);
                            }}
                            className={`p-2 rounded-xl border shadow-sm text-sm hover:bg-blue-50 transition ${
                                selectedSubject === subject ? "bg-blue-100 border-blue-400 font-bold" : ""
                            }`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
            </div>

            {/* שלב שני - בחירת נושא */}
            {selectedSubject && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                        <FaLayerGroup
                            className="text-purple-500 transition-transform transition-colors duration-300 hover:scale-110 hover:text-purple-700 hover:rotate-[25deg]"
                        />
                        בחר נושא:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {topicsData[selectedSubject].map(topic => (
                            <button
                                key={topic.name}
                                onClick={() => {
                                    setSelectedTopic(topic);
                                    setSelectedExercise(null);
                                }}
                                className={`p-2 rounded-xl border shadow-sm text-sm hover:bg-purple-50 transition ${
                                    selectedTopic?.name === topic.name ? "bg-purple-100 border-purple-400 font-bold" : ""
                                }`}
                            >
                                {topic.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* שלב שלישי - בחירת תרגיל */}
            {selectedTopic && (
                <div className="space-y-1">
                    <label className="font-semibold flex items-center gap-2 text-gray-700">
                        <FaPuzzlePiece
                            className="text-yellow-500 transition-transform transition-colors duration-300 hover:scale-110 hover:text-yellow-700 hover:rotate-[25deg]"
                        />
                        בחר תרגיל מתוך "{selectedTopic.name}":
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {selectedTopic.exercises.map(ex => (
                            <button
                                key={ex}
                                onClick={() => setSelectedExercise(ex)}
                                className={`p-2 rounded-xl border shadow-sm text-sm hover:bg-yellow-50 transition ${
                                    selectedExercise === ex ? "bg-yellow-100 border-yellow-400 font-bold" : ""
                                }`}
                            >
                                {ex}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* כפתור התחלה */}
            {selectedSubject && selectedTopic && selectedExercise && (
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={handleNavigate}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2  "
                    >
                        <FaPlay
                               className="transition-transform transition-colors duration-300 hover:scale-110 hover:rotate-[25deg]"
                             />
                        התחל תרגול
                    </button>
                </div>
            )}
        </div>

    )

}

export default QuestionPracticeSelector;
