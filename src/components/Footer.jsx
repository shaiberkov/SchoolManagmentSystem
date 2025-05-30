import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";

export default function Footer() {
    return (

        <footer
            dir="rtl"
            className="relative mt-12  bg-gradient-to-b from-yellow-100 to-red-200/60 backdrop-blur-sm border-t border-gray-300/50 shadow-inner"
        >

            <div className="w-full h-px bg-black absolute top-0 left-0"/>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
                {/* קישורים עיקריים */}
                <nav className="flex flex-wrap justify-center gap-6 text-lg font-medium">
                    <Link
                        to="/about"
                        className="relative text-gray-700 hover:text-blue-700 transition group"
                    >
                        אודות
                        <span
                            className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 scale-x-0
                     group-hover:scale-x-100 origin-right group-hover:origin-left
                     transition-transform duration-300"
                        />
                    </Link>

                    <Link
                        to="/faq"
                        className="relative text-gray-700 hover:text-blue-700 transition group"
                    >
                        שאלות נפוצות
                        <span
                            className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-300"/>
                    </Link>

                    <Link
                        to="/privacy-policy"
                        className="relative text-gray-700 hover:text-blue-700 transition group"
                    >
                        מדיניות פרטיות
                        <span
                            className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-300"/>
                    </Link>

                    <Link
                        to="/terms-of-service"
                        className="relative text-gray-700 hover:text-blue-700 transition group"
                    >
                        תנאי שימוש
                        <span
                            className="absolute left-0 -bottom-1 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-300"/>
                    </Link>
                </nav>

                <div className="flex justify-center gap-6 text-2xl">
                    <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500 transform hover:-translate-y-1 hover:scale-120 transition"
                        aria-label="Twitter"
                    >
                        <FaTwitter/>
                    </a>
                    <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-600 transform hover:-translate-y-1 hover:scale-120 transition"
                        aria-label="YouTube"
                    >
                        <FaYoutube/>
                    </a>
                    <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transform hover:-translate-y-1 hover:scale-120 transition"
                        aria-label="Facebook"
                    >
                        <FaFacebook/>
                    </a>
                </div>

                <div className="text-center text-sm text-gray-500">
                    © כל הזכויות שמורות {new Date().getFullYear()}
                </div>
            </div>
        </footer>
    )

}
