import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestConfigurator = () => {
    const navigate = useNavigate();

    const subjects = ['מתמטיקה'];
    const topics = {
        'מתמטיקה': ['מספרים שלמים'],
    };
    const difficulties = ['קל', 'בינוני', 'קשה'];
    const questionCounts = Array.from({ length: 100 }, (_, i) => i + 1);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [selectedQuestionCount, setSelectedQuestionCount] = useState(1);
    const [selectedTimeMinutes, setSelectedTimeMinutes] = useState(10); // ברירת מחדל: 10 דקות

    const navigateToTest = () => {
        navigate(`/test/${selectedSubject}/${selectedTopic}/${selectedDifficulty}/${selectedQuestionCount}/${selectedTimeMinutes}`);
    };

    return (
        <div>
            <h2>יצירת מבחן</h2>

            <div>
                <label>בחר מקצוע:</label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="">-- בחר --</option>
                    {subjects.map((subject) => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
            </div>

            {selectedSubject && (
                <div>
                    <label>בחר נושא:</label>
                    <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {topics[selectedSubject].map((topic) => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedTopic && (
                <div>
                    <label>בחר רמת קושי:</label>
                    <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                        <option value="">-- בחר --</option>
                        {difficulties.map((level) => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedDifficulty && (
                <div>
                    <label>בחר מספר שאלות:</label>
                    <select value={selectedQuestionCount} onChange={(e) => setSelectedQuestionCount(parseInt(e.target.value))}>
                        {questionCounts.map((count) => (
                            <option key={count} value={count}>{count}</option>
                        ))}
                    </select>
                </div>
            )}

            {selectedQuestionCount && (
                <input
                    type="number"
                    min="1"
                    value={selectedTimeMinutes || ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = value ? parseInt(value, 10) : "";
                        setSelectedTimeMinutes(parsedValue);
                    }}
                />

                // <div>
                //     <label>בחר זמן בדקות:</label>
                //     <input
                //         type="number"
                //         min="1"
                //         value={selectedTimeMinutes}
                //         onChange={(e) => setSelectedTimeMinutes(parseInt(e.target.value))}
                //     />
                // </div>
            )}

            {selectedSubject && selectedTopic && selectedDifficulty && selectedQuestionCount && selectedTimeMinutes > 0 && (
                <div>
                    <button onClick={navigateToTest}>צור מבחן</button>
                </div>
            )}
        </div>
    );
};

export default TestConfigurator;
