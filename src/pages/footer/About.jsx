import React from "react";

export default function About() {



        return (
            <div dir="rtl" className="flex justify-center mb-10 px-4 pt-12 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl space-y-6 transition duration-300 border border-gray-200">
                    <h1 className="text-3xl font-bold text-center text-green-500 mb-4">אודות מערכת ניהול בתי־ספר</h1>

                    <section>
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">ברוכים הבאים!</h2>
                        <p className="text-gray-700 leading-relaxed">
                            המערכת שלנו מאחדת את כל צרכי הניהול של בית־הספר בפלטפורמה אחת קלה לשימוש.
                            היא משרתת מנהלי מערכת, מנהלי בית־ספר, מורים ותלמידים ומאפשרת לכל אחד לבצע את משימותיו היום-יומיות ביעילות.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">מטרת המערכת</h2>
                        <p className="text-gray-700 leading-relaxed">
                            לספק פתרון כולל המפשט תהליכי ניהול – החל מרישום בתי־ספר, הקצאת מורים וכיתות, יצירת מערכות שעות ותזמון מבחנים,
                            ועד למעקב אחר התקדמות תלמידים ותקשורת ישירה בין צוות ההוראה וההנהלה.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">מה תמצאו במערכת?</h2>
                        <ul className="list-disc list-inside space-y-1 text-gray-800">
                            <li>לוחות מחוונים ייעודיים לכל תפקיד</li>
                            <li>ניהול משתמשים והרשאות לפי רמות</li>
                            <li>יצירה וניהול של מערכות שעות לכיתות, מורים ותלמידים</li>
                            <li>שליחת הודעות מערכת ומסרים ייעודיים</li>
                            <li>שחזור סיסמה באמצעות OTP לטלפון</li>
                            <li>תרגול ושאלונים אוטומטיים לתלמידים</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-blue-700 mb-2">תמיכה ושאלות</h2>
                        <p className="text-gray-700 leading-relaxed">
                            יש לכם שאלות או צריכים עזרה? ניתן ליצור קשר בדף&nbsp;
                            <a
                                href="/contact"
                                className="text-green-600 hover:text-green-800 font-medium underline transition duration-200"
                            >
                                צור קשר
                            </a>. צוות התמיכה שלנו ישמח לסייע.
                        </p>
                    </section>


                </div>
            </div>
        );


}
