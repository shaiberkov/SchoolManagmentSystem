import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function PracticeSelector() {
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
        <div>
            <h2>בחר מקצוע</h2>
            {Object.keys(topicsData).map(subject => (
                <button key={subject} onClick={() => {
                    setSelectedSubject(subject);
                    setSelectedTopic(null);
                    setSelectedExercise(null);
                }}>
                    {subject}
                </button>
            ))}

            {selectedSubject && (
                <>
                    <h3>בחר נושא ב-{selectedSubject}</h3>
                    {topicsData[selectedSubject].map(topic => (
                        <button key={topic.name} onClick={() => {
                            setSelectedTopic(topic);
                            setSelectedExercise(null);
                        }}>
                            {topic.name}
                        </button>
                    ))}
                </>
            )}

            {selectedTopic && (
                <>
                    <h4>בחר תרגיל מתוך "{selectedTopic.name}"</h4>
                    {selectedTopic.exercises.map(ex => (
                        <div key={ex}>
                            <button onClick={() => setSelectedExercise(ex)}>{ex}</button>
                        </div>
                    ))}
                </>
            )}

            {selectedSubject && selectedTopic && selectedExercise && (
                <div style={{ marginTop: "20px" }}>
                    <button onClick={handleNavigate}>התחל תרגול</button>
                </div>
            )}
        </div>
    );
}

export default PracticeSelector;
