import React from "react";

export default function Faq() {
    return (

        <div dir="rtl" className="flex justify-center mb-10 mt-15 px-4 pt-12 animate-fade-in">
            <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
                <h1 className="text-3xl font-bold text-center text-green-400 mb-4">
                    שאלות נפוצות
                </h1>

                <details className="group border-b border-gray-200 pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
                 <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
                        </span>
                        מהו אתר הלמידה האישי?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        האתר מאפשר לכל אדם ללמוד, לתרגל ולשפר את הידע שלו בנושאים שונים
                        בצורה עצמאית ובקצב אישי.
                    </p>
                </details>

                <details className="group border-b border-gray-200 pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
                              <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
                        </span>
                        האם צריך להירשם כדי להשתמש באתר?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        לא חובה להירשם כדי לצפות בתכנים בסיסיים. עם זאת, הרשמה מאפשרת
                        לשמור את ההתקדמות האישית שלך, לקבל תרגולים מותאמים ולצבור הישגים.
                    </p>
                </details>

                <details className="group border-b border-gray-200 pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
        <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
        </span>
                        איך בוחרים תחום לימוד?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        ניתן לעיין בתחומים הזמינים בדף הבית או בתפריט הראשי. לחיצה על תחום
                        תוביל אותך לעמוד תרגול מותאם.
                    </p>
                </details>

                <details className="group border-b border-gray-200 pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
        <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
        </span>
                        האם השימוש באתר עולה כסף?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        השימוש בתכנים הבסיסיים באתר הוא ללא תשלום. ייתכן שבעתיד יתווספו
                        תכנים מתקדמים בתשלום סמלי.
                    </p>
                </details>

                <details className="group border-b border-gray-200 pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
        <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
        </span>
                        איך שומרים על פרטיות המשתמשים?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        אנו שומרים על פרטיותך בהתאם לתקנות הגנת המידע. מידע אישי נשמר
                        בצורה מאובטחת ולא מועבר לגורמים חיצוניים.
                    </p>
                </details>

                <details className="group pb-4 rounded-md">
                    <summary
                        className="cursor-pointer text-lg font-semibold text-blue-800 flex items-center gap-2 transition group-open:text-green-500">
        <span className="text-green-600 transition-transform duration-300 group-open:rotate-90">
          ❓
        </span>
                        למי פונים במקרה של שאלה או בעיה?
                    </summary>
                    <p className="mt-2 text-gray-700 leading-relaxed pr-8 animate-slide-in">
                        ניתן לפנות אלינו באמצעות טופס “צור קשר” בתפריט הראשי או לשלוח מייל
                        לכתובת התמיכה שלנו. אנחנו כאן כדי לעזור.
                    </p>
                </details>


            </div>
        </div>
    );

}
