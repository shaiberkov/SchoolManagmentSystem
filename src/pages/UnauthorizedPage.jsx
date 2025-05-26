import {FiAlertTriangle} from "react-icons/fi";

const UnauthorizedPage = () => {
    return(

        <div
            className="w-full max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl text-center animate-fade-in"
            dir="rtl"
        >
            <div className="flex justify-center mb-4">
                <FiAlertTriangle className="text-red-500 text-5xl transition-transform duration-300 hover:scale-110 hover:text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
                אין לך הרשאה לצפות בדף זה.
            </h2>
        </div>


        )

}

export default UnauthorizedPage;
