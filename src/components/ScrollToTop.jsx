import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0); // גלילה למעלה
    }, [location]); // כל שינוי ב־location גורם לגלול למעלה

    return null; // אין צורך להחזיר שום דבר
}

export default ScrollToTop;